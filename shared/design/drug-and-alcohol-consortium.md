# Page design spec: /drug-and-alcohol-consortium/ (Drug and Alcohol Consortium)

Design-only spec. Consumes `shared/page-briefs/drug-and-alcohol-consortium.md`. SEO owns copy, headings, CTA wording and destinations, links, the worked example, and prices; this defines look, layout, hierarchy, components, imagery, motion, and the conversion path. Built on `design-system.md`. No em dashes.

## Page role
A single-filing money page in the driver-compliance cluster, high-commercial-value BOFU. One job: a CDL holder or carrier understands they are required to be in a DOT testing program, grasps the page's distinct angle ("you cannot run a random pool of one"), and enrolls. The page also absorbs the pre-employment drug test term as a section. Longer than the other cluster pages (1,300 to 1,500 words), so it carries one extra explanatory section and a worked example, but stays scannable.

## Section order and layout

1. Header (global): per the system. Persistent primary CTA "Enroll in a consortium".

2. Breadcrumb row (Paper): Home > Compliance Services > Drug and Alcohol Consortium, mono label treatment, Steel links, current item Slate. Renders BreadcrumbList.

3. Hero (Paper, asymmetric two-column; copy-first stack on mobile)
   - Left: H1 "Drug and Alcohol Consortium Enrollment" (Archivo). The brief's hero lede as a styled Body L paragraph. The lede carries a real consequence ("skip it and you are not legal to drive a CDL vehicle, and it is one of the first things an audit checks"); set that consequence clause in Ink at full weight within the paragraph so it lands, without becoming a heading. Primary button "Enroll in a consortium" (Signal amber, Ink text) -> consortium intake form, `/contact-us/` until `[VERIFY]` confirmed. Under the lede, the "Reviewed by Adam Smith, Co-Founder" line: mono "REVIEWED BY" label + name.
   - Right (signature visual): the Authority Status Tracker, scoped to this filing as a driver-readiness step that sits after authority and alongside Clearinghouse and DQ files, not a node gating activation. Honesty rules apply (no guaranteed dates, no government endorsement). Vertical on mobile, below the CTA.

4. H2 "What a drug and alcohol consortium is": lead text in Body explaining the C/TPA and the random pool. The page's distinct angle ("an owner-operator cannot run their own random pool of one") gets a quiet emphasis callout: left Steel rule, Slate text, one sentence stating the pool-of-one problem plainly. This is the memorable framing, so give it visual separation without making it loud. The inline `/fmcsa-clearinghouse-registration/` link renders as a Steel anchor in the body.

5. H2 "Who needs to be in a consortium": honest applicability. Two bullets (owner-operators with a CDL; carriers with CDL drivers) as line items each with a small line icon. The "Note: not every operation is subject..." qualifier set apart in Slate beneath the bullets, so the "we confirm before you enroll" honesty is unmistakable. Not styled as an included-items checklist.

6. H2 "What our drug and alcohol consortium enrollment includes": the "what you get when Tech Rig files it" block. Four included items as a checklist, each with a status-active check (icon plus label) and a short line; the inline `/fmcsa-clearinghouse-registration/` and `/driver-qualification-files/` links render as Steel anchors within the relevant items. Beneath, pricing from the single source as price chips: a flat chip `$150` labeled "Consortium enrollment" and a second flat chip `$100` labeled "Pre-employment drug test". The Clearinghouse $100, listed separately, appears as a Slate line linking to its page, not as a third bundled chip.

7. H2 "Pre-employment drug test": the absorbed term, given its own section so it ranks and reads as substantive. Body copy explaining the negative-test-on-file requirement and that timing matters. The page's UNIQUE worked example renders here as the quiet example callout (left Steel rule, Slate text), telling the New Jersey power-only carrier story on the pre-employment-timing facet: an earlier drug test was more than 30 days old, so a new pre-employment test had to be arranged before the driver could meet the requirement. Mono treatment only on the concrete data point ("more than 30 days"). The inline `/driver-qualification-files/` link is a Steel anchor. This example must be worded as the consortium telling; the DQ-files page tells the same situation from a different facet, so keep the sentences distinct.

8. H2 "Consortium and the Clearinghouse": the second explanatory section the longer word target allows. A compact two-node line diagram in the system language showing the consortium program and Clearinghouse registration working together, with queries and reporting flowing between them. Frames the pair as a driver-compliance set with DQ files. Inline `/fmcsa-clearinghouse-registration/` and `/driver-qualification-files/` links as Steel anchors. This diagram is the consortium-page counterpart to the Clearinghouse page's diagram, drawn from the consortium's point of view.

