# services

Pricing and service scope per the client answers of 2026-06-25 (`../../shared/client-answers-2026-06-25.md` + `../../shared/work-order-client-answers.md`), which supersede the 2026-06-21 QA brief where they differ. This file is the pricing MASTER that the Dev typed registry (`dev/lib/services-registry.ts`) and the `/apply` flow must equal (parity gate). Display rules and claims governed by `brand-guidelines.md`.

## Service lines (two, funnel-ordered)

### 1. Compliance & company setup (acquisition / top of funnel) — ACTIVE FOCUS
The lead service for new and growing carriers, launched August 2025. Tech Rig is officially listed by FMCSA as a BOC-3 blanket process-agent company (see `experience-notes.md`; never imply Tech Rig is FMCSA or government-endorsed). Engagements run a few weeks at most.

**The compliance/setup packet:** Registered LLC (partner referral, Inc Authority) · USDOT number · MC authority · BOC-3 · UCR · DQ files · Clearinghouse · consortium · pre-employment drug test · IRP · IFTA. Plus, as referrals/coordination only (NOT Tech Rig services): ELD (partner referral, Motive) and insurance (coordinate with the carrier's own insurer; the dedicated insurance page is being removed). Coverage mapping in `../../shared/keyword-map.md`.

Master pricing (USD). IRP/IFTA are setup fees only; all other prices include the applicable government fee unless stated.
- **USDOT registration (standalone)** — **$300** total. Includes the government fee; there is NO separate federal USDOT application fee. Never display "+ government fee" on USDOT.
- **MC Authority + USDOT** — **$600**, one-time total. Includes the USDOT number and the applicable government fee. (Card title: "MC Authority + USDOT".)
- **BOC-3 filing** — **$100**, one-time. Add a dedicated titled $100 "BOC-3 Filing" card wherever MC costs are shown. NOT an annual renewal. Generally NOT required for a private motor carrier that is not operating for hire.
- **UCR registration** — **Tech Rig filing fee $50** (a separate line) **plus the applicable UCR government fee.** Annual renewal. On the UCR page, show the government brackets and the $50 filing fee as SEPARATE lines, NOT combined totals (client Q1.3/D6). Do NOT show the bracket table inside the `/apply` form.

  | Bracket (qualifying CMVs) | Government fee |
  |---|---|
  | 0-2 | $46 |
  | 3-5 | $138 |
  | 6-20 | $276 |
  | 21-100 | $963 |
  | 101-1,000 | $4,592 |
  | 1,001+ | $44,836 |

  Bracket = number of qualifying trucks. A business operating only non-CMVs stays in 0-2 even with >2 non-CMVs (e.g. 20 non-CMVs = $46 bracket). UCR is NOT a prerequisite for MC authority activation.
- **Clearinghouse setup** — **$100**.
- **Drug & Alcohol Consortium enrollment** — **$150**, annual renewal.
- **Driver Qualification (DQ) file** — **tiered: 1 driver $200; 2 drivers $350 total; 3 drivers $450 total; more than 3 drivers = custom quote** (manual path, like UCR >100 units). Annual renewal.
- **Pre-employment drug test** — **$100**, when applicable.
- **IRP setup fee only** — **$175**. Government/jurisdiction fees separate. Annual renewal.
- **IFTA setup fee only** — **$175**. Government fees separate.
- **IFTA quarterly filing** — **$150 + government fee**. Separate recurring filing service.
- **USDOT Correction** — **$125** (NEW; dedicated page). Scope: address, legal/business name, email, phone, operating-authority status, number of trucks, number of drivers. Keep separate from the Biennial Update.
- **IFTA Quarterly Filing** — **$150 + government fee** (NEW; dedicated page). Recurring per-quarter filing service, distinct from IFTA setup.
- **FMCSA Portal to MOTUS Migration** — **$125** (NEW; dedicated page). Covers claiming an existing USDOT, Company Official assignment, manual verification, missing MC authority in MOTUS, legacy FMCSA Portal account problems, and FMCSA support-ticket assistance. The relocated California legacy case study lives here.
- **Full Initial Package** — **$1,700**, all-in bundle (replaces every earlier $1,350/$1,650 figure). **Contents (9 items):** MC authority + USDOT · BOC-3 · UCR (0-2 bracket) · Clearinghouse · consortium · pre-employment drug test · IFTA setup · IRP setup · one DQ file. The package folds in the FMCSA application (OP-1) fee and the UCR government fee a carrier would otherwise pay separately. **Framing rule: all-in bundle, NO "discount" claim.** (Sum of listed service fees is ~$1,650 — 600+100+50+100+150+100+175+175+200 — so $1,700 is not a discount on service fees; the only saving is the included government fees, which are not published.) IRP/IFTA government, state, plate, permit, mileage, and jurisdiction charges remain separate and are collected later once calculated.

On-demand / authority management:
- **Biennial Update** — **$125** (the MCS-150 biennial filing). Card/menu label is "Biennial Update"; the term MCS-150 may appear in body text. Keep separate from USDOT Correction.
- **MC reinstatement** — $200 service fee; any FMCSA government fee shown separately. (Distinct from the MOTUS Migration service above.)
- **USDOT reactivation / deactivation** — $125.
- (Standalone "address change" is now folded into the **USDOT Correction** card above.)

Referrals / coordination only (NOT Tech Rig services):
- **ELD** — Tech Rig does NOT provide, sell, install, or configure ELDs. Partner referral to Motive: `https://partners.gomotive.com/DGR-TECH-RIG` (external; client buys the device/subscription directly from Motive). No Tech Rig fee/price. Never say "we set up your ELD."
- **Insurance** — Tech Rig does NOT provide or handle insurance, does not file BMC-91/MCS-90 (only the insurer can), and has no insurer partnerships. Coordinates with the client's own insurer only. **The dedicated insurance-filing page is REMOVED**; internal links to it removed. A neutral note may say the customer's insurer must file proof of insurance with FMCSA.
- **LLC formation** — partner referral to Inc Authority: `https://goto.incauthority.com/QY2keP` (external; disclose as a partner/referral link). Public pricing: "Contact for quote".

Removed per client (do not publish):
- **FMCSA authority letter ($40)** — removed from the site entirely.

## Compliance language rules (client QA brief)
- **USDOT vs MC timing:** a USDOT number becomes active when registration is completed (BOC-3 and insurance are NOT required merely to activate the USDOT). MC operating authority normally has a 21-day protest period and requires the BOC-3 and insurance filings before authority can activate.
- **UCR** is a separate registration obligation, NOT an MC activation prerequisite. Never imply otherwise.
- **BOC-3** is generally NOT required for a private motor carrier not operating for hire.
- **MOTUS:** for new registrations use "MOTUS"/"MOTUS Portal," not "FMCSA Portal." The legacy "FMCSA Portal" is mentioned only when explaining migration of an older account into MOTUS.
- **USDOT PINs:** FMCSA IS still mailing USDOT PINs. Do NOT say FMCSA stopped mailing/emailing PINs anywhere.
- **DQ threshold:** federal DQ-file requirements generally apply to drivers operating a CMV with a GVWR/GCWR/GVW/GCW of 10,001 lbs or more in applicable commerce; not required below 10,001 lbs (avoid state-specific claims).
- **Clearinghouse:** Tech Rig is registered as a C/TPA with the FMCSA Drug & Alcohol Clearinghouse (written confirmation usable; publish-cleared 2026-06-25).
- **MC government fee:** never publish a separate MC authority government-fee figure. Keep the amount-free "shown separately" wording.

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
