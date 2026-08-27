/**
 * Public, client-safe form constants.
 *
 * The Web3Forms access key is public by design — it identifies the destination
 * inbox and cannot be used to read submissions — so it stays in the bundle.
 * Anything that *is* a secret (e.g. the Telegram bot token) belongs in the
 * `/api/notify` Pages Function environment, never here.
 */
export const WEB3FORMS_ACCESS_KEY = "ea1b02ad-1a33-49e3-9dbe-f12f5c01d1eb";

export const KAKAO_URL = "https://open.kakao.com/me/webmanager";
