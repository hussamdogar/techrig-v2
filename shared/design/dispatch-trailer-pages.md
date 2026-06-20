# Page design spec: dispatch trailer pages (template) (reefer, flatbed, dry van, power only, hot shot)

Design-only spec. Consumes `shared/page-briefs/dispatch-trailer-pages.md`. SEO owns copy, headings, CTA wording and destinations per trailer; this defines the shared look, layout, hierarchy, components, imagery, motion, and conversion path for the five remaining trailer spokes, plus the per-trailer deltas. Built on `design-system.md`. The franchise reference is `box-truck-dispatch.md`: these five inherit its layout exactly and differ only in the deltas below. No em dashes.

This is a TEMPLATE spec. It covers `/reefers-trucking/`, `/flatbed-dispatch/`, `/dry-van-trucking/`, `/power-only-trucking/`, `/hot-shot-trucking/`. Apply the shared layout to all five; apply each trailer's row from the deltas table.

## Page role
Each is a trailer-specific dispatch money page, a sibling of the franchise. One job per page: a carrier on that equipment understands "this dispatch is tuned to my freight," sees the percentage model, and is moved to the single consultation action. PRESERVE intent: REFRESH and deepen existing pages, keep ranking signals and any live `/cost/` child (dry van has one). No Authority Status Tracker (dispatch emphasizes "keep loaded"). Same skeleton as the franchise; uniqueness comes from the lead angle, the worked scenario, the trailer icon, and the sibling links, never from a different structure.

## Shared layout (identical to the franchise, `box-truck-dispatch.md`)
Render every trailer page with this section order, inheriting the franchise's component choices:

1. Header (global): shared sticky header and matching mega-footer. Persistent primary CTA carries the page's single action (the brief's CTA wording for that trailer).

