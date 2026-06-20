# Page design spec: /boc-3-filing/ (BOC-3 Filing)

Design-only spec. Consumes `shared/page-briefs/boc-3-filing.md`. SEO owns copy, headings, CTA wording and destinations, the pricing facts, and the exact FMCSA wording; this defines look, layout, hierarchy, components, imagery, motion, and the conversion path. Built on `design-system.md`. No em dashes.

## Page role
A compliance money page for a one-time filing, BOFU. One job: a carrier (or broker) who needs a BOC-3 to activate authority files it directly through Tech Rig, an FMCSA-listed blanket process agent, for a flat $100. The page leans on two assets no competitor can borrow: the FMCSA-listed status (worded, never a badge) and the "direct, not outsourced" angle. It also corrects two common myths, that a BOC-3 is an annual renewal and that it is a printed certificate. Follows the compliance money-page template; visually consistent with the hub and the other filing pages, distinguished by the FMCSA-listed credibility treatment and the North Carolina power-only worked example. This is the simplest, fastest filing on the silo, so the design should feel quick and frictionless.

## Section order and layout

1. Header (global): per `global-footer.md`. Page primary action is "File my BOC-3"; the global header keeps its standard CTA.

2. Hero (Paper, asymmetric two-column; copy-first stack on mobile)
   - Left: H1 "BOC-3 Filing (Blanket Process Agent)" (Archivo). The brief's hero lede as a styled paragraph in Plex Sans Body L (never an H-tag), including the exact line "DGR Tech Rig LLC is officially listed by FMCSA as a BOC-3 blanket process-agent company". That FMCSA-listed clause is set as a worded credibility line, lightly emphasised (Steel weight or a left Steel rule), never a seal, badge, or government-style emblem. Primary button "File my BOC-3" (Signal amber, Ink text) routing to `https://boc-3.techrig.org` (existing form/subdomain). Small "Reviewed by Adam Smith, Co-Founder" credibility line under the lede (mono label + name).
   - Right (signature visual): the Authority Status Tracker, scoped to show BOC-3 as a prerequisite that unblocks the sequence. Frame BOC-3 as the gate before "Authority active": highlight the dependency ("no BOC-3, no active authority") by showing the BOC-3 designation as the step that lets the application proceed to the protest period and activation. Honesty rules apply: no guaranteed dates. Because BOC-3 is one-time, this instance carries NO annual-renewal marker (the deliberate visual contrast with the UCR page).

3. H2 "What a BOC-3 is" (Cloud surface): the what-it-is block. Plain copy at the standard measure. A small line diagram illustrates the "blanket" concept: one filing fanning out to all 50 states (a single node to a US-wide spread of state nodes), which makes "blanket process agent covers all 50 states in one filing" instantly legible. Crucially, the copy and any visual must NOT depict a printed certificate or an FMCSA-issued PDF: show it as an electronic filing posting to the public FMCSA record (a record/screen line motif, not a stamped paper certificate).

4. H2 "Who needs a BOC-3, and when" (Paper surface): a short line-led list (applying for an MC number, brokers and forwarders, filed once during setup). The "Important" myth-correction (a BOC-3 is not an annual renewal; UCR by contrast is annual) set as a quiet callout with a left Steel rule and Slate text. The inline contextual links MC number (`/mc-registration/`) and UCR (`/ucr-registration/`) are Steel inline links exactly as written. This honest "you only file it once" framing is a trust asset, not a missed upsell, so give it clean space.

5. H2 "How our BOC-3 filing works" (Cloud surface): the process, rendered as a clean numbered stepper in the line system (numbered 01 to 04 is correct here, it is a genuine sequence). Horizontal connected steps on desktop, vertical on mobile, Grade 8 copy. The lead-in "Because we are an FMCSA-listed blanket process agent, your BOC-3 is direct, not outsourced" set as a styled emphasis line above the stepper (the differentiator). Step 1 carries the inline BOC-3 form link to `https://boc-3.techrig.org`.
   - Price line directly under the stepper, in the price-chip treatment from the single source: a flat chip "$100" labelled "BOC-3 filing, one time", paired with a quiet bundle option chip "$200" labelled "BOC-3 + UCR, 0 to 2 vehicle bracket". Mono, tabular figures. No government fee applies to the BOC-3 service itself, so no gov-fee line is forced here.
   - Mid-page CTA: text link "File my BOC-3" (Steel), same route. Not a second amber button.

6. H2 "BOC-3 as part of getting road-legal" (Paper surface): this page's unique worked example, set apart as a quiet example callout (left Steel rule, Slate text). The North Carolina power-only carrier story (a simple BOC-3 request that surfaced a MOTUS PIN lockout, resolved with paper filings and an FMCSA callback). It demonstrates depth without metrics, real past case framed as such, and ties back to the "we catch what blocks activation" theme. No guaranteed-timeline styling.

