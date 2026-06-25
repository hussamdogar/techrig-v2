# Client QA & Content Revision Brief (received 2026-06-21)

Verbatim record of the client's developer brief (`Tech_Rig_Website_QA_Developer_Brief.docx`). This is the authoritative change request. SEO source files and the Dev work order (`../../shared/work-order-qa-revision.md`) are derived from it.

## 1. Site-wide critical changes
- **Insurance:** remove all wording that Tech Rig sells, files, or handles insurance. May coordinate/refer only. **Remove the dedicated insurance filing page and its internal links.**
- **ELD:** not directly provided; partner referral, link to Motive.
- **FMCSA Portal → MOTUS:** new registrations say "MOTUS"/"MOTUS Portal"; legacy "FMCSA Portal" only when explaining migration of an older account into MOTUS.
- **UCR activation:** remove any statement that UCR is required to activate MC authority. UCR is separate, not an MC activation prerequisite.
- **BOC-3 applicability:** generally NOT required for a private motor carrier not operating for hire.
- **USDOT vs MC timing:** USDOT becomes active when registration is completed; MC authority normally has a 21-day protest period and requires BOC-3 + insurance filings before it activates.

## 2. Master pricing table
IRP/IFTA prices are setup fees only. All other listed prices include the applicable government fee unless stated.
- USDOT Registration (standalone): **$300** — includes gov fee; no separate USDOT gov fee.
- MC Authority + USDOT: **$600** — one-time total; includes USDOT + gov fee.
- BOC-3 Filing: **$100** — one-time; add a dedicated $100 card wherever MC costs show.
- IRP Setup Fee Only: **$175** — gov/jurisdiction separate; annual renewal.
- IFTA Setup Fee Only: **$175** — gov separate.
- IFTA Quarterly Filing: **$150 + government fee** — separate recurring service.
- Clearinghouse Setup: **$100**.
- Consortium Enrollment: **$150** — annual renewal.
- Driver Qualification File Setup: **$200 per driver** — annual renewal $200/driver.
- Pre-employment Drug Test: **$100**.
- USDOT Correction: **$125** — new card (scope in §5.3).
- Full Initial Package: **$1,700** — update every occurrence site-wide.

## 3. UCR pricing and logic
Customer-facing formula: Tech Rig filing fee **$50** + applicable UCR government fee.
| Bracket | Gov fee | Total (with $50) |
|---|---|---|
| 0-2 | $46 | $96 |
| 3-5 | $138 | $188 |
| 6-20 | $276 | $326 |
| 21-100 | $963 | $1,013 |
| 101-1,000 | $4,592 | $4,642 |
| 1,001+ | $44,836 | $44,886 |
- UCR annual renewal. CMV bracket = number of qualifying trucks. A business operating only non-CMVs stays in 0-2 even with >2 non-CMVs (20 non-CMVs = $46 bracket). UCR is NOT a prerequisite for MC activation.

## 4. Homepage
Remove insurance filing and ELD as services directly handled (para 2 + all summaries/cards/FAQs/CTAs). ELD may remain only as a partner/referral (Motive link, §12).

## 5. Compliance page / service cards
- 5.1 USDOT pricing: "$300 + government fees (varies)" → "$300" (no separate federal USDOT fee).
- 5.2 Rename "MCS-150 Updates" → "Biennial Update" in cards/menu (MCS-150 ok in body text). **Do NOT say FMCSA no longer mails USDOT PINs — FMCSA is still mailing USDOT PINs.**
- 5.3 New "USDOT Correction" card, $125. Scope: address, legal/business name, email, phone, operating-status, # trucks, # drivers. Keep separate from Biennial Update.

## 6. USDOT registration page
- 6.1 USDOT = federal ID/safety-registration; a carrier may haul for compensation with only a USDOT when entirely intrastate (subject to state rules). MC = federal for-hire authority generally required for regulated freight across state lines / interstate commerce.
- 6.2 USDOT active when completed (no BOC-3/insurance to activate USDOT). MC needs 21-day protest + BOC-3 + insurance.
- 6.3 Replace FMCSA Portal with MOTUS for new registration; USDOT shown as $300 total; no "+ government fee".
- 6.4 Remove the California legacy-account migration example (it is reinstatement/migration, not a new registration); move it to a reinstatement/legacy-migration page. If an example is kept, use a straightforward new-carrier example (correct entity details, operation type, vehicle/driver count, cargo, new USDOT issued).

