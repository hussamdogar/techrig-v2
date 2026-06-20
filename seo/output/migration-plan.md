# Pre-Migration Plan: techrig.org revamp

Redesign is in scope (URL + structure changes allowed). Prime directive: **preserve existing rankings and organic clicks through the restructure.** This plan sets the URL governance, the redirect framework, the on-page signal preservation rules, the analytics fix, and the pre/post-launch checklists. The detailed per-URL redirect map is finalized in Phase 7 once the new sitemap exists; this plan defines the rules and the known entries so far.

## 1. Governance: every live URL lands in one of five buckets
1. **PRESERVE** — keep URL exactly, keep/improve on-page signals. (Ranking and high-traffic pages.)
2. **REPURPOSE** — keep the existing URL/slug, change its role: expand into a full organic money page, make indexable. (The old Ads compliance pages — see §4.)
3. **CONSOLIDATE** — merge thin pages into a stronger parent; 301 the old URL to the parent. (Thin sub-silos.)
4. **NEW** — net-new URL for pivot topics that have no existing page (e.g. UCR, LLC setup, "how to start a trucking company" hub).
5. **TRANSACTIONAL (non-organic)** — funnel/payment pages left as-is and `noindex`. (`/single-payment`, `/get-started`, and the `boc-3.`/`form.` subdomain forms.)

No URL changes, removals, or merges happen outside this map. Default action when uncertain = PRESERVE.

## 2. Complete live-URL inventory comes FIRST (pre-launch step 0)
The XML sitemap does **not** represent the true live set: GA4 surfaced live pages absent from it (`/about-us`, `/clone-home`, `/home-backup`, `/single-payment`, `/get-started`, plus the Ads pages). Before any redirect is written:
- **Dev/SEO run a full crawl** (e.g. Screaming Frog) of techrig.org + a GSC "Pages" indexed-URL export + the GA4 landing-page list, and union them into one master URL list. Every URL in that union must be assigned a bucket. This is the source of truth for the redirect map, not the sitemap.
- Known URL groups already identified (from sitemap + GSC + GA4):
  - ~155 sitemap pages (homepage, /services/, /lead-generation/, /contact-us/, legal, 4 state pages, 6 dispatch silos with ~18 sub-pages each, ~30-page reefer compliance sub-silo).
  - 60 blog posts.
  - Off-sitemap live pages: `/about-us/`, `/clone-home`, `/home-backup`, `/single-payment`, `/get-started`.
  - Ads landing pages: `/dot-registration`, `/mc-registration`, `/mc-dot-registration`, `/start-compliance`.

## 3. PRESERVE register — protect these URLs and their signals
These earn the clicks/impressions. Keep the URL; you may improve content but must retain the ranking signals listed.

| URL | Why protected (12-mo GSC/GA4) | Signals to preserve |
| --- | --- | --- |
| `/` | Brand pos 1-2; 165 clicks | Brand title token, H1 intent, NAP, internal links to money pages |
| `/box-truck-dispatch/` | Franchise: 82 clicks, 32.6k impr, pos 23 | Title/H1 targeting "box truck dispatch", body depth, FAQ, internal links |
| `/box-truck-dispatch/cost/` | 54 clicks, 26.5k impr, pos 12 | "box truck dispatch cost" targeting, pricing content |
| `/lead-generation/` | 70 clicks, pos 12.7; pivot-adjacent | "brokers that work with new authority" targeting; broker-list asset |
| `/dry-van-trucking/` + `/dry-van-trucking/cost/` | 22 + 14 clicks, high impr | Trailer-type + cost targeting |
| `/power-only-trucking/`, `/flatbed-dispatch/`, `/reefers-trucking/`, `/hot-shot-trucking/` | Silo hubs with impressions | Hub titles/H1, internal links to retained sub-pages |
| `/contact-us/` | pos 5.0; NAP/conversion | NAP, schema, contact methods |
| `/about-us/` | Live, engaged, pos 4.1 — **add to sitemap** | Keep URL; index it |
| Blog winners: `/what-is-load-to-truck-ratio/` (pos 8.9), `/how-to-find-a-dispatcher-for-a-box-truck/`, `/navigating-the-road-10-common-challenges-in-trucking-dispatch/` | Best-ranking informational | Keep URLs; refresh content; interlink up to money pages |
| `/how-to-get-dot-and-mc-number.../` | 14.4k impr but pos 49 | **Keep URL, upgrade heavily**; becomes a feeder into the new compliance silo (do not delete — latent demand) |

