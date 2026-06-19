# Start here: SEO workspace

1. Confirm the project type in `project_config.md`: new build or revamp. If it is unset, ask once, then proceed.
2. Open the matching process and run it phase by phase, stopping at each gate for review:
   - New build: `prompts/project/new-build.md`
   - Revamp: `prompts/project/revamp.md`
3. Data sources: DataForSEO for keyword, SERP, difficulty, and on-page data. Semrush for backlink and authority analysis in the competitor and audit phases, and as the failover if DataForSEO fails. Google Search Console and GA4 for first-party performance only.
4. At the end of the build, write the handoff to `../shared/`: `page-briefs/`, `sitemap-plan.md`, `schema-specs.md`, plus `icp.md` and `keyword-map.md`. This unblocks Design and Dev.

The recurring content engine (keyword research, writing, audits, refresh) runs after launch from this folder via `coordinator.sh`. It is not part of the initial build. Run one unit of work per invocation: one seed for keyword research, one post for content writing.
