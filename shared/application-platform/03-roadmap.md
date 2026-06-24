# Application Platform — Milestone Roadmap

Owner: orchestrator. Status: M1 ACTIVE (work orders issued); M2–M7 PLANNED.
Decompose the build so nothing is dropped. Each milestone is independently shippable, has explicit lane routing, hard dependencies, and an acceptance gate. A milestone is DONE only when its gate passes and the orchestrator flips it on this page + `../orchestration-status.md`.

**This is a Dev-led workstream (ADR-5/-8).** The platform is noindex, so SEO is not a lane; the design language is locked, so Design is not a lane. Dev owns the UI (built with the existing system), functional copy in the brand voice, and all engineering. The 🔵/🟣 bullets in M2–M7 below are folded into Dev: read "🔵" as "Dev, copy in brand voice" and "🟣" as "Dev, existing design system"; escalate to Design only for a genuinely new pattern. Each milestone still gets its own Dev work order when it activates.

Sequencing rule: a milestone does not start until its dependencies' gates pass.

Legend: 🟢 Dev (owns) · ⚙️ orchestrator/shared · (🔵 copy-in-brand-voice / 🟣 existing-design — both Dev)

---

## M0 — Foundation (Dev) · STATUS: PARTIAL (docs done; infra confirmed)
Goal: lock decisions, stand up the skeleton, no client-visible change.
- ⚙️ ADRs + these docs (DONE). Accounts CONFIRMED: reuse the live legacy infra (ADR-6). Reference-ID prefix stays `DGR-` (ADR-6).
- 🟢 Pull env from the legacy Vercel projects; add the `(app)` route group scaffold + `lib/supabase` client + env wiring (no features); obtain the QCMobile webKey (backup lookup). Decide JSONB-vs-columns for `application_data`.
Gate: skeleton builds clean; env wired from the live projects; both lookup providers reachable.

---

## M1 — Hero USDOT lookup card + lead capture · STATUS: ACTIVE (Dev-led)
Goal (ADR-4): a carrier enters a USDOT on the homepage, sees live FMCSA records (via the dual-provider lookup), and is captured as a lead; "no USDOT" routes to the file-now path. No auth, no payment yet.
- 🟢 Dev — `work-orders/M1-dev.md` (the only M1 work order): `lib/lookup` (MOTUS primary + QCMobile backup, failover), `/api/lookup-usdot` (rate-limited), `leads` + `carrier_snapshots` tables + RLS in the live Supabase project, the hero card client island built with the existing design system, result render with all states, reference-ID generation (`DGR-`), the "file now" route, noindex on app routes. Functional copy is specified inline in the work order (brand voice; no SEO dependency). Optional welcome email if Resend is trivial to wire.
Dependencies: M0 env from the live projects + the QCMobile webKey. No SEO/Design gating.
Gate: enter a real USDOT → correct live FMCSA data renders (primary, and still works when the primary is forced to fail → backup answers); a `leads` + `carrier_snapshots` row is written; not-found/error handled gracefully; rate-limited; homepage Lighthouse not regressed (no CLS, card lazy); app routes noindex + absent from sitemap.

### Build note (Dev, 2026-06-24) — CODE-COMPLETE; live gate partially passed, remainder blocked on credentials
**Shipped (`dev/**`):**
- `lib/lookup/` — dual-provider lookup with failover. MOTUS primary ported from `boc3-form-new` (`normalizeMotusMatrixResponse` + two-step carriers→matrix fetch); QCMobile backup normalized to the same `CarrierData`; `lookupCarrier()` runs primary (~2.5s timeout) → backup → `manual_required`, isolates each call, logs provider + latency, and distinguishes a clean `not_found` from provider-unavailable.
- `lib/server/` — HMAC lead token (+ at-rest hash), KV rate limit (in-memory fallback), `DGR-YYYYMMDD-NNN` KV reference counter, Supabase service/anon clients (`server-only`). `.env.example` documents every key.
- `supabase/migrations/0001_leads_carrier_snapshots.sql` — `leads` + `carrier_snapshots` (additive), RLS (anon insert; owner-only reads; write-once snapshots), indexes. **Not yet applied** to the live project.
- `app/api/lookup-usdot/route.ts` — validate `^\d{1,12}$`, rate-limit 20/15min, reference+token, lookup, best-effort lead+snapshot insert (degrades gracefully without DB), `X-Robots-Tag: noindex`.
- `components/usdot-lookup-card.tsx` + `app/page.tsx` — hero card client island (verbatim copy; idle/loading/result/not-found/error/reset states; status chip; "Not on file" for null fields; a11y). Replaces the decorative `AuthorityStatusTracker` (kept for M5). Deps added: `@supabase/supabase-js`, `@supabase/ssr`, `@vercel/kv`, `zod`.

**Verified in sandbox (live):** real USDOT 3214567 → correct live MOTUS data (`source: motus`, authority Active, 6 power units); absurd USDOT → `not_found` (status logic correct); invalid input → 400; `X-Robots-Tag: noindex` present; home stays prerendered (`○ /`) with the card server-rendered (no CLS) and no Supabase/Stripe in the client bundle; KV reference falls back cleanly when KV is absent. Confirmed against a live matrix response: MC = `mxDocketNumber`; safety-rating and insurance-on-file are NOT in the MOTUS matrix (they come from QCMobile), so MOTUS leaves them null honestly.

**Gate items still OPEN (need credentials/infra Dev cannot self-provision):**
1. **QCMobile webKey (`FMCSA_WEBKEY`)** — the one new credential. Without it the backup is unavailable, so the "force primary to fail → backup answers" gate check is untested live (code path is in place).
2. **Live Supabase + KV env** (pull from the legacy Vercel projects) — needed to actually write `leads`/`carrier_snapshots`, exercise the real KV counter/rate-limit, and **apply migration `0001`** to the live project. Applying to the shared production DB is held for explicit go-ahead.
3. **Preview verification** — Lighthouse (perf/CLS) and RLS (anon cannot read others' rows) on a Vercel preview with the env wired.

**Recommendation:** keep M1 status ACTIVE. Wire the env + webKey, apply `0001`, deploy a preview, run items 1–3; then the orchestrator flips M1 → DONE.

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
