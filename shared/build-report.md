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
