# Start here: Dev workspace

> **ACTIVE WORK ORDER (orchestrator, 2026-06-24): Application Platform — M1.**
> **M1 is BUILD-COMPLETE** (`f0424b4` + DB gate `7a7c885`), with one OPEN amendment:
> **M1 R3 (owner, 2026-06-25) — complete the MOTUS data.** The lookup must be a 3-STEP chain: carriers → matrix → `getOAPublicView` (using `entityOperatingAuthorityId`, which is in the step-1 carriers body at `entityRegistrations[].entityRegistrationOperatingAuthorities[]`, NOT the matrix). Capture discarded step-1 fields (MCS-150 date, biennial due, USDOT status, mileage) and add MC docket + BOC-3 (`blanketFilings`) + insurance (`insuranceFilings`) to the `/lookup/[usdot]/` page. Exact verified field map is in `../shared/application-platform/work-orders/M1-dev.md` §M1 LOOKUP AMENDMENT. Independent of M2 — parallel-safe; verify in sandbox (MOTUS is reachable). Its 3 deploy-time checks remain deferred to the consolidated pre-launch QA (owner policy: nothing deploys, even to preview, until the whole site is complete + QA'd).
>
> **M1 (incl. R3), M2, and M3 are all BUILD-COMPLETE.** The unified `/apply` engine (`16eab3f`) is live against the prod DB with verified pricing, RLS, and step logic.
>
> **✅ APPLICATION PLATFORM BUILD-COMPLETE (`ba3f45e`).** All of M0–M7 + M3-R1 are build-complete; 6 prod migrations; full-platform `/security-review` clean (one HIGH IDOR found + fixed). Nothing is deployed.
>
> **ACTIVE pre-launch task: Client QA revision** (`../shared/work-order-qa-revision.md`, CONFIRMED by the orchestrator 2026-06-25). Client content/pricing/compliance corrections applied SITE-WIDE — marketing pages (§A–E) AND the application platform (**§G delta is mandatory, read it first**). Headline platform changes: registry `dev/lib/services-registry.ts` → UCR filing fee **$100→$50**, full package **$1,350→$1,700** (same 6 services), add **USDOT Correction $125** + **IFTA Quarterly $150**, rename `mcs-150` display → **"Biennial Update"**; remove the `/trucking-insurance-filing/` route + add its 301; scope find-and-fix across `/apply` + the M6 emails/PDFs. ELD/insurance reframe is already done on main → VERIFY, don't re-apply. **Parity gate:** `services.md` = registry = `/apply` review = receipt, zero contradictions. THEN the joint launch (`../shared/launch-plan.md`); do NOT deploy or ALTER/DROP legacy tables without owner sign-off.
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