## 4. Old Ads compliance pages — REPURPOSE into organic money pages
`/dot-registration`, `/mc-registration`, `/mc-dot-registration`, `/start-compliance` were built for **old Google Ads campaigns**. The client has **no active ad campaigns now**, so there is nothing to protect. They have clean slugs, real traffic history, and the highest engagement on the site (51-85%). Decision: **repurpose them as the canonical organic compliance money pages.**
- **Keep the existing URLs/slugs** (preserves any historical equity and avoids a redirect). DOT and MC stay **separate** pages (business confirmed).
- **Flip from `noindex` to indexable**, add to the XML sitemap, and confirm canonical to self (pre-launch QA item — verify current robots/meta state first).
- **Expand into full money pages** in Phase 9: real content depth (1500+ words for service pages), Three Kings keyword placement, FAQ, schema, internal links, single CTA into the `form.`/`boc-3.` conversion endpoints.
- **These become the home of the relocated reefer compliance content** (§5) and the targets that the upgraded `how-to-get-dot-and-mc-number` blog post links into.
- Likely roles (confirm exact mapping in Phase 7 keyword mapping):
  - `/dot-registration` → USDOT number / DOT registration money page.
  - `/mc-registration` → MC number / operating authority money page.
  - `/mc-dot-registration` → combined DOT+MC "get your authority" page (keep distinct intent from the two above to avoid cannibalization, or make it the silo hub).
  - `/start-compliance` → compliance/company-setup hub or the funnel entry; resolve hub-vs-page role in Phase 7.
- **Net-new compliance URLs** are still needed for topics with no existing page (UCR, LLC registration, drug & alcohol consortium, biennial updates, "how to start a trucking company" pillar) — bucket NEW.
- **`/single-payment` and `/get-started`** are transactional funnel pages, not topical targets: leave as-is and `noindex` (bucket TRANSACTIONAL).

## 5. CONSOLIDATE candidates — 301 to parent (finalize targets in Phase 7)
Provisional; exact targets depend on the Phase 7 sitemap. Rule: thin sub-page with negligible clicks → 301 to its silo hub or to a merged guide; preserve any sub-page that has its own clicks.
- **Reefer compliance sub-silo** (`/reefers-trucking/benefits/compliance-assistance/*`, ~30 pages): relocate the genuinely useful compliance content into the repurposed compliance pages (§4) and the NEW compliance URLs; 301 each old deep URL to the matching compliance page (or to the compliance hub). This is the largest consolidation.
- **Per-silo thin sub-pages** (~18 per silo: finding-loads, load-boards, negotiating-rates, route-planning, technology, training, legal-aspects, environmental-impact, innovations, etc. with ~0 clicks): merge into the silo hub or a small number of substantive sub-pages; 301 the rest to the hub. Keep `/cost/` sub-pages (they rank).
- **Orphans/clones:** `/clone-home`, `/home-backup`, `/single-payment` (if not an active Ads page) → 301 to the most relevant live page (homepage or services) or remove with a 301; never leave a 404.

