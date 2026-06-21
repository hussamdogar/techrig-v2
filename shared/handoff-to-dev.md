# Handoff to Dev (from SEO)

From SEO, 2026-06-21. The Dev build covers every page in the planned sitemap (verified). Two old-site migration items remain before launch, and the concrete specs are now written. Both protect existing organic traffic, which is the migration prime directive.

## 1. Build the blog posts (or they 404 on launch)
The build has a `/blog/` hub but no post routes. The old site has 60 posts, ~42 of which must keep their existing URLs (they rank or feed money pages). As built, those URLs 404 and we lose the impressions.
- **Spec:** `shared/blog-disposition.md` lists every post as KEEP-and-rebuild (with the interlink-up target) or 301-and-prune.
- **Action:** add a `/blog/[slug]/` dynamic route (or per-post pages) for the ~42 KEEP posts. Content can be the migrated existing copy; the Operations Track polishes to standards later, but the URLs must resolve at launch.
- **Priority posts** (preserve ranking content): `how-to-get-dot-and-mc-number...` (~14.4k impressions), `what-is-load-to-truck-ratio`, `freight-broker-vs-dispatcher`, `how-to-find-a-dispatcher-for-a-box-truck`, `navigating-the-road-10-common-challenges...`.

## 2. Implement the 301 redirects (or ~150+ old URLs 404)
`next.config.ts` has no `redirects()` yet. The retired thin sub-silos, the reefer compliance encyclopedia, the orphans, and `/start-compliance/` all need 301s.
- **Spec:** `shared/redirect-map.md` (pages) + the 18 prune redirects in `shared/blog-disposition.md`.
- **Action:** add them to `redirects()` with `permanent: true`. Keep the silo hubs and the two built `/cost/` pages OUT of the redirect rules (they are KEEP). One hop, no chains.

## 3. Before launch (migration-plan step 0)
Run the full live-URL crawl union (Screaming Frog + GSC indexed export + GA4 landing pages) and confirm every real URL is either a built route or has a 301. The sitemap-derived maps above cover the known set; the crawl union catches anything off-sitemap. Then a staging crawl should show 0 unexpected 404s and 0 redirect chains.

## Already verified (no action)
Every planned page is built with trailing slashes; the repurposed ad pages (`/dot-registration/`, `/mc-registration/`, `/mc-dot-registration/`) keep their URLs; `/about-us/` is present; OG image routes, sitemap.xml, robots.txt exist. Remaining content `[VERIFY]`/proof items are tracked in `qa-report.md` Section E.
