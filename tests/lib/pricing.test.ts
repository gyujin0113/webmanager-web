import { describe, expect, it } from "vitest";
import pricingJson from "../../content/pricing.json";
import {
  ANNUAL_FREE_MONTHS,
  TRIAL_CATALOG_MAX,
  TRIAL_DAYS,
  WIDGET_ANNUAL,
  WIDGET_CATALOG,
  WIDGET_MONTHLY,
  manwon,
  won,
} from "@/lib/pricing";

describe("pricing constants", () => {
  it("re-exports content/pricing.json as the single source of truth", () => {
    expect(TRIAL_DAYS).toBe(pricingJson.trialDays);
    expect(TRIAL_CATALOG_MAX).toBe(pricingJson.trialCatalogMax);
    expect(WIDGET_MONTHLY).toBe(pricingJson.widgetMonthly);
    expect(WIDGET_ANNUAL).toBe(pricingJson.widgetAnnual);
    expect(WIDGET_CATALOG).toBe(pricingJson.widgetCatalog);
  });

  it("matches the values agreed in the spec", () => {
    expect(TRIAL_DAYS).toBe(30);
    expect(TRIAL_CATALOG_MAX).toBe(20);
    expect(WIDGET_MONTHLY).toBe(29000);
    expect(WIDGET_ANNUAL).toBe(290000);
    expect(WIDGET_CATALOG).toBe(30);
  });

  it("derives the number of free months on the annual plan", () => {
    expect(ANNUAL_FREE_MONTHS).toBe(2);
  });
});

describe("won", () => {
  it("groups thousands with the ko-KR separator", () => {
    expect(won(WIDGET_MONTHLY)).toBe("29,000원");
  });

  it("formats the annual price", () => {
    expect(won(WIDGET_ANNUAL)).toBe("290,000원");
  });

  it("formats zero for the free trial", () => {
    expect(won(0)).toBe("0원");
  });
});

describe("manwon", () => {
  it("keeps one decimal when the amount is not a round 만원", () => {
    expect(manwon(WIDGET_MONTHLY)).toBe("2.9만원");
  });

  it("drops the decimal for round amounts", () => {
    expect(manwon(WIDGET_ANNUAL)).toBe("29만원");
  });

  it("drops a trailing .0", () => {
    expect(manwon(20000)).toBe("2만원");
  });
});
