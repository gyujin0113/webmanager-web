import { describe, expect, it } from "vitest";
import pricingJson from "../../content/pricing.json";
import rawGuide from "../../content/guide.json";
import { substitutePricing } from "../../scripts/sync-guide.mjs";

describe("substitutePricing", () => {
  it("replaces {{price}} with the formatted monthly price", () => {
    expect(substitutePricing("{{price}}", pricingJson)).toBe("29,000원");
  });

  it("replaces {{annual}} with the formatted annual price", () => {
    expect(substitutePricing("{{annual}}", pricingJson)).toBe("290,000원");
  });

  it("replaces {{freeMonths}} with the derived free-month count", () => {
    expect(substitutePricing("{{freeMonths}}", pricingJson)).toBe("2");
  });

  it("replaces {{trialDays}} with the trial length", () => {
    expect(substitutePricing("{{trialDays}}", pricingJson)).toBe("30");
  });

  it("replaces {{trialMax}} with the trial catalog cap", () => {
    expect(substitutePricing("{{trialMax}}", pricingJson)).toBe("20");
  });

  it("replaces every placeholder in a single string", () => {
    const text =
      "월 {{price}} (연 {{annual}}, {{freeMonths}}개월 무료), 체험 {{trialDays}}일 질문 {{trialMax}}개";
    expect(substitutePricing(text, pricingJson)).toBe(
      "월 29,000원 (연 290,000원, 2개월 무료), 체험 30일 질문 20개",
    );
  });

  it("throws when a placeholder is left unresolved", () => {
    expect(() => substitutePricing("남은 {{unknown}} 값", pricingJson)).toThrow(/unresolved placeholder/i);
  });

  it("returns text untouched when it has no placeholders", () => {
    expect(substitutePricing("가격 문의는 채팅으로", pricingJson)).toBe("가격 문의는 채팅으로");
  });
});

describe("content/guide.json after substitution", () => {
  it("parses as JSON with the expected shape and no leftover placeholders", () => {
    const substituted = substitutePricing(JSON.stringify(rawGuide), pricingJson);
    const guide = JSON.parse(substituted);

    expect(guide.site).toBe("webmanager");
    expect(guide.brand.color).toBe("#1e40af");
    expect(guide.brand.greeting).toBe("궁금한 걸 골라주세요. 답이 있는 곳으로 바로 데려다드릴게요.");
    expect(guide.items).toHaveLength(15);
    expect(guide.categories).toHaveLength(4);
    expect(substituted).not.toContain("{{");
  });

  it("bakes the real prices into the price category cards", () => {
    const substituted = substitutePricing(JSON.stringify(rawGuide), pricingJson);
    expect(substituted).toContain("29,000원");
    expect(substituted).toContain("290,000원");
  });
});
