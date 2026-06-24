# Start here: Dev workspace

> **ACTIVE WORK ORDER (orchestrator, 2026-06-24): Application Platform — M1.**
> M1 code is BUILT (`cf57ff8`) but has TWO owner revisions to land FIRST, then the gate. See `../shared/application-platform/work-orders/M1-dev.md`:
> 1. **§M1 REVISIONS (2026-06-25):** R1 — Search navigates to a dedicated noindex results page `/lookup/[usdot]/` (the card becomes an entry form; result/not-found/error move to the page; extract a shared `performLookup()` so the page + POST route share one path). R2 — render the COMPLETE matrix docket on that page, not the card's 8-field summary (the two-step carriers→entityId→matrix fetch in `lib/lookup/motus.ts` is already correct; the gap is display scope). Nulls show "Not on file".
> 2. **§GATE-COMPLETION RUNBOOK:** then pre-flight + apply migration `0001` to the live Supabase DB (AUTHORIZED, additive + idempotent; stop/escalate on any name collision), deploy a Vercel preview with `dev/.env.local` (incl. `FMCSA_WEBKEY`), and run the gate checks (full-docket render, backup provider, RLS, Lighthouse, noindex). Report evidence; the orchestrator flips M1 → DONE and opens M2.
> Do not print secrets. The original site build (below) is already complete; M1 is additive.

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
