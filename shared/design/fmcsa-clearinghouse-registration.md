# Page design spec: /fmcsa-clearinghouse-registration/ (FMCSA Clearinghouse Registration)

Design-only spec. Consumes `shared/page-briefs/fmcsa-clearinghouse-registration.md`. SEO owns copy, headings, CTA wording and destinations, links, and prices; this defines look, layout, hierarchy, components, imagery, motion, and the conversion path. Built on `design-system.md`. No em dashes.

## Page role
A single-filing money page in the driver-compliance cluster, navigational and BOFU. One job: a carrier who has "Clearinghouse registration" on their setup list understands what it is, sees that it is one part of a coordinated driver-compliance set (consortium and DQ files), and files it. The page's distinct angle is the "database of violations vs testing program" distinction, so the design must make the Clearinghouse-records-it / consortium-administers-it relationship visible, not just stated. Tight page (900 to 1,200 words): keep it compact, no padding sections.

## Section order and layout

1. Header (global): per the system. Persistent primary CTA "Register with the Clearinghouse".

2. Breadcrumb row (Paper): Home > Compliance Services > FMCSA Clearinghouse Registration, in the mono label treatment, Steel links, current item Slate. Renders the BreadcrumbList without a decorative bar.

3. Hero (Paper, asymmetric two-column; copy-first stack on mobile)
   - Left: H1 "FMCSA Clearinghouse Registration" (Archivo). The brief's hero lede as a styled paragraph in Plex Sans Body L, with the inline `/drug-and-alcohol-consortium/` link as a Steel contextual anchor. Primary button "Register with the Clearinghouse" (Signal amber, Ink text) routing to the intake form, `/contact-us/` until `[VERIFY]` confirmed. Under the lede, the "Reviewed by Adam Smith, Co-Founder" credibility line: mono label "REVIEWED BY" + name in Plex Sans, no avatar.
   - Right (signature visual): the Authority Status Tracker, scoped to where this filing sits. Clearinghouse is a driver-compliance step that runs once a CDL driver is being put to work, so the tracker shows the federal sequence (Application filed -> 21-day protest period -> Authority active) with this filing marked as a driver-readiness step that sits after authority and alongside the consortium, not as a node that gates activation. Honesty rules apply: no guaranteed dates, no countdown, no implied government endorsement. On mobile the tracker drops below the CTA and renders vertically.

4. H2 "What FMCSA Clearinghouse registration is": the page's signature explanatory moment. Lead text block in Body, then a quiet two-node line diagram that carries the core distinction: one node "Consortium administers testing" (Steel), one node "Clearinghouse records and surfaces violations" (Steel), a labeled connector showing queries and reporting flowing between them. This is a content-bearing process diagram in the system's single-line SVG language, not decoration. The inline `/drug-and-alcohol-consortium/` link sits in the body copy as a Steel anchor.

5. H2 "Who needs to register": honest applicability, the system's "not everyone" treatment. The single bullet rendered as one line item with a small line icon (a CDL/driver glyph); below it the qualifier sentence ("Whether CDL drug-and-alcohol rules apply depends on your operation. We confirm before registering you.") in Slate, set apart so the honesty reads. No green-check styling here: this is scope, not an included-item list.

6. H2 "What our FMCSA Clearinghouse registration service includes": the "what you get when Tech Rig files it" block. Three included items as a checklist, each a line with a status-active check (icon plus label, never color alone) and a one-line description; the inline `/drug-and-alcohol-consortium/` and `/driver-qualification-files/` links render as Steel anchors inside the third item. Directly beneath, the pricing in the system's price-chip component from the single source: a flat chip `$100` labeled "Clearinghouse registration assistance". The related-cost sentence (consortium $150, DQ files $200 per driver, on their own pages) sits below in Slate as separate, clearly-not-bundled figures, each linking to its page; do not blend them into the chip.

