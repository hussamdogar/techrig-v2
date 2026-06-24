# Start here: Dev workspace

> **ACTIVE WORK ORDER (orchestrator, 2026-06-24): Application Platform — M1.**
> **M1 is BUILD-COMPLETE** (`f0424b4` + DB gate `7a7c885`), with one OPEN amendment:
> **M1 R3 (owner, 2026-06-25) — complete the MOTUS data.** The lookup must be a 3-STEP chain: carriers → matrix → `getOAPublicView` (using `entityOperatingAuthorityId`, which is in the step-1 carriers body at `entityRegistrations[].entityRegistrationOperatingAuthorities[]`, NOT the matrix). Capture discarded step-1 fields (MCS-150 date, biennial due, USDOT status, mileage) and add MC docket + BOC-3 (`blanketFilings`) + insurance (`insuranceFilings`) to the `/lookup/[usdot]/` page. Exact verified field map is in `../shared/application-platform/work-orders/M1-dev.md` §M1 LOOKUP AMENDMENT. Independent of M2 — parallel-safe; verify in sandbox (MOTUS is reachable). Its 3 deploy-time checks remain deferred to the consolidated pre-launch QA (owner policy: nothing deploys, even to preview, until the whole site is complete + QA'd).
>
> **M1 (incl. R3), M2, and M3 are all BUILD-COMPLETE.** The unified `/apply` engine (`16eab3f`) is live against the prod DB with verified pricing, RLS, and step logic.
>
> **M0–M6 + M3-R1 are all BUILD-COMPLETE** (`81cd4a5`): lookup, accounts+dashboard, application engine (incl. $1,350 package), Stripe payment, progress tracking + back-office, and the email lifecycle + PDFs. Migrations `0001–0006` live on prod.
>
> **ACTIVE: M7 — migration, redirects, launch hardening (FINAL milestone)** (`work-orders/M7-dev.md`). Subdomain 301s (`form.`/`boc-3.techrig.org` → `/apply/`) handed to the crawl-union; legacy **drain-vs-ETL** decision (flag to orchestrator before cutover — legacy apps are live, real carriers may be mid-flow); **full platform `/security-review` is the mandatory gate** (re-review the M5 admin boundary, all RLS 0001–0006, payment, cron/unsubscribe); Sentry on; rate-limit/load sanity; write `shared/build-report.md`. Standing auth still applies; do NOT ALTER/DROP the legacy `registrations`/`boc-3-new` tables (owner sign-off required). After M7 build-complete, the orchestrator converges Workstream A + B for one launch.
>
> Standing rules still apply: additive migrations to prod after pre-flight; existing design system; verify locally + against prod DB, NO preview deploy (deploy-time items → QA ledger); prices ONLY from `seo/context/services.md`; ELD/insurance never billable; do not print secrets.

---

Blocked until both exist in `../shared/`:
- `../shared/design/` (the design system and per-page design specs from Design)
- `../shared/page-briefs/` (the SEO work orders)

If either is missing, the upstream handoff is not ready. Stop and tell the user.

When unblocked:
1. Read `prompts/dev.md`.
2. Build the design system foundation (tokens, base components, motion policy), then each page per its design spec and SEO work order.
3. Keep the code clean and commented: no dead code, no unused imports, small focused components, comment the why.
4. Output the build to `dev/`, and write `../shared/build-report.md`.
