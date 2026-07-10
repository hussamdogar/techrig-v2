# Start here: Dev workspace

> **ACTIVE WORK ORDER (orchestrator, 2026-07-10): D15 — Pricing v2 re-architecture (the big one).**
> **Worktree (session isolation):** run in `C:\Users\nadir\Documents\github\techrig-v2-dev` on branch `dev/pricing-v2` — NOT the main repo. `node_modules` is gitignored, so **`pnpm install` in that worktree first**, and run the review server/tunnel from there (keeps build/detached-HEAD churn off `main`). Commit only `dev/` + `shared/build-report.md` to your branch (explicit paths, never `git add .`); the orchestrator merges to `main`. Run `git merge main` when the orchestrator says SEO's `services.md` has landed (your parity gate needs it). Full rules: the "Worktree protocol" in `../shared/work-order-pricing-v2.md`.
> **D1-D14 are DONE and committed** (D14 = `454bf82`; don't redo any of it). New milestone: build pricing v2 per `../shared/work-order-pricing-v2.md`. Verbatim client doc: `../shared/client-pricing-v2-2026-07-10.md`. This **supersedes** D1's single $1,700 package and the D1-D14 à-la-carte prices (client's latest doc wins).
>
> **Start now — registry data (fully specified in the work order, no specs needed):**
> - Re-architect `lib/services-registry.ts` to **two prices per service** (`standalone` + `bundle`), **four bundle definitions** (included keys, itemized total, `+$N` rounding adjustment, final price, and public-display fields — **all derived, never hardcoded**), and the **dual DQ tables** (standalone 250/450/600, bundle 200/350/450). Remove the old single `full-package` (Bundle 4 = "Authority Launch — CDL/Heavy" $1,700 replaces it).
> - Rewrite `computePricing`: à-la-carte selection → **standalone** prices; bundle selection → the four fixed bundles at **in-bundle** prices; derive savings / discount % / rounding from the data (one source per displayed number).
> - Note: the new in-bundle prices == the current registry values, so only the standalone prices and the bundle structure are new.
>
> **After SEO's `services.md` + Design's card specs land:**
> - `/apply` bundle-selection UX (the 4 bundles + a CDL/non-CDL selector) alongside à-la-carte at standalone; the review screen shows the itemized table + `+$N` rounding + savings. (D14's `/apply/?service=<key>` pre-select stays.)
> - Propagate the new model to receipts, M6 emails, PDFs, `/admin` order calc, and JSON-LD `Offer` prices.
> - §25 find-and-fix sweep: remove every old single-`$1,700`-package ref, old single-price ref, and hardcoded price across `dev/`.
>
> **Parity gate before build-complete:** `services.md` = `services-registry.ts` = `/apply` review = generated receipt = M6 emails = marketing pages = the §4 comparison table, ZERO contradictions; and the four bundles re-derive to **$400 / $1,100 / $1,000 / $1,700**. Prices ONLY from `../seo/context/services.md`.
>
> Build + verify locally + parity; do NOT deploy (launch hold). Goes live with the validated launch (needs D12 live Stripe + M3/M4 staging click-through). Commit only `dev/` + `shared/build-report.md`, explicit paths, never `git add .`; leave the commit to the orchestrator. Still open/fast-follow: **D12** live Stripe, **D11** legacy import, **D10** renewal reminders.
>
> *(History: D1-D9 + D13/S2 landed as `0ef41fa`; D14 CTA wiring as `454bf82`. The build-report §10 for D14 folds into your pricing-v2 build-report update.)*

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
