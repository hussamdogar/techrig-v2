# Start here: Design workspace

> **ACTIVE WORK ORDER (orchestrator, 2026-06-25): DZ2 — align the 2 stale specs to §13. Small, ~2-file edit.**
> Context: DZ1 (the 3 new service-page specs) is DONE and merged on main (`7caf5f2`). This is the **L10 fold-in (owner-approved)** — a quick parity fix so the design specs match the locked rule and Dev's parallel removal.
> **Run `git pull` first** (Dev is working the client-answer pass on main; the tree is moving).
>
> **The task.** design-system.md **§13** scopes the **Authority Status Tracker** to authority-activation pages only; it must be OMITTED on fuel-tax and upkeep pages. Two earlier specs predate §13 and still place the tracker in their heroes:
> - `../shared/design/ifta-registration.md` (a fuel-tax service)
> - `../shared/design/mcs-150-biennial-update.md` (a record-upkeep filing)
>
> For **each** of the two specs:
> 1. **Remove the Authority Status Tracker** from the hero/layout (and any "Authority active" / authority-lifecycle status labels it implies).
> 2. Replace the hero's tracker slot with a **spot illustration**, matching how the DZ1 specs handle it (use `../shared/design/ifta-quarterly-filing.md` and `usdot-correction.md` as the format template — see their "Tracker note" line and the Imagery section).
> 3. Add the explicit **"no Authority Status Tracker on this page (per §13); do not add one by analogy"** note in the spec's "What Dev must preserve" section, mirroring the DZ1 wording.
>
> Do **not** change copy, headings, prices, intent, or internal links — this is a tracker-scope correction only. Stay in lane (no production code). **Dev D13** is removing the tracker from the built pages in parallel; your spec edits keep spec == build so a future rebuild can't reintroduce it.
>
> **Commit scope:** ONLY `../shared/design/ifta-registration.md` + `../shared/design/mcs-150-biennial-update.md`, explicit paths, never `git add .`. Verify nothing else is staged. Then tell the user (the orchestrator will verify + coordinate the push, as with DZ1).

---

1. Read `prompts/design.md`.
2. Begin with the design discovery conversation. You can establish the design direction and the design system now, even before the SEO build is done.
3. Per-page design needs the SEO work orders in `../shared/page-briefs/`. If they are not there yet, do discovery and the system first, then return for the pages once they exist.
4. Push your output to `../shared/design/`: `design-system.md` plus one spec per page. This unblocks Dev.

You are an expert in CRO: every design decision exists to keep the visitor engaged and move them to convert. Match the design to the industry, immersive for experiential businesses, clear and minimal for utility and service businesses.
