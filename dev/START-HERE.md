# Start here: Dev workspace

> **ACTIVE WORK ORDER (orchestrator, 2026-06-24): Application Platform — M1.**
> **M1 is BUILD-COMPLETE** (`f0424b4` + DB gate `7a7c885`), with one OPEN amendment:
> **M1 R3 (owner, 2026-06-25) — complete the MOTUS data.** The lookup must be a 3-STEP chain: carriers → matrix → `getOAPublicView` (using `entityOperatingAuthorityId`, which is in the step-1 carriers body at `entityRegistrations[].entityRegistrationOperatingAuthorities[]`, NOT the matrix). Capture discarded step-1 fields (MCS-150 date, biennial due, USDOT status, mileage) and add MC docket + BOC-3 (`blanketFilings`) + insurance (`insuranceFilings`) to the `/lookup/[usdot]/` page. Exact verified field map is in `../shared/application-platform/work-orders/M1-dev.md` §M1 LOOKUP AMENDMENT. Independent of M2 — parallel-safe; verify in sandbox (MOTUS is reachable). Its 3 deploy-time checks remain deferred to the consolidated pre-launch QA (owner policy: nothing deploys, even to preview, until the whole site is complete + QA'd).
>
> **M2 is BUILD-COMPLETE** (`ed88a8f`): Supabase Auth (magic-link), `profiles`/`0002`, lead→account claim, `/dashboard` + `/account`.
>
> **ACTIVE: M3 — Unified application engine.** Execute `../shared/application-platform/work-orders/M3-dev.md` (build order: service registry → migration `0003` → state machine → carrier diff → steps → autosave → selection/review/pricing/filings). Standing authorization covers the additive `0003` (pre-flight first). Reuse the existing design system. Verify locally + against the prod DB — NO preview deploy; deploy-time items → the QA ledger. Prices ONLY from `seo/context/services.md`; ELD/insurance are never billable filings.
>
> **Also OPEN: M1 R3** (the 3-step MOTUS lookup amendment, `work-orders/M1-dev.md` §M1 LOOKUP AMENDMENT) — independent of M3 and parallel-safe. **Recommend doing R3 first or alongside M3**: M3's OA-aware service pre-selection (§6) reads the enriched `carrier_snapshots` that R3 produces, so landing R3 first gives M3 a complete snapshot to consume. Do not print secrets.

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
