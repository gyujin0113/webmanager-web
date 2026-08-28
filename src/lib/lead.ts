/**
 * Referral / UTM capture for the widget funnel (client only).
 *
 * A visitor arrives from a customer site's widget footer as
 * `webmanager.co.kr/?ref=grabis&utm_source=guide-widget&utm_medium=cta#trial`.
 * The query string is lost as soon as they navigate or reload, so we stash it in
 * sessionStorage on first paint and read it back when the trial form is submitted.
 *
 * Storage is deliberately session-scoped: attribution belongs to *this* visit.
 */

export interface Lead {
  ref: string;
  utm_source: string;
  utm_medium: string;
  landing_path: string;
}

export const LEAD_STORAGE_KEY = "wm-lead";

/** Defensive cap — these values are pasted straight into a Telegram message. */
const MAX_VALUE_LENGTH = 200;

const EMPTY_LEAD: Lead = Object.freeze({
  ref: "",
  utm_source: "",
  utm_medium: "",
  landing_path: "",
});

const QUERY_FIELDS = ["ref", "utm_source", "utm_medium"] as const;

function storage(): Storage | null {
  try {
    return typeof sessionStorage === "undefined" ? null : sessionStorage;
  } catch {
    // Safari in private mode / cookies blocked.
    return null;
  }
}

function clean(value: string | null | undefined): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, MAX_VALUE_LENGTH);
}

/** Reads the lead captured earlier in this session. Never throws. */
export function readLead(): Lead {
  const store = storage();
  if (!store) return { ...EMPTY_LEAD };

  let parsed: unknown;
  try {
    const raw = store.getItem(LEAD_STORAGE_KEY);
    if (!raw) return { ...EMPTY_LEAD };
    parsed = JSON.parse(raw);
  } catch {
    return { ...EMPTY_LEAD };
  }

  if (!parsed || typeof parsed !== "object") return { ...EMPTY_LEAD };
  const source = parsed as Record<string, unknown>;

  return {
    ref: clean(source.ref as string),
    utm_source: clean(source.utm_source as string),
    utm_medium: clean(source.utm_medium as string),
    landing_path: clean(source.landing_path as string),
  };
}

/**
 * Captures `ref` / `utm_*` from the current query string.
 *
 * Only writes when the query actually carries attribution, and never replaces an
 * already-captured value with an empty one — an internal anchor click must not
 * erase where the visitor came from.
 */
export function captureLead(
  search: string = typeof location === "undefined" ? "" : location.search,
  path: string = typeof location === "undefined" ? "" : location.pathname,
): void {
  const store = storage();
  if (!store) return;

  const params = new URLSearchParams(search);
  const incoming = {
    ref: clean(params.get(QUERY_FIELDS[0])),
    utm_source: clean(params.get(QUERY_FIELDS[1])),
    utm_medium: clean(params.get(QUERY_FIELDS[2])),
  };

  const hasAttribution = QUERY_FIELDS.some((field) => incoming[field] !== "");
  if (!hasAttribution) return;

  const previous = readLead();
  const next: Lead = {
    ref: incoming.ref || previous.ref,
    utm_source: incoming.utm_source || previous.utm_source,
    utm_medium: incoming.utm_medium || previous.utm_medium,
    landing_path: clean(path) || previous.landing_path,
  };

  try {
    store.setItem(LEAD_STORAGE_KEY, JSON.stringify(next));
    emit();
  } catch {
    // Quota or blocked storage — attribution is nice to have, not critical.
  }
}

/* ------------------------------------------------------------------------- *
 * React binding — `useSyncExternalStore(subscribeLead, getLeadSnapshot,
 * getServerLeadSnapshot)`. sessionStorage is external state that does not exist
 * during the static prerender, so this is the correct primitive: the server
 * snapshot is empty, the client re-reads after hydration, and `captureLead`
 * notifies subscribers instead of components calling setState from an effect.
 * ------------------------------------------------------------------------- */

type LeadListener = () => void;

const listeners = new Set<LeadListener>();

function emit(): void {
  for (const listener of listeners) listener();
}

export function subscribeLead(listener: LeadListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

// sessionStorage is per-tab and only `captureLead` writes it, so a cached
// snapshot keyed on the raw string keeps the object identity stable — required
// by useSyncExternalStore, which would otherwise loop forever.
let cachedRaw: string | null = null;
let cachedLead: Lead = EMPTY_LEAD;

export function getLeadSnapshot(): Lead {
  const store = storage();
  let raw: string | null = null;
  try {
    raw = store ? store.getItem(LEAD_STORAGE_KEY) : null;
  } catch {
    raw = null;
  }

  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedLead = readLead();
  }
  return cachedLead;
}

export function getServerLeadSnapshot(): Lead {
  return EMPTY_LEAD;
}
