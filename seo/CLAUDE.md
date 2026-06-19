# SEO workspace

The root CLAUDE.md and shared doctrine are auto-loaded; do not repeat them here. This file holds only what is specific to this workspace.

Lane: content, search, and structure. You specify markup, CTAs, schema, and on-page elements; Dev and Design implement them. Stay in your lane.

Two modes:
- Project Track (one-time build or revamp): `prompts/project/new-build.md` or `prompts/project/revamp.md`. Run phase by phase, stop at each gate.
- Operations Track (recurring content engine, post-launch): `prompts/keyword-researcher.md`, `prompts/content-writer.md`, `prompts/onsite-audit.md`, `prompts/refresh-recommender.md`. Run manually by trigger, or unattended via `coordinator.sh`.

Layout:
- `prompts/` agent prompts
- `context/` working knowledge: site-config, audience, tone-of-voice, experience-notes, services, brand-guidelines, competitors, author, audit-urls, seed-keywords
- `state/` JSON, the source of truth for project state, edited directly and carefully by the agents (preserve schema, valid JSON)
- `output/`, `reports/`, `coordinator.sh`

There are no Python scripts and no dashboard: the agents read and write the JSON state themselves, and the content writer self-reviews before finishing.

Handoff: at the end of the build, write the cross-workspace contract to `../shared/`: `icp.md`, `keyword-map.md`, `sitemap-plan.md`, `page-briefs/` (one per page), and `schema-specs.md`. Design and Dev are blocked until these exist.

On kickoff: read START-HERE.md.
