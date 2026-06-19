# DGR Tech Rig: SEO, Design, and Dev project

This project has three workspaces, each launched as its own Claude Code session. This root file and the shared doctrine below load automatically in every session, because Claude Code walks up the directory tree from the working directory and reads parent CLAUDE.md files.

## Shared doctrine and config (loaded every session)
@_shared/persona.md
@_shared/standards.md
@project_config.md

Each workspace also reads its own CLAUDE.md and START-HERE.md on kickoff.

## Workspaces
| Folder | Lane | Launch | Reads | Writes |
| --- | --- | --- | --- | --- |
| seo/ | Content, search, structure. Specifies, does not implement. | First | project_config.md, seo/context/* | seo/output/*, shared/* (handoff) |
| design/ | Web design and CRO. Consumes SEO work orders. | Discovery early; per-page after SEO handoff | shared/page-briefs/, project_config.md | design/output/*, shared/design/* |
| dev/ | Implementation: markup, schema, meta, performance. | After design specs and work orders exist | shared/page-briefs/, shared/design/* | dev/*, shared/build-report.md |

## Build sequence
SEO defines requirements; Design and Dev consume them. SEO runs first and writes work orders to `shared/page-briefs/`. Design can run discovery and the design system any time, and does per-page design once the work orders exist, writing to `shared/design/`. Dev is blocked until both `shared/page-briefs/` and `shared/design/` exist. Do not run all three on day one.

## Shared artifacts (shared/)
The cross-workspace contract. Expected: `icp.md`, `keyword-map.md`, `sitemap-plan.md`, `page-briefs/` (one file per page), `schema-specs.md` (all from SEO); `design/` (design system and per-page specs from Design); `build-report.md` (from Dev).

## Tools
- Primary for keyword volume, ideas, difficulty, related terms, SERP, Lighthouse, on-page, AI fan-out: DataForSEO MCP (`mcp__dfs-mcp__*`). The only source for volume, KD, and CPC. Never fabricate. Null if unknown.
- Backlinks and authority audits (referring domains, anchor profile, authority score, toxic links): Semrush MCP, used in the SEO competitor and audit phases. Semrush is also the failover if a DataForSEO call fails or returns empty (retry once, then Semrush, log it).
- First-party performance and indexing: Google Search Console (System 4 uses the GSC MCP for URL Inspection) and GA4. Not for keyword discovery.
- Last resort only: WebSearch and WebFetch. Log the fallback.

## State ownership
State JSON is the source of truth for project state. The agents read and write it directly and carefully (only the target item or entry, preserve schema, valid JSON). `state/keyword-bank.json` belongs to System 1. `state/content-queue.json` is appended by System 1 and updated by System 2. `state/onsite-audit.json` and `state/refresh-queue.json` are rewritten by their agents each run. Do not bulk hand-edit.

## Hard rules (enforced by self-review and hooks, not prose alone)
- No em dashes. No fabricated metrics or citation URLs.
- Stay in lane. SEO specifies markup, CTAs, and schema; Dev and Design implement them.
- The operations agents in seo/ never modify prompts, context, or coordinator.sh, and never invoke other agents.
- Locale: United States, USD.

CLAUDE.md is loaded as context, not enforced. Put any must-block rule in a PreToolUse hook.
