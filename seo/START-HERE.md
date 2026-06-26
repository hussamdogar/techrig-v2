# Start here: SEO workspace

> **ACTIVE WORK ORDER (orchestrator, 2026-06-25): S9 — update the stale CTA briefs (compliance pages → `/apply`). Small, brief-only edit. `git pull` first.**
> Context: the owner approved wiring the compliance money pages into the new `/apply` engine (they were on a `/contact-us/` placeholder, BOC-3 on the legacy form). Dev is repointing the page CTAs (**D14**); your job is to update the **page-briefs** so spec == build. Full detail: the "CTA wiring delta (D14 / S9)" section in `../shared/work-order-client-answers.md`.
>
> **The task.** In `../shared/page-briefs/`, the **compliance** money-page briefs that specify a `/contact-us/` (or `/get-started`) CTA or a legacy-form link must instead specify **`/apply/?service=<key>`**. Update the "Primary CTA" / mid-page / closing-CTA lines (and any "give us your details through our [form]" mentions) to the in-app route. Per-page mapping (matches D14):
> - `ucr-registration` → `ucr` · `dot-registration` → `usdot` · `mc-registration` → `mc-authority` · `mc-dot-registration` → `mc-authority` · `fmcsa-clearinghouse-registration` → `clearinghouse` · `drug-and-alcohol-consortium` → `consortium` · `driver-qualification-files` → `dq-files` · `irp-registration` → `irp` · `ifta-registration` → `ifta` · `mcs-150-biennial-update` → `mcs-150` · `boc-3-filing` → `boc-3` · `services` (hub) → `/apply` (generic, user picks).
> - **`boc-3-filing.md` is the important one:** it currently specifies `button "File my BOC-3" → https://boc-3.techrig.org` (line ~23) and "give us your details through our [BOC-3 form](https://boc-3.techrig.org)". Change the active CTA to `/apply/?service=boc-3`. The legacy `boc-3.techrig.org` may be mentioned ONLY as a legacy/drain note, never as the active CTA.
>
> **Do NOT touch the dispatch briefs** (box-truck, flatbed, reefers, power-only, hot-shot, dry-van, state dispatch pages, +cost, lead-gen) — dispatch is a retainer/lead service, not an `/apply` filing, so those correctly keep `/contact-us/`.
>
> **CTA-only edit.** Do not change copy, keywords, intent, headings, or page theses — only the CTA destination. If a brief's CTA already matches the mapping (e.g. the 3 newest pages), leave it.
>
> **Commit scope:** ONLY the changed files under `../shared/page-briefs/`, explicit paths, never `git add .`. Verify nothing else is staged. Then tell the user — the orchestrator will verify + coordinate the push (as with S1-S8 and DZ2).

---

1. Confirm the project type in `project_config.md`: new build or revamp. If it is unset, ask once, then proceed.
2. Open the matching process and run it phase by phase, stopping at each gate for review:
   - New build: `prompts/project/new-build.md`
   - Revamp: `prompts/project/revamp.md`
3. Data sources: DataForSEO for keyword, SERP, difficulty, and on-page data. Semrush for backlink and authority analysis in the competitor and audit phases, and as the failover if DataForSEO fails. Google Search Console and GA4 for first-party performance only.
4. At the end of the build, write the handoff to `../shared/`: `page-briefs/`, `sitemap-plan.md`, `schema-specs.md`, plus `icp.md` and `keyword-map.md`. This unblocks Design and Dev.

The recurring content engine (keyword research, writing, audits, refresh) runs after launch from this folder via `coordinator.sh`. It is not part of the initial build. Run one unit of work per invocation: one seed for keyword research, one post for content writing.
