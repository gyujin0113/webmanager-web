#!/usr/bin/env node
// content/guide.json (placeholders) → public/guide.json (prices substituted from
// content/pricing.json). Next static export copies public/ into out/, so the
// landing's own widget fetches a guide.json with real numbers baked in.
//
// This script cannot `import` src/lib/pricing.ts (that's TypeScript, this is a
// plain Node ESM script run before `next build` exists), so it reads
// content/pricing.json directly — the same single source of truth pricing.ts
// re-exports for the app.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/** 29000 → "29,000원" (mirrors src/lib/pricing.ts `won()`). */
function won(amount) {
  return `${amount.toLocaleString("ko-KR")}원`;
}

/**
 * Replaces every `{{price}}` / `{{annual}}` / `{{freeMonths}}` / `{{trialDays}}` /
 * `{{trialMax}}` placeholder in `text` with values derived from `pricing`
 * (the parsed contents of content/pricing.json). Pure and side-effect free so
 * it can be unit-tested without touching the filesystem.
 *
 * Throws if any `{{...}}` placeholder remains unresolved after substitution —
 * a stray placeholder in the shipped guide.json is a bug, not a warning.
 */
export function substitutePricing(text, pricing) {
  const freeMonths = 12 - Math.round(pricing.widgetAnnual / pricing.widgetMonthly);
  const replacements = {
    "{{price}}": won(pricing.widgetMonthly),
    "{{annual}}": won(pricing.widgetAnnual),
    "{{freeMonths}}": String(freeMonths),
    "{{trialDays}}": String(pricing.trialDays),
    "{{trialMax}}": String(pricing.trialCatalogMax),
  };

  let result = text;
  for (const [placeholder, value] of Object.entries(replacements)) {
    result = result.split(placeholder).join(value);
  }

  const leftover = /\{\{[^}]*\}\}/.exec(result);
  if (leftover) {
    throw new Error(`sync-guide: unresolved placeholder ${leftover[0]} after substitution`);
  }
  return result;
}

export function syncGuide(
  src = resolve(root, "content/guide.json"),
  pricingSrc = resolve(root, "content/pricing.json"),
  dest = resolve(root, "public/guide.json"),
) {
  if (!existsSync(src)) throw new Error(`guide source missing: ${src}`);
  if (!existsSync(pricingSrc)) throw new Error(`pricing source missing: ${pricingSrc}`);

  const pricing = JSON.parse(readFileSync(pricingSrc, "utf8"));
  const raw = readFileSync(src, "utf8");
  const substituted = substitutePricing(raw, pricing);

  // Fail fast if substitution broke the JSON rather than shipping garbage.
  JSON.parse(substituted);

  mkdirSync(dirname(dest), { recursive: true });
  writeFileSync(dest, substituted);
  return dest;
}

if (process.argv[1] && process.argv[1].endsWith("sync-guide.mjs")) {
  console.log("synced", syncGuide());
}
