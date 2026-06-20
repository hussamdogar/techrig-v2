# Page design spec: /eld-services/ (ELD Services)

Design-only spec. Consumes `shared/page-briefs/eld-services.md`. SEO owns copy, headings, CTA wording and destinations, links, the partner mention, and pricing; this defines look, layout, hierarchy, components, imagery, motion, and the conversion path. Built on `design-system.md`. No em dashes.

## Page role
A single-filing money page in the interstate cluster (IRP and IFTA), commercial BOFU. Note: this page is NOT part of the driver-compliance cluster, so it does not carry the consortium/Clearinghouse/DQ cross-link strip; its lateral links point to IRP and IFTA. One job: a carrier who knows they probably need an ELD understands the page's distinct angle ("the rule is easy, choosing and configuring the right device is the hard part"), and lets Tech Rig set it up. Tight page (900 to 1,200 words). Two design specifics set it apart from the cluster pages: pricing is unconfirmed (`[VERIFY]`), and the reviewer is Robert Hooke (systems and technology fit).

## Section order and layout

1. Header (global): per the system. Persistent primary CTA "Set up my ELD".

2. Breadcrumb row (Paper): Home > Compliance Services > ELD Services, mono label treatment, Steel links, current item Slate. Renders BreadcrumbList.

3. Hero (Paper, asymmetric two-column; copy-first stack on mobile)
   - Left: H1 "ELD Setup for Owner Operators and Fleets" (Archivo). The brief's hero lede as a styled Body L paragraph; the distinct angle ("the hard part is not the rule, it is choosing a device that fits your operation and setting it up so your logs are clean") set in Ink at full weight within the paragraph so the positioning lands, without becoming a heading. The Motive mention appears in the lede as written, as a partner, never "exclusive." Primary button "Set up my ELD" (Signal amber, Ink text) -> intake form, `/contact-us/` until `[VERIFY]` confirmed. Under the lede, the "Reviewed by Robert Hooke, Co-Founder" line: mono "REVIEWED BY" label + name (this is the systems-and-technology reviewer, distinct from the Adam Smith driver-compliance pages).
   - Right (signature visual): the Authority Status Tracker, scoped so ELD reads as an operational-readiness step a carrier handles around the time they start hauling, after authority is active, alongside the interstate setup (IRP and IFTA), not a node gating activation. Honesty rules apply (no guaranteed dates, no implied government endorsement). Vertical on mobile, below the CTA. The tracker keeps this page visually consistent with the rest of the compliance silo even though ELD sits late in the sequence.

4. H2 "What an ELD is and who needs one": lead text in Body explaining engine connection and hours-of-service replacement of paper logs. The applicability nuance ("most commercial drivers... with some exceptions for certain short-haul and older-vehicle operations") set so the exceptions read honestly, not buried. The consequence line ("running without a required ELD, or running one set up wrong, leads to violations at inspection") set in Ink at full weight within the copy, reinforcing the page's configuration angle. No false-universal styling.

5. H2 "ELD for owner operators: how we help": the "what you get when Tech Rig does it" block, and the page's substance. Four included items as a checklist, each with a status-active check (icon plus label, never color alone) and a short line; Motive named in the first item as written. Beneath the list, the pricing area handled with the price chip's "Contact for quote" treatment until the fee is confirmed: render the chip in its quote state, not a fabricated number, with a Slate note that device and subscription costs are third-party (Motive) and shown separately from any Tech Rig service fee. This is the honest expression of the `[VERIFY]` price; do not invent a service fee, and never blend a third-party device/subscription cost with a Tech Rig fee.

