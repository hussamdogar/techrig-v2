# Work order: client answers reconciliation (2026-06-25)

Owner: orchestrator (routing only). Lanes: **Dev**, **SEO**, **Design**.
Source of truth: `shared/client-answers-2026-06-25.md` (the client's completed answers, verbatim). The open questions they answered were tracked in `client-questions.md`.

This work order is the routed delta list. It records, per item: the client's answer, the **verified current code state** (read 2026-06-25, file:line cited), the **delta**, and the owning lane. Where it conflicts with `work-order-qa-revision.md`, this work order wins (client's latest answer supersedes the earlier owner-confirmation, per the source-of-truth precedence rule).

## Progress
- **SEO S1-S8: ✅ DONE** — shipped as PR #7, merged to `main` (`35c002e`, 2026-06-25), orchestrator-verified (not stale: branched off `0ba17f0`; lane-clean: 16 seo/+shared/ files; parity master correct). `seo/context/services.md` is now the live pricing master + the 3 new page briefs + refund copy are on main. **Dev can now match the registry to it; Design can start DZ1.**
  - Parity note for Dev: `services.md` lists two copy-only authority-management prices that are NOT `/apply`-billable registry services and are **pre-existing** (not from this client pass): **MC reinstatement $200** and **USDOT reactivation/deactivation $125**. Do not treat their absence from the registry as a parity failure; they passed every prior gate as informational/contact copy.
- **Design DZ1: ✅ DONE** — committed to main (`7caf5f2`), orchestrator-verified (3 shared/design/ specs; tracker omitted per §13; prices from single source; CA case on MOTUS as a past example; D10 copy honest). The 3 new pages now have both a brief and a design spec → the build-sequence gate is satisfied. Design also flagged a pre-existing §13 tracker-scope inconsistency on the older ifta-registration + mcs-150 specs (tracked as L10 in `orchestration-status.md`; non-blocking).
- **Dev D1-D12: the sole remaining build lane.** Everything is unblocked — code-only deltas and the page-builds (D3/D4/D5/D6/D9) can all proceed.

## Locked decisions (orchestrator + owner, 2026-06-25)
- **Package $1,700 = all-in bundle framing.** No "discount" claim. Never publish the MC government-fee figure. Frame as folding in the FMCSA application fee + the UCR government fee you would otherwise pay separately. (Owner decision; the discount-on-service-fees math no longer holds — see D1.)
- **Recurring billing = manual re-invoice + reminders**, NOT Stripe subscriptions. Auto-charge only with the customer's express consent.
- **Legacy data = import where practical + keep editable**; fallback = preserve as historical record. Never delay launch for it. (Modifies the M7 "DRAIN not ETL" decision.)

---

## DEV deltas
File anchors verified in `dev/lib/services-registry.ts` unless noted.

**D1 — Expand the $1,700 package contents (SUPERSEDES qa-rev §G.1).**
- Current: `full-package` price $1,700, `includes: ["mc-authority","boc-3","ucr","clearinghouse","consortium","drug-test"]` (6 services) at `:227-244`; the comment at `:225-226` ("contents unchanged, owner-confirmed") is now **stale**.
- Client (Q2.2): the package also includes **IFTA setup**, **IRP setup**, and **one Driver Qualification file** → 9 items.
- Do: `includes += "ifta", "irp", "dq-files"` (one DQ file); update the blurb (`:230`) to list all 9; keep price **$1,700**; `govFeesIncluded` unchanged (MC FMCSA fee + UCR 0-2). Remove/replace the stale comment.
- **Framing:** all-in bundle, no "discount" wording (locked decision). For reference, sum of listed service fees with the new contents = **$1,650** (600+100+50+100+150+100+175+175+200), so $1,700 is not a discount on service fees alone; it is a discount only once the included government fees (~$300 FMCSA OP-1 + $46 UCR) are counted, and those are not published.
- IRP/IFTA government, state, plate, permit, mileage, jurisdiction charges stay separate and collected later (already the model).

