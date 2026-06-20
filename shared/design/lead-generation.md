# Page design spec: /lead-generation/ (Brokers that work with new authority)

Design-only spec. Consumes `shared/page-briefs/lead-generation.md`. SEO owns copy, headings, CTA wording and destinations, and the internal links; this defines look, layout, hierarchy, components, imagery, motion, and the conversion path. Built on `design-system.md`. No em dashes.

## Page role
The lead magnet for brand-new carriers: just got authority, brokers keep saying no, the "30-day authority" problem. One job: name that exact pain fast, position Tech Rig as the team that gets new-authority carriers loads and builds their track record, and move the visitor to one capture action. This is a conversion-focused bridge page that must interlink BOTH ways: back to compliance (we set you up) and forward to dispatch (we get you loads), because its audience straddles the two silos. It is a PRESERVE/REFRESH page that already ranks, so the design must keep the page legible for its ranking terms while deepening the new-carrier angle.

## Section order and layout

1. Header (global): the shared sticky header and matching mega-footer (per `global-footer.md`). Persistent primary CTA carries this page's single capture action "Get loads on new authority".

2. Hero (Paper, asymmetric two-column; copy-first stack on mobile)
   - Left (dominant): H1 "Finding Brokers That Work With New Authority" (Archivo). The brief's hero lede as a styled Plex Sans Body L paragraph, never an H-tag. The pain ("brokers that want to see 6 months or a year before they will give you a load") is the hook, so let that sentence carry weight. Then the single primary button "Get loads on new authority" (Signal amber, Ink text), routing to `/services/` or `/contact-us/` per the brief, Dev `[VERIFY]`. Reviewed-by is optional per the brief; if used, a small mono "Reviewed by Robert Hooke, Co-Founder" line under the lede linking to his founder anchor, otherwise omit cleanly.
   - Right (signature visual, the "break-in" device): a quiet line-style diagram of the new-authority problem resolving, a small two-stage line graphic reading "new MC, brokers say no -> dispatched, track record building -> more broker yeses," in the system's single-line language with one Steel accent. It visualizes the brief's mechanism (relationships plus a clean, growing track record) WITHOUT any numbers, percentages, or guaranteed timeline. This is the lead-gen counterpart to the money pages' tracker: it shows the path past the filter, honestly. No approval rates anywhere in it.
   - 5-second test: H1 names the exact problem, the lede names the 6-months/30-day filter, the diagram shows the way past it. The amber CTA is the single Signal element above the fold.

3. H2 "Why brokers avoid new authority": the plain-explanation block on Cloud surface, Grade 8 copy. Set the brief's "it is a filter, not personal" framing as a calm typographic explanation with one small single-line icon (a filter or gate with a Steel accent), no decorative triplet. The takeaway "the way past a filter is the right broker relationships plus a clean, growing track record" is pulled out as a short styled lead-in line, because it sets up the next section.

4. H2 "How we help new-authority carriers get loads": the value block, rendered as a clean line-icon list (content-bearing rows, not the decorative icon-triplet reflex). Three rows, each a single-line icon plus the brief's bullet in Plex Sans. The third bullet carries the inline contextual link [compliance services](/compliance-services/) on a 1 to 3 word Steel anchor, tying a clean compliance record to broker approval. Paper surface.

5. H2 "New authority? Start at the source": the two-direction funnel section, the page's defining feature, designed as a deliberate styled handoff (not afterthought links). Lay it out as two clear directional paths rather than one link list, so the both-ways bridge is legible at a glance:
   - Back to acquisition (no authority yet): inline [compliance services](/compliance-services/) and the [guide to starting a trucking company](/how-to-start-a-trucking-company/) on 1 to 3 word Steel anchors.
   - Forward to retention (already active): inline [dispatch service](/services/) on a 1 to 3 word Steel anchor, framed as "keeps you loaded while your authority ages into more approvals."
   - Render as a full-bleed Ink band (the system reserves Ink for these bridge moments) with a simple two-node line diagram, so the one-team, both-halves story reads instantly. No second amber button competes with the hero and close; these are inline contextual anchors. The brief also lists `/box-truck-dispatch/` as a link out, so include it as a quiet inline contextual anchor where the dispatch path is introduced (for the franchise-equipment carrier), without crowding the primary `/services/` route.