## 7. MC authority pricing section (screenshot fix)
- $600 card titled "MC Authority + USDOT". Add a titled $100 "BOC-3 Filing" card: "Required for most for-hire MC authority applicants before authority can activate."
- Remove UCR-as-activation wording. Remove "insurance filing" from services Tech Rig directly handles (neutral note: the customer's insurer must file proof of insurance with FMCSA). Update "full setup" line so it does not claim Tech Rig provides insurance or ELD.

## 8. Driver Qualification File
- Federal DQ generally applies to drivers operating a CMV with GVWR/GCWR/GVW/GCW of 10,001 lbs or more in applicable commerce. Not required below 10,001 lbs (avoid state-specific claims). $200/driver; annual renewal $200/driver. UCR, consortium, DQ, IRP are recurring/renewable where applicable.

## 9. Clearinghouse and Consortium
- 9.1 Clearinghouse: state Tech Rig is registered as a C/TPA with the FMCSA Drug & Alcohol Clearinghouse. New CDL drivers (incl. owner-operators) must complete pre-employment drug testing before safety-sensitive work. Link the pre-employment reference to the pre-employment drug-test service page.
- 9.2 Consortium: a pre-employment drug test is required when a driver begins safety-sensitive work for a new employer. A prior test counts only if within the previous 30 days AND for the same company; otherwise a new test is needed. Remove the location-pin emojis/icons from the "rest of the driver-compliance set" section.

## 10. IRP page
Required when a CMV operates in 2+ jurisdictions (US states/Canadian provinces) and meets a threshold: power unit GVW/registered weight over 26,000 lbs; OR 3+ axles regardless of weight; OR combined vehicle+load over 26,000 lbs. Operating without IRP credentials may mean fines or out-of-service at a weigh station. Pricing: "IRP setup fee only: $175," gov/jurisdiction separate. Annual renewal.

## 11. IFTA page
Applies when a CMV operates across multiple member jurisdictions and transports people/property: 2 axles and over 26,000 lbs GVW/registered weight; OR 3+ axles regardless of weight; OR used in combination and combined weight over 26,000 lbs. Exemptions: entirely within one jurisdiction; RVs/personal non-commercial; certain government vehicles. Pricing: IFTA setup fee only $175, gov separate. Add separate IFTA quarterly-filing service at $150 + gov.

## 12. External partner links
- ELD / Motive CTA → `https://partners.gomotive.com/DGR-TECH-RIG` (external; partner-provided, not directly handled).
- Trucking LLC formation / Inc Authority CTA → `https://goto.incauthority.com/QY2keP` (partner/referral; disclose).

## 13. Replacement copy
**MC cost block:** "$600 — MC Authority + USDOT: One-time registration package. Includes the USDOT number and applicable government filing fee." / "$100 — BOC-3 Filing: Required for most for-hire MC authority applicants before authority can activate." / Insurance note: "Your insurance provider must file the required proof of insurance directly with FMCSA. Insurance premiums are separate and Tech Rig does not directly sell insurance." / Activation note: "MC authority normally has a 21-day protest period and will not activate until the required BOC-3 and insurance filings are on record. UCR is separate and is not an activation requirement."
**USDOT cost block:** "$300 — Standalone USDOT Registration: Total service price. There is no separate federal USDOT application fee. The USDOT number becomes active when the registration is completed. BOC-3 and insurance are not required merely to activate a USDOT number."

## 14. Acceptance checklist (client's)
No page says Tech Rig handles insurance/ELD; insurance page + links removed; prices match table; titled $100 BOC-3 card; USDOT $300 without "+ gov"; MC+USDOT $600; Full package $1,700; UCR $50 + bracket; UCR never an MC-activation requirement; MCS-150 Updates renamed Biennial Update; USDOT Correction card $125; new-registration uses MOTUS not FMCSA Portal; legacy migration case moved off the USDOT registration page; DQ threshold + renewal language; Clearinghouse C/TPA stated; consortium/Clearinghouse link to pre-employment drug test; IRP/IFTA eligibility + recurring obligations accurate; location emojis removed; ELD + LLC partner links set; desktop+mobile QA.

## 15. Final QA
Search the codebase/CMS for: insurance filing, ELD, FMCSA Portal, MCS-150 Updates, UCR activation, government fees, full package, USDOT cost, BOC-3, 21 days — review every match (FAQs, metadata, schema, footer, reusable components).
