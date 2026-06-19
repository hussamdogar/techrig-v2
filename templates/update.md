# Updater: refresh an in-progress project to the latest templates

Run this in an existing project that an earlier version of the orchestrator already scaffolded. It re-distributes the latest system files from `templates/` into the live workspaces and preserves all of your work. It does not re-run the interview, and it does not touch your data.

## Preconditions
- The latest `templates/` library is present in this project root (you unzipped the newest `seo-system-templates.zip` over the old `templates/`). This file is `templates/update.md`. If `templates/` is missing or is still the old version, stop and tell the user to drop the latest library in first.
- This project already has `seo/`, `design/`, and `dev/`. If it does not, this is a fresh project: tell the user to run `templates/orchestrator.md` instead.

## Preserved, never overwritten
- `project_config.md`
- everything in `seo/context/` (your business info, including site-config and anything you filled)
- everything in `seo/state/` (keyword bank, content queue, audit and refresh state)
- everything in `shared/` (icp, keyword-map, sitemap-plan, page-briefs, design specs, build report)
- everything in `seo/output/`, `seo/reports/`, `design/output/`, `dev/`
- `.mcp.json`, `.claude/`, and git history

## Refreshed, overwritten with the latest
- agent prompts: `seo/prompts/*.md` and `seo/prompts/project/*.md`
- shared spine: `_shared/persona.md`, `_shared/standards.md`
- workspace memory and entry files: root `CLAUDE.md`, `seo/CLAUDE.md`, `design/CLAUDE.md`, `dev/CLAUDE.md`, and the three `START-HERE.md`
- newly added files: `design/prompts/design.md`, `dev/prompts/dev.md`, `seo/coordinator.sh`

## Step 1: Safety checkpoint
If this is a git repo, commit first so there is a restore point.
```bash
if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  git add -A && git commit -m "checkpoint before system update" >/dev/null 2>&1 || true
  echo "Git checkpoint committed."
else
  ts="$(date +%Y%m%d-%H%M%S)"; mkdir -p ".backup-$ts"
  cp -r CLAUDE.md _shared seo/CLAUDE.md seo/START-HERE.md seo/prompts \
        design/CLAUDE.md design/START-HERE.md dev/CLAUDE.md dev/START-HERE.md \
        ".backup-$ts/" 2>/dev/null || true
  echo "No git repo; backed up overwritten files to .backup-$ts"
fi
```

## Step 2: Refresh system files (your data is preserved)
```bash
# Shared spine and root memory
cp templates/_shared/persona.md      _shared/persona.md
cp templates/_shared/standards.md    _shared/standards.md
cp templates/root-CLAUDE.md          CLAUDE.md

# Workspace memory and entry files
cp templates/seo/CLAUDE.md           seo/CLAUDE.md
cp templates/seo/START-HERE.md       seo/START-HERE.md
cp templates/design/CLAUDE.md        design/CLAUDE.md
cp templates/design/START-HERE.md    design/START-HERE.md
cp templates/dev/CLAUDE.md           dev/CLAUDE.md
cp templates/dev/START-HERE.md       dev/START-HERE.md

# Agent prompts
mkdir -p seo/prompts/project design/prompts dev/prompts
cp templates/seo/prompts/*.md         seo/prompts/
cp templates/seo/prompts/project/*.md seo/prompts/project/
cp templates/design/prompts/*.md      design/prompts/
cp templates/dev/prompts/*.md         dev/prompts/

# Newly added files
cp templates/seo/coordinator.sh       seo/coordinator.sh 2>/dev/null || true
[ -f seo/coordinator.sh ] && chmod +x seo/coordinator.sh || true

# New directories
mkdir -p shared/design shared/page-briefs

# Create any MISSING context stub only (never overwrite an existing one)
for f in audience tone-of-voice experience-notes services brand-guidelines competitors author; do
  [ -f "seo/context/$f.md" ] || printf '# %s\n\n(Populated by the SEO build. Run the Project Track first.)\n' "$f" > "seo/context/$f.md"
done

# Ensure state files exist (never overwrite existing ones)
[ -f seo/state/keyword-bank.json ]  || echo '{"last_updated":null,"seeds_researched":[],"keywords":[]}' > seo/state/keyword-bank.json
[ -f seo/state/content-queue.json ] || echo '{"items":[]}' > seo/state/content-queue.json
```

## Step 3: Re-fill placeholders from project_config.md
A refreshed file may contain `{{PROJECT_NAME}}`, `{{LOCALE}}`, `{{PROJECT_TYPE}}`, `{{PRIMARY_URL}}`, or `{{SIGNATURE_TERM}}`. Read the real values from the existing `project_config.md` (business name, locale and currency, project type, primary URL, signature term) and substitute them in every refreshed file that still contains a `{{...}}` token. Do not edit `project_config.md`. If a value is not present in the config, leave the token and tell the user which one to fill.

## Step 4: Report and stop
Print a short summary: the files refreshed, the files and directories created, and a confirmation that `project_config.md`, `seo/context/`, `seo/state/`, and `shared/` were left untouched. Then list what to check:
- empty context files will be populated the next time you run the SEO build (the Project Track); nothing you already filled was changed.
- `design/prompts/design.md` and `dev/prompts/dev.md` are now present, so Design and Dev have operating prompts.
- compare your `project_config.md` against `templates/project_config.template.md` if you want the latest tool notes (DataForSEO primary, Semrush failover, GSC MCP for System 4).

Then stop. Do not run the interview, the build, or any agent.

## Hard rules
- Never overwrite `project_config.md`, `seo/context/*`, `seo/state/*`, `shared/*`, `seo/output/*`, `seo/reports/*`, `design/output/*`, or `dev/*`.
- Never delete user files. Leave any unused `seo/scripts/` directory in place; the new prompts simply do not use it.
- Refresh system files only, then re-fill placeholders from `project_config.md`.
- No em dashes.
