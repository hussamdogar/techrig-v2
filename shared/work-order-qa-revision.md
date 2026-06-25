# Work order for Dev: client QA revision (2026-06-21)

Source of truth: the client's full brief is saved at `../seo/output/client-qa-brief-2026-06.md` (verbatim, with the master pricing table, UCR table, per-page copy, and the client's acceptance checklist). Implement that brief on the built site. This work order adds the SEO-owned structural items and the canonical wording, and supersedes `work-order-eld-insurance.md` (its ELD/insurance fixes are folded in here).

Apply changes SITE-WIDE, not only on the pages named. Run the §15 find-and-fix sweep before publishing.

## A. Structural / sitemap changes (SEO-owned)
1. **Remove the insurance page.** Delete `/trucking-insurance-filing/` (route + OG image), remove it from the sitemap and from internal links (it is linked from `/mc-registration/`, `/compliance-services/`, the pillar step 5, and the footer). Add a **301 from `/trucking-insurance-filing/` → `/compliance-services/`** for anyone who has the URL. Insurance becomes a neutral note on the MC pages only ("your insurer must file proof of insurance with FMCSA"), never a service/page.
2. **Rename "MCS-150 Updates" → "Biennial Update"** in all cards/menus/nav. The term MCS-150 may remain in body/explanatory text. Updated brief: `page-briefs/mcs-150-biennial-update.md`.
3. **Add a new "USDOT Correction" service card, $125.** Scope: address, legal/business name, email, phone, operating-status, # trucks, # drivers. Separate from Biennial Update. (New card on the compliance hub + its own section/page as Dev sees fit; brief note added.)
4. **Add "IFTA Quarterly Filing $150 + government fee"** as a separate recurring service on the IFTA page.
5. **ELD page** stays but becomes a partner-referral page (see C). **Trucking LLC page** stays but the CTA is a partner referral (Inc Authority).
6. Sitemap/keyword-map/footer updated in `shared/` to reflect 1-5.

## B. Pricing (match `services.md` master table exactly)
USDOT standalone **$300** (no "+ government fee"); **MC Authority + USDOT $600**; **BOC-3 $100** (titled card); UCR **$50 filing + bracket gov fee** (0-2 $96, 3-5 $188, 6-20 $326, 21-100 $1,013, 101-1,000 $4,642, 1,001+ $44,886); Clearinghouse $100; Consortium $150 (annual); DQ $200/driver (annual); pre-employment drug test $100; IRP setup $175; IFTA setup $175; IFTA quarterly $150 + gov; USDOT Correction $125; Biennial Update $125; **Full Initial Package $1,700** (replace every $1,350/$1,650). ELD: no price (partner). Insurance/LLC: no price (contact-for-quote / partner).

## C. Language fixes (site-wide; canonical wording in `services.md` §"Compliance language rules")
- **Insurance:** never say/imply Tech Rig sells, files, or handles insurance; no insurer partnerships; coordinate-only. Remove "insurance filing" from any list of services Tech Rig directly handles (incl. the MC "full setup" line, the home para-2 list, and the state "what we file" subsets). On `/mc-registration/`, change "Tech Rig files your... insurance filing" to "coordinates."
- **ELD:** partner referral only (Motive `https://partners.gomotive.com/DGR-TECH-RIG`). The built `/eld-services/` page currently says "we choose, install, and configure," has a price chip, `serviceType: "ELD setup"`, and "Set up my ELD" CTA — replace all with the referral framing in `page-briefs/eld-services.md` (CTA "Get connected with our ELD partner", external Motive link, no price chip, schema serviceType "ELD partner referral"). Home para 2 must not list ELD as directly handled.
- **UCR ≠ activation:** remove any wording that UCR is required to activate MC authority (e.g. `/mc-registration/` activation FAQ/lists, the hub, the bundle). Keep BOC-3 + insurance as the activation requirements.
- **BOC-3:** add that it is generally not required for a private motor carrier not operating for hire. MC $100 card copy: "Required for most for-hire MC authority applicants before authority can activate."
- **USDOT vs MC timing:** USDOT active when registration completes (no BOC-3/insurance to activate it); MC needs the 21-day protest period + BOC-3 + insurance. Apply on `/dot-registration/` and `/mc-registration/`.
- **MOTUS:** new-registration copy says "MOTUS"/"MOTUS Portal," not "FMCSA Portal." Legacy "FMCSA Portal" only in migration context. Fix `/dot-registration/` "what a USDOT number costs" and any portal mention.
- **USDOT PINs:** FMCSA IS still mailing PINs. **Remove any statement that FMCSA stopped mailing/emailing PINs** (it currently appears in the MOTUS/PIN narrative on `/dot-registration/`, `/mcs-150-biennial-update/`, `/boc-3-filing/` and the blog idea). Reword so the PIN wait is not attributed to FMCSA having stopped.
- **DQ threshold:** DQ files generally apply at CMV GVWR/GCWR/GVW/GCW ≥ 10,001 lbs; not required below that (no state-specific claims). Update `/driver-qualification-files/`.
- **Clearinghouse:** state Tech Rig is a registered C/TPA with the FMCSA Drug & Alcohol Clearinghouse; link the pre-employment drug-test reference to its service page. Update `/fmcsa-clearinghouse-registration/`.
- **Consortium:** pre-employment test required when a driver begins safety-sensitive work for a new employer; a prior test counts only if within 30 days AND same company. **Remove the location-pin emojis/icons** from the "rest of the driver-compliance set" section (glyphs via CSS only, never typed). Update `/drug-and-alcohol-consortium/`.

## D. Per-page specifics from the client brief (see saved brief §§5-13)
- **USDOT page:** $300 only (no "+ gov"); MOTUS not FMCSA Portal; **remove the California legacy-migration example** (it is reinstatement/migration, not a new registration) and move it to a reinstatement/legacy-migration page; if an example stays, use a straightforward new-carrier example. USDOT/MC explanation per §6.1.
- **MC pricing section (screenshot fix):** $600 card "MC Authority + USDOT"; titled $100 "BOC-3 Filing" card with the §13 copy; remove UCR-as-activation; remove insurance from directly-handled; "full setup" line must not claim Tech Rig provides insurance or ELD. Use the §13.1 replacement copy block.
- **IRP page:** eligibility per §10 (2+ jurisdictions + threshold: >26,000 lbs, or 3+ axles, or combined >26,000 lbs); out-of-service warning; "$175 setup only," gov separate, annual renewal.
- **IFTA page:** qualification + exemptions per §11; $175 setup; add the $150 + gov quarterly-filing service.
- **Partner links:** ELD→Motive; LLC→Inc Authority (both external, disclosed as partner/referral). §12.

## E. Find-and-fix sweep (client §15 + SEO)
Search the codebase/CMS for: `insurance filing`, `ELD`, `FMCSA Portal`, `MCS-150 Updates`, `UCR activation` / UCR-as-prerequisite, `government fees` on USDOT, `full package` / `$1,350` / `$1,650`, `USDOT cost`, `BOC-3`, `21 days`, "FMCSA ... PIN" (stopped mailing). Review every match incl. hidden FAQs, metadata, JSON-LD, footer, and reusable components. Verify against the client's acceptance checklist (§14).

## F. SEO source updated alongside this (for reference/parity)
`seo/context/services.md` (master pricing + language rules), `shared/sitemap-plan.md`, `shared/keyword-map.md`, `shared/page-briefs/*` (eld, insurance removal, mcs-150/biennial, irp, ifta, dq, clearinghouse, consortium, mc, dot, ucr, boc-3, hub, home, trucking-llc, footer), `shared/schema-specs.md`.