6. H2 "ELD and the rest of your compliance": the interstate-cluster cross-link section (this page's equivalent of the cluster strip, but pointing to IRP and IFTA, not the driver-compliance pages). Body copy framing ELD as part of running interstate cleanly, with inline Steel anchors "IRP" -> `/irp-registration/` and "IFTA" -> `/ifta-registration/`. The "if you are still standing up the company, see the full setup" line carries a Steel anchor "full setup" -> `/compliance-services/`. A compact line-icon strip (the IRP plate glyph and the IFTA fuel glyph) reinforces the interstate pairing. Cloud surface.

7. Funnel cross-link forward to dispatch (optional per brief, include it): the system's styled compliance-to-dispatch handoff, one line with a 1 to 3 word anchor to `/services/`. Steel, subordinate. Because ELD sits late in the sequence (close to hauling), this forward link is especially natural here.

8. H2 "ELD FAQ": the system FAQ accordion (FAQPage schema). Four rows from the brief. The "Do owner-operators need an ELD?" answer carries the honest exceptions; the "Which ELD should I use?" answer names Motive as a partner; the "Is the device cost included?" answer is the fee-transparency moment (device and subscription separate from any Tech Rig fee, "we show you both"); the misconfiguration answer reinforces the configuration angle. Chevron respects reduced motion.

9. Closing CTA band: one line ("Need an ELD that keeps your logs clean? Get set up with the right device.") plus the single dominant button "Set up my ELD" -> same destination as the hero CTA.

10. Mega-footer (global).

## Hierarchy and the visual path
Eye path: H1 -> primary amber CTA -> tracker -> the "choosing and configuring is the hard part" angle in the lede and section 4 -> the how-we-help includes list -> the quote-state pricing with the third-party-cost note -> interstate cross-links -> FAQ -> single closing CTA. Signal amber is rationed to the primary action only (hero and close). All links, including IRP/IFTA and the funnel link, are Steel and subordinate. One primary action per view. The pricing area uses the chip's quote state, which keeps the price-as-trust-asset principle intact even with no confirmed number.

## Imagery and illustration
No photography. Assets: the Authority Status Tracker in the hero; one small line icon per how-we-help item; the IRP plate and IFTA fuel line icons in the interstate strip; optionally a single ELD-device line glyph as the section motif (device connected to engine), in the system's 2px line language, content-bearing not decorative. All single-line SVG, lightweight for the weak CWV baseline. No icon-in-rounded-square triplet.

## Motion
Minimal. Hero tracker staggered reveal (<=200ms steps). Accordion chevron. No per-section scroll-fade; the includes list and pricing render static. `prefers-reduced-motion` gives final states.

## CRO treatment
- One dominant action (set up my ELD), Signal amber, repeated at hero and close, same destination.
- The "configuration is the hard part" angle is the conversion lever: it reframes a commodity (the device) into a service (getting it set up right), justifying the engagement.
- Pricing honesty under uncertainty: the quote-state chip plus the explicit "device and subscription are third-party, shown separately" note. Hidden or fabricated pricing would read as risk to this buyer; the quote state is the honest, on-brand handling until the fee is confirmed.
- Motive is presented as a partner that makes setup reliable, never as an exclusive arrangement (do-not-publish list).
- The interstate cross-links (IRP, IFTA) capture the carrier standing up their full interstate operation; the late-sequence funnel link to dispatch is well placed.
- Mobile: sticky bottom bar with the primary CTA plus a tel: Call button; copy-first hero; tracker vertical.

## OG image
Unique branded OG from the template: Ink field, mono wordmark, title "ELD Setup", category tag "Compliance" in Plex Mono, one relevant line icon (an ELD-device or hours-of-service glyph), a Signal rule. No seal lookalike, no placeholder.

## What Dev must preserve
- SEO copy, the heading structure, every internal link and destination, and the Motive partner wording exactly. The lede and the "Reviewed by Robert Hooke, Co-Founder" line are styled paragraphs, never H-tags; the reviewer is Robert Hooke on this page, not Adam Smith.
- Pricing: render the price chip in the "Contact for quote" state until the service fee is confirmed (`[VERIFY]`); do not hardcode or invent a number. Any device or subscription cost is third-party (Motive) and must be shown separately from any Tech Rig service fee, never blended. Omit the Service-schema price until set.
- Motive is named as a partner, never "exclusive."
- Amber-never-white-text; one Signal action per view; AA contrast; visible focus; reduced motion.
- Authority Status Tracker honesty rules: no guaranteed date, no countdown, no implied government affiliation. State the ELD exceptions honestly; do not claim every carrier needs one.
- Documented proof only; no invented figures or ratings. Decorative glyphs and check marks via CSS or inline SVG, never typed into headings.
