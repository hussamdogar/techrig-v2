# Orchestrator (project setup, run once)

You set up a new SEO, Design, and Dev project, then hand off. You do not do SEO, design, or development work yourself. You interview the user, scaffold the workspace, distribute the template files, write `project_config.md`, and stop.

## Preconditions
You are running in a fresh project root, and the `templates/` library is present here (this file is `templates/orchestrator.md`). If `templates/` is missing, stop and tell the user to drop the templates library into the project root first.

If the root already contains a populated `seo/`, `design/`, or `dev/`, do not overwrite anything. Warn the user and ask before touching those folders.

## Step 1: Interview
Ask in grouped batches, not one question at a time. Project type comes first, because it decides which process the SEO workspace runs.

Batch 1, project type and basics: project type (new build or revamp); business name; primary URL; sitemap URL if live; offers or services.
Batch 2, commercial context: price level or typical deal size; sales cycle length; geography and target market; locale and currency (default Pakistan, PKR or Rs); signature term to keep site-wide.
Batch 3, audience and constraints: ICP if known (accept "research required"); must-keep URLs, brand rules, or known constraints.

Tools are fixed, so do not ask which to use. Confirm only that access exists: DataForSEO (primary), Semrush (backlinks and authority, plus failover), and, for System 4 only, the Google Search Console MCP. GA4 is optional. Note any that are not yet connected.

Accept "unknown" or "research required" for any field. Never invent a value.

## Step 2: Confirm
Summarise the gathered config back to the user. Get a yes before writing anything.

## Step 3: Scaffold
Create the structure, copy templates into place, then fill placeholders.

```bash
mkdir -p _shared shared/page-briefs shared/design \
  seo/prompts/project seo/context seo/state seo/output/posts seo/output/keywords seo/reports \
  design/prompts design/output \
  dev/prompts dev/output

cp templates/_shared/persona.md          _shared/persona.md
cp templates/_shared/standards.md        _shared/standards.md
cp templates/root-CLAUDE.md              CLAUDE.md
cp templates/project_config.template.md  project_config.md
cp templates/seo/CLAUDE.md               seo/CLAUDE.md
cp templates/seo/START-HERE.md           seo/START-HERE.md
cp templates/seo/coordinator.sh          seo/coordinator.sh 2>/dev/null || true
cp templates/seo/prompts/*.md            seo/prompts/
cp templates/seo/prompts/project/*.md    seo/prompts/project/
cp templates/design/CLAUDE.md            design/CLAUDE.md
cp templates/design/START-HERE.md        design/START-HERE.md
cp templates/design/prompts/*.md         design/prompts/
cp templates/dev/CLAUDE.md               dev/CLAUDE.md
cp templates/dev/START-HERE.md           dev/START-HERE.md
cp templates/dev/prompts/*.md            dev/prompts/

# context templates if the library ships any, plus seed files
cp -n templates/seo/context/*.md  seo/context/  2>/dev/null || true
[ -f seo/context/seed-keywords.txt ] || : > seo/context/seed-keywords.txt
[ -f seo/context/audit-urls.txt ]    || echo "$(grep -m1 -i 'Primary URL' project_config.md | sed 's/.*: *//')" > seo/context/audit-urls.txt

# initialise empty state so the operations agents do not fail on missing files
[ -f seo/state/keyword-bank.json ]  || echo '{"last_updated":null,"seeds_researched":[],"keywords":[]}' > seo/state/keyword-bank.json
[ -f seo/state/content-queue.json ] || echo '{"items":[]}' > seo/state/content-queue.json
[ -x seo/coordinator.sh ] && chmod +x seo/coordinator.sh || true

# Create labelled stubs for the context files the SEO build will populate, so the folder is complete.
for f in audience tone-of-voice experience-notes services brand-guidelines competitors author; do
  [ -f "seo/context/$f.md" ] || printf '# %s\n\n(Populated by the SEO build. Run the Project Track first.)\n' "$f" > "seo/context/$f.md"
done
```

Then fill placeholders with the interview answers:
- In `CLAUDE.md`, `seo/CLAUDE.md`, `design/CLAUDE.md`, `dev/CLAUDE.md`, and the three `START-HERE.md` files, replace `{{PROJECT_NAME}}`, `{{LOCALE}}`, `{{PROJECT_TYPE}}`, `{{PRIMARY_URL}}`, `{{SIGNATURE_TERM}}`.
- Write `project_config.md` in full from the interview.
- Pre-populate `seo/context/site-config.md` from `project_config.md`: carry the primary URL, locale, signature term, and offers, then leave the SEO-specific in-scope and out-of-scope topic lists for the SEO workspace to fill.

Do not hand-write the other context files. The SEO build populates them: `audience.md` from its ICP research, `competitors.md` from its competitor audit, `services.md` from the existing site, and `tone-of-voice.md` from the site confirmed with the user. The build asks the user for `author.md` and for any real stories in `experience-notes.md`.

There are no Python scripts to copy and no dashboard. The agents manage their JSON state themselves.

## Step 4: Hand off
Print the launch instructions and stop. Do not begin any SEO, design, or development work.

```
Project scaffolded. Launch order matters.

1. SEO first. Open a Claude Code session with the working directory in seo/ and send:
   "Read CLAUDE.md and START-HERE.md, confirm the project type from project_config.md, and begin."
   It populates the context files (audience, services, competitors, tone-of-voice) by research and a short
   intake, asks you for author details and any real client stories, and writes work orders to
   ../shared/page-briefs/ at the end.

2. Design can start its discovery conversation and design system any time, even now. Open a session in
   design/ and send the same kickoff. Per-page design picks up ../shared/page-briefs/ once SEO has written them.
   Design pushes the system and per-page specs to ../shared/design/.

3. Dev is gated. It stays blocked until both ../shared/page-briefs/ and ../shared/design/ exist. Then open a
   session in dev/ and send the kickoff.

The recurring content engine (keyword research, content writing, audits, refresh) runs from seo/ after launch,
either by typing a trigger in a seo/ session or unattended via seo/coordinator.sh.
```

## Hard rules
- Setup only. Never do downstream SEO, design, or dev work.
- Never invent a config value. Ask, or mark it "unknown" or "research required".
- Do not overwrite a populated workspace without explicit confirmation.
- No em dashes.
