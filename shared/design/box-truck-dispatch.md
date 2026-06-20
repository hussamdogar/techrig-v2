# Page design spec: /box-truck-dispatch/ (Box truck dispatch, franchise)

Design-only spec. Consumes `shared/page-briefs/box-truck-dispatch.md`. SEO owns copy, headings, CTA wording and destinations; this defines look, layout, hierarchy, components, imagery, motion, and the conversion path. Built on `design-system.md`. This is the franchise page and the reference trailer page: it is the fullest trailer treatment, and `dispatch-trailer-pages.md` is the template that inherits from it. No em dashes.

## Page role
The franchise dispatch money page and the most established service: it carries real ranking signals (82 clicks, 32.6k impressions) and a live `/cost/` child. One job: a box truck owner-operator understands "this is the dispatch built for how box trucks actually earn," sees the flat 8% model openly, and is moved to the single consultation action. PRESERVE intent: deepen, never thin. Same trailer-page skeleton the other five inherit, but the fullest version, and the canonical reference for the template spec. No Authority Status Tracker (dispatch emphasizes "keep loaded").

## Section order and layout

1. Header (global): shared sticky header and matching mega-footer. Persistent primary CTA carries this page's action "Get my box truck dispatched".

2. Hero (Paper, asymmetric two-column; copy-first stack on mobile)
   - Left (dominant): H1 "Box Truck Dispatch Service" (Archivo). The brief's hero lede (the box-truck load-profile framing, including "our most established dispatch service") as a styled Plex Sans Body L paragraph, never an H-tag. Then the single primary button "Get my box truck dispatched" (Signal amber, Ink text) routing to the brief's destination (`/contact-us/` or onboarding, route is Dev's `[VERIFY]`).
   - Right (the trailer-page signature visual): the box truck single-line icon from the system's trailer set, shown at spot-illustration scale (two-tone Ink/Steel line, flat Paper/Signal fill on one accent element only), with a quiet line motif of short regional load nodes around it to signal the box-truck load profile (more, shorter, local runs). This is the reference for how every trailer page renders its hero visual: the trailer's own icon enlarged, no photography, one accent. No utilization or revenue numbers in the art.
   - 5-second test: H1 names the service, the lede names the box-truck angle and "most established," the enlarged box-truck icon makes the equipment unmistakable. The amber CTA is the single Signal element above the fold.

3. H2 "What our box truck dispatch service covers": the five-item capability list in the system's line-icon-row treatment (content-bearing rows, not the decorative icon-triplet), each row = single-line icon + the brief's line. Two columns desktop, one column mobile. Cloud surface. This is the shared "what we cover" block the template inherits, with box-truck-specific copy (regional and local lanes) preserved exactly.

4. H2 "Built for box truck owner-operators": the equipment-specific differentiator, the page's unique angle. Lay out as a typographic emphasis block, not a card grid: a bold styled lead-in (styled paragraph, not an H-tag) plus the brief's "we watch the boards so you can drive" copy, set beside a small line motif of a box truck against a busy load board to make the "more, shorter loads" point visually. The inline "guide to starting a box truck business" -> `/how-to-start-a-box-truck-business/` link sits on a 1 to 3 word anchor inside the copy. Paper surface so it reads as a distinct beat from the capability list.

5. H2 "Box truck dispatch pricing": the flat 8% model in the mono "price" treatment from the single source. Render the headline rate as a single mono figure ("8% of gross monthly revenue", Plex Mono, tabular figures), the simplest state of the dispatch rate model. Beneath it, the "no long-term contract, no forced dispatch, no lock-in" line as a styled trust lead-out, and the inline "box truck dispatch cost" -> `/box-truck-dispatch/cost/` link on a 1 to 3 word anchor (the live `/cost/` child must keep its link). The "we earn a percentage, so keeping your rates and utilization high is our job too" line reads as the model's rationale, not an outcome claim. Cloud surface.

6. H2 "Need your authority first?": the funnel cross-link back to acquisition, designed as a deliberate styled handoff (the reverse of the compliance funnel-forward), not an afterthought. A full-bleed Ink band (the system's bridge treatment) with a simple two-node line diagram (Get road-legal -> Keep loaded) and the brief's "same team that gets you road-legal keeps you loaded after" copy. Inline "compliance services" -> `/compliance-services/` link. No second primary button competes here.

7. H2 "Box truck dispatch FAQ": the system FAQ accordion (FAQPage schema), one question per row, chevron rotates (respects reduced motion). The cost answer carries the inline "cost page" -> `/box-truck-dispatch/cost/` link; the authority answer carries "compliance services" -> `/compliance-services/`. Cloud surface.

8. Closing CTA band: one styled lead line plus the single dominant button "Get my box truck dispatched" (Signal amber, Ink text), same destination as the hero. One clear action.

9. Mega-footer (global): complete service lists live here.

## Hierarchy and the visual path
Eye path: H1 -> primary amber "Get my box truck dispatched" -> the box-truck differentiator (the unique reason to choose this) -> the flat 8% mono pricing -> the funnel bridge -> FAQ -> single closing CTA. Signal amber is rationed to the one action (hero, close, persistent header). The two internal links (`/cost/`, `/compliance-services/`) and the box-truck-business anchor are Steel and subordinate. One primary action per view.

## Imagery and illustration
No photography. Hero: the box truck trailer icon at spot-illustration scale with the regional-load-node motif (the reference pattern for all trailer heroes). Capability list: one single-line icon per row. Differentiator: a small box-truck-against-load-board line motif. Funnel band: the two-node Get road-legal -> Keep loaded diagram. All single-line SVG, 2px stroke, lightweight for CWV. The box truck line icon must match the one used on its dispatch-hub card so the franchise reads consistently across pages.

## Motion
Minimal. Hero visual gets a calm one-time fade/slide-in (<=200ms) on load. Accordion chevron rotates. Sticky mobile CTA appears after the hero scrolls past. No per-section scroll-fade. `prefers-reduced-motion` gives the static final state.

## CRO treatment
- One dominant action (Get my box truck dispatched), Signal amber, repeated at hero and close and held in the sticky header; everything else subordinate.
- The equipment-specific differentiator does the persuading: it answers "why this dispatch for my box truck" before pricing, reducing bounce from carriers comparing generic dispatchers.
- Pricing as a trust asset: the flat 8% is shown openly in mono, with "no forced dispatch / no contract" given real visual weight (the dispatch trust equivalent of fee-transparency).
- The `/cost/` link is a deliberate decision-stage handoff to the ranking child page, not buried.
- The funnel bridge links back to compliance upkeep and acquisition as a styled Ink handoff (the one-team advantage).
- Honest proof only: "most established service" and the dispatch-since-2021 context persuade; no utilization, revenue, or empty-mile percentages. 8% is the price, not an outcome.
- Mobile: sticky bottom bar with the CTA plus a tel: Call button; copy-first hero stack.

## OG image
Unique branded OG from the system template: Ink or Paper field, mono wordmark, title "Box Truck Dispatch", category tag "Dispatch" in Plex Mono, the box truck line icon, a Signal rule. Never a placeholder.

## What Dev must preserve
- SEO copy, the heading structure, every internal link and destination, and all existing ranking headings and terms exactly. Deepen, never strip. The hero lede and bold differentiator lead-in are styled paragraphs, never H-tags.
- The URL `/box-truck-dispatch/` and the live `/box-truck-dispatch/cost/` child link must stay; do not drop internal links or headings that already rank.
- The 8% rate rendered from the single source in mono; no percentage hardcoded.
- The Authority Status Tracker is NOT used on this page.
- Amber-never-white-text; one Signal action per view; AA contrast; visible keyboard focus; reduced-motion behavior; hit targets >=44px.
- Documented proof only: "most established" and the since-2021 context. No utilization, revenue, or time-savings percentages and no star ratings.
- Trailer and capability glyphs and any check marks via inline SVG or CSS, never typed into headings.
