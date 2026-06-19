# How to use this system

A two-track SEO, Design, and Dev setup for Claude Code. The orchestrator scaffolds one project root with three workspaces (`seo/`, `design/`, `dev/`), a shared spine, and a shared handoff folder. You launch each workspace as its own Claude Code session.

## 0. What you need first

- Claude Code installed (CLI, VS Code, or JetBrains). Not Claude Desktop.
- An MCP config (`.mcp.json` in the project) exposing:
  - DataForSEO (`mcp__dfs-mcp__*`) for keyword, SERP, difficulty, Lighthouse, on-page. Primary.
  - Semrush for backlinks and authority, and as the DataForSEO failover.
  - Google Search Console MCP, only if you want System 4 (refresh). Systems 1, 2, 3 work without it.
- GA4 is optional (first-party traffic).

## 1. Drop the library in

Unzip into an empty project root. You now have only `project-root/templates/`. Do not move the files out by hand; the orchestrator places them.

## 2. Run the orchestrator (once)

Open a Claude Code session with the working directory at the project root and send:

> Read templates/orchestrator.md and follow it.

Answer the interview (project type, business, URL, offers, locale, signature term, ICP or "research required", constraints). It scaffolds `seo/ design/ dev/ _shared/ shared/`, writes `CLAUDE.md` and `project_config.md`, distributes every prompt, initialises empty state, and prints the launch order. Keep `templates/` as the library for your next project, or delete it.

## 3. SEO first (the build)

Open a Claude Code session in `seo/` and send:

> Read CLAUDE.md and START-HERE.md, confirm the project type from project_config.md, and begin.

Work through the phases, reviewing at each gate. At the end it writes the handoff to `../shared/` (`page-briefs/`, `sitemap-plan.md`, `schema-specs.md`, `icp.md`, `keyword-map.md`) and seeds the recurring engine (`seo/context/seed-keywords.txt`).

## 4. Design (discovery early, per-page after SEO)

Open a session in `design/` and send the same kickoff line. You can do the design discovery conversation and the design system now, before SEO finishes. Per-page design picks up `../shared/page-briefs/` once they exist. Design pushes the system and per-page specs to `../shared/design/`.

## 5. Dev (after design specs and work orders exist)

Open a session in `dev/` and send the kickoff. It builds from `../shared/page-briefs/` and `../shared/design/` into `dev/`, in your stack, and writes `../shared/build-report.md`. If either input is missing, it stops and tells you.

## 6. Ongoing content engine (post-launch, from seo/)

Manual, the simplest way: open a session in `seo/` and type a trigger.
- `research keywords for <seed>` runs System 1 (keyword research).
- `write the next post in the queue` runs System 2 (content writer).
- `run an onsite audit` runs System 3.
- `find posts to refresh` runs System 4 (needs the GSC MCP).

Unattended (optional): `cd seo && ./coordinator.sh <agent> [seed]` from cron, Windows Task Scheduler, or launchd. It prepends `MODE: AUTO` for the content writer and `SEED_KEYWORD` for keyword research, runs `claude -p`, and commits if the folder is a git repo.

## 7. Fill the gaps

- The SEO build populates `seo/context/` for you: `audience.md` from its ICP research, `competitors.md` from its competitor audit, `services.md` by fetching your existing site, and `tone-of-voice.md` from your site confirmed with you. It asks you for `author.md` and for any real client stories in `experience-notes.md`. The orchestrator pre-fills `site-config.md` from your interview.
- If you have no publishable client stories, leave `experience-notes.md` empty: the content writer runs research-only and invents nothing until you add real wins.
- Add audit URLs to `seo/context/audit-urls.txt` only to extend coverage; the SEO build already writes the homepage and money pages there.
- Design and Dev read your stack and brand from `project_config.md`; on a revamp, Design also studies the live site.

## Notes

- No Python scripts and no dashboard. The agents read and write their JSON state directly, and the content writer self-reviews before finishing. If you want a hard pre-publish block, add a PreToolUse hook.
- Do not commit publicly: `.mcp.json` (credentials) and anything in `seo/context/` (private business info).
