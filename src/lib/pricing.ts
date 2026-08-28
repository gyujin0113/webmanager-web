import pricing from "../../content/pricing.json";

/**
 * Single source of truth for every price and trial condition on the landing page.
 *
 * The raw numbers live in `content/pricing.json` so that non-TypeScript consumers
 * (the `scripts/sync-guide.mjs` placeholder substitution for the landing's own
 * guide widget catalog) read exactly the same values. Nothing else in the codebase
 * may hardcode a price, a day count or a catalog size — import from here.
 */
export const TRIAL_DAYS = pricing.trialDays;
export const TRIAL_CATALOG_MAX = pricing.trialCatalogMax;
export const WIDGET_MONTHLY = pricing.widgetMonthly;
export const WIDGET_ANNUAL = pricing.widgetAnnual;
export const WIDGET_CATALOG = pricing.widgetCatalog;

/** How many months the annual plan effectively gives away (2 at 29,000 / 290,000). */
export const ANNUAL_FREE_MONTHS = 12 - Math.round(WIDGET_ANNUAL / WIDGET_MONTHLY);

/** 29000 → "29,000원" */
export function won(amount: number): string {
  return `${amount.toLocaleString("ko-KR")}원`;
}

/** 29000 → "2.9만원", 290000 → "29만원" */
export function manwon(amount: number): string {
  return `${(amount / 10000).toString().replace(/\.0$/, "")}만원`;
}