**D2 — DQ file tiered pricing.**
- Current: flat **$200/driver** (`priceKind: "perDriver"`, `price: 200` at `:166-174`; compute `price × driverCount` at `:423-425`).
- Client (Q2.2): 1 driver $200, 2 drivers **$350 total**, 3 drivers **$450 total**, >3 = custom quote.
- Do: replace the flat multiply with the tier table; >3 routes to a manual/custom-quote path (no auto price), mirroring the existing UCR >100-units manual pattern.

**D3 — USDOT Correction dedicated page.** Registry entry already exists ($125, `:138-147`; scope fields in `step-fields.tsx:229-234`). Build the dedicated marketing page (see SEO S1 / Design DZ1). Scope to show: address, legal/business name, email, phone, operating-authority status, # trucks, # drivers change.

**D4 — IFTA Quarterly dedicated page.** Registry entry already exists ($150 + gov, `:205-214`). Build the dedicated marketing page (it is currently only a section inside `ifta-registration/page.tsx`).

**D5 — New service: FMCSA Portal to MOTUS Migration, $125.**
- Current: **absent** — no `motus-migration`/`reinstatement` key in `ServiceKey` (`:25-42`), no route. (`lib/lookup/motus.ts` is the carrier-lookup API, unrelated.)
- Do: add the registry service ($125 flat), `expectedTimeline: "Approximately 1 to 2 weeks"`. Build the page (SEO S1 / Design DZ1). Page scope (Q3.2): claiming an existing USDOT, Company Official assignment, manual verification, missing MC authority in MOTUS, legacy FMCSA Portal account problems, FMCSA support-ticket assistance.

**D6 — UCR fee presentation.**
- Current: marketing UCR page shows **combined totals** ($96/$188/$326/$1,013...) at `ucr-registration/page.tsx:65-70`. The `/apply` form shows only the customer's own bracket, never the full table (`step-fields.tsx:202-209`, review note `services-registry.ts:431`).
- Client (Q1.3): publish the **government brackets** ($46/$138/$276/$963/$4,592/$44,836) **plus a separate "$50 Tech Rig filing fee"** line on the UCR service page; do **not** show the full table in the application form.
- Do: re-present the UCR page as gov-brackets + a separate $50 line (not combined totals). The `/apply` form is already compliant — **verify, do not change**.

**D7 — Remove the MC government-fee placeholder.**
- Current: `mc-registration/page.tsx:326-328` says "Current FMCSA fee to be confirmed." No dollar figure exists elsewhere (registry `govFeeNote` = "+ FMCSA application fee, shown separately", no amount).
- Client (Q1.3): do **not** publish a separate MC authority government-fee figure.
- Do: remove the "to be confirmed" placeholder; keep the amount-free "shown separately" wording. No MC gov figure anywhere.

**D8 — Turnaround times (`expectedTimeline`) per Q6.2.** Every service has the field; several values are materially off. Update to:
- `usdot` → filed within 24h, active immediately after successful submission (currently "1 to 2 business days").
- `boc-3` → same business day when ordered with info during business hours (currently "24 hours on working days").
- `ucr` → same day when the carrier is in the UCR database; a new USDOT may take 1-2 days to appear (currently "1 to 2 business days").
- `mc-authority` → filed within 24h; activates after the 21-day protest period and requires BOC-3 + insurance (currently "Activates after the 21-day federal protest period" — expand).
- `usdot-correction` → normally same day when MOTUS active + USDOT linked; FMCSA linking/support up to ~7-10 business days (currently "7 working days").
- `mcs-150` (Biennial Update) → normally same day; same 7-10 business-day FMCSA delay if linking needed (currently "7 working days").
- `clearinghouse` → within 1 business day (currently "5 working days").
- `consortium` → within 1-2 business days (currently "7 working days").
- `dq-files` → within 1-3 business days after documents received (currently "7 working days").
- `drug-test` → scheduled after consortium enrollment per carrier/driver availability (currently "7 working days").
- `irp` → varies by state and document availability (currently "1 to 2 business days").
- `ifta` → varies by state and document availability (currently "1 to 2 business days").
- `ifta-quarterly` → within 1-3 business days after complete mileage + fuel records (currently "Filed each quarter by the IFTA deadline").
- `motus-migration` (new) → approximately 1-2 weeks.