7. Driver-compliance cluster cross-link strip: a quiet, deliberate handoff (not an afterthought link row) tying the three cluster pages together. A compact line-icon strip with two contextual anchors, "drug and alcohol consortium" -> `/drug-and-alcohol-consortium/` and "driver qualification files" -> `/driver-qualification-files/`, framed as "the rest of the driver-compliance set". Steel anchors, on a Cloud surface to separate it from the funnel-forward link below.

8. Funnel cross-link forward to dispatch: the system's styled compliance-to-dispatch handoff. One line ("authority active, keep your truck loaded") with a 1 to 3 word contextual anchor to `/services/`. Subordinate to the primary filing action; Steel, not amber.

9. H2 "FMCSA Clearinghouse FAQ": the system FAQ accordion (FAQPage schema). Four rows from the brief. The applicability answer ("Do I need it if I am an owner-operator?") and the consortium-vs-Clearinghouse answer carry the honest-expectations tone; the cost answer restates `$100` in mono inline. Chevron rotates, respects reduced motion.

10. Closing CTA band: one line ("Setting up driver compliance? Get your Clearinghouse registration handled with your testing program.") plus the single dominant button "Register with the Clearinghouse" -> same destination as the hero CTA. One primary action.

11. Mega-footer (global): the complete filing list lives here.

## Hierarchy and the visual path
Eye path: H1 -> primary amber CTA -> the tracker (sets honest expectations) -> the consortium/Clearinghouse distinction diagram (the page's reason to exist) -> includes + the $100 chip -> cluster cross-links -> FAQ -> single closing CTA. Signal amber is rationed to the primary action only (hero and close); every other link, the secondary anchors, and the cluster strip are Steel and subordinate. One primary action per view.

## Imagery and illustration
No photography. Two assets carry the load: the Authority Status Tracker in the hero, and the two-node consortium/Clearinghouse line diagram in the "what it is" section. Plus one small line icon per included item and the applicability bullet, and small icons in the cluster strip. All single-line SVG from the system, 2px stroke, lightweight for the weak CWV baseline. No icon-in-rounded-square triplet.

## Motion
Minimal. Hero tracker reveals its steps with a calm staggered fade (<=200ms each) on load. The "what it is" diagram may draw its connector once on first view (<=200ms); no looping. Accordion chevron. No per-section scroll-fade. `prefers-reduced-motion` gives final static states.

## CRO treatment
- One dominant action (register with the Clearinghouse), Signal amber, repeated at hero and close, same destination both times.
- The distinction diagram removes the buyer's core confusion ("is this the same as a consortium?") visually, which is the page's conversion lever; the cluster strip captures the carrier who realizes they need all three.
- Fee transparency: the $100 service fee shows from the single source, and related costs are listed as separate figures on their own pages, never bundled.
- Honest applicability (the "we confirm before registering you" line and the tracker) reduces the anxiety that drives bounce.
- Mobile: sticky bottom bar with the primary CTA plus a tel: Call button; copy-first hero stack; the tracker renders vertically.

## OG image
Unique branded OG from the system template: Ink field, mono wordmark, title "FMCSA Clearinghouse", category tag "Compliance" in Plex Mono, one relevant line icon (a filing/record or shield glyph), a Signal rule. Never a placeholder, never an FMCSA-seal lookalike.

## What Dev must preserve
- SEO copy, the heading structure, every internal link and destination, and the price exactly. The lede and the "Reviewed by" line are styled paragraphs, never H-tags.
- The price chip from the single source (`services.md`): the $100 Clearinghouse fee, with consortium and DQ figures shown separately and never blended into one number.
- Amber-never-white-text; one Signal action per view; AA contrast; visible focus; reduced motion.
- The Authority Status Tracker honesty rules: no guaranteed activation date, no countdown, no implied government affiliation. FMCSA wording stays as written.
- Documented proof only: no invented figures or ratings; the applicability qualifier stays (do not claim universal applicability).
- Decorative glyphs and check marks via CSS or inline SVG, never typed into headings.
