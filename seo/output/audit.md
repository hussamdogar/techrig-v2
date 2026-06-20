# Performance Audit: techrig.org

Data: Google Search Console + GA4 (Composio), 12 months 2025-06-01 to 2026-06-16, US. On-page review from the Phase 1 crawl. Metrics are first-party; nothing here is fabricated.

## Headline numbers
| Source | Metric (12 mo) | Value | Read |
| --- | --- | --- | --- |
| GSC | Clicks | ~600 | Very low for the impression base |
| GSC | Impressions | ~281,000 | Large footprint, mostly unconverted |
| GSC | Sitewide CTR | 0.22% | Severely depressed (page 2-3 rankings) |
| GSC | Avg position | 27.2 | Most ranking is page 3+ |
| GA4 | Sessions | 5,238 | |
| GA4 | Users | 3,929 | |
| GA4 | Engagement rate | 45% | Healthy overall; organic is 64% |
| GA4 | Avg session | 186s | Reasonable |
| GA4 | **Key events (conversions)** | **0** | **No conversion tracking configured** |

Plain read: the site has built a wide thin-content footprint that earns ~281k impressions but converts almost none of it to clicks (0.22% CTR), because almost everything ranks on page 3+. Brand queries ("techrig," "tech rig") account for ~half of all organic clicks. The non-brand engine that works is **box truck dispatch**; the pivot topics (compliance/setup) rank terribly or are not indexed at all.

## What is working
- **Box truck dispatch is the franchise.** `/box-truck-dispatch/` (82 clicks, 32,622 impr, pos 23) and `/box-truck-dispatch/cost/` (54 clicks, 26,507 impr, pos 12) are the top non-brand pages by a wide margin. Query cluster "box truck dispatch / dispatcher / dispatching services" ranks 12-21 with thousands of impressions. This is the clearest defend-and-grow asset.
- **Lead-generation / new-authority page.** `/lead-generation/` (70 clicks, pos 12.7) ranks for "brokers that work with new authority / 30 day authority." This is pivot-adjacent (segment A, brand-new carriers) and already performs — a bridge between the dispatch base and the compliance pivot.
- **Brand demand exists.** "techrig"/"tech rig" rank 1-2 at 13-25% CTR. There is real brand search to capture and route.
- **A few blog posts rank well:** `/what-is-load-to-truck-ratio/` (18 clicks, pos 8.9 — best non-brand position on the site), `/how-to-find-a-dispatcher-for-a-box-truck/` (pos 19), `/navigating-the-road-10-common-challenges...` (pos 7.3).
- **Organic visitors engage.** Organic Search is only ~19% of sessions (988) but the highest engagement rate (64%) of any channel, and the dispatch hub pages run 69-71% engagement.

## What is missing
- **The pivot has no organic visibility.** No compliance/setup term (BOC-3, USDOT, MC number, UCR, LLC, "how to start a trucking company") appears in the ranking query set. The single closest page, the blog post `/how-to-get-dot-and-mc-number.../` , sits at **position 49** on 14,414 impressions with 6 clicks. The highest-value topic for the business is its weakest organic asset.
- **Compliance landing pages exist but are invisible to search.** GA4 shows real, highly engaged traffic to `/dot-registration` (281 sessions, 57% eng), `/mc-registration` (197, 62%), `/mc-dot-registration` (166, 51%), `/start-compliance` (27, 85% eng), `/get-started` (21, 86%). **None are in the sitemap or the GSC organic data** — they receive Direct/Paid traffic only. These are money pages with zero organic equity; making them indexable, content-complete SEO pages is the largest single opportunity.
- **Conversion measurement.** GA4 records 0 key events. The business cannot see which pages or channels produce leads/calls. Flag to Dev/analytics: configure key events (form submit on form.techrig.org, BOC-3 filing start, tel: click, WhatsApp click) before/with launch.
- **A consistent service hub.** `/services/` is stale (dispatch-only, no compliance) and low traffic.

