# Application Platform — Milestone Roadmap

Owner: orchestrator. Status: M1 ACTIVE (work orders issued); M2–M7 PLANNED.
Decompose the build so nothing is dropped. Each milestone is independently shippable, has explicit lane routing, hard dependencies, and an acceptance gate. A milestone is DONE only when its gate passes and the orchestrator flips it on this page + `../orchestration-status.md`.

Sequencing rule: a milestone does not start until its dependencies' gates pass. Within a milestone, SEO specs → Design specs → Dev implements (the project's build sequence), though SEO and Design can run in parallel where they do not block each other.

Legend: 🔵 SEO · 🟣 Design · 🟢 Dev · ⚙️ orchestrator/shared

---

## M0 — Foundation (shared) · STATUS: PARTIAL (docs done)
Goal: lock decisions, stand up the skeleton, no client-visible change.
- ⚙️ ADRs + these docs (DONE). Reference-ID prefix decision (TR vs DGR). Confirm Supabase/Stripe/Resend accounts (reuse legacy or provision new).
- 🟢 Add the `(app)` route group scaffold + `lib/supabase` client + env wiring (no features). Decide JSONB-vs-columns for `application_data`. MOTUS reachability spike (see M1).
- 🟣 Define the "application surface" design tokens/components that differ from marketing (forms, steppers, status chips, dashboard shell) within the locked system.
Gate: skeleton builds clean; env documented; accounts confirmed.

---

## M1 — Hero USDOT lookup card + lead capture · STATUS: ACTIVE
Goal (ADR-4): a carrier enters a USDOT on the homepage, sees live FMCSA records, and is captured as a lead; "no USDOT" routes to the file-now path. No auth, no payment yet.
- 🔵 SEO — `work-orders/M1-seo.md`: hero composition (card vs `AuthorityStatusTracker`), all card copy + microcopy + result-panel labels, the not-found/empty/error copy, the "Don't have a USDOT number? File for one now" link target, lead-capture intent, any schema, and a guarantee the change does not regress the home page's ranking signals.
- 🟣 Design — `work-orders/M1-design.md`: the card UI + result panel in the design system, all states (idle/loading/result/not-found/error), trust treatment of FMCSA fields, mobile, no-CLS placement in the hero.
- 🟢 Dev — `work-orders/M1-dev.md`: `lib/motus` (spike + normalizer port), `/api/lookup-usdot` (rate-limited), `leads` + `carrier_snapshots` tables + RLS, the hero card client island, result render, reference-ID generation, "file now" route, optional welcome email.
Dependencies: M0 env (Supabase project + lookup data source). 
Gate: enter a real USDOT → correct live FMCSA data renders; a lead row is written; bad/again-not-found inputs handled gracefully; rate-limited; homepage Lighthouse not regressed (no CLS, card lazy); copy matches the SEO brief.

---

