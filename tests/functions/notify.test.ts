import { describe, expect, it, vi } from "vitest";
import { handleNotify, rateLimitInternals, type Env } from "../../functions/api/notify";

const ENV: Env = { TELEGRAM_BOT_TOKEN: "test-token", TELEGRAM_CHAT_ID: "12345" };

function post(body: unknown): Request {
  return new Request("https://webmanager.co.kr/api/notify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

/** Records every Telegram call so tests can assert on the outgoing payload. */
function fetchSpy() {
  return vi.fn(async () => new Response(null, { status: 200 })) as unknown as typeof fetch;
}

function sentText(spy: ReturnType<typeof vi.fn>): string {
  const [, init] = spy.mock.calls[0] as [string, RequestInit];
  return (JSON.parse(String(init.body)) as { text: string }).text;
}

describe("handleNotify", () => {
  it("returns 204 and calls Telegram once with the kind label and fields", async () => {
    const spy = fetchSpy();
    const res = await handleNotify(
      post({ kind: "contact", fields: { name: "홍길동", phone: "01012345678" } }),
      ENV,
      "ip-happy",
      spy,
    );

    expect(res.status).toBe(204);
    expect(spy).toHaveBeenCalledTimes(1);

    const [url, init] = (spy as unknown as ReturnType<typeof vi.fn>).mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://api.telegram.org/bottest-token/sendMessage");
    expect(init.method).toBe("POST");

    const payload = JSON.parse(String(init.body)) as { chat_id: string; text: string };
    expect(payload.chat_id).toBe("12345");
    expect(payload.text).toContain("상담 문의");
    expect(payload.text).toContain("홍길동");
    expect(payload.text).toContain("01012345678");
  });

  it("uses the trial label for kind=trial", async () => {
    const spy = fetchSpy();
    await handleNotify(post({ kind: "trial", fields: { site: "https://grabis.co.kr" } }), ENV, "ip-trial", spy);
    expect(sentText(spy as unknown as ReturnType<typeof vi.fn>)).toContain("위젯 체험 신청");
  });

  it("drops keys outside the whitelist", async () => {
    const spy = fetchSpy();
    await handleNotify(
      post({ kind: "contact", fields: { name: "홍길동", evil: "leak-me", access_key: "secret" } }),
      ENV,
      "ip-whitelist",
      spy,
    );
    const text = sentText(spy as unknown as ReturnType<typeof vi.fn>);
    expect(text).toContain("홍길동");
    expect(text).not.toContain("leak-me");
    expect(text).not.toContain("secret");
  });

  it("truncates each field value to 500 characters", async () => {
    const spy = fetchSpy();
    await handleNotify(post({ kind: "contact", fields: { message: "가".repeat(900) } }), ENV, "ip-truncate", spy);
    const text = sentText(spy as unknown as ReturnType<typeof vi.fn>);
    expect(text).toContain("가".repeat(500));
    expect(text).not.toContain("가".repeat(501));
  });

  it("returns 503 without calling Telegram when the token is not configured", async () => {
    const spy = fetchSpy();
    const res = await handleNotify(post({ kind: "contact", fields: {} }), {}, "ip-notoken", spy);
    expect(res.status).toBe(503);
    expect(spy).not.toHaveBeenCalled();
  });

  it("returns 400 for malformed json", async () => {
    const spy = fetchSpy();
    const res = await handleNotify(post("not json at all"), ENV, "ip-badjson", spy);
    expect(res.status).toBe(400);
    expect(spy).not.toHaveBeenCalled();
  });

  it("returns 400 for an unknown kind or a missing fields object", async () => {
    const spy = fetchSpy();
    expect((await handleNotify(post({ kind: "spam", fields: {} }), ENV, "ip-badbody", spy)).status).toBe(400);
    expect((await handleNotify(post({ kind: "contact" }), ENV, "ip-badbody", spy)).status).toBe(400);
    expect(spy).not.toHaveBeenCalled();
  });

  it("rate limits the 6th request from the same ip within a minute", async () => {
    const spy = fetchSpy();
    const send = () => handleNotify(post({ kind: "contact", fields: { name: "n" } }), ENV, "ip-ratelimit", spy);

    for (let i = 0; i < 5; i++) expect((await send()).status).toBe(204);
    expect((await send()).status).toBe(429);
    expect(spy).toHaveBeenCalledTimes(5);
  });

  it("honours NOTIFY_RATE_PER_MIN and lets the window expire", async () => {
    vi.useFakeTimers();
    try {
      const spy = fetchSpy();
      const env: Env = { ...ENV, NOTIFY_RATE_PER_MIN: "2" };
      const send = () => handleNotify(post({ kind: "contact", fields: { name: "n" } }), env, "ip-window", spy);

      expect((await send()).status).toBe(204);
      expect((await send()).status).toBe(204);
      expect((await send()).status).toBe(429);

      vi.advanceTimersByTime(61_000);
      expect((await send()).status).toBe(204);
    } finally {
      vi.useRealTimers();
    }
  });

  it("keeps the counter map bounded by sweeping expired entries", async () => {
    vi.useFakeTimers();
    try {
      rateLimitInternals.reset();
      const spy = fetchSpy();
      const send = (ip: string) =>
        handleNotify(post({ kind: "contact", fields: { name: "n" } }), ENV, ip, spy);

      for (let i = 0; i < 1000; i++) await send(`10.0.${Math.floor(i / 256)}.${i % 256}`);
      expect(rateLimitInternals.size()).toBe(1000);

      // Every window has expired by now, so the next request must sweep them away
      // instead of letting the map grow past the ceiling.
      vi.advanceTimersByTime(61_000);
      const res = await send("ip-after-sweep");

      expect(res.status).toBe(204);
      expect(rateLimitInternals.size()).toBeLessThanOrEqual(2);
    } finally {
      vi.useRealTimers();
      rateLimitInternals.reset();
    }
  });

  it("logs the status but still returns 204 when Telegram rejects the message", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      const spy = vi.fn(async () => new Response("bad request", { status: 400 })) as unknown as typeof fetch;
      const res = await handleNotify(
        post({ kind: "contact", fields: { name: "n" } }),
        ENV,
        "ip-telegram-400",
        spy,
      );

      expect(res.status).toBe(204);
      expect(errorSpy).toHaveBeenCalledTimes(1);
      expect(errorSpy).toHaveBeenCalledWith("[notify] telegram responded", 400);
    } finally {
      errorSpy.mockRestore();
    }
  });

  it("does not leak the bot token into the response body", async () => {
    const spy = fetchSpy();
    const res = await handleNotify(post({ kind: "contact", fields: { name: "n" } }), ENV, "ip-noleak", spy);
    expect(await res.text()).toBe("");
  });
});
