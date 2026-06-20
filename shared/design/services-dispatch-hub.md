# Page design spec: /services/ (Dispatch services hub)

Design-only spec. Consumes `shared/page-briefs/services-dispatch-hub.md`. SEO owns copy, headings, CTA wording and destinations, and the trailer list; this defines look, layout, hierarchy, components, imagery, motion, and the conversion path. Built on `design-system.md`. No em dashes.

## Page role
The front door to the dispatch silo, the mirror of `/compliance-services/` but tuned to retention, not acquisition. One job: a carrier who is already (or soon to be) road-legal understands "they keep my truck loaded, by load, no lock-in," picks their trailer type, and is moved to the single consultation action. This is the dispatch counterpart to the compliance hub, so it deliberately echoes that structure (hero, the cards grid, pricing block, funnel bridge, FAQ, close) while reading as the second silo: Steel-accented, no Authority Status Tracker. Dispatch does not sell activation, it sells "keep loaded," so the signature tracker stays on the compliance side.

## Section order and layout

1. Header (global): the shared sticky header and matching mega-footer (the complete service lists live in the footer). Persistent primary CTA carries this page's single action "Get dispatched".

2. Hero (Paper, asymmetric two-column; copy-first stack on mobile)
   - Left (dominant): H1 "Truck Dispatch Service for Owner-Operators and Fleets" (Archivo). The brief's hero lede as a styled Plex Sans Body L paragraph, never an H-tag. Then the single primary button "Get dispatched" (Signal amber, Ink text) routing to the brief's destination (`/contact-us/` consultation, route is Dev's `[VERIFY]`). A small "Reviewed by Robert Hooke, Co-Founder" credibility line under the lede (mono label + name), matching the compliance hub's reviewed-by placement.
   - Right (the dispatch signature visual, NOT the tracker): a quiet line-style "loaded loop" diagram, a small two or three node cycle (find load -> negotiate -> rolling -> repeat) in the system's single-line language with one Steel accent. It says "we keep the wheels turning" without promising numbers, and it visually distinguishes this hub from the compliance hub's status tracker. No deadhead or revenue figures anywhere in it.
   - 5-second test: H1 names the service and audience, the lede names "keeps you loaded, no forced dispatch," the loop diagram shows the ongoing cycle. The amber "Get dispatched" is the single Signal element above the fold.

3. H2 "What our truck dispatch service does": a five-item capability list rendered as a clean line-icon list (not the decorative icon-triplet reflex, these are content-bearing rows). One single-line icon per row (load match, rate negotiation, route planning, billing/paperwork, support), Archivo micro-label plus the brief's one-line description in Plex Sans. Two columns on desktop, single column on mobile. The closing "we dispatch owner-operators and small fleets" line sits as a styled lead-out paragraph under the list. Cloud surface.

4. H2 "Dispatch by trailer type": the canonical dispatch trailer-card grid (this is the dispatch counterpart to the compliance hub's service-card grid, designed once and reused on each dispatch page's "siblings" context). Six trailer cards, responsive grid (3-up desktop, 2-up tablet, 1-up mobile), equal-height, Cloud surface, 1px Slate-at-16% outline. Each card = the trailer's distinct single-line icon (box truck, reefer, flatbed, dry van, power only, hot shot) + trailer name as a Steel link + one-line value + the exact destination from the brief. Box truck dispatch is the franchise: give its card a subtle "most established" emphasis (a small mono tag "MOST ESTABLISHED", a 1.5px Steel left rule, no glow, no amber), so it leads the grid without breaking the equal-height rhythm. Paper surface band so the card grid (Cloud) lifts off it.

5. H2 "Truck dispatch service pricing": the percentage-by-equipment model, rendered in the mono "price" treatment from the single source, not the 3-state price chip (this is a rate model, not a per-service fee). A compact mono rate table: box trucks 8%, cargo vans 5%, flatbeds and reefer vans 3%, each "% of gross monthly revenue" in Plex Mono with tabular figures. Unconfirmed equipment percentages (dry van, power only, hot shot) are shown via the brief's `[VERIFY]` discipline: do not invent a row; if a percentage is not in the single source, render "Contact for quote" in mono for that equipment rather than a guessed number. Beneath the table, the "no long-term contract, no forced dispatch, no sign-up lock-in" line set as a styled trust lead-out (this is the dispatch trust signal, the equivalent weight to compliance fee-transparency). The "we earn only when you do" framing reads as the model's rationale, not an outcome claim. Cloud surface.

6. H2 "New authority? We can do both halves": the funnel cross-link back to acquisition, designed as a deliberate styled handoff (the dispatch-to-compliance bridge, the reverse of the compliance hub's dispatch bridge), not an afterthought link. A full-bleed Ink band (the system reserves Ink for these bridge moments), a simple two-node line diagram (Get road-legal -> Keep loaded) reinforcing the one-team story. Inline 1 to 3 word contextual links "compliance services" -> `/compliance-services/` and "guide to starting a trucking company" -> `/how-to-start-a-trucking-company/`. No second primary button competes with the hero/close action here; these are inline anchors.

7. H2 "Why carriers choose Tech Rig dispatch": the design-system trust band, documented proof only. The since-2021 / around 100 carriers figure in the mono "official record" treatment as a small stat line. Partner names (OTR Solutions, RTS Financial) as plain text in the factoring line. "Every major trailer type, specialists per equipment" and the no-contract/no-forced-dispatch points as short typographic value lines, not glossy cards. The graceful empty-friendly review slot per the system: no ratings, no stars, no invented testimonials. Paper surface.

8. H2 "Truck dispatch FAQ": the system FAQ accordion (FAQPage schema). One question per row, chevron rotates (respects reduced motion). The pricing answer mirrors the mono rate model; the "can you set up my authority too?" answer carries the inline "compliance services" -> `/compliance-services/` link. Cloud surface.

9. Closing CTA band: one styled lead line plus the single dominant button "Get dispatched" (Signal amber, Ink text), same destination as the hero. One clear action, no co-equal second button.

10. Mega-footer (global): the complete dispatch and compliance lists live here.

## Hierarchy and the visual path
Eye path on first view: H1 -> primary amber "Get dispatched" -> the trailer-card grid (the carrier self-selects equipment) -> the mono pricing model -> proof -> FAQ -> single closing CTA. Signal amber is rationed to the one action (hero and close, plus the persistent header CTA). Every trailer-card link, every funnel anchor, and the partner names are Steel or Ink and subordinate. The franchise (box truck) card is emphasized within the grid by Steel weighting and a mono tag, never by amber. One primary action per view.

## Imagery and illustration
No photography. Hero: the line-style "loaded loop" diagram (Steel accent), distinct from the compliance tracker. Capability list: one single-line icon per row. Trailer grid: the six distinct trailer line icons from the system's trailer set. Funnel band: the two-node Get road-legal -> Keep loaded diagram. All single-line SVG, 2px stroke, lightweight to protect the weak CWV baseline SEO flagged.

## Motion
Minimal. Hero loop diagram animates one calm cycle on load (<=200ms per node) then rests, so it reads as "ongoing" without looping endlessly while the user reads. Accordion chevron rotates. Sticky mobile CTA appears after the hero scrolls past. No per-section scroll-fade. `prefers-reduced-motion` gives the static final state (loop shown complete, no animation).

## CRO treatment
- One dominant action (Get dispatched), Signal amber, repeated at hero and close and held in the sticky header; everything else subordinate. Dispatch pages drive to consultation, per the system.
- The trailer-card grid is the primary self-selection device: the carrier finds their equipment and routes to the matching money page in one move.
- Pricing as a trust asset: the percentage model is shown openly in mono, not hidden; "no forced dispatch / no contract" is the dispatch equivalent of compliance fee-transparency and is given real visual weight.
- The funnel bridge is a deliberate CRO feature: dispatch links back to compliance upkeep and acquisition as a styled Ink handoff, reinforcing the one-team advantage.
- Honest proof only: the since-2021 / ~100 carriers line and partner names persuade; no revenue, deadhead, or time-savings percentages.
- Mobile: sticky bottom bar with the "Get dispatched" CTA plus a tel: Call button; copy-first hero stack; trailer cards stack to one column.

## OG image
Unique branded dispatch OG from the system template: Ink or Paper field, mono wordmark, title "Truck Dispatch", category tag "Dispatch" in Plex Mono, one trailer line icon, a Signal rule. Never a placeholder.

## What Dev must preserve
- SEO copy, the heading structure, every internal link and destination, and the trailer list exactly. The hero lede, the reviewed-by line, and all trust lead-ins are styled paragraphs, never H-tags.
- The percentage rate model rendered from the single source; unconfirmed equipment percentages use "Contact for quote" in mono, never a guessed number. No percentage hardcoded.
- The Authority Status Tracker is NOT used on this page (dispatch emphasizes "keep loaded," not activation).
- Amber-never-white-text; one Signal action per view; AA contrast; visible keyboard focus; reduced-motion behavior; hit targets >=44px.
- Documented proof only: the since-2021 / ~100 carriers line and the partner names. No performance, deadhead, or time-savings percentages and no star ratings anywhere.
- The franchise (box truck) emphasis is Steel/mono only, never amber. Trailer and capability glyphs and any check marks via inline SVG or CSS, never typed into headings.
