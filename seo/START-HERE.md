# Start here: SEO workspace

> **ACTIVE WORK ORDER (orchestrator, 2026-07-10): S10 — Pricing v2 (four-bundle, two-price model). You LEAD this milestone.**
> **Worktree (session isolation):** run in `C:\Users\nadir\Documents\github\techrig-v2-seo` on branch `seo/pricing-v2` — NOT the main repo. Commit only `seo/` + `shared/` SEO paths to your branch (explicit paths, never `git add .`); the orchestrator merges to `main`. Run `git merge main` when told an upstream lane landed. Full rules: the "Worktree protocol" section in `../shared/work-order-pricing-v2.md`.
> The client sent a "final" pricing/bundle doc; the owner approved a **full pricing-v2 build before launch**. Full routed spec: `../shared/work-order-pricing-v2.md`. Verbatim client doc: `../shared/client-pricing-v2-2026-07-10.md`. This **supersedes** the single-$1,700-package model and the à-la-carte prices from the last pass (client's latest doc wins).
>
> **Your scope (S10):**
> 1. **Rewrite `seo/context/services.md`** to: the two-price model (a `standalone` and a lower `in-bundle` price per service), the **four bundles** ($396 / $1,096 / $996 / $1,696; final = itemized in-bundle total, no rounding), the **dual DQ tables** (standalone 250/450/600 · bundle 200/350/450), and the §10-24 wording refinements. This is the **parity master** the Dev registry + `/apply` + receipt + marketing must equal — get it right and landed early.
> 2. **Write a packages/bundles page-brief:** the 4 cards, the §4 comparison table, the §5 heading + supporting text, the §6 CDL/non-CDL selector wording ("choose by vehicle, not driver"), and the §7 "BOC-3 Included" wording. Add a package-selector section to the **compliance hub brief**.
> 3. **Refine the individual service-page briefs** for the new **standalone** prices + wording: UCR $80 standalone / $50 bundle (§10); DQ standalone 250/450/600 (§12); Consortium $175 + the TrueTest eligibility wording (§13); Clearinghouse $125 (§14); Drug test $125 (§15); IRP/IFTA $225 setup (§16); MC+USDOT $650 standalone + the USDOT-intrastate nuance (§17); Refund add the 30-day-inactive non-refundable case (§21).
>
> Note: the new **in-bundle** prices equal the current `services.md`/registry values — only the **standalone** prices are new. Dispatch pages, ELD/LLC partner referrals, and the D14 `/apply` CTA routing all stay as-is. Stay in lane (specify, don't implement). Commit only `seo/` + `shared/` SEO artifacts, explicit paths, never `git add .`; the orchestrator verifies + pushes (as with S1-S9).

---

1. Confirm the project type in `project_config.md`: new build or revamp. If it is unset, ask once, then proceed.
2. Open the matching process and run it phase by phase, stopping at each gate for review:
   - New build: `prompts/project/new-build.md`
   - Revamp: `prompts/project/revamp.md`
3. Data sources: DataForSEO for keyword, SERP, difficulty, and on-page data. Semrush for backlink and authority analysis in the competitor and audit phases, and as the failover if DataForSEO fails. Google Search Console and GA4 for first-party performance only.
4. At the end of the build, write the handoff to `../shared/`: `page-briefs/`, `sitemap-plan.md`, `schema-specs.md`, plus `icp.md` and `keyword-map.md`. This unblocks Design and Dev.

The recurring content engine (keyword research, writing, audits, refresh) runs after launch from this folder via `coordinator.sh`. It is not part of the initial build. Run one unit of work per invocation: one seed for keyword research, one post for content writing.
