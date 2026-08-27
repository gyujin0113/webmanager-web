/**
 * Pure validation helpers for the trial signup form (§5 of the landing spec).
 *
 * Kept free of React so the rules are unit-testable and reusable by any future
 * form (or by a server-side check) without dragging the component along.
 */

export interface TrialFields {
  site: string;
  name: string;
  contact: string;
  mgmt?: string;
  message?: string;
}

export type TrialField = "site" | "name" | "contact" | "message";

export type TrialErrors = Partial<Record<TrialField, string>>;

/** Memo cap, mirrored by the textarea `maxLength` and the notify function. */
export const MESSAGE_MAX_LENGTH = 500;

const NAME_MIN_LENGTH = 2;

export const TRIAL_ERROR_MESSAGES = {
  siteRequired: "홈페이지 주소를 입력해 주세요.",
  siteInvalid: "주소 형식을 확인해 주세요. (예: example.co.kr)",
  nameRequired: "회사명 또는 성함을 입력해 주세요.",
  nameTooShort: `${NAME_MIN_LENGTH}자 이상 입력해 주세요.`,
  contactRequired: "연락처를 입력해 주세요.",
  contactInvalid: "휴대폰 번호 또는 이메일을 입력해 주세요.",
  messageTooLong: `${MESSAGE_MAX_LENGTH}자 이내로 입력해 주세요.`,
} as const;

/** Hostnames must be ASCII — a hangul IDN would need punycode we do not emit. */
const NON_ASCII = /[^\x20-\x7E]/;
const SCHEME = /^[a-z][a-z0-9+.-]*:/i;
const HTTP_SCHEME = /^https?:\/\//i;
const HOSTNAME = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/;
const TLD = /^[a-z]{2,}$/;

const EMAIL = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
const MOBILE = /^01\d{8,9}$/;

/**
 * `grabis.co.kr` → `https://grabis.co.kr`. Returns null for anything that is not a
 * plain http(s) site: other schemes (`javascript:`, `mailto:`, `data:`), IDN/hangul
 * hosts, bare words and IP addresses.
 */
export function normalizeSiteUrl(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed || NON_ASCII.test(trimmed)) return null;

  let candidate = trimmed;
  if (!HTTP_SCHEME.test(candidate)) {
    // A scheme we do not allow (javascript:, mailto:, data:, ftp://…).
    if (SCHEME.test(candidate)) return null;
    candidate = `https://${candidate}`;
  }

  let url: URL;
  try {
    url = new URL(candidate);
  } catch {
    return null;
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") return null;

  const host = url.hostname.toLowerCase();
  if (!HOSTNAME.test(host)) return null;
  if (!TLD.test(host.slice(host.lastIndexOf(".") + 1))) return null;

  const path = url.pathname === "/" ? "" : url.pathname.replace(/\/+$/, "");
  return `${url.protocol}//${url.host}${path}`;
}

/** Accepts an email or a Korean mobile number in any of the shapes people type. */
export function isValidContact(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  if (trimmed.includes("@")) return EMAIL.test(trimmed);

  const digits = trimmed.replace(/^\+?82\s*/, "0").replace(/[\s.-]/g, "");
  return MOBILE.test(digits);
}

export function validateTrial(fields: TrialFields): TrialErrors {
  const errors: TrialErrors = {};

  const site = fields.site.trim();
  if (!site) errors.site = TRIAL_ERROR_MESSAGES.siteRequired;
  else if (!normalizeSiteUrl(site)) errors.site = TRIAL_ERROR_MESSAGES.siteInvalid;

  const name = fields.name.trim();
  if (!name) errors.name = TRIAL_ERROR_MESSAGES.nameRequired;
  else if (name.length < NAME_MIN_LENGTH) errors.name = TRIAL_ERROR_MESSAGES.nameTooShort;

  const contact = fields.contact.trim();
  if (!contact) errors.contact = TRIAL_ERROR_MESSAGES.contactRequired;
  else if (!isValidContact(contact)) errors.contact = TRIAL_ERROR_MESSAGES.contactInvalid;

  if ((fields.message ?? "").length > MESSAGE_MAX_LENGTH) {
    errors.message = TRIAL_ERROR_MESSAGES.messageTooLong;
  }

  return errors;
}
