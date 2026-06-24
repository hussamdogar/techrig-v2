# M7 Work Order — Dev (final milestone)

Milestone: M7 — Migration, redirects, launch hardening. Lane: Dev-led (ADR-5/-8).
Reads: `../00-overview.md`, `../01-architecture.md` §2 (subdomain migration) + §7 (security), the M1–M6 build notes, `../../shared/redirect-map.md` + `../../shared/orchestration-status.md` (Workstream A launch loops L1/L4), `dev/next.config.ts`. Writes: `dev/**`, `../../shared/build-report.md` (the contract deliverable), + a build note to `../03-roadmap.md` M7.

Goal: make the platform launch-ready and converge it with the marketing site (Workstream A) for ONE deploy. After M7 build-complete, the consolidated pre-launch QA ledger runs once, together with Workstream A's gate, and the whole site goes live.

## 0. Dependencies
M1–M6 all build-complete. This is the last build milestone; it does not start new product surface, it hardens and migrates.

## 1. Subdomain 301 migration (folds into Workstream A's crawl-union)
- `form.techrig.org` → the new application entry (`/apply/` or `/lookup/` — pick per the funnel; `/apply/?service=...` for deep links). `boc-3.techrig.org` → `/apply/?service=boc-3`. One hop, 301/308, no chains.
- Implement in `next.config.ts` redirects (host-based) and/or DNS/edge config — coordinate with how the subdomains are hosted. The new targets are noindex (ADR-5); that is correct for transactional flows.
- **Hand the full subdomain URL set to Workstream A's L1 crawl-union** (`orchestration-status.md`) so the union confirms every legacy app URL is a built route or a one-hop redirect, with 0 unexpected 404s. Note in the crawl-union that these redirect targets are noindex by design.

## 2. Legacy data drain vs ETL — DECISION (flag to orchestrator/owner before cutover)
The legacy `techrig-form` / `boc3-form-new` apps are still LIVE on the shared infra, so real carriers may be mid-application at cutover.
- **Default plan: DRAIN.** Stop sending new traffic to the legacy apps, let in-flight sessions finish there, then flip the 301s (DNS) so new traffic lands on the new platform. No data migration; the legacy `registrations`/`boc-3-new` tables stay as historical record (untouched — do NOT ALTER/DROP them; that requires explicit owner sign-off).
- **Alternative: ETL** in-flight legacy records into `applications`/`filings`/`carrier_snapshots`. Only if the owner wants open legacy sessions carried over. More work + risk.
- Confirm the choice with the orchestrator/owner before cutover. Build the redirects either way; the drain-vs-ETL choice affects only whether a one-time migration script runs.

## 3. Full platform `/security-review` (mandatory — the gate of this milestone)
Run `/security-review` across the WHOLE platform surface (not just M4's payment path): the lookup + lead capture, auth + claim, the application engine + pricing, payment + webhook, the admin authz boundary (`admin_users`, the transition API — explicitly re-review the M5 privilege boundary), the email/cron (CRON_SECRET, unsubscribe token), PDF/Storage access, and all RLS policies across `0001–0006`. Resolve anything ≥ high-confidence before build-complete. This is non-negotiable for launch.

## 4. Hardening
- **Sentry** on (server + client), per `01-architecture.md` §9. Scrub PII from events.
- **Rate-limit / load** sanity: confirm the public endpoints (lookup, checkout, cron) hold under burst; KV-backed limits behave on the real network (this overlaps the QA ledger — verify what you can locally, flag the rest).
- Confirm every app route is noindex + absent from `sitemap.xml`; the marketing routes remain indexable and unregressed.
- Verify no secret is in any client bundle; `.env.example` complete; document every required Vercel env var for launch (Supabase, Stripe live, Resend, FMCSA webKey, KV, CRON_SECRET, Sentry).

## 5. `shared/build-report.md` (the contract deliverable, finally written)
Write the platform build report consolidating all milestones: routes/surfaces built, the 6 migrations + the data model, the dual-provider lookup, auth model, payment + pricing (service-fees-only decision), the admin boundary, the email lifecycle, every owner decision (ADR-1..8 + package contents + gov-fee), and the full deferred-to-QA list. This is what a human (or the launch run) reads to understand the platform. It also satisfies Workstream A's L3.

## Acceptance gate (build-complete)
**Verifiable now (local + prod DB):**
- Subdomain redirect rules implemented; one hop; targets resolve; the legacy URL set handed to the crawl-union.
- `/security-review` run across the whole platform and clean (no unresolved high-confidence findings).
- Sentry wired; noindex/sitemap correct platform-wide; no secrets in bundles; env documented.
- `shared/build-report.md` written and covers M0–M7.
- Drain-vs-ETL decision recorded.

**Deferred to the consolidated pre-launch QA (the joint launch event):** the actual DNS cutover + live 301 verification, the live deploy of every QA-ledger item across M1–M7 (FMCSA webKey/real IP, KV, Stripe live keys + webhook, Resend deliverability + cron schedule, auth redirect URLs, Lighthouse everywhere), and the staging crawl (0 unexpected 404s, 0 chains) unioned with Workstream A.

## Note to the orchestrator
M7 is the convergence point. When it reaches build-complete, re-engage Workstream A (L1 crawl-union, L2 blog sign-off, L4 claims-vs-code) so the marketing site and the application platform launch together as one deploy, running the consolidated QA ledger once. The legacy-drain decision and the launch sequencing are owner calls to surface then.

## Commit scope
Commit only `dev/**` + `shared/build-report.md` + the M7 roadmap note. Never `git add .`.
