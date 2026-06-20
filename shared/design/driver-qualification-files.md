# Page design spec: /driver-qualification-files/ (Driver Qualification Files)

Design-only spec. Consumes `shared/page-briefs/driver-qualification-files.md`. SEO owns copy, headings, CTA wording and destinations, links, the worked example, and prices; this defines look, layout, hierarchy, components, imagery, motion, and the conversion path. Built on `design-system.md`. No em dashes.

## Page role
A single-filing money page in the driver-compliance cluster, informational sliding to BOFU (primary keyword is low difficulty, so the page also serves searchers who want to know what a DQ file is). One job: a carrier understands what driver qualification files are, internalizes the page's distinct angle ("owner-operators are still drivers, the requirement applies even to a one-driver company"), and has Tech Rig build them. Longest of the four (1,400 to 1,600 words): it carries a contents checklist and an audit section, so structure and scannability matter most here.

## Section order and layout

1. Header (global): per the system. Persistent primary CTA "Set up my DQ files".

2. Breadcrumb row (Paper): Home > Compliance Services > Driver Qualification Files, mono label treatment, Steel links, current item Slate. Renders BreadcrumbList.

3. Hero (Paper, asymmetric two-column; copy-first stack on mobile)
   - Left: H1 "Driver Qualification Files (DQ Files)" (Archivo). The brief's hero lede as a styled Body L paragraph; the closing line ("This applies even if you are the only driver in the company.") set in Ink at full weight inside the paragraph to seed the page's angle, without becoming a heading. Primary button "Set up my DQ files" (Signal amber, Ink text) -> DQ intake form, `/contact-us/` until `[VERIFY]` confirmed. Under the lede, the "Reviewed by Adam Smith, Co-Founder" line: mono "REVIEWED BY" label + name.
   - Right (signature visual): the Authority Status Tracker, scoped to this filing as a driver-readiness step that sits after authority and alongside consortium and Clearinghouse. Honesty rules apply. Vertical on mobile, below the CTA.

4. H2 "What driver qualification files are": lead text in Body. Pull the recurring-maintenance point ("the file is not a one-time form; parts of it have to be refreshed on a schedule") into a quiet emphasis callout (left Steel rule, Slate text), because the recurring nature is what carriers underestimate and it justifies the yearly-update pricing later.

5. H2 "Owner-operators are still drivers": the page's distinct angle, given its own section and the strongest non-CTA emphasis on the page. Render as a single focused statement block on a Cloud surface with a left Steel rule, Body copy, no icon-triplet decoration. The point ("being the owner does not waive the requirement, a missing file on the owner-driver is exactly what a safety audit flags") is the page's reason to exist, so it gets visual separation and breathing room. No amber.

6. H2 "What goes in a driver qualification file": the contents checklist, the most scannable block on the page. Render as a two-column checklist on desktop (single column mobile), each item a line with a small relevant line icon and the item label; items are content-bearing, not decorative. Because the list is general and not exhaustive (federal specifics vary), present it under a plain framing that reads as representative, and the closing line ("We assemble these into a compliant file and keep the recurring items current.") sits below the list, not as a checklist item. The inline `/drug-and-alcohol-consortium/` and `/fmcsa-clearinghouse-registration/` links render as Steel anchors inside the testing-records item. Do not use status-active green checks here (this is "what is in the file", not "what we include"); use neutral Ink/Steel line bullets so the green check stays meaningful for the includes section below.

7. H2 "What our DQ file service includes": the "what you get when Tech Rig files it" block. Three included items as a checklist with status-active checks (icon plus label, the green check earns its meaning here by contrast with section 6), each a short line; inline `/drug-and-alcohol-consortium/` and `/fmcsa-clearinghouse-registration/` links as Steel anchors. Beneath, pricing from the single source: a flat price chip `$200` labeled "per driver, includes the yearly update". The related driver-compliance costs (Clearinghouse $100, consortium $150, pre-employment drug test $100) appear as a Slate line, each figure linking to its page, shown as separate prices, never bundled into the chip.

8. H2 "DQ files and your first safety audit": the audit-context section the long word target supports, and the home of the page's UNIQUE worked example. Body copy on the early new-carrier safety audit, with inline `/fmcsa-clearinghouse-registration/` link as a Steel anchor. The worked example renders as the quiet example callout (left Steel rule, Slate text), telling the New Jersey power-only carrier story on the DQ-and-expired-test facet: he needed his DQ file, consortium enrollment, Clearinghouse setup, and a fresh pre-employment drug test before he could put his truck to work, because an earlier test was more than 30 days old, and "we handled the set so he was audit-ready, not just licensed." Mono treatment only on the concrete data point. This telling must differ in sentence construction from the consortium page's telling of the same carrier; the facet here is the full audit-ready set, not the test timing alone.

