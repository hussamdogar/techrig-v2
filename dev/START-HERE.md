# Start here: Dev workspace

> **ACTIVE WORK ORDER (orchestrator, 2026-06-25): Client-answer deltas — `../shared/work-order-client-answers.md` (Dev D1-D13). This is now the active pass.**
> The client answered all open questions; the deltas are reconciled against verified code and routed in that work order. **SEO S1-S8 (PR #7, `35c002e`) and Design DZ1 (`7caf5f2`) are MERGED on main** — run `git pull` first so you build against the merged `seo/context/services.md` master + the 3 new page briefs (`../shared/page-briefs/`) + the 3 design specs (`../shared/design/`). This **supersedes parts of `work-order-qa-revision.md` §G**: the **$1,700 full package is now 9 items, not 6**.
>
> **Start now (code/registry only — fully specified, no new specs needed):**
> - **D1** — `full-package` `includes += "ifta", "irp", "dq-files"(×1)`; keep price **$1,700**; update the blurb to list all 9; drop the stale "contents unchanged" comment (`lib/services-registry.ts` ~:227-244). `govFeesIncluded` unchanged.
> - **D2** — DQ tiered pricing: 1=$200, 2=$350 total, 3=$450 total, >3 = custom-quote (manual path, like UCR >100 units). Currently flat $200/driver (:166-174).
> - **D7** — remove the "Current FMCSA fee to be confirmed" MC placeholder (`app/mc-registration/page.tsx`); keep the amount-free "FMCSA application fee shown separately" wording; **no separate MC gov-fee figure anywhere**.
> - **D8** — update `expectedTimeline` for each service per the Q6.2 list in the work order (several are materially off: Clearinghouse 5→1 day, Consortium 7→1-2, IRP/IFTA fixed→varies, USDOT→24h).
> - **D12** — the provided Stripe key `mk_1TQSnGBUKzFDGSEhTE8lrbVQ` is **not a standard Stripe prefix**; verify and request live `sk_`/`pk_`/`whsec_`. Set receipt: DGR TECH RIG LLC / info@techrig.org / 30 N Gould St, Sheridan WY / no sales tax.
> - **D10 (fast-follow):** manual-invoice renewal reminders for UCR/Consortium/DQ annual + IFTA quarterly — **NOT Stripe subscriptions**; auto-charge only with express consent. First renewals are a quarter/year out, so not launch-blocking; don't ship copy promising a reminder that doesn't yet exist.
> - **D11 (parallel):** assess the legacy `boc-3.techrig.org` DB export; import historical orders as **EDITABLE** dashboard records where practical, else preserve-as-historical. Never delay launch. Modifies the M7 "DRAIN not ETL" decision. (`form.techrig.org` is not in use; `boc-3.` stays live until the new flow is fully tested, then 301 on your recommended timing.)
>
> **Page-builds (briefs + specs are already on main, so these are unblocked now):**
> - **D3 / D4 / D5** — build the 3 new indexable pages from their brief + design spec: **USDOT Correction $125**, **IFTA Quarterly $150/quarter + gov**, **FMCSA Portal to MOTUS Migration $125** (NEW registry service; timeline ~1-2 weeks; the relocated California case lives on this page). Design specs correctly omit the Authority Status Tracker (per §13) — honor that.
> - **D6** — UCR page → show the gov brackets + a **separate $50 filing-fee line** (not combined totals). The `/apply` form already hides the full table — **verify only, do not change**.
> - **D9** — build the refund-policy page from SEO's copy (`../shared/page-briefs/refund-policy.md`; the page is currently a stub) AND reword the PDF acknowledgement (`lib/pdf/generate.ts:76`) — "non-refundable regardless of outcome" now contradicts the new 3-day-full-refund clause.
> - **D13 (L10 fold-in, owner-approved):** remove the Authority Status Tracker from the built `/ifta-registration/` + `/mcs-150-biennial-update/` pages **if present** (per design-system §13 — neither asserts authority status). §13 is the governing locked rule, so this is implementing the system, not redefining it. Design is aligning the 2 stale specs in parallel (DZ2).
>
> **Locked decisions:** package = **all-in bundle, NO "discount" claim** (sum of listed service fees ≈ $1,650 < $1,700; never publish the MC gov-fee figure); recurring = **manual invoice + reminders, not subscriptions**; legacy = **import-if-practical + editable, else preserve, never delay launch**.
> **Parity gate (before build-complete):** `services.md` = `services-registry.ts` = `/apply` review = generated receipt = marketing pages, ZERO contradictions. Note: two pre-existing copy-only prices in `services.md` (MC reinstatement $200, USDOT reactivation $125) are NOT `/apply`-billable registry services — their absence from the registry is **not** a parity failure; do not add them.
> THEN the joint launch (`../shared/launch-plan.md`); do NOT deploy or ALTER/DROP legacy tables without owner sign-off.
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
