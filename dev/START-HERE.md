# Start here: Dev workspace

> **ACTIVE WORK ORDER (orchestrator, 2026-06-24): Application Platform — M1.**
> Build the homepage USDOT lookup card + lead capture. This is a Dev-led workstream (noindex, so no SEO; existing design system, so no new Design). Execute `../shared/application-platform/work-orders/M1-dev.md` end to end; read `../shared/application-platform/00-overview.md` → `01-architecture.md` → `02-data-model.md` first for context. Reuse the live legacy infra (Supabase/Stripe/Resend/KV); the one new credential to obtain is the FMCSA QCMobile webKey (backup lookup). First task: `lib/lookup` (MOTUS primary + QCMobile backup, failover). Honor the acceptance gate before declaring M1 done. The original site build (below) is already complete; M1 is additive.

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