9. Driver-compliance cluster cross-link strip: the deliberate cluster handoff, identical pattern to the other two cluster pages for consistency. Compact line-icon strip with contextual anchors "FMCSA Clearinghouse" -> `/fmcsa-clearinghouse-registration/` and "driver qualification files" -> `/driver-qualification-files/`, framed as the rest of the driver-compliance set. Cloud surface, Steel anchors.

10. Funnel cross-link forward to dispatch (optional per brief, include it): the system's styled compliance-to-dispatch handoff, one line with a 1 to 3 word anchor to `/services/`. Steel, subordinate.

11. H2 "Drug and alcohol consortium FAQ": the system FAQ accordion (FAQPage schema). Five rows from the brief. The "Does every carrier need this?" answer is the honest-expectations moment (applicability varies); the cost answer restates `$150` and `$100` in mono inline; the Clearinghouse answer carries the inline link. Chevron respects reduced motion.

12. Closing CTA band: one line ("Driving a CDL vehicle? Get into a compliant testing program before you haul.") plus the single dominant button "Enroll in a consortium" -> same destination as the hero CTA.

13. Mega-footer (global).

## Hierarchy and the visual path
Eye path: H1 -> primary amber CTA -> tracker -> the pool-of-one framing callout (the page's distinct hook) -> includes + the $150/$100 chips -> pre-employment section with the worked example -> the consortium/Clearinghouse pairing -> cluster strip -> FAQ -> single closing CTA. Signal amber is rationed to the primary action only (hero and close). The two emphasis callouts (pool-of-one, worked example) use the Steel-rule quiet treatment, never amber, so they read as credibility, not CTAs. One primary action per view.

## Imagery and illustration
No photography. Assets: the Authority Status Tracker in the hero; the consortium/Clearinghouse two-node line diagram in section 8; one small line icon per included item and per applicability bullet; small icons in the cluster strip. The pre-employment worked example is typographic (Steel rule + Slate text), not illustrated. All single-line SVG from the system, lightweight for CWV. No decorative icon triplet.

## Motion
Minimal. Hero tracker staggered reveal (<=200ms steps). The section-8 diagram may draw its connector once on first view (<=200ms). Accordion chevron. No per-section scroll-fade; the two callouts render static (no count-up on the 30-day figure). `prefers-reduced-motion` gives final states.

## CRO treatment
- One dominant action (enroll in a consortium), Signal amber, repeated at hero and close, same destination.
- The pool-of-one framing is the page's persuasion lever: it converts vague "do I need this" into a concrete reason, so it gets quiet visual prominence.
- The worked example is honest proof of competence (we caught a timing problem), not a metric or testimonial; it sits in the credibility treatment, not a glossy card.
- Pricing as a trust asset: $150 enrollment and $100 pre-employment shown in mono from the single source, Clearinghouse cost shown separately so nothing reads as a hidden bundle.
- Honest applicability (the "we confirm" qualifier and the FAQ answer) reduces bounce.
- Mobile: sticky bottom bar with the primary CTA plus a tel: Call button; copy-first hero; tracker vertical.

## OG image
Unique branded OG from the template: Ink field, mono wordmark, title "Drug & Alcohol Consortium", category tag "Compliance" in Plex Mono, one relevant line icon (a testing/clipboard or shield glyph), a Signal rule. No seal lookalike, no placeholder.

## What Dev must preserve
- SEO copy, the heading structure (including the pre-employment section as its own H2), every internal link and destination, the worked example wording, and the prices exactly. The lede, the emphasis callouts, and the "Reviewed by" line are styled paragraphs, never H-tags.
- Price chips from the single source (`services.md`): the $150 enrollment and $100 pre-employment test, with the Clearinghouse $100 shown separately and never blended.
- The worked example stays distinct from the DQ-files telling of the same carrier; do not unify the wording.
- Amber-never-white-text; one Signal action per view; AA contrast; visible focus; reduced motion.
- Authority Status Tracker honesty rules: no guaranteed date, no countdown, no implied government affiliation. Do not claim every carrier needs a consortium (applicability varies, do-not-publish list).
- Documented proof only; no invented figures or ratings. Decorative glyphs and check marks via CSS or inline SVG, never typed into headings.
