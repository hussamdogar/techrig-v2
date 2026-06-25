# Orchestration status board

Owner: orchestrator (coordination only; does not implement in any lane).
Last updated: 2026-06-25. Source of truth for "who owns what next" across SEO, Design, Dev.

> ## ▶ RESUME HERE (next session)
> **You are the orchestrator.** Role + working pattern: read the [[techrig-orchestrator-role]] memory (doc map, git discipline, verify-before-confirm). 
> **State:** the marketing revamp (Workstream A) AND the application platform (Workstream B, M0–M7 + M3-R1) are **BUILD-COMPLETE**; the client QA revision (`c74bffb`) is build-complete. **The client answered all open questions 2026-06-25** (`client-answers-2026-06-25.md`), reconciled into **routed deltas** (`work-order-client-answers.md`). **SEO S1-S8 DONE** (PR #7 merged, `35c002e`): the new pricing master `services.md` + 3 page briefs + refund copy are on main. **Dev D1-D12 + Design DZ1 remain.** **Nothing is deployed.** Git: `main` clean + synced, branches = `main` + `design/` only, no open PRs.
> **What's next — Dev + Design execute, THEN the JOINT LAUNCH** (`launch-plan.md`). Dev now matches the registry to the merged `services.md`; Design writes DZ1 (briefs exist). Before launch (D1-D9): expand the $1,700 package to 9 items + DQ tiers, 3 new indexable pages (USDOT Correction, IFTA Quarterly, MOTUS Migration), UCR/MC fee presentation, turnaround times, refund policy + PDF. Fast-follow (D10/D11): renewal reminders, legacy import. Then provision Phase-0 creds (only **QCMobile webKey** still pending + the live Stripe key) → staging deploy → Consolidated QA ledger + Workstream A L1 crawl-union/L2/L4 → drain legacy + DNS cutover → go live as one deploy. SEO re-engaged for the crawl-union (now also covers the 3 new pages) + the new briefs.
> **Doc map:** this board + `launch-plan.md` + `client-questions.md` (RESOLVED) + `client-answers-2026-06-25.md` + `work-order-client-answers.md` + `application-platform/{00..03 + work-orders}` + `build-report.md`.

**Client inputs RESOLVED** in `client-questions.md` (all 24 answered 2026-06-25; routed to `work-order-client-answers.md`). One credential pending: **Q5.3 QCMobile webKey** (Hussam, at deploy). This supersedes the L7 client-input notes below.

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

### L3 — Formal build-report.md  [OWNER: Dev] — ✅ DELIVERED 2026-06-25
`shared/build-report.md` written as part of M7 (App Platform). It consolidates the platform's M0–M7 surfaces, the 6-migration data model, every subsystem + owner decision, the security model, the deferred-QA list, and the crawl-union URL set. Covers the platform; for the marketing-site §C claims-vs-code see L4. The contract deliverable now exists.

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

### L9 — Client-answer deltas (2026-06-25)  [OWNERS: Dev, SEO, Design] — LAUNCH-GATING (D1-D9)
The client answered all open questions; reconciled against verified code into `work-order-client-answers.md`. Verified deltas, routed:
- **SEO (S1-S8): ✅ DONE** — PR #7 merged to main (`35c002e`), orchestrator-verified (not stale; 16 seo/+shared/ files; parity master `services.md` correct). The 3 new page briefs + refund copy + updated pricing master are on main. Unblocks Design (DZ1) and Dev's page-builds. Pre-existing copy-only prices flagged for Dev (MC reinstatement $200, USDOT reactivation $125 — not registry-billable, not a parity failure).
- **Dev (D1-D9, before launch):** expand $1,700 package to 9 items + DQ tiers (D1/D2, supersedes qa-rev §G.1); UCR gov-brackets+$50 presentation + remove MC gov-fee placeholder (D6/D7); turnaround-time values (D8); refund-policy page + PDF fix (D9). New service `motus-migration` $125 (D5). **Dev (D10/D11, fast-follow):** manual-invoice renewal reminders (not subscriptions); legacy import-where-practical (modifies M7 "DRAIN not ETL"). **Dev (D12):** verify the non-standard Stripe key, request live creds.
- **SEO (S1-S8):** 3 new page briefs (USDOT Correction, IFTA Quarterly, MOTUS Migration) + sitemap/keyword-map/services.md; relocate the CA legacy story (note: it's on the MC pages, not dot-registration); refund copy; UCR page copy; remove state stats; publish-clear C/TPA + links + PIN; testimonials post-launch.
- **Design (DZ1):** specs for the 3 new pages, reusing the locked service-page pattern (no new system work).
- Done when: D1-D9 land + the parity gate re-passes (`services.md` = registry = `/apply` = receipt = marketing), and the 3 new indexable pages are in the L1 crawl-union set. Decisions locked: package = all-in bundle (no "discount"); recurring = manual invoice; legacy = import-if-practical else preserve.

## Workstream B — Application Platform (NEW, 2026-06-24)
A full client-facing application platform on the new site: USDOT lookup card, unified service-driven application, payment, lead capture, Supabase-Auth accounts, dashboard, progress tracking. Unifies the two legacy form apps (`techrig-form`, `boc3-form-new`) and adds the dashboard layer they lacked. Full docs: `application-platform/` (overview, architecture, data-model, roadmap, work-orders).
- Decisions locked (ADR-1..8): integrated into techrig.org; real Supabase-Auth accounts; one unified service-driven engine; first milestone = hero lookup card + lead capture; **whole platform is noindex (so SEO is not a lane)**; **reuse the live legacy infra** (Supabase/Stripe/Resend/KV still active — no provisioning); **dual lookup provider with failover** (MOTUS primary, FMCSA QCMobile backup); **reuse the locked design language** (so Design is not a lane).
- **This is a Dev-led workstream.** SEO out (noindex); Design out (existing system). M0 infra CONFIRMED (reuse legacy). 
- **M1 — R1+R2 LANDED + DB gate PASSED; stays ACTIVE pending 3 deploy-time checks.**
  - Build `cf57ff8`; revisions `f0424b4`; gate `7a7c885`. R1: Search → dedicated noindex results page `/lookup/[usdot]/` (server component, `X-Robots-Tag` + sitemap-excluded); shared `performLookup()` in `lib/server/lookup-capture.ts` reused by page + POST route. R2: full matrix docket in six sections, nulls "Not on file", safety/insurance labelled by source. Verified live (full ELMI docket).
  - DB gate (ran with owner's `SUPABASE_ACCESS_TOKEN`): pre-flight clear; migration `0001` applied + verified (2 tables, RLS, 4 policies, 9 indexes, trigger); live write PASS (`leads` + immutable `carrier_snapshots`, source motus); RLS PASS (anon 0 rows); noindex/sitemap PASS. No secrets printed.
  - **RESOLVED 2026-06-25 (owner-confirmed):** Supabase project `pqbynaaihauifomfhcxo` ("BOC-3 Test Project") IS the production DB of record for the platform, despite the legacy name. M1 ran against prod; no cutover needed. This is the platform's DB going forward (M2 auth, M3 applications, etc. all target it).
  - **M1 = BUILD-COMPLETE.** Deploy policy (owner, 2026-06-25): nothing deploys, even to preview, until the whole site is complete + QA'd. So M1's 3 deploy-time checks (QCMobile real-IP failover, Vercel KV, Lighthouse) moved to the Consolidated pre-launch QA ledger (`application-platform/03-roadmap.md`) and do NOT block M2.
  - **M1 R3 LANDED (`5be85a5`, 2026-06-25):** the 3-step MOTUS chain shipped — carriers (keeps body + extracts OA ids) → matrix → `getOAPublicView` per OA id (parallel, isolated). Results page gained 4 sections (registration/filing dates, operating authority, insurance on file, BOC-3); MC docket now from the OA view; filings filtered to current/active with honest status; no-authority → "Not on file". Verified live (matches the orchestrator's own ground-truth pull: MC1004652, GEICO/BMC-91X, Trucker's Nationwide). **M1 is now fully build-complete** (R1-R3 all landed); only the 3 deploy-time checks remain in the QA ledger.
- **M2 = BUILD-COMPLETE (`ed88a8f`).** Supabase Auth magic-link (`@supabase/ssr`); `proxy.ts` (Next 16's renamed middleware) guards `/dashboard`+`/account`; `/login`, `/auth/callback`, sign-out. Migration `0002` applied to prod (pre-flight clear): `profiles` 1:1 + RLS + `handle_new_user` trigger. Lead→account claim via httpOnly cookie (HMAC + stored-hash, claim-only-if-unclaimed). Verified against prod (throwaway user/lead, deleted): signup→profile, RLS, claim no-reassign, logged-out 307, noindex, no service-key in bundle — all green. Orchestrator confirmed artifacts present at HEAD. Deploy-time items (prod redirect-URL allowlist, real magic-link click-through, Lighthouse on authed routes) → QA ledger. Fully DONE when ledger clears.
- **M3 = BUILD-COMPLETE (`16eab3f`).** Unified service-driven engine: registry (prices orchestrator-verified against `services.md` line by line), `0003` applied to prod (applications+filings, owner-only RLS, FK), dynamic stepper (conditionals + zod), carrier diff + OA-aware hints from the R3 snapshot, `/apply` (autosave/resume, server-priced review, one filing per billable service), homepage link → `/apply/?service=usdot`. Gate green (6-svc cart $1,575 exact; ELD/insurance excluded; UCR 150→manual; RLS both ways; client status-write blocked; noindex). Deploy-time items → QA ledger.
  - **M3-R1 = BUILD-COMPLETE (`321396d`) — full-package bundle.** Registry `full-package` at fixed $1,350 (`priceKind: package`, price 1350); de-dups vs individual selection; one filing per constituent; higher UCR brackets add the gov-fee delta. Orchestrator-verified the entry. Closes the advertised-vs-quoted contradiction.
- **M4 = BUILD-COMPLETE (`321396d`)** — work order `work-orders/M4-dev.md`. Stripe TEST-mode payment works end-to-end vs prod (intent → signature-verified webhook → `payments.paid`/`applications.paid`/`filings.queued`, idempotent), migration `0004`.
  - **`/security-review` PASSED (2026-06-25):** no high-confidence findings. Verified by reading the real code (+ runtime tests): webhook signature-verified and keys off the DB `payments` row (not attacker-controlled metadata); IDOR closed via user-scoped RLS; server-side pricing (client amount never trusted); `payments` has owner-read-only + no client write policy (writes are service-role/webhook); Stripe metadata carries only `applicationId`+`DGR-` ref (no PII); secret/webhook keys server-only; no injection/XSS sinks.
  - **RATIFIED 2026-06-25 (owner): SERVICE FEES ONLY.** Stripe charges Tech Rig service fees + the $1,350 package; government/state fees (MC $300, UCR bracket, IRP/IFTA state) are disclosure lines the customer pays directly to FMCSA/state. The package keeps its included MC+UCR-0-2 gov fees. This matches the existing `computePricing` implementation (`services-registry.ts:308`) — no rework. M4's only open decision is now closed; it reaches build-complete on the dev's test-mode payment-flow verification (security review already PASSED).
- **M5 = BUILD-COMPLETE (`45da3f7`)** — progress tracking + back-office. `0005` (`admin_users` + `filing_events`), state machine + admin-gated transition API (422 on disallowed, idempotent, writes events), `/admin` board, client `ClientProgress` timeline (reuses `AuthorityStatusTracker`). **Security:** dev correctly used a separate `admin_users` table (RLS on, zero policies, read via service role) instead of `profiles.role` — a `role` on the client-editable profile row would be a self-escalation path. Orchestrator read `0005` and confirmed the boundary; authz verified both ways. Flagged for the M7 full security review.
- **M6 = BUILD-COMPLETE (`81cd4a5`)** — email lifecycle + PDFs. `0006` (`documents` + private Storage bucket + idempotency flags + CAN-SPAM opt-out/coupon), `lib/email` Resend wrapper + 6 brand-voice templates, lifecycle wired into existing paths (welcome/receipt/status-change transactional; 24h/72h via cron), `/api/cron/reminders` (`CRON_SECRET` Bearer guard, never emails a paid lead, 72h coupon + opt-out respected), signed-token `/unsubscribe`, `pdf-lib` acknowledgement+answers → `documents`. Verified (logic + prod DB + Resend sandbox): guards idempotent, cron selection correct, RLS on documents both ways. Deploy-time (deliverability/DKIM, cron schedule, inbox click-throughs) → QA ledger.
- **M7 = BUILD-COMPLETE (`ba3f45e`) — FINAL milestone.** Subdomain 301s (host-based in `next.config.ts`: `form.`→`/apply/`, `boc-3.`→`/apply/?service=boc-3`, one hop), Sentry (PII-scrubbed, DSN-gated), hardening verified (no secret in client bundles, all app routes noindex, marketing's 82 URLs unregressed). **`shared/build-report.md` written (satisfies L3).** Owner decision: **DRAIN not ETL** (flip 301s after in-flight legacy sessions finish; legacy tables untouched). **Full-platform `/security-review`: one HIGH (IDOR in `createApplication` — raw `lead_id` used with service role w/o ownership check) FOUND + FIXED + orchestrator-verified in code (`app/apply/actions.ts:46-60`); all else clean.**
- **✅ WORKSTREAM B COMPLETE (build):** all of M0–M7 + M3-R1 build-complete, 6 prod migrations, clean security review. Nothing deployed. **Convergence reached → joint launch with Workstream A: see `launch-plan.md`.**
- Ties to Workstream A: M7 subdomain redirects (`form.`/`boc-3.techrig.org`) fold into the L1 crawl-union (note: redirect targets are noindex by design); pricing stays sourced from `services.md`; the ELD/insurance reframe must not be reintroduced by the application engine.

## Client QA revision (2026-06-25) — ✅ BUILD-COMPLETE (`c74bffb`), PARTLY SUPERSEDED by client answers
> **Superseded by the 2026-06-25 client answers (`work-order-client-answers.md`):** §G.1's "Full package contents UNCHANGED (6 services, owner-confirmed)" is **overridden** — the client expanded the $1,700 package to **9 items** (adds IFTA setup, IRP setup, one DQ file) per Q2.2 (Dev D1). The UCR/MC fee presentation (Q1.3) and turnaround times (Q6.2) are also revised. The rest of the QA revision stands.

**Implemented + orchestrator-verified.** Parity gate PASS (spot-checked directly): `services-registry.ts` UCR `serviceFee: 50` all brackets, `full-package` price `1700`, `usdot-correction` `125`, `ifta-quarterly` `150` — all match the new `services.md`; insurance route deleted with a one-hop 301 in `next.config.ts`; `next build` exits 0. Dev's review caught beyond the work order: 3 stale "FMCSA portal" refs, a user-facing em-dash, the **BOC-3+UCR bundle $200→$150** (a real parity bug — UCR dropped to $50), and the consortium location-pin icons. Committed directly to main (no branch — verified, and avoids another stale-branch situation). Not deployed (deploy-time `/apply` click-through for the 2 new services → QA ledger / `build-report.md` §8). Original confirm/remediation detail below.

### Confirmed + remediated (history)
Client content/pricing/compliance-language revision (`work-order-qa-revision.md`; client brief at `seo/output/client-qa-brief-2026-06.md`). SEO did its part correctly but on a **stale branch** (PR #6, based on old main, missing the whole platform), and the new pricing **contradicted the just-built platform**. Orchestrator remediation:
- **Re-staged** SEO's source changes onto current main via clean cherry-pick (`424ac80`): `services.md` now UCR $50 / full package $1,700; insurance page-brief deleted; QA work order + client brief added. **PR #6 closed** (superseded); stale branch `claude/hungry-boyd-00148b` pruned.
- **Expanded the work order with §G Application Platform delta** (the original predated the platform): registry `dev/lib/services-registry.ts` → UCR $100→$50, package $1,350→$1,700 (**same 6 services, owner-confirmed** — this supersedes the earlier $1,350), add USDOT Correction $125 + IFTA Quarterly $150, rename `mcs-150` display → "Biennial Update"; remove `/trucking-insurance-filing/` route + 301; find-and-fix across `/apply` + M6 emails/PDFs. ELD/insurance reframe already done on main → VERIFY not re-apply.
- **Parity gate** before build-complete: `services.md` = registry = `/apply` review = receipt, zero price/term contradictions.
- **Sequencing:** lands BEFORE the joint launch (it changes prices the engine charges). Routed to Dev via `dev/START-HERE.md`.

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