## M2 — Accounts + dashboard shell · STATUS: PLANNED
Goal (ADR-2): clients can sign up/log in and land on a dashboard; an anonymous lead claims into the account.
- 🔵 SEO: dashboard/account copy, empty states, transactional email subject/copy (magic link), any noindex rules for authed routes.
- 🟣 Design: dashboard IA + nav, logged-out vs logged-in home, empty/populated states, account/profile screens.
- 🟢 Dev: Supabase Auth (magic-link), `profiles`, RLS, dashboard pages, lead→account claim flow, route protection, authed-route noindex.
Dependencies: M1 (leads exist to claim). Gate: a user signs up, lands on the dashboard, sees their claimed lookup; RLS verified (cannot read another user's rows); authed routes noindexed.

---

## M3 — Unified application engine · STATUS: PLANNED
Goal (ADR-3): the service-driven multi-step application — lookup pre-fills, client selects services, only relevant steps render, autosave + resume tied to the account.
- 🔵 SEO: service definitions/labels/legal copy, the service registry content, per-step microcopy, the process-agent acknowledgement wording, honoring the ELD/insurance reframe.
- 🟣 Design: the stepper, per-step layouts, service-selection screen, review screen, validation/error patterns, save/resume affordances.
- 🟢 Dev: `applications` + `filings` tables, the service registry (`lib/services-registry`), dynamic step machine, autosave, server+client validation, carrier-data diff tracking, resume.
Dependencies: M2 (accounts). Gate: a logged-in client completes a multi-service application end-to-end (no payment), data persists + resumes, only required steps show, diffs flagged, no fabricated/contradictory pricing surfaced.

---

## M4 — Payment capture · STATUS: PLANNED
Goal: take payment for selected services, server-priced, with a reliable paid state.
- 🔵 SEO: confirm every price/label against `seo/context/services.md`; refund/terms copy; receipt copy.
- 🟣 Design: payment screen, order summary, success/receipt, failure states.
- 🟢 Dev: Stripe (intent/checkout — pick one), server-side pricing engine (UCR tiers, add-ons, 101+ manual review), webhook (signature-verified, idempotent), `payments` table, verify-on-return, coupon support.
Dependencies: M3 (services selected to price). Gate: a real test-mode payment succeeds → `payments.paid` + application `paid`; webhook idempotent; amount provably from `services.md`; no PII in metadata/logs; `/security-review` passed on the payment path.

---

## M5 — Progress tracking + filing lifecycle + back-office · STATUS: PLANNED
Goal: clients see each filing's real status; the team advances it.
- 🔵 SEO: status labels + the client-visible status descriptions (plain, Grade-8), what each stage means.
- 🟣 Design: the progress tracker (repurpose `AuthorityStatusTracker`?), per-filing status chips/timeline, the admin status board.
- 🟢 Dev: `filing_events`, status transition API (admin-guarded), the `(admin)` board, client read views, MOTUS-diff/`needs_mcs150` surfacing, status-change triggers.
Dependencies: M3 (filings exist), M2 (auth for admin). Gate: an admin advances a filing → the client dashboard reflects it + a timeline entry; RLS prevents client writes; admin actions audited.

---

## M6 — Email lifecycle + documents · STATUS: PLANNED
Goal: the full lifecycle email engine + PDF documents.
- 🔵 SEO/brand: all email copy (welcome, reminders, coupon, final per-service variants, status updates), PDF legal text.
- 🟣 Design: email layout/branding, document/receipt visual.
- 🟢 Dev: Resend integration, cron (`vercel.json`), `*_sent_at` idempotency guards, per-service final email selection, `pdf-lib` acknowledgement + answers PDFs, Supabase Storage `documents`, coupon issuance at 72h.
Dependencies: M4 (paid events), M5 (status events). Gate: each trigger fires exactly once, guarded; PDFs generate + attach; reminders never sent to paid leads; deliverability tested.

---

## M7 — Migration, redirects, launch hardening · STATUS: PLANNED
Goal: cut over from the legacy subdomains and harden.
- 🔵 SEO: fold the new routes + subdomain redirects into the crawl-union (orchestration L1); confirm no ranking URL regresses; same-domain GA4 events.
- 🟣 Design: final QA of every state on real devices.
- 🟢 Dev: 301/308 `form.techrig.org`→`/apply/`, `boc-3.techrig.org`→`/apply/?service=boc-3`; legacy data drain-or-ETL (decision); load/rate-limit test; full `/security-review`; Sentry on.
Dependencies: M1–M6 gates. Gate: 0 unexpected 404s across the unioned URL set; one-hop redirects; security review clean; legacy apps drained; analytics verified.

---

## Cross-cutting (every milestone)
- **Standards:** no fabricated FMCSA/metric data (show "not on file"); no em dashes; pricing only from `services.md`; honor the ELD/insurance reframe.
- **Performance:** never regress the marketing homepage; load Stripe/PDF/signature only where needed.
- **Security:** RLS + rate limits + signature verification from the first DB write; `/security-review` before M4 and M7 ship.
- **Docs discipline:** each milestone updates its work order with "what shipped" + opens the next; the orchestrator keeps this page and `../orchestration-status.md` in sync. No silent scope changes.

## Status ledger
| M | Title | Status | Gate passed |
| --- | --- | --- | --- |
| M0 | Foundation | PARTIAL (docs done) | no |
| M1 | Hero lookup + lead capture | ACTIVE | no |
| M2 | Accounts + dashboard shell | PLANNED | no |
| M3 | Unified application engine | PLANNED | no |
| M4 | Payment capture | PLANNED | no |
| M5 | Progress tracking + back-office | PLANNED | no |
| M6 | Email lifecycle + documents | PLANNED | no |
| M7 | Migration + hardening | PLANNED | no |