6. H2 "New authority loads FAQ": the system FAQ accordion (FAQPage schema). One question per row, chevron rotates (respects reduced motion). The "how long until more brokers work with me" answer is the honest-expectations moment: it varies, no promised timeline, a clean track record opens doors. The "can you both set up my authority and find me loads" answer carries the inline [compliance](/compliance-services/) and [dispatch](/services/) links, reinforcing the one-team advantage. Cloud surface.

7. Closing CTA band: the brief's closing line "New authority and no loads? We will help you break in and keep you moving." as a styled lead paragraph, plus the single dominant button "Get loads on new authority" (Signal amber, Ink text), same destination as the hero. One clear capture action, no co-equal second button.

8. Mega-footer (global): the complete service lists live here.

## Hierarchy and the visual path
Eye path on first view: H1 -> primary amber "Get loads on new authority" -> the break-in diagram -> why brokers avoid new authority -> how we help -> the two-way funnel bridge -> FAQ -> single closing CTA. Signal amber is rationed to the one capture action (hero, close, and the persistent header CTA). The optional reviewed-by name, every funnel anchor, and all internal links are Steel or Ink and subordinate. One primary action per view. The page reads as a focused conversion path while still surfacing its ranking-term language in the headings and lede.

## Imagery and illustration
No photography. Hero: the line-style "break-in" diagram (new MC -> dispatched, track record building -> more yeses), Steel accent, no numbers. "Why brokers avoid": one filter/gate line icon. "How we help": one single-line icon per row (point to brokers, dispatch you, keep compliance airtight). Funnel band: the two-node Get road-legal -> Keep loaded diagram. All single-line SVG, 2px stroke, lightweight to protect the weak CWV baseline SEO flagged.

## Motion
Minimal. Hero break-in diagram reveals its stages with a calm staggered fade (<=200ms each) on load, resolving on the "more yeses" stage, then rests. Accordion chevron rotates. Sticky mobile CTA appears after the hero scrolls past. No per-section scroll-fade. `prefers-reduced-motion` gives the static final state (diagram shown resolved, no animation).

## CRO treatment
- One dominant capture action (Get loads on new authority), Signal amber, repeated at hero and close and held in the sticky header; everything else subordinate. The page drives to the consultation/dispatch capture per the brief.
- The both-ways funnel bridge is the page's CRO signature: it catches the visitor wherever they are (no authority yet -> compliance; already active -> dispatch) and routes them into the right silo, which is exactly the bridge role the brief assigns this page. Designed as a deliberate Ink handoff, not afterthought links.
- The break-in diagram sets honest expectations: it shows the path past the broker filter without promising a timeline or approval rate, which keeps the page credible to a burned new carrier.
- Honest proof only: the mechanism (relationships plus a growing track record) and the one-team advantage persuade; no fabricated approval rates, no guaranteed broker-approval timelines, no ratings.
- Preserve the ranking terms: keep "brokers that work with new authority," "new authority," and the "30-day authority" language present in the headings and lede; do not strip what already ranks.
- Mobile: sticky bottom bar with the "Get loads on new authority" CTA plus a tel: Call button; copy-first hero stack; the two funnel directions stack clearly so both paths stay legible.

## OG image
Unique branded OG from the system template: Ink or Paper field, mono wordmark, title "New Authority Loads" in Archivo, category tag "Dispatch" in Plex Mono (the capture routes toward dispatch), one relevant line icon (a route node or load), a Signal rule. Never a placeholder.

## What Dev must preserve
- SEO copy, the heading structure, every internal link and destination (`/services/`, `/compliance-services/`, `/how-to-start-a-trucking-company/`, `/box-truck-dispatch/`), and the CTA wording exactly. The hero lede, the optional reviewed-by line, and all lead-ins are styled paragraphs, never H-tags.
- Preserve the URL and the ranking-term language; do not remove the terms the page already ranks for.
- Amber-never-white-text; one Signal (capture) action per view; AA contrast; visible keyboard focus; reduced-motion behavior; hit targets >=44px.
- Documented proof only: no fabricated broker-approval rates and no guaranteed approval timelines anywhere, including in the hero diagram. No star ratings.
- FMCSA and regulatory wording exact where referenced; never imply government affiliation. Decorative glyphs via inline SVG or CSS, never typed into headings.
