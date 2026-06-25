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