**D9 — Refund policy page + PDF acknowledgement.**
- Current: `dev/app/refund-policy/page.tsx` is a **stub** (`<LegalPage>`, "being migrated", no terms, no $50 fee, no date). The PDF acknowledgement (`dev/lib/pdf/generate.ts:76`) states "all service fees are final and non-refundable, regardless of the outcome."
- Client (Q6.3): full new policy (SEO writes copy S3). Key terms: no flat $50 processing fee; full refund if no work/filing/consult started and requested within 3 days; deduct only the actual non-returned processing fee (example: $100 paid, $3 fee → refund $97); up to 75% partial if prep started but not filed; filing fees non-refundable once work substantially started or filed; government/lab/partner/third-party fees non-refundable once paid/committed; renewables invoiced before renewal, auto-charge only with consent. Updated-policy date: **June 25, 2026**.
- Do: build the page from SEO's copy; **also reword the PDF acknowledgement** — the current "non-refundable regardless of outcome" line contradicts the new 3-day/no-work-started full-refund clause.

**D10 — Renewal reminders (Q2.1) — NEW, deferrable.**
- Current: the only reminders are 24h/72h **abandoned-lead nurture** (`dev/app/api/cron/reminders/route.ts`); all billing is one-time (`paymentIntents.create`, no subscriptions). No renewal reminders exist; marketing copy ("we remind you") is unimplemented.
- Do: add a reminder-before-due-date → manual-invoice flow for the renewable services (UCR annual, Consortium annual, DQ annual, IFTA quarterly). Optional auto-charge with express consent. **Not** Stripe subscriptions.
- **Sequencing:** the first renewal falls a quarter/year after the first post-launch filing, so this is a **fast-follow**, not launch-blocking. Constraint: launch copy must not promise an automated reminder that does not yet exist — either land a minimal version or keep the copy honest.

**D11 — Legacy import (Q6.4) — assess, must not delay launch.**
- Current decision: M7 = "DRAIN not ETL" (legacy `registrations`/`boc-3-new` tables untouched).
- Client: import historical records where practical and keep them **editable** in the new dashboard; if no practical export, inspect the DB and preserve the old system as a historical record. `form.techrig.org` is **not in use**; `boc-3.techrig.org` is **live** — keep it live until the new flow is fully tested, then 301 on the dev's recommended timing; handle transition submissions manually.
- Do: assess the legacy BOC-3 DB export/import feasibility; if practical, import as editable dashboard records; else preserve-as-historical. Run in parallel; never delay launch.

**D12 — Stripe credential verification (Q5.1).**
- Client provided the key on the current BOC-3 form: `mk_1TQSnGBUKzFDGSEhTE8lrbVQ`. This is **not a standard Stripe API key prefix** (live keys are `sk_`/`pk_`/`rk_`/`whsec_`); checkout uses `paymentIntents.create`, which needs a secret key.
- Do: verify the key type; request the standard **live `sk_`/`pk_`/`whsec_`** credentials (client will provide securely). Set receipt details: DGR TECH RIG LLC / info@techrig.org / 30 N Gould Street, Sheridan, Wyoming / no sales tax.

**D13 — Remove the out-of-scope Authority Status Tracker (L10 fold-in, owner-approved 2026-06-25).**
- design-system §13 scopes the Authority Status Tracker to authority-activation pages. `/ifta-registration/` (a fuel-tax return) and `/mcs-150-biennial-update/` (a record upkeep filing) assert no authority-lifecycle status, so the tracker does not belong there.
- Do: verify whether the built `/ifta-registration/` and `/mcs-150-biennial-update/` pages render the tracker; **if present, remove it** per §13 (drop the component + any authority-status labels; keep the rest of the page). §13 is the governing locked rule, so this is implementing the design system, not redefining it. The DZ1 specs already omit it; the 2 older specs are being aligned in parallel (Design DZ2). You are in these files anyway for D8 (mcs-150 timeline) and the new IFTA Quarterly cross-links, so fold this in here.

