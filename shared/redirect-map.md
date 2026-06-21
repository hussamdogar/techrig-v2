# Redirect map (301) for Dev

For Dev to implement in `dev/next.config.ts` via `redirects()` with `permanent: true` (301). Built from the live sitemaps (page-sitemap.xml + post-sitemap.xml, retrieved 2026-06-20) plus the known off-sitemap pages. The new site uses `trailingSlash: true`, so sources and targets carry the trailing slash.

Rules: one hop, no chains, no loops. Update any internal link that points at a retired URL to the final target (do not rely on the redirect). Anything not listed here and not a built route must still be caught by the crawl-union pass (migration-plan step 0) before launch. Blog posts are handled separately in `blog-disposition.md`.

## A. KEEP (built routes, no redirect)
Home; `/services/`; all six dispatch hubs (`/box-truck-dispatch/`, `/dry-van-trucking/`, `/reefers-trucking/`, `/flatbed-dispatch/`, `/power-only-trucking/`, `/hot-shot-trucking/`); the two `/cost/` pages (`/box-truck-dispatch/cost/`, `/dry-van-trucking/cost/`); the 4 state pages; `/lead-generation/`, `/about-us/`, `/contact-us/`, `/referral-program/`, `/blog/`; legal (`/terms-of-service/`, `/privacy-policy/`, `/power-of-attorney/`, `/refund-policy/`); and all NEW compliance/bridge pages. Do NOT redirect these.

## B. Exact-match 301s (named pages)
| Old URL | 301 target | Why |
|---|---|---|
| `/home-backup/` | `/` | Orphan duplicate of old homepage |
| `/clone-home/` (off-sitemap) | `/` | Orphan clone |
| `/start-compliance/` (old ad page) | `/compliance-services/` | Hub built as a new URL; this ad slug folds in |
| `/introduction/` | `/how-to-start-a-trucking-company/` | Onboarding explainer, superseded by the pillar |
| `/step-by-step-process/` | `/how-to-start-a-trucking-company/` | Same |

Leave `/single-payment/` and `/get-started/` as functional `noindex` transactional pages (do not 301). The `boc-3.` / `form.` subdomains are unchanged.

## C. Dispatch silo sub-pages → silo hub (301)
Every deep sub-page under a trailer silo collapses to that silo's hub, EXCEPT the `/cost/` pages (kept). Implement as a per-silo rule: redirect `/{silo}/:sub*` to `/{silo}/` with `/cost/` excluded.

Silos and the sub-paths to redirect (from the live sitemap):
- **`/reefers-trucking/`** ← what-is-reefer-dispatching, finding-loads, load-boards, negotiating-rates, route-planning, compliance, technology, technology/introduction, challenges, success-stories, choosing-dispatcher, reefer-vs-other-truck-dispatching, efficiency, training, legal-aspects, insurance, environmental-impact, innovations, customer-service. (KEEP `/reefers-trucking/cost/`? It is NOT a built route, so 301 `/reefers-trucking/cost/` → `/reefers-trucking/` too. Only box-truck and dry-van `/cost/` are built.)
- **`/flatbed-dispatch/`** ← what-is-flatbed-dispatching, finding-loads, benefits, load-boards, negotiating-rates, route-planning, compliance, technology, challenges, success-stories, cost, choosing-dispatcher, flatbed-vs-other, efficiency, training, legal-aspects, insurance, environmental-impact, innovations, customer-service.
- **`/box-truck-dispatch/`** ← what-is-box-truck-dispatching, benefits, finding-best-loads, load-boards, negotiating-rates, route-planning, compliance, technology, common-challenges, success-stories, choosing-dispatcher, box-vs-other, efficiency, training, legal-aspects, insurance, environmental-impact, innovations, customer-service. (KEEP `/box-truck-dispatch/cost/`.)
- **`/dry-van-trucking/`** ← what-is-dry-van-dispatching, benefits, finding-loads, load-boards, negotiating-rates, route-optimization, technology, challenges, choosing-dispatcher, customer-service, dry-vs-other, efficiency, training, legal-aspects, insurance, environmental-impact, innovations, success-stories. (KEEP `/dry-van-trucking/cost/`.)
- **`/power-only-trucking/`** ← what-is-power-only-dispatching, benefits, finding-loads, load-boards, negotiating-rates, route-planning, technology, success-stories-in-power-only-dispatching, compliance, cost, choosing-dispatcher, power-vs-other, challenges.

## D. Reefer "benefits" tree → 301
The ~20 benefit pages and the deep compliance-assistance encyclopedia (~30) under `/reefers-trucking/benefits/`:
- `/reefers-trucking/benefits/` and `/reefers-trucking/benefits/:slug` (time-saving, increased-earnings, reducing-stress, access-to-better-loads, professional-negotiation, improved-route-planning, enhanced-customer-service, financial-management, reduced-downtime, streamlined-communication, market-insights, access-to-technology, risk-management, work-life-balance, expertise-load-types, maximizing-utilization, long-term-relationships, industry-knowledge) → **`/reefers-trucking/`**.
- `/dry-van-trucking/benefits/flexibility-scalability/` (mis-nested) → **`/dry-van-trucking/`**.
- `/reefers-trucking/benefits/compliance-assistance/` and its children → the compliance silo. Catch-all to `/compliance-services/`, with these higher-value specific overrides:
  - `eld-mandate/`, `hos-regulations/` → `/eld-services/`
  - `csa-scores/`, `safety-violations/`, `audits-checks/`, `safety-standards/` → `/fmcsa-clearinghouse-registration/`
  - `driver-training/`, `record-keeping/`, `compliance-training-programs/` → `/driver-qualification-files/`
  - `insurance-requirements/` → `/trucking-insurance-filing/`
  - everything else (regulatory-requirements, vehicle-maintenance, using-technology, environmental-compliance, accident-reporting, health-safety-protocols, hazardous-materials, risk-management, future-trends, dispatch-software, gps-tracking, introduction) → `/compliance-services/`

## E. Implementation note
Express C and D as Next.js `redirects()` entries. Where a `source` pattern would also catch a KEEP page (the `/cost/` children, or the silo hub itself), list the KEEP exception first or use explicit `source` paths so the hub and cost pages are never redirected. After deploy, run a staging crawl: 0 unexpected 404s, 0 redirect chains, every old indexed URL resolves in one hop.