## Search-intent mismatch
- **State pages are mis-pointed.** `/tech-rig-dispatch-[state]/` are written as dispatch pages, but per the business they originate from state-level *compliance* clients. The page intent does not match the acquisition motion that creates these clients. Realign to lead with state compliance/setup (Phase 7).
- **Informational blog posts ranking for their topic but not converting.** High-impression posts (`what-is-the-best-gps-app`, `how-much-is-commercial-insurance-for-hot-shot`, `eta-etd`, `what-is-eld` at 5,121 impr / 0 clicks / pos 64) pull informational impressions with no commercial path. Either tighten intent + interlink to money pages, or accept them as top-of-funnel and add a clear next step.
- **Homepage ranks for brand (pos 1-2) but poorly for non-brand (pos 42).** It is doing brand-capture, not category ranking. That is fine if the money pages carry category intent, which today they only partly do.

## Weak / thin sections
- **Programmatic sub-silos.** Each dispatch silo repeats ~18 sub-pages; many have thousands of impressions but pos 20-64 and ~0 clicks (e.g. `/power-only-trucking/finding-loads/` 3,915 impr / 2 clicks; `/flatbed-dispatch/legal-aspects/` 4,856 impr / 1 click). They dilute crawl budget and internal equity without converting.
- **The ~30-page reefer compliance sub-silo** (`/reefers-trucking/benefits/compliance-assistance/*`) is the mislocated, thin version of exactly the content the pivot needs at the top level.
- **Orphan/duplicate pages:** `/clone-home` (32 sessions), `/home-backup`, `/single-payment` — clones and stray funnel pages that should be removed or noindexed.

## Authority gaps
- Average position 27 across the board indicates low domain authority relative to competitors on commercial dispatch terms; the site ranks because of volume of pages, not strength. (Quantify referring domains / authority score in Phase 5 via Semrush.)
- No topical authority cluster exists for compliance/setup — the highest-intent, highest-margin topic.

## Internal-linking gaps
- The winning pages (box-truck-dispatch, lead-generation) are not used as hubs to pass equity to the pivot pages (which are not even indexed).
- No funnel interlink from setup/compliance content to dispatch, or vice versa, despite the funnel being the core business model.
- Strong blog posts (load-to-truck-ratio, dispatcher-for-box-truck) do not link up to the box truck money page.

## Conversion improvements
- Install GA4 key-event tracking (above) — currently flying blind.
- Add a single clear next step to high-impression informational pages (they currently leak attention).
- Route brand search and Direct traffic (the biggest channel, 2,750 sessions, lowest engagement 36%) to a coherent services hub rather than a stale `/services/` page.
- Make the compliance landing pages indexable and content-rich so they earn the organic traffic their topics clearly generate (the blog post on DOT/MC numbers alone shows 14k impressions of latent demand).

## Clear next actions (feed Phases 4-9)
1. **Build the compliance/setup silo on-domain** as indexable money pages (BOC-3, USDOT, MC number, UCR, LLC, "how to start a trucking company" hub). Fold in / relocate the reefer compliance sub-silo content. Highest priority.
2. **Convert the existing `/dot-registration`, `/mc-registration`, `/mc-dot-registration`, `/start-compliance` landing pages into SEO-complete, indexed pages** (or 301 them into the new silo) — resolve the duplication between them and decide canonical URLs in Phase 4/7.
3. **Defend and deepen box truck dispatch** (the one franchise) and use it + lead-generation as hubs.
4. **Consolidate the thin per-silo sub-pages** (refresh/merge/prune) — Phase 7, with 301s.
5. **Realign state pages to state-level compliance** intent and plan an expansion play.
6. **Fix orphans/clones** (`/clone-home`, `/home-backup`, `/single-payment`) and resolve `/about-us` (live, engaged, not in sitemap).
7. **Hand analytics gap to Dev:** configure GA4 key events before launch.

## Pages NOT in the public sitemap but live and receiving traffic (reconcile in Phase 4)
`/dot-registration`, `/mc-registration`, `/mc-dot-registration`, `/start-compliance`, `/get-started`, `/single-payment`, `/about-us`, `/clone-home`. Several are the pivot's de facto money pages. The sitemap does not represent the true live URL set; the migration plan must inventory these.
