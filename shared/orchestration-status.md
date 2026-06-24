# Orchestration status board

Owner: orchestrator (coordination only; does not implement in any lane).
Last updated: 2026-06-24. Source of truth for "who owns what next" across SEO, Design, Dev.

## Lane status at a glance
| Lane | State | Blocking anyone? | Blocked on |
| --- | --- | --- | --- |
| SEO | Build deliverables complete (24 briefs, schema-specs, sitemap-plan, keyword-map, qa-report = PASS). | No | Pre-launch crawl-union (needs SEO tools); client inputs |
| Design | Complete: system, logo, 24 specs, 24 mockups (2026-06-21). | No | Nothing |
| Dev | Site built (160 prerendered pages), 301 redirects live, blog posts migrated, ELD/insurance reframe done + verified. | No | Client proof/fees; SEO crawl-union sign-off before launch |

Build-sequence gate (`page-briefs/` + `design/` both exist) is satisfied. No lane is starved; no branch is ahead of `main`. Remaining work is launch-gating, not build-gating.

## Open loops, routed to owners
Ordered by what blocks launch first.

### L1 — Pre-launch crawl-union gate  [OWNER: SEO] — LAUNCH BLOCKER
Union of Screaming Frog crawl + GSC indexed-URL export + GA4 landing pages; confirm every real live URL is either a built route or a one-hop 301. Then a staging crawl post-deploy: 0 unexpected 404s, 0 redirect chains.
- Why it is SEO's: needs DataForSEO/GSC/GA4 + crawl tooling Dev cannot run.
- Dev side already done: sitemap-derived source set fully covered, 0 chains (`handoff-dev-to-seo.md` #3).
- Done when: a crawl-union report lands in `seo/reports/` and this row flips to CLEARED.

### L2 — Blog-at-root decision sign-off  [OWNER: SEO] — quick, unblocks nothing else but needs a yes
Dev built the ~42 KEEP posts at their original root URLs `/{slug}/` (not under `/blog/`), to preserve exact ranking URLs. Dev explicitly asked SEO to confirm or request a relocation (`handoff-dev-to-seo.md` #1).
- Orchestrator recommendation: CONFIRM root. Relocating to `/blog/` would 301 ranking URLs and violate the preserve-rankings prime directive. No upside.
- Done when: SEO records the confirmation (a line in `blog-disposition.md` or a handoff reply); if SEO instead wants `/blog/`, that becomes a Dev work order.

### L3 — Formal build-report.md  [OWNER: Dev] — contract deliverable, currently missing
Root contract expects `shared/build-report.md` from Dev. It does not exist; `handoff-dev-to-seo.md` is serving as a partial substitute.
- Action: Dev writes `shared/build-report.md` consolidating: routes built, redirect mechanics (note: implemented as 308 permanent, not literal 301 — see L5), blog migration, OG/llms.txt/JSON-LD status, and the §C self-claims it has verified vs still open.
- Done when: `shared/build-report.md` exists and covers qa-report §C.

### L4 — Claims-vs-code verification (qa-report §C)  [OWNER: Dev]
Dev must confirm at build, and report in L3's build-report:
1. Per-page unique OG image (no placeholder). 2. `llms.txt` at root. 3. JSON-LD matches `schema-specs.md` (one Organization, two alias Persons, per-page Service w/ service-fee-only price, FAQPage parity, BreadcrumbList; no review stars; no real names). 4. Ad pages `/dot-registration/`, `/mc-registration/`, `/mc-dot-registration/` flipped to indexable + canonical-self + in sitemap, ad tracking preserved. 5. CTA routes live (`boc-3.techrig.org`, `form.techrig.org`) + cross-domain GA4. 6. Price chips from a single source. 7. Decorative glyphs via CSS. 8. FAQ/process Grade 8. 9. Core Web Vitals meet any on-page speed claim.
- Plus: per-page CTA route selection (intake form vs `/get-started` vs `/contact-us/`), marked `[VERIFY]` in qa-report §A5.

### L5 — Redirect status code  [OWNER: SEO to decide, Dev to flip if needed]
Dev implemented redirects as `permanent: true` = HTTP 308 (passes signals like a 301). If SEO wants a literal 301 status, Dev switches to `statusCode: 301`.
- Orchestrator note: 308 is fine for ranking signal transfer; only flip if a stakeholder requires the literal 301 status. Default = leave as 308.

### L6 — Duplicate-string scan across state pages  [OWNER: SEO]
qa-report §A4 flags `/tech-rig-dispatch-[state]/` as highest duplication risk. Run the 8-word/label scan across the built state pages before launch.

### L7 — Client inputs  [OWNER: CLIENT, chased by SEO] — not in any agent's lane
- Government fees: USDOT gov fee, IRP/IFTA state fees, state market stats (e.g. TX "$1.6T") — source or remove.
- Testimonial permissions: Felix / Marcus / Freddie (outreach in progress).
- Until resolved, affected spots stay neutral/`[VERIFY]`; do not fabricate (standards.md).

### L8 — Post-launch content  [OWNER: SEO Operations Track]
content-writer polishes the 42 migrated blog bodies to `standards.md` (titles >60 chars, Three Kings not enforced on posts) and picks up the 4 client-requested posts + per-page proof once client supplies it. Strictly post-launch.

## Workstream B — Application Platform (NEW, 2026-06-24)
A full client-facing application platform on the new site: USDOT lookup card, unified service-driven application, payment, lead capture, Supabase-Auth accounts, dashboard, progress tracking. Unifies the two legacy form apps (`techrig-form`, `boc3-form-new`) and adds the dashboard layer they lacked. Full docs: `application-platform/` (overview, architecture, data-model, roadmap, work-orders).
- Decisions locked (ADR-1..8): integrated into techrig.org; real Supabase-Auth accounts; one unified service-driven engine; first milestone = hero lookup card + lead capture; **whole platform is noindex (so SEO is not a lane)**; **reuse the live legacy infra** (Supabase/Stripe/Resend/KV still active — no provisioning); **dual lookup provider with failover** (MOTUS primary, FMCSA QCMobile backup); **reuse the locked design language** (so Design is not a lane).
- **This is a Dev-led workstream.** SEO out (noindex); Design out (existing system). M0 infra CONFIRMED (reuse legacy). 
- **M1 — R1+R2 LANDED + DB gate PASSED; stays ACTIVE pending 3 deploy-time checks.**
  - Build `cf57ff8`; revisions `f0424b4`; gate `7a7c885`. R1: Search → dedicated noindex results page `/lookup/[usdot]/` (server component, `X-Robots-Tag` + sitemap-excluded); shared `performLookup()` in `lib/server/lookup-capture.ts` reused by page + POST route. R2: full matrix docket in six sections, nulls "Not on file", safety/insurance labelled by source. Verified live (full ELMI docket).
  - DB gate (ran with owner's `SUPABASE_ACCESS_TOKEN`): pre-flight clear; migration `0001` applied + verified (2 tables, RLS, 4 policies, 9 indexes, trigger); live write PASS (`leads` + immutable `carrier_snapshots`, source motus); RLS PASS (anon 0 rows); noindex/sitemap PASS. No secrets printed.
  - **RESOLVED 2026-06-25 (owner-confirmed):** Supabase project `pqbynaaihauifomfhcxo` ("BOC-3 Test Project") IS the production DB of record for the platform, despite the legacy name. M1 ran against prod; no cutover needed. This is the platform's DB going forward (M2 auth, M3 applications, etc. all target it).
  - **M1 = BUILD-COMPLETE.** Deploy policy (owner, 2026-06-25): nothing deploys, even to preview, until the whole site is complete + QA'd. So M1's 3 deploy-time checks (QCMobile real-IP failover, Vercel KV, Lighthouse) moved to the Consolidated pre-launch QA ledger (`application-platform/03-roadmap.md`) and do NOT block M2.
  - **M1 R3 amendment OPEN (owner, 2026-06-25):** complete the MOTUS data via a 3-step chain (carriers → matrix → `getOAPublicView`) + capture discarded step-1 fields. Adds real MC docket, BOC-3 (blanketFilings), insurance (insuranceFilings), and registration dates (MCS-150, biennial due) to the `/lookup/[usdot]/` page. Orchestrator verified the full chain + exact field paths live; spec in `work-orders/M1-dev.md` §M1 LOOKUP AMENDMENT. Independent of M2 (parallel-safe), verifiable in sandbox. Routed to dev. M1 fully DONE when R3 lands + QA ledger clears.
- **M2 ACTIVE (Dev-led)** — work order `application-platform/work-orders/M2-dev.md`. Scope: Supabase Auth (magic-link) + `profiles` (migration `0002`) + RLS + signup trigger; lead→account claim (the M1 results page carries the signed lead token; post-auth sets `leads.user_id`); dashboard shell (`/dashboard`, authed, noindex) listing claimed lookups + empty applications state; `/account`. All on the prod project `pqbynaaihauifomfhcxo`. Verified locally + against prod DB (no preview); deploy-time items → QA ledger.
- **M3 work order DRAFTED ahead** (`application-platform/work-orders/M3-dev.md`): the unified service-driven application engine (service registry, `applications`+`filings` migration `0003`, dynamic stepper, carrier diff/MCS-150, autosave/resume, server-side pricing display, filings per service). Gated on M2 build-complete; do not start until then. ELD/insurance stay non-billable; prices only from `services.md`.
- M3–M7 PLANNED (application engine → payment → progress tracking → email/docs → migration). See `application-platform/03-roadmap.md` status ledger.
- Ties to Workstream A: M7 subdomain redirects (`form.`/`boc-3.techrig.org`) fold into the L1 crawl-union (note: redirect targets are noindex by design); pricing stays sourced from `services.md`; the ELD/insurance reframe must not be reintroduced by the application engine.

## Closed / verified
- ELD + insurance reframe (`work-order-eld-insurance.md`): VERIFIED CLOSED 2026-06-24. `serviceType: "ELD partner referral"`, ELD price chip removed, CTA = "Get connected with our ELD partner", insurance hero disclaimer present, no "files your insurance" survives. Committed 43a1598.
- Blog posts built (42 KEEP at root) + 301 redirect map implemented (`handoff-dev-to-seo.md` #1, #2).
- SEO build deliverables + Design system/mockups.

## Git posture (orchestrator-managed)
- `main` == `origin/main`, working tree clean. No lane is ahead of another.
- Pruned 2026-06-24: `claude/hungry-boyd-00148b` and `claude/modest-carson-36d0c0` (both fully merged, 0 ahead) deleted local + remote. Their leftover worktree was detached from git (`git worktree list` shows only `main`).
- Remaining branches: `main`, `design/logo-and-design-system` (== `main` HEAD, kept intentionally for Design).
- Leftover dir `seo/.claude/worktrees/hungry-boyd-00148b` is locked by a live process (an open SEO session). Git no longer tracks it; delete the empty folder after closing that session.
- Rule going forward: each lane commits only its own paths (SEO -> `seo/`, `shared/` SEO artifacts; Design -> `shared/design/`; Dev -> `dev/`, `shared/build-report.md`). Never `git add .`.
