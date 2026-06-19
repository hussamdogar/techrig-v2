# Project Track: Revamp of a Live Site (run inside seo/)

The shared persona, standards, and `project_config.md` load via the root CLAUDE.md. If invoked bare, read `../_shared/persona.md`, `../_shared/standards.md`, and `../project_config.md` first.

Run one phase at a time. Save, present, and STOP for review after each. Preserving rankings is the prime directive: keep existing URLs unless there is a documented reason to change one.

Data sources:
- DataForSEO (`mcp__dfs-mcp__*`): primary for keyword, SERP, difficulty, and competitor data.
- Semrush (MCP): backlinks and authority in Phase 5, gap keywords in Phase 6, and the failover for DataForSEO (retry once, then Semrush, log it).
- Google Search Console and GA4: first-party performance only (Phase 3), via scripts. Not for keyword discovery.
- Never fabricate a metric. Null if unknown.

Outputs: cross-workspace contract to `../shared/`; working docs to `output/` and `reports/`.

## Phase 0: Intake
Confirm PROJECT TYPE = Existing revamp in `project_config.md`. Read the sitemap URL. Restate the goal and confirm whether a redesign (URL or structure change) is in scope.
Gate: confirm.

## Phase 1: Crawl and extraction
Crawl the live site from the sitemap. Inventory every URL with its purpose, a current content summary, and on-page basics. Extract business and offer information.
Save: `output/site-inventory.md`. Then populate the working context files from what you have, asking the user only for gaps:
- `context/services.md`: from the services and proof found in the crawl; confirm with the user and fill gaps.
- `context/author.md`: ask the user for the byline (person or team name), avatar or logo URL, and profile URLs.
- `context/tone-of-voice.md`: draft from the site's current voice and the voice notes in `project_config.md`, with 2 to 3 sample sentences; confirm with the user.
- `context/brand-guidelines.md`: draft from the brand rules and constraints in `project_config.md` (banned words, regulated claims, competitor exclusions); confirm with the user.
- `context/experience-notes.md`: ask the user for 2 to 3 real, publishable client stories or numbers. If none, leave it empty (the content writer runs research-only).
Gate: review.

## Phase 2: ICP check
Determine whether an ICP is clearly defined and actually targeted on the current site. If not, run ICP research as in the new-build Phase 1.
Save: `../shared/icp.md`, and write `context/audience.md` as the working ICP for the content engine.
Gate: review.

## Phase 3: Performance audit
Using Google Search Console (ranking queries, pages, impressions, CTR) and GA4 (traffic, engagement, conversions), plus an on-page review, identify what works, what underperforms, search-intent mismatches, keyword cannibalisation, thin or weak pages, and technical issues. Since the money pages are live here, write `context/audit-urls.txt` with the homepage plus the existing live money-page URLs, so System 3 can audit them immediately.
Save: `output/audit.md`, structured as: what is working / what is missing / search-intent mismatch / weak sections / authority gaps / internal-linking gaps / conversion improvements / clear next actions.
Gate: review.

## Phase 4: Pre-migration plan (only if redesign is in scope)
Protect rankings. Keep URLs and the existing sitemap. Where a URL must change, define a 301 redirect map. List the metadata, headings, internal links, and structured data that must be preserved or improved. Define a pre-launch and post-launch checklist.
Save: `output/migration-plan.md`
Gate: review.

## Phase 5: Competitor research and authority audit
Same as new-build Phase 2: DataForSEO for ranking and content structure, Semrush for backlink and authority comparison.
Save: `output/competitors.md`, and write `context/competitors.md` (the working summary the content writer uses to avoid citing competitors).
Gate: review.

## Phase 6: Keyword research
Combine existing GSC keywords with DataForSEO data and add gap and opportunity keywords (Semrush for competitor gap terms). Use the same table as new-build Phase 3.
Save: `output/keywords.md`
Gate: review.

## Phase 7: Keyword mapping
Map primaries and secondaries to existing URLs first, then to any new URLs. Mark each page as refresh, merge, or new. Resolve cannibalisation.
Save: `../shared/keyword-map.md` and `../shared/sitemap-plan.md`
Gate: review.

## Phase 8: Post-migration strategy
Same structure as new-build Phase 5, framed around upgrading existing assets rather than building from zero.
Save: `output/strategy.md`
Gate: review.

## Phase 9: Page briefs and copy (page by page)
Same brief and standards as new-build Phase 6. Respect existing URLs.
Save: `../shared/page-briefs/<slug>.md`
Gate: review per page or batch.

## Phase 10: Site-wide QA and migration safety check
Run the full standards QA pass, then verify redirects, preserved URLs, and that no high-performing page has lost its ranking signals. Consolidate JSON-LD into `../shared/schema-specs.md`. Seed the operations engine: write `context/seed-keywords.txt` from the strategy.
Save: `reports/qa-report.md`
Gate: sign-off, then hand off to Dev and Design via `../shared/`.
