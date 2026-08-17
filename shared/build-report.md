# DGR Tech Rig — Application Platform Build Report

Owner: Dev workspace. Scope: the Application Platform (Workstream B), milestones M0–M7. This is the contract deliverable a human (or the launch run) reads to understand what was built, the data model, the security model, every owner decision, and exactly what remains for the consolidated pre-launch QA.

Status at writing (2026-06-25): **M0–M7 BUILD-COMPLETE.** Nothing deployed (owner policy: no preview until the whole site is QA'd). Six additive migrations live on the prod Supabase project `pqbynaaihauifomfhcxo`. Marketing site (Workstream A) is separate and indexable; the platform is noindex throughout.

---

## 1. Surfaces built (routes)

All platform routes are **noindex** (page metadata `robots` + `X-Robots-Tag` header in `next.config.ts`) and **absent from `sitemap.xml`**. The marketing site is untouched and indexable.

| Route | Purpose | Auth |
| --- | --- | --- |
| `/` hero USDOT card | Lookup entry on the marketing home | none |
| `/lookup/[usdot]/` | Full FMCSA docket + "start application" / "create account" | none (token for resume) |
| `/api/lookup-usdot` | Rate-limited lookup, writes lead + snapshot | none |
| `/login`, `/auth/*` | Magic-link auth + claim of a pre-account lead | Supabase |
| `/dashboard/`, `/account/` | Client home: applications, lookups, profile | owner |
| `/apply/`, `/apply/[id]/` | The unified application engine (stepper) | owner |
| `/apply/[id]/pay/`, `/success/` | Stripe payment + receipt (verify-on-return) | owner |
| `/apply/[id]/` (paid) | Client progress tracker + filing timeline | owner |
| `/api/checkout`, `/api/stripe-webhook` | Server-priced intent + signature-verified settlement | owner / Stripe |
| `/admin/` | Back-office board: advance filings, see diff/payment | admin |
| `/api/filings/[id]/transition` | Admin-gated status state machine | admin |
| `/api/cron/reminders` | Daily reminder cron (24h/72h + coupon) | CRON_SECRET |
| `/unsubscribe/` | CAN-SPAM suppression via signed lead token | token |

Legacy subdomains redirect one-hop (308): `form.techrig.org` → `/apply/`, `boc-3.techrig.org` → `/apply/?service=boc-3` (host-based rules in `next.config.ts`). These targets are noindex by design.

---

## 2. Data model — 6 migrations (all additive, owner-only RLS unless noted)

| Migration | Tables / changes | RLS posture |
| --- | --- | --- |
| `0001` | `leads`, `carrier_snapshots` | anon insert; owner-only reads; write-once snapshots |
| `0002` | `profiles` + signup trigger | owner read/update own |
| `0003` | `applications`, `filings` | owner read/write own application; **filings: owner read only, no client status write** |
| `0004` | `payments` | owner **read** only; **all writes service-role/webhook** |
| `0005` | `admin_users`, `filing_events` | `admin_users`: RLS on, **no policies** (unreachable by clients); `filing_events`: owner reads client-visible only, no client write |
| `0006` | `documents` + private Storage bucket; `applications.final_email_sent_at`, `payments.receipt_sent_at`, `leads.email_opt_out`, `leads.coupon_code` | `documents`: owner read, service-role write |

`application_data` is JSONB (per-step answers); structured columns for the queryable fields (usdot, company, power_units, status, selected_services, the MOTUS diff flags). Reference IDs are `DGR-YYYYMMDD-NNN`.

---

## 3. Subsystems

**Dual-provider lookup (M1, incl. R3).** Primary is the MOTUS 3-step chain (`carriers` → `public-registration-matrix` → `getOAPublicView` per operating-authority id, in parallel, each isolated); QCMobile is the normalized backup. The docket shows registration/filing dates, operating authority (MC docket from the OA view), insurance on file, and BOC-3, with honest "Not on file" / canceled states. 8s primary timeout for the multi-call chain. No user-controlled host/protocol in the external fetch.

**Auth + claim (M2).** Supabase magic-link, `@supabase/ssr` cookie sessions, `proxy.ts` refresh + login redirect on `/dashboard|/account|/admin`. A pre-account lookup lead can be claimed into an account.

**Application engine (M3 + M3-R1).** Service-driven dynamic stepper: active steps = union of the selected services' required steps; `zod` per-step validation, server-action autosave + resume, server-computed pricing, one `filings` row per billable service on submit. Carrier diff (ported from boc3) sets `needs_mcs150_update`. The `$1,350` full-package bundle de-dups constituents and discloses the UCR government-fee difference separately.

**Payment (M4).** Stripe PaymentIntent + embedded Elements, **server-priced from the registry** (the client never sends an amount), idempotency key = hash(application | sorted services | amount). The webhook is the source of truth: signature-verified on the raw body, idempotent, flips `payments.paid` + `applications.paid` + `filings.queued`, keyed off the persisted payments row (not attacker-controllable metadata). Metadata carries only `applicationId` + `reference_id` (no PII). Stripe loads only on the pay route.

**Progress + back-office (M5).** `admin_users` is the privilege boundary (a separate table with no client RLS policy, read only via the service role server-side — deliberately NOT a `profiles.role` column, which the M2 self-update policy would have made escalatable). The transition API + admin board both gate on `getAdminUser()` server-side; an explicit state machine rejects illegal transitions (422) and writes a `filing_events` audit row. Clients see their own filings + a curated event timeline (reusing the AuthorityStatusTracker).

**Email lifecycle + documents (M6).** Resend wrapper (server-only key, per-recipient rate limit, no PII in logs) + six brand-voice templates (welcome, receipt, 24h, 72h promo, final, status-change), em-dash-free, honoring the ELD/insurance reframe. Each trigger is idempotent via a `*_sent_at` guard. The cron (`vercel.json`, `CRON_SECRET` bearer) sends 24h/72h reminders to unpaid past-threshold leads, never to a paid lead, batched; the 72h issues a Stripe coupon and respects `email_opt_out`. Completion generates an acknowledgement PDF (FMCSA legal certification + signature) + an answers PDF (`pdf-lib`), stored in the private `documents` bucket with owner-read RLS.

**Hardening (M7).** Sentry (server + edge + client), DSN-gated, `sendDefaultPii: false`, `beforeSend` strips request cookies/headers/body/query and the user object. Confirmed: no secret in any client bundle (only the public anon key + publishable keys ship; the service-role key signature is absent), every app route noindex + sitemap-excluded, marketing unregressed (82 sitemap URLs).

---

## 4. Owner decisions of record

- **ADR-1..8** (orchestrator docs): noindex platform, reuse legacy infra (ADR-6), `DGR-` reference prefix, Dev-led workstream (ADR-5/-8).
- **Full-package contents** (2026-06-25): `$1,350` fixed = MC (incl. USDOT) + its FMCSA fee + BOC-3 + UCR 0-2 (incl. $46 gov fee) + Clearinghouse + consortium + drug test.
- **Government-fee collection** (2026-06-25): **charge service fees only** for à-la-carte; gov/state fees are shown as separate disclosed lines and paid by the customer directly. The package keeps its included gov fees.
- **Legacy cutover** (2026-06-25): **DRAIN, not ETL.** Stop new traffic to the legacy apps, let in-flight sessions finish there, then flip the 301s. No data migration. The legacy `registrations` / `boc-3-new` tables are untouched as historical record (no ALTER/DROP — that needs explicit owner sign-off).
- **Prices** trace only to `seo/context/services.md`. **ELD and insurance are never billable** Tech Rig filings (ELD = partner referral, insurance = coordinate-only).

---

## 5. Security model summary

Privilege boundaries are all server-enforced, never client-trusted:
- **Ownership** via Supabase RLS on every owner table; cross-user reads/writes verified to return 0 rows across `leads/applications/filings/filing_events/payments/documents/carrier_snapshots`.
- **Admin** via `admin_users` (no client RLS policy) + `getAdminUser()` server gate; clients cannot read `admin_users`, write filing status, or write `filing_events` (all verified 0/403).
- **Payment** state is webhook-only (signature-verified) + service-role; clients cannot write `payments` (403); amounts are server-recomputed.
- **Tokens** (lead access, unsubscribe) are HMAC-signed with constant-time compare + expiry.
- **Secrets** are server-only (`server-only` imports); no secret in any client bundle; PII excluded from Stripe metadata, logs, and Sentry events.

A full-platform `/security-review` was run at M7 across lookup/lead, auth/claim, engine/pricing, payment/webhook, the admin boundary, email/cron/unsubscribe, PDF/Storage, and all RLS 0001–0006 (parallel reviewers per subsystem). **Result: one HIGH finding, fixed; everything else clean.**

- **HIGH (fixed): IDOR in `createApplication`.** The raw `lead_id` form field was used with the service role (which bypasses RLS) without an ownership check, so a caller could seed their application from — and rebind the snapshot of — another tenant's lead. Fix: a raw `lead_id` is now accepted only if the RLS-scoped client can read it (caller owns it); the `lead_token` path stays HMAC-verified for unclaimed leads. Verified against prod: a second user reading another's lead via RLS returns 0 rows, so the linkage is rejected.
- **Clean:** server-side pricing + ownership + signature-verified idempotent webhook (no client-influenced amount, no forged-paid); admin boundary (`admin_users` no-policy + server gate); HMAC lead/unsubscribe tokens (constant-time, expiry); HTML-escaped email templates (no injection); private Storage + no path traversal; no PII in logs/metadata/Sentry; no SSRF (hardcoded hosts, digit-validated USDOT).
- **Below threshold (not a finding):** the success page reflects an arbitrary `payment_intent` status banner if its id is supplied, but real paid state + the filings list are RLS-scoped, so no data disclosure or mutation. Cosmetic only.

---

## 6. Deferred to the consolidated pre-launch QA ledger (deploy-time only)

Nothing below blocks build-complete; all run once, together, at the joint launch with Workstream A.

- **M1:** QCMobile backup on a real IP (sandbox got 403); Vercel KV reference counter + rate-limit on the real network; Lighthouse on `/` and `/lookup`.
- **M2:** prod auth redirect-URL allowlist; magic-link deliverability; full signed-in click-through.
- **M3:** Lighthouse on `/apply/*`; full multi-step click-through with a live session.
- **M4:** live Stripe keys; register the webhook endpoint on the deployed origin; real-card path; Lighthouse on the pay route.
- **M5:** Lighthouse on `/admin` + dashboard; full signed-in admin click-through (advance a real filing in-browser).
- **M6:** email deliverability (DKIM/SPF) + `RESEND_API_KEY`/`EMAIL_FROM`; set `CRON_SECRET` + confirm the Vercel cron fires; inbox click-throughs.
- **M7:** DNS cutover + live 301 verification; the staging crawl-union with Workstream A (0 unexpected 404s, 0 chains); Sentry source-map upload (`SENTRY_AUTH_TOKEN`).

**Required Vercel env vars for launch** (documented in `dev/.env.example`): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `KV_REST_API_URL`, `KV_REST_API_TOKEN`, `LEAD_ACCESS_TOKEN_SECRET`, `FMCSA_WEBKEY`, `STRIPE_SECRET_KEY` (live), `STRIPE_PUBLISHABLE_KEY` (live), `STRIPE_WEBHOOK_SECRET` (live), `RESEND_API_KEY`, `EMAIL_FROM`, `CRON_SECRET`, `SENTRY_DSN`, `NEXT_PUBLIC_SENTRY_DSN`.

---

## 7. Legacy URL set for the crawl-union (Workstream A L1)

Hand to the crawl-union; each must resolve as a built route or a one-hop redirect (targets noindex by design):
- `https://form.techrig.org/*` → `https://techrig.org/apply/` (308)
- `https://boc-3.techrig.org/*` → `https://techrig.org/apply/?service=boc-3` (308)

Legacy data tables (`registrations`, `boc-3-new`) remain in place (drain decision); no URLs served from them after cutover.

---

## 8. Client QA revision (2026-06-25) — build-complete, not deployed

Implements `shared/work-order-qa-revision.md` (client brief `seo/output/client-qa-brief-2026-06.md`) site-wide: marketing pages (§A–F) AND the application platform (§G). `next build` clean (compiled successfully, no type/lint errors); `/trucking-insurance-filing` no longer in the route table.

**Platform / parity anchor (`dev/lib/services-registry.ts`):**
- UCR Tech Rig filing fee `$100 → $50` (`calculateUcr` all brackets). Gov-fee figures unchanged; totals now 0-2 $96 / 3-5 $188 / 6-20 $326 / 21-100 $1,013. Over 100 units stays manual-review.
- Full package `$1,350 → $1,700` (price + blurb + `computePricing` fallback + comments). Contents unchanged (owner-confirmed).
- `mcs-150` display name → **"Biennial Update"** (key unchanged; "MCS-150" kept in body copy only).
- Added **`usdot-correction`** ($125 flat) and **`ifta-quarterly`** ($150 flat + gov fee). No DB migration needed: `filings.service_key` is unconstrained `text`. New `service-specifics` fields (`usdot_correction_details`, `ifta_quarter`) added to `schemas.ts` + `step-fields.tsx`. The `/apply` selection/review render dynamically from the registry, so both new services appear automatically; Stripe checkout, receipt email, and persisted totals are server-priced from `computePricing`.
- `/apply` `needs_mcs150_update` prompt labels renamed to "Biennial Update".

**Insurance route removal (§A1 / §G2):** deleted `dev/app/trucking-insurance-filing/` (page + OG image); one-hop **301 `/trucking-insurance-filing/` → `/compliance-services/`** in `next.config.ts`; reefer `insurance-requirements` override re-pointed to the hub (no two-hop chain); removed from `lib/services.ts` nav + pricing (sitemap derives from nav, so it drops automatically); all internal links removed (`mc-registration`, `mc-dot-registration`, `how-to-start-a-trucking-company`).

**`lib/services.ts`:** dropped the insurance nav entry + pricing entry; nav label "MCS-150 Update" → "Biennial Update"; `/dot-registration/` `govFee` removed (USDOT $300 never shows "+ gov fee"); UCR `amount 100 → 50`.

**Marketing copy (16 pages):** package $1,700 everywhere; insurance reframed to coordinate-only (Tech Rig never sells/files insurance; insurer files proof with FMCSA); UCR removed from MC-activation requirements; MOTUS Portal naming for new registrations (legacy "FMCSA Portal" only in migration context); removed all "FMCSA stopped mailing PINs" claims (FMCSA still mails PINs); DQ 10,001 lb GVWR threshold; Clearinghouse stated as registered C/TPA + pre-employment link; consortium 30-day/same-company rule + location-pin icons removed; IRP/IFTA eligibility + exemptions; **new IFTA quarterly $150 service** on the IFTA page; **new USDOT Correction $125 card** on the compliance hub; ELD→Motive (`partners.gomotive.com/DGR-TECH-RIG`) and LLC→Inc Authority (`goto.incauthority.com/QY2keP`) partner-referral links; home-page insurance/ELD reframe. UCR `BOC-3 + UCR` bundle chip `$200 → $150` (BOC-3 $100 + UCR fee $50, gov fee shown separately).

**Parity gate — PASS:** `services.md` = `services-registry.ts` = `/apply` review = receipt, zero contradictions.

**Deferred to the pre-launch QA ledger (deploy-time):** end-to-end `/apply` click-through for the two new services (`usdot-correction`, `ifta-quarterly`) with a live session; the USDOT Correction hub card renders without a dedicated page link (mirrors the existing reactivation/deactivation card pattern) and the IFTA quarterly card CTA uses the IFTA page's `/contact-us/` convention, so if dedicated routes or an `/apply` deep-link are wanted later, add them then.

---

## 9. Client-answer deltas D1-D13 (2026-06-26) — build-complete, not deployed

Implements `shared/work-order-client-answers.md` (client answers `shared/client-answers-2026-06-25.md`), reconciled against the merged SEO master (S1-S8, `35c002e`) and Design specs (DZ1 `7caf5f2`, DZ2). `next build` clean (compiled successfully, 96 routes, no type/lint errors). This supersedes parts of §8 (`work-order-qa-revision.md` §G): the $1,700 package is now 9 items, and the UCR page shows gov brackets + a separate $50 line (not combined totals). Nothing deployed.

**Registry (`dev/lib/services-registry.ts`):**
- **D1** full-package expanded to **9 items**: `includes += ifta, irp, dq-files`; blurb + the `computePricing` line note list all 9; price stays **$1,700**; stale "contents unchanged" comment replaced with the all-in-bundle / no-"discount" framing; added `vehicles` to the package `requiredSteps` (IRP/IFTA need it).
- **D2** DQ tiered pricing via new `calculateDqFiles` helper (1=$200, 2=$350, 3=$450, >3 = manual custom-quote, mirroring the UCR >100 path); wired into the `perDriver` branch.
- **D5** new service `motus-migration` ($125 flat, ~1-2 week timeline) added to the `ServiceKey` union + `SERVICES`; `service-specifics` field `motus_migration_details` added to `schemas.ts` + `step-fields.tsx`. No DB migration (unconstrained `service_key`).
- **D8** every `expectedTimeline` updated to the Q6.2 wording (Clearinghouse 5→1 day, Consortium 7→1-2, IRP/IFTA fixed→varies, USDOT/MC/BOC-3/UCR refined, etc.); verbatim parity with the `services.md` turnaround section.

**New indexable money pages (built from brief + DZ1 spec, price chip from the single source, no Authority Status Tracker per §13, CTA → `/apply/?service=<key>`):**
- **D3** `/usdot-correction/` ($125, reviewed by Adam Smith).
- **D4** `/ifta-quarterly-filing/` ($150 + fuel tax separate, reviewed by Robert Hooke; was only a section inside `/ifta-registration/`).
- **D5** `/motus-migration/` ($125, reviewed by Robert Hooke) — **holds the relocated California legacy case study** (S2).
Each has its own branded `opengraph-image`. All three wired into `lib/services.ts` nav + pricing (so the sitemap + footer pick them up) and added as compliance-hub cards.

**Page edits:**
- **D6** `/ucr-registration/`: bracket table re-presented as **government fees** ($46/$138/$276/$963/$4,592/$44,836) with a separate flat **$50 Tech Rig filing fee** line (not combined totals). The `/apply` form already hides the full table (verified, unchanged).
- **D7** `/mc-registration/`: removed the "Current FMCSA fee to be confirmed" placeholder; kept the amount-free "FMCSA application fee shown separately" wording (no MC gov-fee figure anywhere).
- **D9** `/refund-policy/` rebuilt from the SEO copy (full/partial/non-refundable terms, no $50 processing fee, dated June 25 2026); PDF acknowledgement (`lib/pdf/generate.ts`) reworded from "final and non-refundable regardless of outcome" → "Refunds are governed by our Refund Policy at techrig.org/refund-policy/."
- **D13 (L10)** removed the Authority Status Tracker from `/ifta-registration/` and `/mcs-150-biennial-update/` (component, import, steps const, hero collapsed to single column) per design-system §13; added the "do not reintroduce" note.
- **S2** removed the California dismissed-MC story from `/mc-registration/` and `/mc-dot-registration/`, each now linking to `/motus-migration/` for that buyer.

**Parity gate — PASS:** `services.md` = `services-registry.ts` = `/apply` review = generated receipt = marketing pages, zero contradictions. MC reinstatement $200 and USDOT reactivation $125 remain copy-only hub cards (not `/apply`-billable), which is not a parity failure (per the work order).

**Owner-action / fast-follow (NOT built this pass):**
- **D12** the provided Stripe key `mk_1TQSnGBUKzFDGSEhTE8lrbVQ` is **not a standard Stripe prefix** (`sk_`/`pk_`/`whsec_`); needs the live credentials from the owner. Receipt identity (DGR TECH RIG LLC / info@techrig.org / 30 N Gould St, Sheridan WY / no sales tax) already flows from `lib/site` + the no-tax checkout.
- **D11** legacy `boc-3.techrig.org` import: needs the legacy DB export to assess (import-if-practical-and-editable, else preserve-as-historical). Parallel, never launch-blocking. `form.techrig.org` not in use; `boc-3.` stays live until the new flow is fully tested, then 301.
- **D10** renewal reminders (UCR/Consortium/DQ annual + IFTA quarterly) = manual invoice + reminders, NOT Stripe subscriptions, auto-charge only with express consent. First renewals are a quarter/year out → fast-follow. Launch copy kept honest (manual reminder, never "automated").

---

## 10. D15 — Pricing v2 (two-price, four-bundle model), 2026-07-10 — build-complete, not deployed

Implements `shared/work-order-pricing-v2.md` (client doc `shared/client-pricing-v2-2026-07-10.md`), a re-architecture, not a tweak. **Supersedes** the single-$1,700-package model (§8/§9 above) and the D1-D14 à-la-carte prices. Two passes: the registry re-architecture landed first (`bd576ac`) and was reported/verified separately; this section covers the second pass — the `/apply` bundle UX, propagation, and the §25 sweep — after SEO's `services.md` and Design's `shared/design/compliance-packages.md` merged in.

**Registry (`dev/lib/services-registry.ts`, prior commit, unchanged this pass):** every billable service carries `standalonePrice` + `bundlePrice`; four bundles (`BUNDLES`) replace the old `full-package`; `getBundleBreakdown()` derives itemized total, `+$N` rounding, final price, standalone value, savings, and discount % — nothing hardcoded. Dual DQ tables (standalone 250/450/600, bundle 200/350/450) and the full UCR gov-fee bracket table through 1,001+ ($44,836, was capped at "manual review" over 100 units).

**New: `/compliance-packages/` (the four-bundle selector, DZ3 spec).** New page + 5 new components, all built from the registry's derived fields (no price typed twice):
- `components/package-card.tsx` — the bundle card (eyebrow, name with sanctioned em dash, BOC-3 badge, price, included-services list, the receipt, CDL/Heavy fee note, CTA).
- `components/bundle-receipt.tsx` — itemized → rounding → price → standalone value → savings, reused on the card, the `/apply` review step, and available for future receipt/email work.
- `components/boc3-included-badge.tsx`, `components/package-matrix-map.tsx` (static 2x2 hero link grid, no JS needed), `components/package-selector.tsx` (client, two segmented controls, resolves to one bundle, progressive enhancement — cards are always server-rendered and reachable without JS).
- `components/package-comparison-table.tsx` — the §4 matrix, sticky first column, its own horizontal-scroll container.
- Added a `solidInk` button variant (`components/ui/button.tsx`) for the card CTAs, matching design-system §8's "solid Ink on light sections," so Signal stays rationed to the hero/close.
- New `pricedOfferCatalogNode()` in `lib/schema.ts` (Offers carry a `price`, unlike the hub's unpriced `offerCatalogNode`). Page carries `OfferCatalog` (4 priced bundles) + `BreadcrumbList` + `FAQPage`.
- Verified in-browser (Playwright, dev server): page renders 0 console errors, all 4 card receipts match the client doc exactly ($396/+$4/$400/$476/$76/16.0%, etc.), the comparison table ✓/— pattern and figures match brief §4, and the segmented selector correctly resolves "New authority" + "CDL/heavy" → "Authority Launch — CDL/Heavy — $1,700" with a working anchor link.

**`/apply` bundle-selection UX:** `computePricing`'s `ctx.bundle` is now wired end-to-end — `lib/apply/steps.ts` `activeSteps()` takes an optional bundle key and unions in its constituents' required steps; `app/apply/actions.ts` (`createApplication`, `setServices`, `saveStep`, `submitApplication`) and `app/apply/page.tsx`, `app/apply/[applicationId]/page.tsx`, `app/apply/[applicationId]/pay/page.tsx`, `app/api/checkout/route.ts` all read/write a new `selected_bundle` column. The services step now offers the 4 bundles (radio, mutually exclusive) above the existing à-la-carte checklist (checkboxes, with an "included in your package" hint for constituent services — no double charge either way, `computePricing` already dedupes); the review step renders `BundleReceipt` for the active bundle plus any overage lines (extra drivers, UCR bracket above 0-2) and remaining à-la-carte extras. `/apply/?bundle=<key>` pre-selects a bundle, mirroring D14's `/apply/?service=<key>`.

**New migration `dev/supabase/migrations/0007_selected_bundle.sql`:** additive, nullable `applications.selected_bundle text`. **NOT applied to the live project this pass** — this session had no Supabase credentials (the connected MCP account doesn't include the Tech Rig project, no local `.env.local`, no Supabase CLI). Apply it before the bundle-selection UX can be exercised against real data; until then `/apply` 500s on missing Supabase env in any environment (confirmed in this session's dev-server smoke test — a config/credentials gap, not a code defect: `computePricing`/`getBundleBreakdown` were separately verified correct via a standalone Node script bypassing the DB layer).

**§25 sweep (old single-$1,700-package / pre-increase prices), by file:**
- `lib/services.ts` (marketing `PriceChip` source): MC $600→$650, UCR $50→$80 (from), Clearinghouse $100→$125, Consortium $150→$175, DQ $200→$250, IRP $175→$225, IFTA $175→$225 (IFTA quarterly $150, USDOT $300, BOC-3 $100 unchanged). Added `/compliance-packages/` to `complianceNav` (sitemap + footer pick it up automatically).
- `app/compliance-services/page.tsx`: the old single-package panel (`packagePrice`/`packageItems`, $1,700 flat) replaced with a derived four-bundle summary section linking to `/compliance-packages/`; hero secondary CTA repointed from the old in-page anchor to `/compliance-packages/`.
- `app/mc-dot-registration/page.tsx`, `app/mc-registration/page.tsx`: old "$1,700 full package" / "$600" references repointed to the Authority Launch bundles ($1,000 non-CDL / $1,700 CDL/Heavy) and the new $650 standalone MC price.
- `app/boc-3-filing/page.tsx`, `app/ucr-registration/page.tsx`: removed the now-nonexistent standalone "BOC-3 + UCR combo" price/chip on both pages (BOC-3 is included in every bundle instead, per the work order's "do not create a separate BOC-3+UCR bundle" rule).
- `app/driver-qualification-files/page.tsx`: single $200/driver price replaced with the dual standalone/bundle table.
- `app/drug-and-alcohol-consortium/page.tsx`: consortium + drug-test dual pricing, TrueTest waiver-eligibility wording (replaces the old flat "30 days" rule).
- `app/fmcsa-clearinghouse-registration/page.tsx`, `app/irp-registration/page.tsx`, `app/ifta-registration/page.tsx`, `app/ifta-quarterly-filing/page.tsx`: dual standalone/bundle prices; IFTA quarterly's cross-reference to the one-time setup fee corrected (was still citing the old flat $175).
- `app/refund-policy/page.tsx`: added the 30-day-inactive non-refundable case.
- `app/how-to-start-a-trucking-company/page.tsx`: removed the single $1,700 `PriceChip`/constant, replaced with a "$400 to $1,700 depending on the package" reference linking to `/compliance-packages/`.
- Every touched page's JSON-LD `serviceNode` price updated to the new standalone figure.
- Full-tree grep swept clean afterward for `full-package`, `full compliance package`, and stale flat-price strings; the only remaining `$1,700`/`$600` hits are legitimate Bundle 4 / new-MC-price references (verified individually).

**Parity gate — PASS.** `services.md` = `services-registry.ts` = the `/compliance-packages/` page = the §4 comparison table, zero contradictions (re-verified live in-browser). All four bundles re-derive to exactly $400 / $1,100 / $1,000 / $1,700 (standalone Node script, `getBundleBreakdown` + `computePricing`, all assertions pass). `tsc --noEmit` clean, `pnpm build` clean (compiles, `/compliance-packages/` + its OG image in the route table, no warnings). **`eslint` was not run this pass** (WSL runtime is slow for it in this environment; owner asked to defer it to the Windows-side orchestrator run before merge).

**Not yet exercised end-to-end (needs the live Supabase env + migration 0007 applied):** the `/apply` bundle checkout → review → payment → receipt path; the generated-receipt and M6-email legs of the parity gate (`lib/email/templates.ts` and `lib/pdf/*` are already generic/derived off `filings`/`applications.total_amount`, so no code change was needed there, but this is inferred from reading the code, not a live click-through). `/admin` order calc is likewise generic (no hardcoded price found) and unexercised live.

**Deferred (explicitly out of scope for D15, unchanged from §8/§9):** D10 renewal reminders, D11 legacy import, D12 live Stripe.

---

## 11. Quick-buy fast path (BOC-3, UCR, Clearinghouse, Consortium, DQ files), 2026-07-16 — build-complete

Owner-directed addition, built interactively across one session (no prior work order). **Not part of the M0-M7/D1-D15 milestone track above** — it's a parallel, additive fast-purchase lane that sits alongside `/apply` without changing it. Read this section top to bottom if you're new to this codebase; it explains both *why* this exists and exactly how it works.

### 11.1 Why this exists

`/apply` requires a magic-link account before anything else, then walks the buyer through a multi-step form (carrier identity, business details, operations, vehicles, drivers, review), and only then takes payment. The owner considers that too much friction for the five simplest, flattest-priced services — nothing about them actually needs more than a confirmed USDOT record. The fast path is: **enter USDOT → confirm the pulled record → review, upsell, and sign → pay → thank-you**, no account, ever, for these five services. Every other service (MC authority, trucking LLC setup, legal compliance, the four fixed bundles) is untouched and still exclusively an `/apply` concept.

### 11.2 Route map

All routes are `noindex` (added to the header list in `dev/next.config.ts` alongside `/apply` and `/lookup`), no header/footer chrome changes (same layout as the rest of the site).

| Route | Purpose | Auth |
| --- | --- | --- |
| `/buy/[service]/` | USDOT entry for one of the 5 quick-buy services (`notFound()` for anything else) | none |
| `/buy/[service]/[usdot]/` | Confirm screen: runs the same `performLookup()` as `/lookup/[usdot]/`, shows a curated carrier-identity subset, editable name/email/phone pre-filled from the record | none |
| `/buy/order/[orderId]/review/` | Order summary, upsell checklist, typed-name signature + terms | capability token (cookie) |
| `/buy/order/[orderId]/pay/` | Stripe Elements payment | capability token (cookie) |
| `/buy/order/[orderId]/thank-you/` | Verify-on-return confirmation | none (verifies the Stripe intent itself) |
| `/api/quick-buy-checkout` | Server-priced PaymentIntent creation | capability token (cookie) |

Note the URL shape: order-scoped routes live under `/buy/order/[orderId]/...`, **not** `/buy/[orderId]/...` — Next.js doesn't allow two different dynamic segment names (`[service]` and `[orderId]`) as siblings under the same parent, so the `order/` static segment exists specifically to avoid that collision. Don't "simplify" it back to `/buy/[orderId]/...`; the build will fail.

### 11.3 Why no account: the trust model

Ownership of a quick-buy order is a capability token, not a Supabase session — the same HMAC-signed lead-access token (`createLeadAccessToken`/`verifyLeadAccessToken`, `dev/lib/server/security.ts`) that `/apply`'s pre-account lead-resume flow already used, reused rather than reinvented. `performLookup()` mints the token at confirm time; it's carried forward in an httpOnly cookie (`QUICK_BUY_TOKEN_COOKIE`, `dev/lib/server/quick-buy.ts`) — never the URL — read back by the review action and by `/api/quick-buy-checkout`, each of which calls `verifyLeadAccessToken(token, order.lead_id)` before allowing a write or a charge. `/api/checkout` (the `/apply` payment endpoint) was **not modified** — `/api/quick-buy-checkout` is a sibling file, deliberately, to keep the already-shipped `/apply` payment path's blast radius at zero.

### 11.4 Data model

New table `quick_buy_orders` (migration `0008`), plus three small follow-on migrations as the feature grew (`0009` names, `0010` review/signature, `0011` the upsell-menu signal). Current columns:

| Column | Purpose |
| --- | --- |
| `id`, `lead_id`, `usdot_number`, `reference_id` | identity / linkage to `leads` |
| `service_key` | the PRIMARY service (checked against the 5-key allowlist), immutable once set |
| `additional_service_keys` (jsonb array) | upsells added on the review screen |
| `first_name`, `last_name`, `email`, `phone` | pre-filled from the lookup at confirm, editable |
| `power_units` | **not** the carrier's general reported power units — see §11.6, this is UCR's qualifying-CMV count |
| `truck_tractors` | raw signal for the review screen's dynamic upsell menu (§11.7) |
| `driver_count` | DQ files pricing input, collected on review |
| `signature_name`, `terms_accepted_at` | review-and-sign step |
| `confirmed_at`, `status` (`created`/`awaiting_payment`/`paid`/`fulfilled`/`cancelled`) | lifecycle |

`payments.application_id` and `filings.application_id` were widened from `not null` to nullable, each gaining a new nullable `quick_buy_order_id` column plus a `..._parent_xor` check constraint (a row belongs to exactly one lane, never both, never neither). Existing `/apply` rows are unaffected — they always set `application_id`. RLS on `quick_buy_orders` is enabled with **zero policies** (same posture as `admin_users`): there's no client-facing read path for it at all, since there's no account to own it — only the service role touches it, from the confirm/review/checkout/webhook/admin server code.

Filings for a quick-buy order are **not** created at confirm time — they're created (and idempotently replaced, delete-then-insert, same pattern as `/apply`'s `submitApplication`) at the review step's submit, once the final service selection (primary + upsells) is locked in. This matters if you're tracing "why isn't there a filing yet" for an order that's only reached the confirm screen.

### 11.5 The review & sign step, and upsell

Sits between confirm and payment (`/buy/order/[orderId]/review/`, page + client `review-form.tsx` + `actions.ts`). Three things happen here:
1. **Order summary** — a "Company details" card (name/email/phone/USDOT), reusing the same `DocketSection`/`Row` components as the confirm screen and `/lookup/[usdot]/` (extracted into `dev/lib/lookup/format.tsx` specifically so all three surfaces render identically — reuse this, don't recreate the pattern).
2. **Upsell** — a "You may also need" checklist offering the other quick-buy services (never anything from the `/apply`-only catalog). Selections and the live total preview run client-side through `computeQuickBuyPricing()` (a pure function, safe in a client component), but the server recomputes authoritatively both on submit and again at charge time — the client is never trusted for the amount, same rule as everywhere else in this app.
3. **Signature** — typed full legal name + a terms-acceptance checkbox, stored as `signature_name`/`terms_accepted_at`. `/api/quick-buy-checkout` refuses to charge an order that isn't both confirmed and signed.

### 11.6 UCR pricing: combined total, qualifying CMVs only

Two owner decisions changed how UCR is priced and charged, **for the quick-buy lane only** — `/apply` and the four fixed bundles were deliberately left on the original behavior:

- **Combined charge, not disclosed separately.** `/apply` shows the $80 Tech Rig service fee and the government bracket fee as two separate lines, and only ever collects the $80 — the government portion is documented as "paid by the customer directly" (§4 above). For quick-buy, the owner wants ONE number shown and ONE Stripe charge covering both; Tech Rig now collects the government fee upfront and is responsible for remitting it. This lives entirely in a new function, **`computeQuickBuyPricing()`** (`dev/lib/services-registry.ts`, right after `computePricing()`) — it delegates to `computePricing()` for every non-UCR line, and only overrides the UCR line's `amount`/`note` to the combined figure. `computePricing()`/`calculateUcr()` themselves are untouched. If a future change needs `/apply`'s UCR behavior to change too, that's `computePricing()`; if it's quick-buy-only, that's `computeQuickBuyPricing()` — don't conflate the two.
- **Bracket is qualifying CMVs only.** The government fee bracket must be based on `truckTractors + straightTrucks` from the FMCSA/MOTUS equipment breakdown (`carrier.equipmentSummary`) — trailers and non-commercial vehicles never count, even if they're most of the fleet. The general `carrier.powerUnits` field is **not** safe to use for this: tracing `getMotusPowerUnits()` in `dev/lib/lookup/motus.ts`, it's the *max* of several candidates including raw FMCSA self-reported totals that can include non-commercial vehicles, so it can inflate the bracket. The confirm screen's hidden `power_units` field (and hence `quick_buy_orders.power_units`, despite the generic-sounding column name) is deliberately populated with `carrier.equipmentSummary.truckTractors + carrier.equipmentSummary.straightTrucks`, not `carrier.powerUnits`. When a carrier has no MOTUS equipment data (QCMobile fallback, which always reports zero equipment), this correctly resolves to 0, which `computeQuickBuyPricing()` treats as the 0-2 bracket rather than blocking the purchase or asking the visitor to type a number in.

### 11.7 Dynamic upsell menu

The "You may also need" checklist on review shows different options depending on the carrier's fleet, per owner instruction: carriers with `truckTractors > 0` see all four other quick-buy services, framed as completing their compliance requirements ("Add all of these and your compliance requirements are fully covered"); carriers with zero truck tractors see only BOC-3, UCR, and DQ files — Clearinghouse and Consortium are CDL drug/alcohol testing compliance, which the owner judged doesn't apply without truck tractors in the fleet. (An earlier version of this also factored in CDL driver count; the owner simplified it to truck-tractor-count-only, so `cdl_driver_total` was never persisted.) The signal (`truck_tractors`) is captured raw at confirm time and the eligibility rule lives in `review-form.tsx` (`showFullMenu`, `LIMITED_UPSELL_KEYS`) specifically so the business can change the rule later without another migration. This only changes what's *suggested* — a visitor who lands directly on `/buy/consortium/` keeps that as their primary purchase regardless of their fleet signal; only the surrounding upsell suggestions narrow.

### 11.8 Fulfillment side: webhook, admin, email

Additive branches only, on the exact same three files that already handle `/apply`'s equivalents — read the `if (application_id) {...} else if (quick_buy_order_id) {...}` shape in each before changing any of them, since the two branches must stay symmetric:
- **`dev/app/api/stripe-webhook/route.ts`** — `markPayment()` branches on `row.quick_buy_order_id`: flips `quick_buy_orders.status → paid`, queues its filings, sends `sendQuickBuyReceiptIfNeeded()`. This is the highest-care file to touch in this whole feature; re-verify the existing `/apply` branch end to end (Stripe CLI replay) if you ever change it.
- **`dev/lib/server/filing-transition.ts`** — branches the status-change email and the "mark the order fulfilled" logic on whichever parent id the filing has. **Important if you're adding more upsell services later:** a quick-buy order can now have *more than one* filing (thanks to upsell), so `to === "completed"` only flips the order to `fulfilled` once **all** of the order's filings are terminal — it does not assume one filing per order. Don't reintroduce that assumption.
- **`dev/lib/email/lifecycle.ts`** — `sendQuickBuyReceiptIfNeeded()` / `sendQuickBuyStatusChangeEmail()`, sourcing the recipient from `quick_buy_orders.email` (there's no auth user to look up). No PDF completion documents for quick-buy in this build — deferred, plain status emails only.
- **`dev/app/admin/page.tsx`** — an additive "Quick-buy orders" section below the existing applications list, same filing-transition UI, reusing the existing `adminTransition` server action unmodified.

### 11.9 Not yet verified live / known gaps

- **Migrations `0008`-`0011` were applied by the owner via `supabase db push` against the `pqbynaaihauifomfhcxo` project during this session** (not by the agent — direct database-credential handling was explicitly declined; the owner ran the CLI themselves each time). `0008`-`0010` were confirmed working by a live click-through (the owner reported a UCR pricing display bug that was fixed and reconfirmed correct). **`0011` (the `truck_tractors` column) has not yet been confirmed applied or exercised live** — if `confirmQuickBuyOrder` starts failing into its `?error=1` redirect again, check this first.
- **Email deliverability, update 2026-07-31: `EMAIL_FROM` is now set** (`Tech Rig <info@sales.techrig.org>`, on the Resend-verified `sales.techrig.org` domain — the apex `techrig.org` is NOT verified in Resend, don't point `EMAIL_FROM` back at it). This superseded the original gap noted here (sends previously fell back to the Resend sandbox address). Separately, the Stripe webhook must actually reach the app (`stripe listen` locally, or a registered endpoint once deployed) or `payment_intent.succeeded` never fires and no order ever settles.
- **New, 2026-07-31: three internal admin alerts across the quick-buy fast path** (`dev/lib/email/lifecycle.ts`, templates in `dev/lib/email/templates.ts`). Owner-directed, deliberately short (service, USDOT, company name, email, phone — never the full carrier docket):
  1. **`sendQuickBuyLookupAdminAlert`** — fires when a visitor reaches `/buy/[service]/[usdot]/` with a resolved lookup (found or not-found). Company name comes from the just-completed live lookup (no DB round-trip).
  2. **`sendQuickBuyPaymentStepAdminAlert`** — fires when a client reaches `/buy/order/[orderId]/pay/` (review + signature already complete). Subject: "Client is on payment step". Company name isn't a `quick_buy_orders` column, so it's resolved via the new `getQuickBuyCompanyName()` helper (`dev/lib/server/quick-buy.ts`), which reads the immutable `carrier_snapshots` row the original lookup wrote, keyed by `lead_id`.
  3. **`sendQuickBuyPaidAdminAlert`** — fires from the Stripe webhook (`payment_intent.succeeded`, `dev/app/api/stripe-webhook/route.ts`) alongside the existing client receipt send. Adds the total amount and the full selected service list (primary + upsells). Subject: `USDOT <n> — invoice paid — $<amount>`.

  None of the three has an idempotency guard (nothing is persisted for them) — each fires once per page render or webhook event, same as its trigger. Best-effort like every other send in this file.

  **Bug found and fixed same day: the shared per-recipient rate limit (`dev/lib/email/send.ts`, 5 sends/60s) was silently dropping the paid alert.** All three admin alerts share one recipient (`ADMIN_EMAIL`), and that limit was designed to throttle repeat sends to a single CLIENT, not one internal inbox receiving 3 distinct alert types back to back — a normal test pass (a couple of USDOT retries, reaching payment, resubmitting) could exhaust the cap before the paid alert (fires last) ever sent, and the drop was silent (no log at all). Fixed with a new `skipRateLimit` option on `sendEmail()`, set `true` by all three admin alerts; the client-facing sends (receipts, status updates, reminders) keep the limit unchanged. Also added a `console.error` on any future rate-limited drop so this class of bug can't go silent again.

  **LAUNCH TODO — recipient is a pre-launch testing override, not the final address**, for all three: they currently send to `ADMIN_EMAIL` (`hussamdogar@gmail.com`, set in `.env.local`/Vercel env) instead of the public `info@techrig.org` inbox, deliberately, so alerts land somewhere actively watched during build/QA. **Before or at launch cutover, unset `ADMIN_EMAIL` (or repoint it to `info@techrig.org`)** — the code already falls back to `site.email` (`info@techrig.org`) automatically once `ADMIN_EMAIL` is unset, so this is a one-line env change, not a code change. Flagging for the orchestrator to fold into `shared/launch-plan.md` Phase 0's credential checklist, since that file is orchestrator-owned.

  **Second bug found and fixed same day, more serious: the webhook never ran on ANY quick-buy test payment because of a trailing-slash 308 redirect.** `next.config.ts` has `trailingSlash: true`, so a POST to `/api/stripe-webhook` (no trailing slash) gets a 308 redirect to `/api/stripe-webhook/` — Stripe's webhook delivery does not follow redirects, so a 308 is a failed delivery and the handler body never executes. This is a **config/registration issue, not a code bug** — `app/api/stripe-webhook/route.ts` itself is correct, and the rest of the app already calls its sibling `/api/quick-buy-checkout/` with a trailing slash (verified in `curl` testing via `stripe listen` + `stripe events resend`, confirmed 308 → fixed to 200). This is the SAME webhook route `/apply`'s payments already use (`sendReceiptIfNeeded`, the non-quick-buy branch), so this isn't quick-buy-specific — it would silently break `/apply` payment settlement too if ever registered without the trailing slash. **LAUNCH TODO, same D12 gate as above:** whoever registers the production webhook endpoint in the Stripe Dashboard for D12 (live Stripe) MUST use the trailing-slash URL (`https://techrig.org/api/stripe-webhook/`), or every live payment (both `/apply` and quick-buy) will silently fail to settle server-side (order/application never marked paid, no receipt, no admin alert) despite the client seeing a successful charge and reaching the thank-you/confirmation page (both verify the payment intent directly with Stripe, independent of the webhook, so this failure mode is invisible to both the buyer and casual QA). For any LOCAL testing via `stripe listen`, always use `stripe listen --forward-to localhost:3000/api/stripe-webhook/` (trailing slash) — without it every event returns 308 and nothing processes.
- **SEO/Design specs updated, marketing copy partially updated.** `shared/page-briefs/` and `shared/design/` for all 5 services now describe the quick-buy flow and route their CTAs at `/buy/<service>/`; the live pages (`dev/app/{boc-3-filing,ucr-registration,fmcsa-clearinghouse-registration,drug-and-alcohol-consortium,driver-qualification-files}/page.tsx`) had their CTA hrefs flipped accordingly, and one stale "give us your company details" line was fixed on the BOC-3 page. A full copy pass of the remaining marketing body text to match the new flow was **not** done — that's an SEO-lane content task, out of scope for what was asked.
- **No PDF/document generation, no post-purchase account-claim path, no renewal reminders** for quick-buy orders — all explicitly deferred, same spirit as D10/D11/D12 above.
- **`npx tsc --noEmit`, `eslint`, and `next build` all pass clean** as of the final commit in this section; no live-Stripe or live-email click-through was performed by the agent (no Stripe/Resend test credentials in this session — the owner ran their own manual click-throughs and reported results back).

### 11.10 Client-facing quick-buy receipt email, 2026-07-31

New dedicated template, **`quickBuyReceiptEmail`** (`dev/lib/email/templates.ts`), replacing the generic `receiptEmail` (still used by `/apply`) for `sendQuickBuyReceiptIfNeeded` (`dev/lib/email/lifecycle.ts`). Owner-directed content, deliberately narrow:
- **Identity: company name + USDOT only**, no address/MC number/DBA. Company name is resolved the same way as the admin alerts, via `getQuickBuyCompanyName()` (`dev/lib/server/quick-buy.ts`), since `quick_buy_orders` has no company-name column of its own.
- **Per purchased service: its price and a "what to expect next" paragraph**, from a new static copy map (`QUICK_BUY_NEXT_STEPS`, keyed by the 5 quick-buy service keys) written to the owner's spec: BOC-3 within 24 hours (next business day if the order lands on a weekend/federal holiday); UCR within 24 hours, with a 5-to-7-business-day caveat for recently registered USDOT numbers (UCR/MOTUS system-side delay, not our processing); Clearinghouse and Consortium both 2-3 business days; DQ files about one week, with an explicit "we'll contact you for more information" note. **Deliberately separate from `SERVICES[...].expectedTimeline`** in `services-registry.ts` (that field is marketing-site copy, used on the live service pages and as the default `filings.expected_timeline`) — the two are allowed to read differently since this is transactional-email copy the owner dictated specifically for this email.
- **Order total** at the bottom. Contact info (`info@techrig.org`, `+1 917-909-2257`) needed no new code: every template already gets it from the shared `layout()` footer (`site.email`/`site.telephone`), so it's automatic here too.

**Bug found and fixed same day: `filings.price_amount` could be stale by the time the receipt reads it, which would have shown the wrong per-service price, most visibly on UCR.** Root cause: `filings.price_amount` is written once, at review-submit time (`reviewAndSignQuickBuyOrder`, `dev/app/buy/order/[orderId]/actions.ts`), from whatever `computeQuickBuyPricing()` returns at that moment. The actual charge happens later, in `/api/quick-buy-checkout` (`dev/app/api/quick-buy-checkout/route.ts`), which correctly recomputes pricing fresh from the live registry to decide what to bill Stripe, but was never writing that fresh number back to `filings`. If a registry price (or UCR's fleet-size-driven government bracket) changes between review and checkout, which happens routinely while we're actively iterating on pricing during build/QA, `filings.price_amount` drifts from what was actually charged. **Fixed** by having `/api/quick-buy-checkout` sync `filings.price_amount`/`ucr_tier` to the freshly computed `pricing.filings` values right after the Stripe intent is created (keyed by `quick_buy_order_id` + `service_key`), so by the time payment succeeds and the receipt email reads `filings`, it reflects the actual invoiced amount. This also fixes the data for any other future consumer of `filings.price_amount` (e.g. an admin breakdown view), not just this email.

### 11.11 Third bug found same day, more serious than the first two: duplicate `payments` rows silently killed BOTH the client receipt and the paid admin alert (and would have hit `/apply` too)

**Symptom:** after a real test purchase, neither the client receipt nor the "paid" admin alert arrived, despite the webhook logging a 200 response (so nothing looked broken from the Stripe CLI side).

**Root cause, confirmed against the live data (Supabase, via the service-role key already in `.env.local`):** `payments.stripe_payment_intent_id` (`dev/supabase/migrations/0004_payments.sql`) has an index but no uniqueness constraint. Both checkout routes (`/api/checkout` and `/api/quick-buy-checkout`) guard against inserting a duplicate `payments` row with a select-then-insert check ("does a row already exist for this intent? if not, insert"), which has a race window: two near-simultaneous requests for the same intent (a double-click on Pay, a client-side retry, a dev-mode double effect) can both pass the "does it exist" check before either insert lands, producing two rows for one `stripe_payment_intent_id`. Confirmed exactly this in the live data: order `41244ce7…` had two `payments` rows, 280ms apart, same intent id.

Every place that looked up a payment by intent id (`markPayment()` in the webhook, plus `sendReceiptIfNeeded`, `sendQuickBuyReceiptIfNeeded`, and the new `sendQuickBuyPaidAdminAlert`, all in `dev/lib/email/lifecycle.ts`) used `.maybeSingle()`, which does **not** throw when more than one row matches, it silently returns no row. So the moment a duplicate existed, payment settlement, filings, the client receipt, and the admin alert all silently no-opped, while the webhook still returned 200 to Stripe (so Stripe considers it delivered and never retries). This is not quick-buy-specific: `/apply`'s `sendReceiptIfNeeded` has the identical pattern and would have silently dropped a real client's receipt under the same race.

**Fixed two ways:**
1. **Application-level (shipped, no migration needed for this part):** new `findPaymentByIntent()` helper (`dev/lib/server/payments.ts`) that queries by intent id, orders by `created_at` ascending, and takes the oldest row instead of using `.maybeSingle()`. A duplicate is always an artifact of the SAME checkout attempt (the idempotency key already guarantees Stripe only ever created one real PaymentIntent), never a second real payment, so "oldest row" is a safe, deterministic choice. Swapped into all four call sites above. Verified live: replayed the stuck order's webhook event after this fix landed, it settled correctly (`quick_buy_orders.status → paid`, `receipt_sent_at` stamped on the oldest of the two duplicate rows) with zero DB cleanup needed first.
2. **Schema-level (migration written, NOT yet applied — needs the owner to run it, same practice as migrations 0008-0011):** new `dev/supabase/migrations/0012_payments_dedupe_and_unique_intent.sql`. Deletes any existing duplicate rows per intent id (keeping the oldest, deterministic via `created_at` then `id`), then adds a partial unique index on `stripe_payment_intent_id` (partial so it only applies where the column is non-null) so this class of duplicate becomes structurally impossible going forward. **Not applied to the live project this pass** — per established practice on this project, the agent doesn't run `supabase db push` directly; the owner runs it. Fix #1 above works correctly with or without this migration, so nothing is broken in the interim, but #2 is the real close: once it's live, the checkout routes' select-then-insert should also be upgraded to a proper `.upsert(..., { onConflict: "stripe_payment_intent_id" })`, which needs the unique index to exist first (an `onConflict` upsert against a non-existent constraint throws) — **not done yet, intentionally, to avoid a deploy-ordering break:** shipping that upsert change before the migration is live would make every checkout attempt fail outright. Do this as a fast-follow once 0012 is confirmed applied.

`npx tsc --noEmit`, `eslint`, and `next build` all pass clean.

`npx tsc --noEmit`, `eslint`, and `next build` all pass clean. No live-email click-through of the new receipt content performed by the agent this pass.

### 11.11 Small quick-buy fixes and a post-purchase upsell, 2026-08

- **Confirm screen (`dev/app/buy/[service]/[usdot]/page.tsx`): removed DBA name and MC/docket # from the "Carrier identity" summary** (owner request). Only legal name, USDOT #, power units, and address remain.
- **Test-card hint (`dev/components/payment-form.tsx`) is now conditional, not a manual pre-launch TODO.** It only renders when the Stripe publishable key starts with `pk_test_`; once D12 (live Stripe keys, `pk_live_...`) lands, it disappears on its own with no code change or launch-checklist item needed.
- **New: post-purchase upsell block on the thank-you page** (`dev/app/buy/order/[orderId]/thank-you/page.tsx`), owner-directed. For a paid order, shows a "You may also need" list of the other quick-buy services the order didn't already include, each linking to `/buy/<service>/<usdot>/` with the USDOT pre-filled so the visitor doesn't retype it. This is a **full new purchase** (its own confirm → review → pay), not a one-click add-on to the existing charge: this checkout has no saved account or stored card, so a genuine one-click "charge this again" would need Stripe off-session payment-method storage and SCA re-authorization handling, a materially bigger scope the owner explicitly deferred in favor of shipping the simple version now.
- **Refactor: the upsell-eligibility rule (fleet has truck tractors → all 4 other services; no truck tractors → BOC-3/UCR/DQ files only, since Clearinghouse/Consortium are CDL-only) moved to a shared `eligibleQuickBuyUpsells()`** in `dev/lib/services-registry.ts`, replacing a copy that lived only in the review step's `review-form.tsx`. Both the review-step checklist and the new thank-you-page block now call the same function, so the two surfaces can't recommend different things to the same carrier. The thank-you page additionally excludes whatever the order actually purchased (by `filings.service_key`, not just the primary), which the review step doesn't need since it's still mid-selection.

`npx tsc --noEmit`, `eslint`, and `next build` all pass clean. No live click-through of the new upsell block performed by the agent this pass.

### 11.12 Upsell "why you need this" one-liners, 2026-08

Owner request: everywhere a quick-buy service is upsold, add a one-line reason, not just the name and price. New `QUICK_BUY_UPSELL_REASON` map (`dev/lib/services-registry.ts`, next to `eligibleQuickBuyUpsells`), one line per quick-buy service, framed as the consequence of skipping it rather than a plain description:
- BOC-3: "Process agent designation, required to activate your operating authority."
- UCR: "Annual federal registration; unregistered carriers risk roadside fines and held loads."
- Clearinghouse: "Required FMCSA registration for any carrier with CDL drivers."
- Consortium: "Required random drug and alcohol testing pool enrollment for your CDL drivers."
- DQ files: "Required driver paperwork, kept current and ready for an FMCSA audit."

Each line is grounded in a claim already published on that service's own marketing page (`/boc-3-filing/`, `/ucr-registration/`, `/fmcsa-clearinghouse-registration/`, `/drug-and-alcohol-consortium/`, `/driver-qualification-files/`), not invented, so it can't contradict what's already live (standards.md: "no metric contradicts another anywhere on the site"). Deliberately a separate map from `SERVICES[...].blurb` (marketing copy describing what a service IS, used on the service pages) rather than repurposing it, since the two serve different jobs and shouldn't be forced to read identically.

Wired into both places a quick-buy service gets upsold: the review-step checklist (`review-form.tsx`) and the thank-you-page block (§11.11 above). Also introduced a proper `QuickBuyServiceKey` union type (replacing a looser `ServiceKey[]` typing on `QUICK_BUY_SERVICE_KEYS` / `eligibleQuickBuyUpsells`), so `QUICK_BUY_UPSELL_REASON` can be indexed by every upsell key without a cast — a real type-safety improvement, not just plumbing for this feature.

`npx tsc --noEmit`, `eslint`, and `next build` all pass clean.
