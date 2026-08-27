import { describe, expect, it } from "vitest";
import { MESSAGE_MAX_LENGTH, normalizeSiteUrl, validateTrial } from "@/lib/validation";

describe("normalizeSiteUrl", () => {
  it("prefixes a bare domain with https://", () => {
    expect(normalizeSiteUrl("grabis.co.kr")).toBe("https://grabis.co.kr");
  });

  it("keeps an explicit https:// url and drops the trailing slash", () => {
    expect(normalizeSiteUrl("https://grabis.co.kr/")).toBe("https://grabis.co.kr");
  });

  it("keeps a meaningful path", () => {
    expect(normalizeSiteUrl("grabis.co.kr/about")).toBe("https://grabis.co.kr/about");
  });

  it("trims surrounding whitespace and lowercases the host", () => {
    expect(normalizeSiteUrl("  HTTPS://Grabis.CO.KR  ")).toBe("https://grabis.co.kr");
  });

  it("keeps http:// as-is", () => {
    expect(normalizeSiteUrl("http://example.com")).toBe("http://example.com");
  });

  it("rejects a hangul domain", () => {
    expect(normalizeSiteUrl("한글.한국")).toBeNull();
  });

  it("rejects a hangul domain with an explicit scheme", () => {
    expect(normalizeSiteUrl("https://한글.kr/x")).toBeNull();
  });

  it("accepts a non-ascii path on an ascii host", () => {
    const result = normalizeSiteUrl("example.com/회사소개");
    expect(result).not.toBeNull();
    expect(new URL(result!).hostname).toBe("example.com");
  });

  it("rejects a javascript: url", () => {
    expect(normalizeSiteUrl("javascript:alert(1)")).toBeNull();
  });

  it("rejects other non-http schemes", () => {
    expect(normalizeSiteUrl("mailto:a@b.com")).toBeNull();
    expect(normalizeSiteUrl("data:text/html,<h1>x</h1>")).toBeNull();
    expect(normalizeSiteUrl("ftp://example.com")).toBeNull();
  });

  it("rejects a string without a dotted host", () => {
    expect(normalizeSiteUrl("localhost")).toBeNull();
    expect(normalizeSiteUrl("우리 회사 홈페이지")).toBeNull();
  });

  it("rejects an empty or blank value", () => {
    expect(normalizeSiteUrl("")).toBeNull();
    expect(normalizeSiteUrl("   ")).toBeNull();
  });

  it("rejects a numeric tld", () => {
    expect(normalizeSiteUrl("1.2.3.4")).toBeNull();
  });
});

const valid = {
  site: "grabis.co.kr",
  name: "그라비스",
  contact: "010-1234-5678",
  mgmt: "self",
  message: "",
};

describe("validateTrial", () => {
  it("returns no errors for a valid submission", () => {
    expect(validateTrial(valid)).toEqual({});
  });

  it("requires the site", () => {
    expect(validateTrial({ ...valid, site: "  " }).site).toBeTruthy();
  });

  it("rejects a malformed site", () => {
    expect(validateTrial({ ...valid, site: "javascript:alert(1)" }).site).toBeTruthy();
  });

  it("requires a name of at least 2 characters", () => {
    expect(validateTrial({ ...valid, name: "" }).name).toBeTruthy();
    expect(validateTrial({ ...valid, name: "김" }).name).toBeTruthy();
  });

  it("requires a contact", () => {
    expect(validateTrial({ ...valid, contact: "" }).contact).toBeTruthy();
  });

  it("accepts a mobile number in several shapes", () => {
    for (const contact of ["01012345678", "010-1234-5678", "010 1234 5678", "+82 10-1234-5678"]) {
      expect(validateTrial({ ...valid, contact }).contact).toBeUndefined();
    }
  });

  it("accepts an email address", () => {
    expect(validateTrial({ ...valid, contact: "ceo@grabis.co.kr" }).contact).toBeUndefined();
  });

  it("rejects a contact that is neither a mobile number nor an email", () => {
    for (const contact of ["02-123-4567", "hello", "ceo@grabis", "0101234"]) {
      expect(validateTrial({ ...valid, contact }).contact).toBeTruthy();
    }
  });

  it("caps the memo length", () => {
    expect(validateTrial({ ...valid, message: "가".repeat(MESSAGE_MAX_LENGTH) }).message).toBeUndefined();
    expect(validateTrial({ ...valid, message: "가".repeat(MESSAGE_MAX_LENGTH + 1) }).message).toBeTruthy();
  });

  it("treats mgmt as optional", () => {
    expect(validateTrial({ ...valid, mgmt: "" })).toEqual({});
  });
});
