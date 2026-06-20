# SEO response to the Design work order

From SEO, 2026-06-21. Answers `shared/handoff-to-seo.md`. Everything SEO can legitimately supply is now in the page briefs; the rest is client-internal data or unwritten client proof that standards forbid inventing. Each item below says DONE, or who it is blocked on.

## Copy to write

### Dispatch trailer pages — DONE
Full per-page copy added to `page-briefs/dispatch-trailer-pages.md` (new "FULL PER-PAGE COPY" section): a one-line **lane profile**, an equipment-specific **hero lede**, and a **worked scenario** for all five (reefer, flatbed, dry van, power only, hot shot). Distinct wording per page.
- Pricing: reefer and flatbed carry the confirmed **3%**. Dry van, power only, hot shot show **"rate on request"** until the client confirms the percentage.
- Worked scenarios: reefer / flatbed / dry van are research-led empty-state framings (`[CLIENT PROOF NEEDED]`). **Honesty note:** the work order suggested reusing the real NC power-only and MD hotshot clients on the dispatch facet, but those are compliance engagements not actively dispatched, so a dispatch worked-example would overstate a result we cannot document. Power only and hot shot are therefore also research-led until a real dispatch story exists. Flagged in the brief.

### State pages — DONE
Full per-state copy added to `page-briefs/state-pages.md`: a **state-specific lead fact**, **state nuances**, and a **worked example** for TX, CA, NY, FL.
- Nuances are real regulatory items (TX TxDMV intrastate; CA MCP + CA Number + CARB; NY HUT; FL FLHSMV IRP/IFTA), each marked `[VERIFY current state schedule]` so the writer/Dev confirms against the state agency before publish. No market statistics.
- CA worked example uses a real CA box-truck client (MOTUS linkage), worded distinctly from `/dot-registration/`. TX, NY, FL worked examples are `[CLIENT PROOF NEEDED]`.

### Worked-example proof slots — BLOCKED ON CLIENT
`irp-registration` and the reefer / flatbed / dry van pages still need a real, cleared client story. Cannot be invented (no fabricated proof). Keep the graceful empty proof blocks. Will fill when the client supplies stories (questionnaire path).

## Data to confirm

### UCR fee brackets — DONE (public data, sourced)
`page-briefs/ucr-registration.md` now lists the official **2026 UCR government fees** by bracket (0-2 $46; 3-5 $138; 6-20 $276; 21-100 $963; 101-1,000 $4,592; 1,001+ $44,836), shown as the government portion, separate from Tech Rig's service fee. Source: the UCR Plan fee-bracket schedule (2026 registration year, unchanged from 2025). Re-verify each registration year. Replace the "fee set by bracket" token with this table.

### Still BLOCKED ON CLIENT (internal pricing, cannot source or invent) — keep honest tokens
- Dispatch percentages: dry van, power only, hot shot ("rate on request").
- DOT+MC bundle price (`mc-dot-registration`).
- IRP service fee and state-fee handling.
- ELD device/subscription cost and Tech Rig service fee.
- Insurance-filing fee.
- Trucking-LLC pricing ("Contact for quote").
These are Tech Rig's own prices; only the client can confirm them. They are listed in `qa-report.md` Section E and the page briefs' `[VERIFY]` markers.

## For Dev (unchanged)
CTA intake-form routes, and client logo + social profile URLs, remain Dev/client items.

## Branch / propagation note
This copy is committed on the SEO branch `claude/hungry-boyd-00148b` (PR #1). The Design branch `design/logo-and-design-system` was based on an earlier SEO commit, so it does not yet contain this copy or the FMCSA-footer-link commit. To pull this into the mockups, merge/rebase the SEO branch onto the Design branch, or merge PR #1 to `main` and update from there. Nothing about the design system or mockups needs to change to receive it; the words drop into the existing placeholders.
