# Project Track: New Build (run inside seo/)

The shared persona, standards, and `project_config.md` load via the root CLAUDE.md. If invoked bare, read `../_shared/persona.md`, `../_shared/standards.md`, and `../project_config.md` first. They are the floor; this prompt adds the process.

Run one phase at a time. After each phase, save the artifact, present it, and STOP for review before the next. Do not skip ahead.

Data sources:
- DataForSEO (`mcp__dfs-mcp__*`): primary for keyword volume, ideas, difficulty, related terms, SERP, and competitor ranking data.
- Semrush (MCP): backlinks and authority (referring domains, anchor profile, authority score, toxic links) in Phase 2, and the failover if a DataForSEO call fails or returns empty (retry once, then Semrush, log the failover).
- Never fabricate a metric. Null if unknown.

Outputs:
- Cross-workspace contract for Design and Dev: `../shared/`.
- SEO working docs: `output/` and `reports/`.

## Phase 0: Intake
Confirm PROJECT TYPE = New build in `project_config.md`. If offers or services are missing, ask now. Restate the goal in two lines and the page-type scope you expect to produce.
Gate: user confirms scope.

## Phase 0b: Context setup (populate the working context files)
Fill `context/` by research and a short intake, not by leaving it for the user. Other context files (`audience.md`, `competitors.md`) are written by the phases below.
- `context/services.md`: draft from the offers in `project_config.md`; if the business has an existing live site, fetch it and extract the real services and proof. Confirm with the user and ask only for the gaps the site and config do not cover.
- `context/author.md`: ask the user for the byline (person or team name), avatar or logo URL, and profile URLs (LinkedIn, X, YouTube, GitHub). Write what they give, leave the rest blank.
- `context/tone-of-voice.md`: draft from the voice notes in `project_config.md` and, if a site exists, its current voice. Include 2 to 3 sample sentences. Confirm with the user.
- `context/brand-guidelines.md`: draft from the brand rules and constraints in `project_config.md` (banned words, regulated claims, competitor exclusions). Confirm with the user.
- `context/experience-notes.md`: ask the user for 2 to 3 real client stories or operational observations they can publish, with numbers where possible. If they have none, leave it empty: the content writer will run research-only and invent nothing.
Gate: review.

## Phase 1: ICP research
Define the ideal customer, their problems, buying triggers, objections, and the language they use. Map each to a funnel stage and the intent types they search with.
Save: `../shared/icp.md`, and write `context/audience.md` as the working ICP for the content engine.
Gate: review.

## Phase 2: Competitor research and authority audit
Identify 3 to 5 real competitors. With DataForSEO, pull what they rank for, their top pages, and their content structure. With Semrush, pull their backlink and authority profile and compare it to this site's current authority. Summarise their strategy and the gaps you can win. State plainly what is copyable and what is not.
Save: `output/competitors.md`, and write `context/competitors.md` (the working summary the content writer uses to avoid citing competitors).
Gate: review.

## Phase 3: Keyword research
Build the target keyword set with DataForSEO metrics. One winnable primary per intended page plus secondaries. List head terms as themes only.
Save: `output/keywords.md` using this table:

| Keyword | Intent | Funnel Stage | Difficulty | Volume | Business Value | Recommended Page Type | Priority |
|---|---|---|---|---|---|---|---|

Gate: review.

## Phase 4: Keyword mapping and URL plan
Map one primary plus secondaries to each URL. Produce the planned sitemap (slugs), the content bucket per URL, and the internal-linking plan. No two URLs target the same intent, to avoid cannibalisation.
Save: `../shared/keyword-map.md` and `../shared/sitemap-plan.md`
Gate: review.

## Phase 5: SEO and content strategy
Positioning angle, content pillars, money pages, topic clusters, the first 10 to 20 content ideas, publishing priority, repurposing plan (LinkedIn, Instagram, blog, newsletter, landing pages), and a measurement framework.

| Topic | Primary Keyword | Intent | Angle | CTA | Priority |
|---|---|---|---|---|---|

Save: `output/strategy.md`
Gate: review.

## Phase 6: Page briefs and copy (page by page)
Write one page at a time from a brief. Each brief contains: suggested title, suggested meta description, slug, primary and secondary keywords, intent, target reader, unique thesis, word-count range, heading structure, key points to cover, internal links to add, external proof needed, FAQs, the single CTA, JSON-LD types, OG image brief (what the image should convey), writer notes, and the final copy. Apply every standard as you write. Service pages target 1500 words or more.
Save: `../shared/page-briefs/<slug>.md`, one file per page.
Gate: review after each page or each batch, as the user prefers.

## Phase 7: Site-wide QA and handoff
Run the full standards QA pass across every page. Fix all issues before output. Consolidate the JSON-LD specs from the briefs into `../shared/schema-specs.md`. Seed the operations engine for post-launch: write `context/seed-keywords.txt` from the strategy themes, and optionally pre-load priority-tagged entries into `state/keyword-bank.json`. Write `context/audit-urls.txt` too: the homepage plus every money-page URL, built from the primary URL and the slugs in `sitemap-plan.md` and `services.md`. These are planned URLs on a new build; they become auditable once Dev ships the site, so System 3 picks them up on its first post-launch run.
Save: `reports/qa-report.md`
Gate: sign-off. Design and Dev are now unblocked: `../shared/` holds `icp.md`, `keyword-map.md`, `sitemap-plan.md`, `page-briefs/`, and `schema-specs.md`. Hand the structure and markup specs to Dev and the design and CRO requirements to Design.
