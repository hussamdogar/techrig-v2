# services

Pricing and service scope per the client's Pricing v2 doc, 2026-07-10 (`../../shared/client-pricing-v2-2026-07-10.md` + `../../shared/work-order-pricing-v2.md`). This **supersedes** the single-$1,700-package + à-la-carte model of 2026-06-25 (client's latest doc wins). This file is the pricing MASTER that the Dev typed registry (`dev/lib/services-registry.ts`), `/apply`, receipts, emails, and the marketing pages must equal (parity gate). Display rules and claims governed by `brand-guidelines.md`.

## Service lines (two, funnel-ordered)

### 1. Compliance & company setup (acquisition / top of funnel) — ACTIVE FOCUS
The lead service for new and growing carriers, launched August 2025. Tech Rig is officially listed by FMCSA as a BOC-3 blanket process-agent company (see `experience-notes.md`; never imply Tech Rig is FMCSA or government-endorsed). Engagements run a few weeks at most.

**The compliance/setup packet:** Registered LLC (partner referral, Inc Authority) · USDOT number · MC authority · BOC-3 · UCR · DQ files · Clearinghouse · consortium · pre-employment drug test · IRP · IFTA. Plus, as referrals/coordination only (NOT Tech Rig services): ELD (partner referral, Motive) and insurance (coordinate with the carrier's own insurer; the dedicated insurance page is being removed). Coverage mapping in `../../shared/keyword-map.md`.

## Pricing v2 — two-price model + four bundles (the parity master)
Every bundle-eligible service has TWO prices: a **standalone** price (à-la-carte checkout uses this) and a lower **in-bundle** price (used inside the four bundles). The four bundle prices are **DERIVED**, never hardcoded: the final price = the sum of the in-bundle prices (no rounding). Savings = standalone value − final price, which equals the sum of the per-line in-bundle discounts; discount % = savings ÷ standalone value. Keep everything derived so the numbers stay correct if a price moves. **No convenience fee; no extra package-level discount** beyond the listed in-bundle discounts.

### Two-price table (§2)
| Service | Standalone | In-bundle | In-bundle discount |
|---|---|---|---|
| MC Authority + USDOT | **$650** | $600 | $50 |
| USDOT only | $300 | $300 | $0 |
| BOC-3 filing | $100 | $100 | $0 |
| UCR filing service | **$80** | $50 | $30 |
| UCR government fee (0-2 bracket) | $46 | $46 | $0 |
| DQ file — 1 driver | **$250** | $200 | $50 |
| Clearinghouse setup | **$125** | $100 | $25 |
| Consortium enrollment | **$175** | $150 | $25 |
| Pre-employment drug test | **$125** | $100 | $25 |
| IRP initial setup | **$225** | $175 | $50 |
| IFTA initial setup | **$225** | $175 | $50 |
| IFTA quarterly filing | $150 | $150 | $0 |

Bold = a standalone **price increase** (8 services). The **in-bundle prices equal the prior registry values** exactly, so bundle economics are unchanged; only the standalone à-la-carte prices are new.

Not bundled (single price, standalone only): **USDOT Correction $125 · Biennial Update $125 · FMCSA Portal to MOTUS Migration $125.**

### Driver Qualification (DQ) dual pricing (§8, §12)
Every bundle includes one driver. Additional drivers priced by total driver count; bundle price is always lower than standalone at every count. Annual renewal at the applicable driver-count rate.
- **Standalone:** 1 = $250 · 2 = $450 total · 3 = $600 total · >3 = custom quote.
- **In-bundle:** 1 = $200 (included) · 2 = $350 total (+$150) · 3 = $450 total (+$100) · >3 = custom quote.

### UCR government-fee brackets (§10)
On the UCR page show the government brackets and the Tech Rig filing fee as SEPARATE lines, NOT combined totals. Standalone filing fee **$80**; in-bundle $50; plus the government fee below. Do NOT show the full table inside the `/apply` form unless necessary.

| Bracket (qualifying CMVs) | Government fee |
|---|---|
| 0-2 | $46 |
| 3-5 | $138 |
| 6-20 | $276 |
| 21-100 | $963 |
| 101-1,000 | $4,592 |
| 1,001+ | $44,836 |

Non-CMV clarification: a carrier operating only non-CMVs stays in the 0-2 bracket even with more than two non-CMVs (e.g. 20 non-CMVs = $46). UCR is NOT a prerequisite for MC authority activation.

### The four bundles (§3) — prices DERIVED, not hardcoded
Replace the single package with four bundles. Each card shows the itemized in-bundle total (= the final price, no rounding) and the public display (standalone value / package price / savings / discount %). **BOC-3 is shown "Included" on every card** (existing-carrier wording: "Includes BOC-3 filing when required or verification that the carrier's existing BOC-3 is correctly on file"). Do NOT create a separate BOC-3+UCR bundle.

**Bundle 1 — Compliance Continuation — Non-CDL — $396.** Already have USDOT + MC, operate a non-CDL vehicle. Includes: BOC-3 (or verification), UCR filing, UCR gov (0-2), one DQ file. Itemized in-bundle total = final price **$396**. Public: standalone value **$476**, savings **$80**, discount **16.8%**.

**Bundle 2 — Compliance Continuation — CDL/Heavy — $1,096.** Already have authority; need CDL-driver compliance + IRP + IFTA. Includes Bundle 1's set + Clearinghouse, Consortium, pre-employment drug test, IRP setup, IFTA setup. Itemized total = final price **$1,096**. Public: value **$1,351**, savings **$255**, **18.9%**. IRP/IFTA government, state, plate, credential, and jurisdiction fees billed separately.

**Bundle 3 — Authority Launch — Non-CDL — $996.** New carrier, non-CDL vehicle. Includes: MC+USDOT, BOC-3, UCR filing, UCR gov (0-2), one DQ file. Itemized total = final price **$996**. Public: value **$1,126**, savings **$130**, **11.5%**.

**Bundle 4 — Authority Launch — CDL/Heavy — $1,696.** New heavy interstate carrier. Includes MC+USDOT + the full CDL/heavy set (= the old 9-item package). Itemized total = final price **$1,696**. Public: value **$2,001**, savings **$305**, **15.2%**. IRP/IFTA government/jurisdiction fees separate. **This bundle REPLACES the old single $1,700 "Full Initial Package"** (remove that entry from the registry).

Derivation check (must re-pass in the parity gate): final = itemized total with no rounding — $396, $1,096, $996, $1,696; savings ($80/$255/$130/$305) = value − final = the sum of the per-line in-bundle discounts.

### Renewal disclosures (§9)
Package pricing covers the initial setup and first service period for one driver. Renewal cycles: UCR annual · Consortium annual · DQ files annual · IRP annual · IFTA quarterly · Clearinghouse (not an annual subscription) · pre-employment drug test (charged when required). Public wording: "Package pricing covers the initial filing and first service period. UCR, consortium enrollment, Driver Qualification files, and IRP require renewal. IFTA returns are filed quarterly. We send reminders and invoices before services become due. Automatic billing is only used when the customer expressly authorizes it."

### On-demand / authority management (single price)
- **Biennial Update** — **$125** (the MCS-150 two-year USDOT update; keep the page focused on that). **USDOT Correction** — **$125** (address, legal/business name, email, phone, operating status, truck count, driver count). **FMCSA Portal to MOTUS Migration** — **$125** (~1-2 weeks; holds the relocated CA legacy case study).
- **MC reinstatement** — $200 service fee; any FMCSA government fee separate.
- **USDOT reactivation / deactivation** — $125.

### Referrals / coordination only (NOT Tech Rig services, no price)
- **ELD** — Tech Rig does NOT provide, sell, install, or configure ELDs. Partner referral to Motive: `https://partners.gomotive.com/DGR-TECH-RIG` (external; client buys the device/subscription directly from Motive). Never say "we set up your ELD."
- **Insurance** — Tech Rig does NOT provide or handle insurance, does not file BMC-91/MCS-90 (only the insurer can), and has no insurer partnerships. Coordinates with the client's own insurer only. The dedicated insurance-filing page is REMOVED; internal links removed. Neutral note only: the customer's insurer must file proof of insurance with FMCSA.
- **LLC formation** — partner referral to Inc Authority: `https://goto.incauthority.com/QY2keP` (external; disclose as a partner/referral link). Public pricing: "Contact for quote".

### Removed per client (do not publish)
- **FMCSA authority letter ($40)** — removed from the site entirely.

## Compliance language rules (client QA brief)
- **USDOT vs MC timing:** a USDOT number becomes active when registration is completed (BOC-3 and insurance are NOT required merely to activate the USDOT). MC operating authority normally has a 21-day protest period and requires the BOC-3 and insurance filings before authority can activate.
- **UCR** is a separate registration obligation, NOT an MC activation prerequisite. Never imply otherwise.
- **BOC-3** is generally NOT required for a private motor carrier not operating for hire.
- **MOTUS:** for new registrations use "MOTUS"/"MOTUS Portal," not "FMCSA Portal." The legacy "FMCSA Portal" is mentioned only when explaining migration of an older account into MOTUS.
- **USDOT PINs:** FMCSA IS still mailing USDOT PINs. Do NOT say FMCSA stopped mailing/emailing PINs anywhere.
- **DQ threshold:** federal DQ-file requirements generally apply to drivers operating a CMV with a GVWR/GCWR/GVW/GCW of 10,001 lbs or more in applicable commerce; not required below 10,001 lbs (avoid state-specific claims).
- **Clearinghouse (§14):** "DGR Tech Rig LLC is registered as a C/TPA with the FMCSA Drug & Alcohol Clearinghouse." (Uses the legal-entity name for regulatory accuracy; "Tech Rig" DBA elsewhere.) Link Clearinghouse setup to pre-employment drug testing where relevant.
- **MC government fee:** never publish a separate MC authority government-fee figure. Keep the amount-free "shown separately" wording.
- **USDOT vs MC (§17):** "A USDOT number may be sufficient for intrastate for-hire operations where permitted by state law. MC operating authority is generally required when transporting property for compensation in interstate commerce." Do NOT say every carrier hauling for compensation automatically needs MC authority. USDOT-only stays $300 (standalone or bundle).
- **BOC-3 activation (§11):** "MC authority activation requires the BOC-3 filing and the required insurance filing from the carrier's insurer. UCR is a separate annual registration and is not required for authority activation." Retain: BOC-3 is generally not required for a private motor carrier not operating for hire.
- **Consortium / prior test (§13, revised — TrueTest):** "A previous pre-employment drug test may be used in place of a new one only if the driver has actively participated in a qualifying DOT drug testing program within the preceding 30 days and meets FMCSA's other conditions for waiving a new test. Tech Rig will verify eligibility through TrueTest before waiving any test."
- **IRP/IFTA fee disclosure (§16):** "This payment covers Tech Rig's setup and filing-assistance fee. Government, state, plate, credential, and jurisdiction fees are calculated separately and must be paid before the filing can be completed." IRP renews annually; IFTA returns are filed quarterly.
- **Refund (§21):** remove the old flat $50 processing fee; on eligible refunds deduct only the actual non-refundable payment-processing fee (e.g. paid $100, $3 processing fee → refund $97). **Non-refundable now also includes: the client being inactive for 30 days due to missing documents or delayed response.** Full copy lives in the `refund-policy` page brief; policy last updated June 25, 2026.

## Turnaround times (client Q6.2 — `expectedTimeline` parity with the registry)
Each service's turnaround. Use this wording; never state a guaranteed activation date (FMCSA timing is outside Tech Rig's control).
- **USDOT registration** — filed within 24 hours; active immediately after successful submission.
- **BOC-3** — same business day when the order and required info are received during business hours.
- **UCR** — same day when the carrier is in the UCR database; a new USDOT may take 1-2 days to appear.
- **MC authority** — filed within 24 hours; activates after the 21-day protest period and requires BOC-3 + insurance (if either is missing after the protest period, activation stays pending until submitted).
- **USDOT Correction** — normally same day when the MOTUS account is active and the USDOT is linked; FMCSA linking/support issues may take ~7-10 business days.
- **Biennial Update** — normally same day when MOTUS/USDOT are accessible; same ~7-10 business-day FMCSA delay if linking is needed.
- **Clearinghouse setup** — within 1 business day.
- **Consortium enrollment** — within 1-2 business days.
- **Driver Qualification file** — within 1-3 business days after all documents are received.
- **Pre-employment drug test** — scheduled after consortium enrollment, per carrier/driver availability.
- **IRP setup** — varies by state and document availability.
- **IFTA setup** — varies by state and document availability.
- **IFTA quarterly filing** — within 1-3 business days after complete mileage + fuel records.
- **FMCSA Portal to MOTUS Migration** — approximately 1-2 weeks.