2. Hero (Paper, asymmetric two-column; copy-first stack on mobile)
   - Left (dominant): H1 (the brief's trailer H1, Archivo). The brief's equipment-specific hero lede as a styled Plex Sans Body L paragraph, never an H-tag. Then the single primary button (the brief's CTA, Signal amber, Ink text), route is Dev's `[VERIFY]`.
   - Right (signature visual): that trailer's own single-line icon at spot-illustration scale (two-tone Ink/Steel line, one accent fill), following the franchise hero pattern. The supporting line motif around the icon expresses the trailer's lead angle (see deltas), not generic load nodes. No revenue or utilization numbers.

3. H2 "What our [trailer] dispatch covers": the system line-icon-row capability list (content-bearing rows, not the decorative icon-triplet), two columns desktop, one column mobile. Cloud surface. Copy is the brief's, preserved exactly.

4. Equipment-specific differentiator H2 (the brief's distinct angle for that trailer): the typographic emphasis block from the franchise (bold styled lead-in plus copy, beside a small line motif), Paper surface. This is where each page's worked scenario lives: render it as the system's quiet example callout (left 1.5px Steel rule, Slate text), matching how the compliance hub sets apart its worked example. Where the brief marks `[CLIENT PROOF NEEDED]`, use the graceful empty-friendly proof/example slot from the system: it reads as research-led framing while empty and accepts a real story later, no invented testimonial, no fabricated names.

5. Pricing H2: the percentage model in the mono "price" treatment from the single source, the same component as the franchise's 8% figure. Flatbed and reefer render 3% of gross in mono. For dry van, power only, and hot shot, the percentage is NOT in the single source: do not guess a number. Render "Contact for quote" in the mono treatment for those until confirmed (the brief's `[VERIFY]` discipline), with the "no long-term contract, no forced dispatch" trust lead-out beneath. Cloud surface.

6. "Need authority first?" funnel H2: the franchise's styled Ink bridge band with the two-node Get road-legal -> Keep loaded diagram and an inline "compliance services" -> `/compliance-services/` link. No second primary button.

7. FAQ H2: the system FAQ accordion (FAQPage schema), chevron rotates (reduced motion respected). Cloud surface.

8. Closing CTA band: one styled lead line plus the single dominant primary button (the brief's CTA wording), same destination as the hero.

9. Mega-footer (global).

## Per-trailer deltas
Everything else is shared; change only these per page.

| Page | Trailer line icon | Hero motif / lead angle (visual expression of the brief angle) | Worked-scenario callout | Pricing (mono) | Lateral sibling links |
|---|---|---|---|---|---|
| `/reefers-trucking/` | reefer (box trailer with a cooling-unit accent) | Tight appointment-window and seasonality motif: a clock/temperature accent on the load nodes to read "temperature-controlled, time-critical." | `[CLIENT PROOF NEEDED]` graceful slot, research-led: a reefer carrier through a seasonal market shift. | `3%` of gross, mono. | Cross-link to a relevant sibling (e.g. dry van) where the brief allows; up to `/services/`. |
| `/flatbed-dispatch/` | flatbed (open deck, no walls) | Open-deck motif: securement/tarping and an oversize-permit accent on a steel/lumber lane. | `[CLIENT PROOF NEEDED]` graceful slot: a flatbed owner-operator on building-materials lanes. | `3%` of gross, mono. | Up to `/services/`; sibling where relevant. |
| `/dry-van-trucking/` | dry van (enclosed trailer) | Volume-workhorse motif: high load availability shown as a dense node field, with a rate-protection accent (negotiation matters most under rate compression). | `[CLIENT PROOF NEEDED]` graceful slot: a dry van carrier protecting rate per mile in a soft market. | `Contact for quote` in mono until `[VERIFY]` confirmed. Keep the live `/dry-van-trucking/cost/` child link in the pricing block. | Up to `/services/`; `/dry-van-trucking/cost/`; sibling where relevant. |
| `/power-only-trucking/` | power only (tractor only, no trailer) | Drop-and-hook motif: a tractor coupling to supplied trailers from carriers/3PLs, an efficiency-loop accent. | Real NC power-only client context, but ONLY on dispatch utilization (drop-and-hook), worded so no sentence matches the compliance pages that use this client. Not a `[CLIENT PROOF NEEDED]` placeholder. | `Contact for quote` in mono until `[VERIFY]` confirmed. | Up to `/services/`; sibling where relevant. |
| `/hot-shot-trucking/` | hot shot (dually pickup + gooseneck) | Expedited motif: a dually + gooseneck on fast MDT/expedite lanes, a speed accent; often new-authority CDL operators. | Real MD hotshot client context (Ram 3500 dually), ONLY on expedited-run utilization, worded so no sentence matches the UCR compliance telling. Not a `[CLIENT PROOF NEEDED]` placeholder. | `Contact for quote` in mono until `[VERIFY]` confirmed. | Up to `/services/`; sibling where relevant. |

Each trailer's hero icon must match the icon used for that trailer on the dispatch-hub card, so the silo reads consistently page to page.

## Hierarchy and the visual path
Identical to the franchise: H1 -> primary amber CTA -> the equipment differentiator and worked scenario (the unique reason to choose this) -> the mono pricing -> the funnel bridge -> FAQ -> single closing CTA. Signal amber rationed to the one action (hero, close, persistent header); all internal and sibling links are Steel and subordinate. One primary action per view.

## Imagery and illustration
No photography. Each page: its own trailer line icon at spot-illustration scale (hero) and at row scale (capability list and any sibling references), plus the per-trailer motif from the deltas. Funnel band: the shared two-node diagram. All single-line SVG, 2px stroke, lightweight for CWV. The five trailer icons are distinct from each other and from the box truck, per the system's trailer icon set.

## Motion
Minimal, identical to the franchise. Hero visual gets one calm fade/slide-in (<=200ms) on load. Accordion chevron rotates. Sticky mobile CTA appears after the hero. No per-section scroll-fade. `prefers-reduced-motion` gives static final states.

## CRO treatment
- One dominant action per page (the brief's CTA), Signal amber, repeated at hero and close and held in the sticky header; everything else subordinate.
- The equipment differentiator plus the worked scenario do the persuading and carry the uniqueness, so each page reads as purpose-built rather than a swapped-noun template.
- Pricing as a trust asset: confirmed percentages (reefer, flatbed 3%) shown openly in mono; unconfirmed ones show "Contact for quote," never a guessed number. "No forced dispatch / no contract" given real visual weight on every page.
- The funnel bridge links back to compliance upkeep and acquisition as a styled Ink handoff (the one-team advantage); dry van also surfaces its `/cost/` decision page.
- Honest proof only: the two real client contexts (power only, hot shot) used on a dispatch facet only; the other three use the graceful empty proof slot. No performance, utilization, or time-savings percentages; the percentage is the price, not an outcome.
- Mobile: sticky bottom bar with the page's CTA plus a tel: Call button; copy-first hero stack; capability rows and cards stack to one column.

## OG image
Unique branded OG per trailer page from the system template: Ink or Paper field, mono wordmark, the trailer's title (e.g. "Reefer Dispatch"), category tag "Dispatch" in Plex Mono, that trailer's line icon, a Signal rule. Five distinct OGs, one per page. Never a placeholder.

## What Dev must preserve
- SEO copy, the heading structure, every internal link and destination, and all existing ranking headings and terms exactly, per page. Deepen, never strip. Hero ledes and bold differentiator lead-ins are styled paragraphs, never H-tags.
- Existing URLs, and the live `/dry-van-trucking/cost/` child link in the dry van pricing block; do not drop ranking headings or internal links.
- Percentages from the single source: reefer and flatbed render 3% in mono; dry van, power only, and hot shot render "Contact for quote" until `[VERIFY]` confirmed. No percentage hardcoded or guessed.
- The Authority Status Tracker is NOT used on any trailer page.
- The two real client contexts (power only NC, hot shot MD) appear on the dispatch utilization facet only and must not reuse any sentence from the compliance pages; the other three use the graceful empty proof slot with no invented story or name.
- Amber-never-white-text; one Signal action per view; AA contrast; visible keyboard focus; reduced-motion behavior; hit targets >=44px.
- Documented proof only; no performance, utilization, or time-savings percentages and no star ratings on any page.
- Trailer and capability glyphs and any check marks via inline SVG or CSS, never typed into headings.