## SEO deltas
- **S1 — Three new page briefs:** USDOT Correction ($125), IFTA Quarterly Filing ($150 + gov), FMCSA Portal to MOTUS Migration ($125). Money-page/service intent; add to `sitemap-plan.md`, `keyword-map.md`, `services.md`, footer.
- **S2 — Relocate the California legacy story** to the MOTUS Migration page. NOTE for accuracy: it currently lives on the **MC pages** (`mc-registration/page.tsx:243-253`, `mc-dot-registration/page.tsx:277-285`) as a dismissed-MC reinstatement story, **not** on `/dot-registration/` (which uses a Texas new-carrier example). The client's instruction assumed it was on the USDOT page; route the narrative to the migration page from the MC pages, and confirm `/dot-registration/` stays clean.
- **S3 — Refund policy copy** (full text per Q6.3, dated June 25, 2026) → hand to Dev for D9.
- **S4 — UCR page copy:** gov brackets + a separate $50 filing-fee line (not combined totals).
- **S5 — State market stats (Q4.2):** remove unsupported numbers (e.g. Texas "$1.6T"); replace with general wording ("Texas is one of the largest freight and trucking markets in the United States").
- **S6 — Publish-cleared claims:** C/TPA (Q1.1, written confirmation usable), partner links (Q1.2, both match code), PIN copy (Q1.4, FMCSA still mailing) — confirm the QA-rev wording stands; these no longer carry a `[VERIFY]`/publish hold.
- **S7 — Testimonials (Q4.1), post-launch (L8):** first name + company for Felix, Marcus, Freddie; genuine statements only; grammar cleanup allowed; no invented or materially changed claims.
- **S8 — `services.md` master update:** expanded package contents, DQ tiers, MOTUS migration line, turnaround times — so the SEO master equals the registry after the Dev deltas.

## Design deltas
- **DZ1 — Specs for the 3 new service pages** (USDOT Correction, IFTA Quarterly, MOTUS Migration). Reuse the locked service-page pattern from `design/design-system.md`; no new design-system work. **✅ DONE (`7caf5f2`).**
- **DZ2 — Align the 2 stale specs to §13 (L10 fold-in, owner-approved 2026-06-25).** Update `shared/design/ifta-registration.md` and `shared/design/mcs-150-biennial-update.md` to **remove the Authority Status Tracker** and add the explicit "do not add the tracker (per §13)" note, mirroring the DZ1 specs. Small edit; keeps the specs in sync with Dev's D13 removal so a future rebuild does not reintroduce the tracker.

## Provisioning (config, not build) — for the launch credential request
- **Stripe:** existing account; verify key type, request live `sk_`/`pk_`/`whsec_`; receipt details as in D12. (Q5.1)
- **Resend:** sending domain `mail.techrig.org`, from + reply-to `info@techrig.org`, DNS access for SPF/DKIM. Dev may adjust if technically better. (Q5.2)
- **QCMobile webKey:** STILL PENDING — Hussam provides at deploy. MOTUS primary works, so not build-blocking. (Q5.3)
- **Domain/DNS/Sentry/auth:** production `techrig.org`, DNS available, Supabase auth redirect for `techrig.org` + production callbacks, add Sentry. (Q5.4)
- **Admin seed:** `admin_users` = `info@techrig.org` only initially; team ownership assigned later. (Q6.1)

## Sequencing + gates
- **Before the joint launch:** D1-D9 (pricing/contents/pages/copy that the engine charges and the crawl-union indexes). The 3 new pages are **indexable money pages** — they fold into the L1 crawl-union (unlike the noindex platform).
- **Fast-follow (not launch-blocking):** D10 renewal reminders (before the first renewals come due), D11 legacy import (parallel assessment).
- **Re-run the parity gate** after D1-D8: `services.md` = `services-registry.ts` = `/apply` review = generated receipt = marketing pages, zero price/term contradictions.
- **Still open for the client/owner:** the QCMobile webKey (D-provisioning), final team filing ownership (Q6.2), and the live Stripe credential (D12).
