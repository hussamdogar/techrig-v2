# M6 Work Order — Dev

Milestone: M6 — Email lifecycle + documents. Lane: Dev-led (ADR-5/-8).
Reads: `../00-overview.md`, `../01-architecture.md` §6 (email lifecycle), `../02-data-model.md` (`documents`, the `*_sent_at` columns on `leads`), the legacy `techrig-form` (`lib/emailTemplates/*` — 6 final variants, welcome/payment/reminder; `lib/pdfGenerator.ts`; `api/cron/email-reminders`), M4 (paid events) + M5 (status events). Writes: `dev/**` + a build note to `../03-roadmap.md` M6.

Goal: the full lifecycle email engine + PDF documents. Every meaningful event sends the right message exactly once, idempotently, and completed applications get their PDF acknowledgement + answers. Copy is functional brand voice (no SEO lane), em-dash-free, and honors the ELD/insurance reframe.

## 0. Dependencies + infra
- Depends on M4 (payment events) + M5 (status events) — both build-complete. Reuse the live **Resend** account/domain (ADR-6). Prod project `pqbynaaihauifomfhcxo`. Standing auth covers additive migration `0006`.
- **Reality check on verification:** real email delivery and the Vercel cron schedule only run on a deploy. So **verify the logic locally** (template rendering, the idempotency guards, the cron query, PDF generation) against the prod DB; **defer actual delivery + cron scheduling to the consolidated QA ledger.** Resend has a test/sandbox mode — use it for render/delivery smoke tests where possible without spamming.

## 1. Resend integration (`lib/email`)
- A send wrapper: typed `sendEmail({to, template, data, attachments?})`, rate-limited per recipient (legacy: 5/min), errors logged (no PII in logs). Secret key server-only.
- Port the template system from `techrig-form/lib/emailTemplates` but rebuild copy in brand voice. Base layout + per-email templates.

## 2. The lifecycle (triggers → emails)
| Email | Trigger | Mechanism | Idempotency guard |
| --- | --- | --- | --- |
| **Welcome** | lead created (M1 deferred this) | transactional, on lookup/lead insert | `leads.welcome_email_sent_at` |
| **Payment confirmation / receipt** | Stripe `payment_intent.succeeded` (M4 webhook) | transactional, in the webhook | a `payments`-level sent flag (don't double-send on webhook replay) |
| **24h reminder** | cron: lead/app started >24h ago, still unpaid | cron | `leads.reminder_24h_sent_at` |
| **72h reminder + coupon** | cron: >72h, unpaid | cron; issue a Stripe coupon, set `coupon_code` | `leads.reminder_72h_sent_at` |
| **Final per-service** | application completed (all filings reach a terminal state, or on paid — confirm with the M5 lifecycle) | transactional; pick 1 of N variants by purchased services; attach the PDFs (§4) | an `applications.final_email_sent_at` (add in `0006`) |
| **Status-change** | a filing transition in M5 (e.g. → filed, → active, → completed) | transactional, from the transition path | per-event (M5 `filing_events` already records the transition; guard so only client-relevant transitions email) |

- **Never** send a reminder to a paid lead/application. Every send is guarded by its timestamp/flag and is a no-op if already sent. Batch the cron (legacy: 50/run) to respect rate limits.

## 3. Cron (`/api/cron/reminders`)
- Vercel cron in `vercel.json` (legacy ran `0 22 * * *`). Guard the endpoint with `CRON_SECRET` (reject calls without it). Query unpaid leads/apps past the 24h/72h thresholds whose reminder timestamps are null; send; stamp; batch. Idempotent across runs.

## 4. PDF documents (`lib/pdf`, `pdf-lib`)
- Port `techrig-form/lib/pdfGenerator`: an **acknowledgement** PDF (legal terms + the captured signature/`signature_name` + terms-accepted timestamp) and an **answers** PDF (the application data as a Q&A table). Generate on completion; attach to the final email.
- Store them in **Supabase Storage**; record in a `documents` table (`0006`): `id`, `application_id`, `filing_id?` (nullable), `kind` ('acknowledgement_pdf'|'answers_pdf'|'receipt'), `storage_path`, `created_at`. RLS: owner read; service-role write. No PII in object URLs/logs.

## 5. Migration `0006`
Additive: `documents` table (+ RLS), `applications.final_email_sent_at timestamptz`, and any payment-confirmation sent flag not already present. Pre-flight first. Do not alter legacy tables.

## 6. Compliance + content rules
- **CAN-SPAM:** the promotional 72h coupon email needs a physical mailing address + an unsubscribe path; transactional emails (welcome/receipt/status) are exempt but still need a clear sender. Add a suppression check before promotional sends.
- Copy: brand voice, em-dash-free, no banned AI-tell words (standards.md). **Honor the reframe:** never say Tech Rig files insurance or sets up ELDs. The final per-service variants must match the services actually purchased.
- No fabricated timelines: use the registry `expectedTimeline` as guidance, not a guarantee.

## Acceptance gate
**Verifiable now (local + prod DB; Resend sandbox where possible):**
- Each trigger selects the correct template and renders with real data; each send is guarded by its timestamp/flag and is a **no-op on repeat** (idempotent) — prove the welcome, reminder, and receipt guards.
- The cron query selects only unpaid, past-threshold, not-yet-sent leads; never selects paid ones; `CRON_SECRET` enforced.
- 72h path issues a coupon + sets `coupon_code`; promotional email carries address + unsubscribe.
- Final email picks the right variant by purchased services; **PDFs generate** (acknowledgement + answers) and attach; stored in `documents` with owner-read RLS.
- No PII in logs; Resend key server-only.

**Deferred to consolidated pre-launch QA (no preview):** real email **deliverability** (DKIM/SPF on the domain), the **Vercel cron** actually firing on schedule, full inbox click-throughs. Log to the QA ledger.

## Commit scope
Commit only `dev/**` + the M6 roadmap note. Never `git add .`.