9. Driver-compliance cluster cross-link strip: the deliberate cluster handoff, same pattern as the other two cluster pages. Compact line-icon strip with contextual anchors "drug and alcohol consortium" -> `/drug-and-alcohol-consortium/` and "FMCSA Clearinghouse" -> `/fmcsa-clearinghouse-registration/`, framed as the rest of the driver-compliance set. Cloud surface, Steel anchors.

10. Funnel cross-link forward to dispatch (optional per brief, include it): the system's styled compliance-to-dispatch handoff, one line with a 1 to 3 word anchor to `/services/`. Steel, subordinate.

11. H2 "Driver qualification file FAQ": the system FAQ accordion (FAQPage schema). Five rows from the brief. The owner-operator answer reinforces the page angle; the update-frequency answer pairs in tone with the section-4 recurring callout; the cost answer restates `$200` in mono inline. Chevron respects reduced motion.

12. Closing CTA band: one line ("Hiring a driver, or running your own truck? Get audit-ready driver files in place.") plus the single dominant button "Set up my DQ files" -> same destination as the hero CTA.

13. Mega-footer (global).

## Hierarchy and the visual path
Eye path: H1 -> primary amber CTA -> tracker -> the owner-operator angle block (the page's hook) -> the contents checklist (the scannable substance) -> includes + the $200 chip -> audit section with the worked example -> cluster strip -> FAQ -> single closing CTA. Signal amber is rationed to the primary action only (hero and close). The owner-operator block, the recurring callout, and the worked example use the Steel-rule quiet treatment, never amber. One primary action per view. The deliberate two-tier checklist styling (neutral bullets for "what is in the file", green checks for "what we include") keeps the green check meaningful.

## Imagery and illustration
No photography. Assets: the Authority Status Tracker in the hero; one small line icon per checklist item (the contents list is the richest icon set on the page, drawn from the compliance icon language: a license, a record, a medical certificate, a testing glyph); status-active checks on the includes list; small icons in the cluster strip. The worked example and the angle block are typographic. All single-line SVG from the system, lightweight for CWV. No decorative icon triplet; the contents icons are content-bearing.

## Motion
Minimal. Hero tracker staggered reveal (<=200ms steps). Accordion chevron. The contents checklist renders static (no staggered list animation). No per-section scroll-fade; the worked example and callouts are static. `prefers-reduced-motion` gives final states.

## CRO treatment
- One dominant action (set up my DQ files), Signal amber, repeated at hero and close, same destination.
- The owner-operator angle is the page's conversion lever: it converts a searcher who assumed DQ files do not apply to a one-driver operation into a buyer, so it gets the strongest non-CTA emphasis.
- The contents checklist builds confidence ("they know exactly what goes in here") and the includes list shows the service is complete and maintained; the $200-includes-yearly-update framing answers the recurring-cost worry the section-4 callout raised.
- The worked example is honest proof of competence, in the credibility treatment, not a metric or testimonial.
- Pricing as a trust asset: $200 per driver including the yearly update, in mono from the single source; related costs shown separately.
- Honest scope: contents described as representative ("including"), not asserted as an exhaustive federal list.
- Mobile: sticky bottom bar with the primary CTA plus a tel: Call button; copy-first hero; tracker vertical; checklist single column.

## OG image
Unique branded OG from the template: Ink field, mono wordmark, title "Driver Qualification Files", category tag "Compliance" in Plex Mono, one relevant line icon (a driver-record or file glyph), a Signal rule. No seal lookalike, no placeholder.

## What Dev must preserve
- SEO copy, the heading structure, every internal link and destination, the worked example wording, and the price exactly. The lede, the angle block, the callouts, and the "Reviewed by" line are styled paragraphs, never H-tags.
- The price chip from the single source (`services.md`): the $200-per-driver fee with the yearly update framing, related driver-compliance costs shown separately and never bundled.
- The contents list stays general (described with "including"); do not present it as an exhaustive or authoritative federal checklist.
- The worked example stays distinct from the consortium page's telling of the same carrier; do not unify the wording.
- Amber-never-white-text; one Signal action per view; AA contrast; visible focus; reduced motion.
- Authority Status Tracker honesty rules: no guaranteed date, no countdown, no implied government affiliation.
- Documented proof only; no invented figures or ratings. Decorative glyphs and check marks via CSS or inline SVG, never typed into headings.
