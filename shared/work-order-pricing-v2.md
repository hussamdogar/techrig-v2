# Work order: Pricing v2 — four-bundle, two-price model

Owner: orchestrator (routing only). Lanes: **SEO (S10)**, **Design (DZ3)**, **Dev (D15)**.
Source of truth (verbatim client doc, 2026-07-10): `shared/client-pricing-v2-2026-07-10.md`. Read it for full per-page wording; this work order carries the structural decisions, the pricing data, the routing, and the gate.

**Owner decision (2026-07-10): FULL pricing v2 build BEFORE launch.** This **supersedes** the single-$1,700-package model built in D1 and the à-la-carte prices set across D1-D14 (client's latest doc wins, per the source-of-truth precedence rule). It is a re-architecture of the pricing engine, not a tweak — treat it as a milestone.

## Locked decisions
- Build the doc **as written**, including the standalone **price increases** on 8 services (customer-facing à-la-carte prices go up; bundle prices are unchanged).
- **Two prices per service**: a `standalone` price and a lower `bundle` price. À-la-carte checkout uses `standalone`; the four bundles use `bundle` prices.
- **Four bundles** replace the single package. Each bundle price = sum of its in-bundle prices, **rounded up to the nearest $100**, with the itemized total, the `+$N` rounding line, standalone value, savings, and discount % all shown publicly (§1).
- **BOC-3 shown as "Included" on every bundle card** (existing-carrier wording: "BOC-3 filing when required or verification the existing BOC-3 is on file"). Do NOT create a separate BOC-3+UCR bundle.
- **No** convenience fee; **no** extra package-level discount beyond the listed in-bundle discounts + rounding.

## Orchestrator verification (done)
All four bundles' arithmetic is internally consistent — I re-derived every itemized total, rounding, saving, and discount %. **The new in-bundle prices equal the current registry prices exactly** (MC+USDOT 600, UCR 50, DQ 200, clearinghouse 100, consortium 150, drug 100, IRP 175, IFTA 175); only the **standalone** prices are new. So bundle economics are unchanged; the work is the two-price structure + the four-bundle split + the new standalone prices + the display math.

## The data

### Two-price table (§2)
| Service | Standalone | In-bundle |
|---|---|---|
| MC Authority + USDOT | $650 | $600 |
| USDOT-only | $300 | $300 |
| BOC-3 | $100 | $100 |
| UCR filing service | **$80** | $50 |
| UCR gov fee (0-2) | $46 | $46 |
| DQ file — 1 driver | **$250** | $200 |
| Clearinghouse | **$125** | $100 |
| Consortium | **$175** | $150 |
| Pre-employment drug test | **$125** | $100 |
| IRP initial setup | **$225** | $175 |
| IFTA initial setup | **$225** | $175 |
| IFTA quarterly | $150 | $150 |
| USDOT Correction / Biennial / MOTUS Migration | $125 each | not bundled |

Bold = a **change** from the current registry (the current value becomes the in-bundle price; the bold value is the new standalone).

### DQ dual pricing (§8, §12)
- **Standalone:** 1=$250, 2=$450 total, 3=$600 total, >3 = custom quote.
- **In-bundle:** 1=$200 (included), 2=$350 total (+$150), 3=$450 total (+$100), >3 = custom.

### Four bundles (§3) — name · price · included · itemized→final · public display
1. **Compliance Continuation — Non-CDL — $400.** BOC-3, UCR filing, UCR gov (0-2), 1 DQ. Itemized $396 +$4 → **$400**. Standalone value $476, savings $76, 16.0%.
2. **Compliance Continuation — CDL/Heavy — $1,100.** + Clearinghouse, Consortium, Drug test, IRP, IFTA (on top of Bundle 1's set). Itemized $1,096 +$4 → **$1,100**. Value $1,351, savings $251, 18.6%.
3. **Authority Launch — Non-CDL — $1,000.** MC+USDOT, BOC-3, UCR filing, UCR gov, 1 DQ. Itemized $996 +$4 → **$1,000**. Value $1,126, savings $126, 11.2%.
4. **Authority Launch — CDL/Heavy — $1,700.** MC+USDOT + the full CDL/heavy set (= the old 9-item package). Itemized $1,696 +$4 → **$1,700**. Value $2,001, savings $301, 15.0%.

All four `+$4` rounding lines and the display figures must be **derived** from the data, never hardcoded, so they stay correct if a price moves.

## Routing

### SEO — S10 (leads; produces the parity master + specs)
1. **`seo/context/services.md`** → rewrite to the two-price model + the four bundles + the DQ dual tables + all §10-24 wording refinements. This is the master the Dev registry / `/apply` / receipt / marketing must equal.
2. **Page-briefs:**
   - A **packages/bundles brief** (the 4 cards, the §4 comparison table, the §5 heading + supporting text, the §6 CDL/non-CDL selector wording, the §7 BOC-3-Included wording).
   - Update the **compliance hub brief** to add the package-selector section.
   - Refine the **individual service-page briefs** for the new **standalone** prices + wording: UCR ($80 standalone / $50 bundle, §10), DQ (standalone 250/450/600, §12), Consortium ($175 + the TrueTest eligibility wording, §13), Clearinghouse ($125, §14), Drug test ($125, §15), IRP/IFTA ($225 setup, §16), MC+USDOT ($650 standalone + the USDOT-intrastate nuance, §17), Refund (add the 30-day-inactive non-refundable case, §21).
3. Update `sitemap-plan.md` / `keyword-map.md` if the bundles get their own URL(s).

### Design — DZ3 (after SEO's bundles brief)
Specs (reuse the locked design system; new components within it): the **four package cards**, the **side-by-side comparison table** (§4), the **CDL/non-CDL selector** + "choose by vehicle not driver" explanatory block (§6), the **"BOC-3 Included"** badge (§7), and the **per-bundle itemized + rounding + savings display** (§1). No new design-system foundations.

### Dev — D15 (the big lift)
1. **Re-architect `dev/lib/services-registry.ts`:** two prices per service (`standalone`, `bundle`); four bundle definitions (included keys, itemized total, rounding adjustment, final price, public-display fields — all derived); the dual DQ tables. Remove the old single `full-package` entry (Bundle 4 replaces it).
2. **Rewrite `computePricing`:** à-la-carte selection → standalone prices; bundle selection → the four fixed bundles at in-bundle prices; derive savings / discount % / rounding from the data. One source for every displayed number.
3. **`/apply`:** bundle-selection UX (the four bundles + the CDL/non-CDL selector) alongside à-la-carte; the review screen shows the itemized table + rounding + savings. (D14 CTA routing stays; `/apply/?service=<key>` still pre-selects a service.)
4. **Propagate:** receipts, M6 emails, PDFs, `/admin` order calculations, and JSON-LD `Offer` prices all read the new model.
5. **§25 find-and-fix sweep:** remove every old single-`$1,700`-package reference, old single-price reference, and hardcoded price across `dev/` (marketing pages, `/apply`, emails, PDFs, schema, FAQs, comparison tables, footer, metadata).
6. **Parity gate (before build-complete):** `services.md` = `services-registry.ts` = `/apply` review = generated receipt = M6 emails = marketing pages = the §4 comparison table, ZERO contradictions; and the four bundles re-derive to exactly $400 / $1,100 / $1,000 / $1,700.

## Sequencing + gate
- **SEO leads** (services.md + the bundles brief + service-brief refinements). **Dev may start the registry re-architecture in parallel** — the pricing data is fully specified here. **Design** produces the card/comparison/selector specs once SEO's bundles brief lands; **Dev** finishes the `/apply` + display UI after Design's specs. Build-sequence gate (page-briefs/ + design/ for the new package UI) applies to the UI, not the registry data.
- **Launch is gated on this.** Pricing v2 lands + the parity gate re-passes BEFORE the joint launch; then the staging QA ledger (M3 stepper + M4 **live Stripe**) validates the new pricing + bundle checkout end-to-end. The two open creds (QCMobile webKey, live Stripe key) remain the other launch blockers.
- Not launch-blocking, still deferred: D10 renewal reminders, D11 legacy import.
