# Launch Plan — joint Workstream A (marketing) + B (application platform)

Owner: orchestrator. Created 2026-06-25, at the convergence point (all platform milestones M0–M7 build-complete; marketing revamp build-complete and parked at its launch gate). This is the single runbook for taking the whole site live as ONE deploy, per the owner's policy (nothing deploys until the whole site is complete + QA'd — now satisfied).

Status: **BUILD-COMPLETE, pre-launch.** Nothing is deployed yet. The "no preview until complete" policy now inverts — a staging deploy for QA is the next step.

> **Update 2026-07-10 — PRICING V2 gates the launch.** The client sent a "final" pricing/bundle doc (`client-pricing-v2-2026-07-10.md`); owner chose a full pricing-v2 build (two-price model + four bundles $400/$1,100/$1,000/$1,700) BEFORE launch. Routed as L12 (`work-order-pricing-v2.md`). This is now the first pre-launch milestone: pricing v2 lands + parity re-passes, THEN Phase 0/1/2/3 below. The staging QA (M3/M4 with live Stripe) validates the NEW pricing + bundle checkout.
>
> **Update 2026-06-25:** the client answered all open questions (`client-answers-2026-06-25.md`). Provisioning is now mostly supplied (Resend domain, prod domain/DNS, Sentry yes, admin seed = info@techrig.org); only the **QCMobile webKey** (Hussam, at deploy) and a **standard live Stripe credential** remain open (the provided `mk_...` key is not a usable Stripe API key — see `work-order-client-answers.md` D12). **New precondition before the staging deploy:** the client-answer build deltas **D1-D9** (`work-order-client-answers.md`) land first — they change engine prices and add 3 indexable pages to the crawl-union. D10/D11 are fast-follow.

## Phase 0 — Owner-provisioned launch credentials (the gate to deploying)
Everything was built against the prod Supabase DB; these are the remaining live creds/config the team supplies on the Vercel project. All documented in `application-platform/build-report.md` + `.env.example`.
- **FMCSA QCMobile webKey** (`FMCSA_WEBKEY`) — M1 backup lookup (primary MOTUS already works).
- **Stripe LIVE keys** + register the **webhook endpoint** on the deployed origin — M4.
- **Resend**: verify **DKIM/SPF** on the sending domain + `RESEND_API_KEY` + `EMAIL_FROM` — M6.
- **Supabase Auth**: add the launch domain's `/auth/callback` to the redirect-URL allowlist — M2.
- **`CRON_SECRET`** on Vercel (Vercel sends it to the cron automatically) — M6.
- **Sentry DSN** (server + client) — M7.
- **Vercel KV** namespace — M1 reference counter + rate limits.

## Phase 1 — Staging deploy + Consolidated QA ledger (Workstream B)
Deploy to a Vercel staging/preview with Phase-0 env wired, then clear every deferred deploy-time check (from `application-platform/03-roadmap.md`):
- **M1:** QCMobile failover on a real IP (past the WAF); KV counter + rate-limit on real Upstash; Lighthouse `/` + `/lookup/[usdot]/`.
- **M2:** magic-link deliverability + full sign-in click-through; Lighthouse authed routes.
- **M3:** full multi-step application click-through with a real session; Lighthouse `/apply/*`.
- **M4:** live Stripe webhook + a real-card test; Lighthouse `/apply/[id]/pay`.
- **M5:** signed-in admin click-through (advance a real filing in the browser); Lighthouse `/admin` + dashboard.
- **M6:** email deliverability (DKIM/SPF); the Vercel cron firing on schedule; inbox click-throughs of each lifecycle email.
- **M7:** live subdomain 301 verification; Sentry receiving (PII-scrubbed) events.

## Phase 2 — Workstream A launch gate (marketing; runs WITH Phase 1)
From `orchestration-status.md` (the parked marketing launch loops):
- **L1 — crawl-union (the launch blocker):** union of Screaming Frog + GSC indexed export + GA4 landing pages; confirm every real live URL (incl. the `form.`/`boc-3` subdomains) is a built route or a one-hop 301. The platform's subdomain redirect targets are noindex by design.
- **L2 — blog-at-root sign-off:** confirm the ~42 KEEP posts stay at root (recommended; preserves ranking URLs).
- **L4 — claims-vs-code (qa-report §C):** per-page OG images, `llms.txt`, JSON-LD parity, ad-page indexability + canonical, CTA routes live, price-chip single source, CWV. (`build-report.md` satisfies the L3 build-report deliverable.)
- **Duplicate-string scan** across the `/tech-rig-dispatch-[state]/` pages.
- **Staging crawl:** 0 unexpected 404s, 0 redirect chains, against the unioned indexed set.

## Phase 3 — Cutover / go-live
- **Drain the legacy apps** (owner decision 2026-06-25): stop sending new traffic to `form.`/`boc-3.techrig.org`; let in-flight sessions finish there; **do not migrate data**; leave the legacy `registrations`/`boc-3-new` tables untouched as historical record.
- Flip DNS / activate the subdomain 301s.
- Deploy marketing + application platform **together, as one production deploy**.
- **Post-deploy watch (prime directive):** confirm GSC coverage + GA4 events; monitor the PRESERVE-register URLs (box-truck-dispatch + cost, lead-generation, homepage, dry-van); any >20% click drop = a same-week regression to fix.

## Open owner decisions / actions before launch
1. **Provision Phase-0 creds** + authorize the staging deploy (this is what unblocks everything).
2. **Launch window/timing** — when to cut over.
3. **Confirm the drain execution** (default recorded above) and who flips DNS.
4. **Client inputs RESOLVED 2026-06-25** (`client-questions.md`, routed in `work-order-client-answers.md`). The launch-gating build deltas are **D1-D9**; still open: QCMobile webKey (Q5.3), a live Stripe credential (D12), and final team filing ownership (Q6.2).

## Roles at launch
- **Orchestrator:** sequences the launch, runs the convergence, keeps the gate.
- **Dev:** executes the staging deploy + the Consolidated QA ledger (Workstream B) and the Workstream A code-side L4 items.
- **SEO (re-engaged):** runs L1 crawl-union, L2 sign-off, the duplicate-string scan (needs the SEO tools).
- **Owner:** Phase-0 creds, launch timing, drain/DNS, the open client inputs.