## Billing model (client Q2.1)
Recurring services (UCR annual, Consortium annual, DQ annual, IFTA quarterly) are billed by **reminder before the due date, then a manual invoice**. Auto-charge only with the customer's express consent. NOT Stripe subscriptions. Launch copy must not promise an automated reminder that does not yet exist.

### 2. Truck dispatch (retention / recurring retainer) — ACTIVE
The original service, launched 2021 (~100 carriers dispatched to date) and still actively offered. Present as fully bookable.
- **Pricing model (confirmed all equipment):** straight percentage of gross monthly revenue by equipment: box trucks 8%, cargo vans 5%, dry van 5%, power only 5%, flatbeds & reefer vans 3%, hot shot 8%.
- **Dispatch by trailer type:** box truck, flatbed, hot shot, reefer, dry van, power only.
- **Included ops:** load matching, rate negotiation, 24/7 support, billing & paperwork, route planning.
- **Adjacent:** factoring (partner-facilitated via OTR Solutions / RTS Financial), document management.
- Positioning: no long-term contracts, no forced dispatch.

## Money-page priority (pivot-led, protect dispatch)
1. New top-level **compliance / company-setup** money pages (currently greenfield — no indexable pages exist).
2. A rebuilt **/services/** hub reflecting both lines (current page is stale, dispatch-only).
3. Defend and upgrade the **dispatch silo hubs** (reefer, flatbed, dry van, box truck, power only, hot shot) that already rank.
4. **State** pages (currently 4: NY, CA, TX, FL).

## Proof points
Real, confirmed proof now lives in `experience-notes.md` (6 client stories, track record, credentials). The legacy homepage metrics (15% revenue increase, 20% deadhead reduction, $10k-$20k extra earnings, 15 hrs/wk saved, "5-star rated") are REMOVED — both partners confirmed none are documented. Do not reintroduce them.

## NAP
Public brand: **Tech Rig** (legal entity **DGR Tech Rig LLC** for footer/legal/schema).
30 N Gould St, Ste R, Sheridan, WY 82801 | +1 (917) 909-2257 | info@techrig.org
Address caveat: use only as the registered business address; do not imply a staffed walk-in office.