7. H2 "BOC-3 filing FAQ" (Cloud surface): the system FAQ accordion (FAQPage schema). Two answers do load-bearing myth-correction and must read clearly: "Do I have to renew my BOC-3 every year?" (No) and "Is the BOC-3 a certificate I print?" (No, electronic, on your FMCSA record). The "Can you file my BOC-3 today?" answer leans on the FMCSA-listed direct-filing status; keep the government-processing caveat honest (no guaranteed timeline). Chevron rotates, respects reduced motion.

8. Closing CTA band (full-bleed Ink, the template's closing emphasis): the brief's closing line "Need a BOC-3 to activate your authority? File it directly with an FMCSA-listed process agent." as a styled paragraph, then the single dominant button "File my BOC-3" (Signal amber, Ink text) routing to `https://boc-3.techrig.org`. One action only.

9. Mega-footer (global): the complete filing list lives here.

## Hierarchy and the visual path
Eye path: H1 (with the FMCSA-listed credibility clause) -> primary amber CTA -> the tracker (BOC-3 as the gate to activation) -> what it is (blanket = all 50 states, electronic not certificate) -> who needs it + the not-annual correction -> how it works stepper + the flat $100 chip -> worked example -> FAQ -> single closing CTA. Signal amber is rationed to the primary "File my BOC-3" action (hero and close only); the mid-page CTA and every inline link are Steel and subordinate. One primary action per view. The FMCSA-listed status is emphasised through wording and placement, never through colour or a badge.

## Imagery and illustration
No photography. The Authority Status Tracker (BOC-3-as-gate variant, no annual marker) in the hero; the "blanket: one filing to all 50 states" line diagram in the what-it-is section (the page's signature explanatory asset); the how-it-works numbered stepper as a line diagram; small single-line icons on the "who needs it" list. The electronic-record motif (screen/record, not a paper certificate) is used wherever the filing artifact is shown. All single-line SVG from the system, 2px stroke, lightweight for CWV.

## Motion
Minimal. Hero tracker staggered reveal (<=200ms per step), the BOC-3 gate node emphasised last. Accordion chevron. The "blanket" diagram may draw its state-spread once on load (<=200ms, calm), not on scroll. No per-section scroll-fade, no count-up on the price. `prefers-reduced-motion` gives final static states (tracker resolved, diagram fully drawn, no animation).

## CRO treatment
- One dominant action, "File my BOC-3", Signal amber, repeated at hero and close, both routing to the existing `boc-3.techrig.org` form; the mid-page CTA is a subordinate Steel text link to the same route.
- The FMCSA-listed, direct-not-outsourced status is the primary conversion lever and is unique to this page; surface it in the hero and again in the how-it-works lead-in, always worded, never as a government seal.
- The flat $100 price (no government fee on the service) makes this the lowest-friction filing; show the single clear number early and keep the $200 UCR bundle as a quiet secondary, not a competing offer.
- Honest myth-correction (not annual, not a printed certificate) builds trust against competitors who upsell annual BOC-3 renewals; it reads as candour, which converts this buyer.
- Mobile: sticky bottom bar with "File my BOC-3" plus a tel: Call button; copy-first hero stack; the 50-state diagram and the stepper stack vertically.

## OG image
Unique branded OG from the system template: Ink field, mono wordmark, title "BOC-3 Filing", category tag "Compliance" in Plex Mono, one relevant line icon (process-agent / route-node or filing line icon, not a certificate), Signal rule. No placeholder.

## What Dev must preserve
- SEO copy, the heading structure, every internal link and destination, and the CTA wording exactly. The lede, the FMCSA-listed clause, the "direct, not outsourced" lead-in, and the "Important" not-annual note are styled paragraphs, never H-tags.
- The FMCSA wording exact: "officially listed by FMCSA as a BOC-3 blanket process-agent company." Never imply FMCSA endorsement, never style it as a badge, seal, or government emblem, and never imply Tech Rig is FMCSA.
- Do NOT depict or describe the BOC-3 as an FMCSA-issued certificate or PDF anywhere in copy or imagery; it is an electronic filing on the public FMCSA record.
- Do NOT present the BOC-3 as an annual renewal in copy, the tracker, or any visual.
- Price chips from the single source (`services.md`): the flat $100 state and the $200 BOC-3 + UCR bundle. No price hardcoded.
- Amber-never-white-text; one Signal action per view; AA contrast; visible focus; reduced motion.
- Documented proof only (the one real North Carolina worked example). No performance metrics, ratings, or invented testimonials. No guaranteed activation timeline; the government-processing caveat stays.
- Decorative glyphs and the 01 to 04 step numbers via CSS or inline SVG, never typed into headings; numbering used only because this is a real sequence.
