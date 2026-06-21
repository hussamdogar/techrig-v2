# Handoff: Dev to SEO (migration deliverables implemented)

From Dev, 2026-06-21. Implements the three pre-launch actions in `handoff-to-dev.md` (redirect map, blog disposition, crawl union). All Dev-side work is built and verified; two items below need the SEO/Operations tools or a confirmation.

## 1. Blog posts: built at the ROOT URL, not under /blog/  (please confirm)
**Decision and why.** `handoff-to-dev.md` suggested a `/blog/[slug]/` route, but the live posts are published at the **site root** (`/{slug}/`, confirmed from `post-sitemap.xml`), and `blog-disposition.md` says KEEP = preserve the URL. The prune map also redirects `dispatchers-vs-brokers...` to `/freight-broker-vs-dispatcher/`, a KEEP post that therefore must exist at the root. Building under `/blog/` would change those URLs and break the preserve-rankings directive. So the ~42 KEEP posts render at their original root URLs via a root-level `app/[slug]/` dynamic route.

If SEO actually intended to relocate the blog under `/blog/` (accepting root-to-/blog 301s), say so and Dev will switch; the current build preserves the exact ranking URLs.

**What was built.**
- 42 KEEP posts migrated to `dev/content/blog/<slug>.md` (existing copy, brought off the live site). Each resolves at `/<slug>/` and does not 404.
- Each post: H1, byline (alias reviewer), Article + BreadcrumbList JSON-LD, a unique generated OG image, and an interlink UP to its money page on the assigned 1 to 3 word anchor (woven inline plus a short footer link).
- Added every KEEP post URL to `sitemap.xml` (they were missing).
- `navigating-the-road-10-common-challenges-in-trucking-dispatch` retitled to "10 Common Challenges in Trucking Dispatch" (slug/URL unchanged), per the disposition note to drop "navigating".

**For Operations (content-writer), post-launch:** the bodies are migrated copy at launch grade, not yet polished to `standards.md`. Titles may exceed 60 chars and Three Kings placement is not enforced on the posts; descriptions are fresh at 150 to 160 chars. The 5 priority posts retained their ranking content (title token, H1 intent, body depth). One glance for QA: the priority DOT/MC post states the FMCSA filing fee as `$300` as editorial fact (not a Tech Rig service price).

## 2. Redirects (`next.config.ts`)
Implemented `redirect-map.md` B/C/D plus the 18 prune redirects. Notes:
- `permanent: true` (HTTP 308) per the handoff instruction. 308 is a permanent redirect and passes signals like a 301; if you need a literal 301 status, Dev can switch to `statusCode: 301`.
- Silo catch-alls keep the two built `/cost/` pages (box-truck, dry-van) serving; the other three silos' `/cost/` collapses to the hub as specified.
- Verified live: every rule class redirects in one hop, every redirect target returns 200, no chains, no hub self-loops.

## 3. Crawl union (migration-plan step 0): needs your tools
Dev-side verification is done (the sitemap-derived source set is fully covered, 0 chains). The off-sitemap catch still needs the SEO/Operations tools, which Dev cannot run here:
- Screaming Frog crawl of the live site + GSC indexed-URL export + GA4 landing pages, unioned, checked so every real URL is a built route or a 301.
- A staging crawl after deploy: confirm 0 unexpected 404s and 0 redirect chains against the real indexed set.

## Verification done
Clean production build (160 prerendered pages). All 42 post URLs return 200; money pages are not shadowed by the root `[slug]` route; unknown root slugs 404; the prune-to-KEEP redirect lands on a real page. Live on the preview tunnel.
