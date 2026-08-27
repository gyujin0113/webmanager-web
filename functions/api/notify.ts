/**
 * POST /api/notify — server-side Telegram relay for the landing page forms.
 *
 * The bot token used to live in the client bundle, which meant anyone could read
 * it from the page source and post to the chat. It now lives only in Cloudflare
 * Pages environment variables and never reaches the browser.
 */
export interface Env {
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_CHAT_ID?: string;
  NOTIFY_RATE_PER_MIN?: string;
}

export type NotifyKind = "trial" | "contact";

/** Only these keys are forwarded — anything else the client sends is dropped. */
const ALLOWED = [
  "site",
  "name",
  "contact",
  "phone",
  "mgmt",
  "message",
  "ref",
  "utm_source",
  "utm_medium",
  "landing_path",
] as const;

const LABEL: Record<NotifyKind, string> = {
  trial: "위젯 체험 신청",
  contact: "상담 문의",
};

const MAX_VALUE_LEN = 500;
const RATE_WINDOW_MS = 60_000;
const DEFAULT_RATE_PER_MIN = 5;
const TELEGRAM_API = "https://api.telegram.org";
/** Hard ceiling on counter entries — this is a public endpoint, so the map must be bounded. */
const MAX_RL_ENTRIES = 1000;

/**
 * Rate-limit counters live in the worker isolate's memory, so the cap is *soft*:
 * each isolate (and each Cloudflare PoP) keeps its own counter, and an isolate
 * can be recycled at any time. Good enough to stop a single tab hammering the
 * form; deliberately not backed by KV — this endpoint has no storage budget and
 * a hard global limit is not worth a KV write per request.
 */
const rateLimit = new Map<string, { count: number; expiresAt: number }>();

/** Test-only handle — the counter map is isolate-local state tests need to inspect and reset. */
export const rateLimitInternals = {
  size: () => rateLimit.size,
  reset: () => rateLimit.clear(),
};

/**
 * Keeps the map bounded. Sweeps expired windows first; if every entry is still
 * live afterwards the map is dropped wholesale, which *fails open* — a burst of
 * distinct IPs gets its counters reset rather than growing memory without limit.
 * Acceptable because this limiter is soft by construction (per-isolate, per-PoP);
 * memory safety is the property worth guaranteeing here, not the cap.
 */
function evictIfNeeded(now: number): void {
  if (rateLimit.size < MAX_RL_ENTRIES) return;
  for (const [key, entry] of rateLimit) {
    if (entry.expiresAt <= now) rateLimit.delete(key);
  }
  if (rateLimit.size >= MAX_RL_ENTRIES) rateLimit.clear();
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isNotifyKind(value: unknown): value is NotifyKind {
  return value === "trial" || value === "contact";
}

/** Telegram Markdown control characters would break the message layout. */
function sanitize(value: string): string {
  return value.slice(0, MAX_VALUE_LEN).replace(/[*_`[\]]/g, " ");
}

function allow(ip: string, limit: number): boolean {
  const now = Date.now();
  evictIfNeeded(now);
  const existing = rateLimit.get(ip);
  const entry =
    existing && existing.expiresAt > now
      ? existing
      : { count: 0, expiresAt: now + RATE_WINDOW_MS };

  if (entry.count >= limit) return false;
  entry.count += 1;
  rateLimit.set(ip, entry);
  return true;
}

function rateLimitFor(env: Env): number {
  const parsed = Number(env.NOTIFY_RATE_PER_MIN);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_RATE_PER_MIN;
}

export async function handleNotify(
  request: Request,
  env: Env,
  ip: string,
  fetchImpl: typeof fetch = fetch,
): Promise<Response> {
  // Not configured yet (e.g. merged before the secrets are set): stay silent
  // rather than erroring the form — email delivery is a separate path.
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) {
    console.warn("[notify] TELEGRAM_BOT_TOKEN/TELEGRAM_CHAT_ID not configured");
    return new Response(null, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(null, { status: 400 });
  }

  if (!isRecord(body) || !isNotifyKind(body.kind) || !isRecord(body.fields)) {
    return new Response(null, { status: 400 });
  }

  if (!allow(ip, rateLimitFor(env))) {
    return new Response(null, { status: 429 });
  }

  const fields = body.fields;
  const lines = [`📩 *${LABEL[body.kind]}*`, ""];
  for (const key of ALLOWED) {
    const value = fields[key];
    if (typeof value === "string" && value.trim()) {
      lines.push(`*${key}:* ${sanitize(value)}`);
    }
  }

  try {
    const res = await fetchImpl(`${TELEGRAM_API}/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: env.TELEGRAM_CHAT_ID,
        text: lines.join("\n"),
        parse_mode: "Markdown",
      }),
    });
    if (!res.ok) {
      // Status only. Telegram echoes the failing request back in the error body,
      // and that payload embeds the bot token in the URL — never log it.
      console.error("[notify] telegram responded", res.status);
    }
  } catch (err) {
    // Never surface Telegram's failure (or its URL, which embeds the token) to the client.
    console.error("[notify] telegram sendMessage failed", err);
    return new Response(null, { status: 502 });
  }

  return new Response(null, { status: 204 });
}

/**
 * Handler context is typed inline instead of via the global `PagesFunction`, so
 * this module also typechecks from the test project (which does not load
 * `@cloudflare/workers-types` globals). The shape matches what Pages passes in.
 */
export const onRequestPost = ({
  request,
  env,
}: {
  request: Request;
  env: Env;
}): Promise<Response> =>
  handleNotify(request, env, request.headers.get("CF-Connecting-IP") ?? "unknown");