## 6. On-page signal preservation rules (applies to every PRESERVE/refresh page)
When content is rewritten on a retained URL, the Dev/Content handoff must keep:
- **Title tag**: keep the primary keyword token that earns the ranking; may improve wording within 60 chars incl. brand.
- **Meta description**: one unique 150-160 char description per page (many are currently missing — add, do not remove).
- **H1**: keep the page's core intent; one H1 per page.
- **H2s**: keep the primary keyword in ≥2 H2s on money pages (Three Kings).
- **Internal links**: keep existing inbound internal links working; never orphan a retained page.
- **Structured data**: preserve existing valid JSON-LD; add the types specified in `shared/schema-specs.md` (Phase 10).
- **Media/alt**: preserve image alt text on ranking pages.

## 7. Redirect map mechanics
- All redirects are **301** (permanent), one hop, no chains, no loops. Update internal links to point at the final URL (don't rely on the redirect).
- Map lives as a spec in `shared/` for Dev to implement at the server/WordPress level.
- Preserve query strings where relevant; force HTTPS and a single host (www vs non-www — confirm canonical host).
- Keep the XML sitemap updated to list only final 200 URLs (add `/about-us/`; remove consolidated URLs).
- Add the new compliance pages to the sitemap on launch.

## 8. Analytics fix (hand to Dev — closes the conversion-tracking gap)
GA4 recorded **0 key events for 12 months**. Specify these GA4 key events so lead performance is measurable from launch:
- `generate_lead` — submit on `form.techrig.org` intake form.
- `boc3_filing_start` / `boc3_filing_complete` — BOC-3 form on `boc-3.techrig.org`.
- `click_to_call` — clicks on `tel:+19179092257`.
- `whatsapp_click` — WhatsApp contact clicks.
- `consultation_booked` — booking confirmation.
Mark `generate_lead`, `boc3_filing_complete`, and `consultation_booked` as conversions. Ensure cross-domain measurement between techrig.org and the `form.`/`boc-3.` subdomains so the funnel is attributable end to end.

## 9. Pre-launch checklist
- [ ] Full-crawl URL union built; every URL assigned a bucket (§2).
- [ ] 301 map complete, reviewed; no chains/loops; every removed/changed URL has a target.
- [ ] PRESERVE pages retain title/meta/H1/H2/internal-link/schema signals (§6).
- [ ] Repurposed compliance pages (§4) flipped to indexable, canonical-to-self, added to sitemap, content expanded, internally linked.
- [ ] New compliance pages (UCR, LLC, setup pillar) indexable, in sitemap, internally linked.
- [ ] `/single-payment`, `/get-started` confirmed `noindex` (transactional).
- [ ] `/about-us/` added to sitemap; orphans/clones redirected or removed.
- [ ] XML sitemap regenerated to final 200 URLs; submitted in GSC.
- [ ] robots.txt allows the new silo; canonical host + HTTPS enforced.
- [ ] GA4 key events implemented and firing in DebugView (§8).
- [ ] Staging crawl: 0 unexpected 404s, 0 redirect chains, correct canonicals.
- [ ] Standards QA pass (Phase 10) green.

## 10. Post-launch checklist (first 30-60 days)
- [ ] Submit updated sitemap; request indexing for new compliance pages and upgraded `how-to-get-dot-and-mc-number`.
- [ ] GSC Coverage: watch for spikes in 404s / "crawled not indexed"; fix redirects same-week.
- [ ] Monitor the PRESERVE pages' impressions/clicks/position weekly vs the pre-launch baseline in this audit; investigate any drop >20%.
- [ ] Confirm 301s resolve in one hop (live crawl).
- [ ] Watch GA4 key events populate; verify funnel attribution across subdomains.
- [ ] Track new compliance pages entering the index and their first impressions.

## Baseline to protect (from Phase 3, 12 mo)
Sitewide: ~600 clicks, ~281k impressions, CTR 0.22%, avg pos 27. Top assets to watch: box-truck-dispatch (82c) + cost (54c), lead-generation (70c), homepage brand (165c), dry-van (22c). Any of these losing clicks post-launch is a migration regression to fix immediately.
