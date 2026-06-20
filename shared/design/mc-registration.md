# Page design spec: /mc-registration/ (How to Get Your MC Number)

Design-only spec. Consumes `shared/page-briefs/mc-registration.md`. SEO owns copy, headings, CTA wording and destinations, and the pricing facts; this defines look, layout, hierarchy, components, imagery, motion, and the conversion path. Built on `design-system.md`. No em dashes.

## Page role
A compliance money page, informational to BOFU, repurposed from a thin Google Ads landing page into a full organic money page on the same URL. One job: a for-hire carrier who needs operating authority files their MC application, BOC-3, and insurance through Tech Rig so the authority actually activates instead of stalling at the 21-day finish line. The page's core insight, unique in the silo, is the activation trap: submitting the application is not the same as being ready to operate, because the BOC-3, insurance filing, or UCR is missing or wrong. Follows the compliance money-page template; visually consistent with the hub and the other filing pages, distinguished by the protest-period/activation-trap framing and the California box-truck dismissed-MC worked example. It also covers insurance filing as a gating section.

## Section order and layout

1. Header (global): per `global-footer.md`. Page primary action is "Get my MC authority"; the global header keeps its standard CTA.

2. Hero (Paper, asymmetric two-column; copy-first stack on mobile)
   - Left: H1 "How to Get Your MC Number (Operating Authority)" (Archivo). The brief's hero lede as a styled paragraph in Plex Sans Body L (never an H-tag). Primary button "Get my MC authority" (Signal amber, Ink text) routing to the MC intake form (`[VERIFY]` route; `/contact-us/` until Dev confirms). Small "Reviewed by Adam Smith, Co-Founder" credibility line under the lede (mono label + name).
   - Right (signature visual): the Authority Status Tracker, scoped to the MC activation sequence. This is the page where the full tracker is most at home, because the MC journey IS the tracker: Application filed -> 21-day federal protest period -> Authority active. Show all three nodes, with the 21-day protest period rendered as the fixed federal step it is (status-progress treatment), never a countdown or a guaranteed date. Visually flag that activation also depends on BOC-3, insurance, and UCR being in place (a small dependency note on the active node), which previews the activation-trap theme. Honesty rules apply.

3. H2 "What an MC number is" (Cloud surface): the what-it-is block, with honest applicability. Plain copy at the standard measure. The USDOT-vs-MC distinction (identification vs authority to haul for pay; many need both; private/exempt may not need MC) rendered as the same two-item line comparison used on the DOT page, kept visually consistent so the DOT-vs-MC cross-link reads as one coherent idea across both pages.

4. H2 "How to get an MC number, and where it goes wrong" (Paper surface): the educational core and the activation-trap setup, rendered as a clean numbered stepper in the line system (numbered 01 to 06 is correct, it is a genuine sequence). Horizontal connected steps on desktop, vertical on mobile, Grade 8 copy. Step 4 carries the inline BOC-3 link (`/boc-3-filing/`); step 6 is the 21-day protest period, visually tied to the hero tracker's protest node. "The trap" paragraph (carriers reach the end of the 21-day window and the authority still will not activate, because BOC-3, insurance, or UCR was missing or wrong) set as a quiet warning callout with a left Steel rule and Slate text, the page's signature insight, set apart from the steps so it lands.

5. H2 "How to get an MC number with Tech Rig" (Cloud surface): this page's unique worked example plus the value list.
   - The California box-truck dismissed-MC worked example as a quiet example callout: left Steel rule, Slate text, set apart. The story (a dismissed MC cannot simply be reinstated; new authority filed, old MC number kept but the age clock resets; MC application, BOC-3, and UCR filed in one day, then the protest period) demonstrates depth without metrics, real past case framed as such. Note the honest nuance visually: keeping the old MC number versus the age resetting is a subtle distinction; let the callout carry it in plain text, no celebratory styling, no guaranteed timeline.
   - "What you get with us" as a four-item content-bearing list, each with a single-line icon (confirm you need authority and the correct type, MC + BOC-3 + insurance handled together, a realistic picture of timing including the protest period, clean path into driver compliance and dispatch). Typographic, not glossy cards.
   - Mid-page CTA: text link "Get my MC authority" (Steel), same route as hero. Not a second amber button.

6. H2 "What an MC number costs" (Paper surface): pricing, fees separated, the compliance template's pricing block. Use price chips from the single source (mono, tabular):
   - Tech Rig service fee: a flat chip "$600" labelled "MC authority application, one time".
   - BOC-3: a flat chip "$100" labelled "required to activate authority", shown as a paired component, not a competing primary.
   - Insurance filing: a "Contact for quote" treatment in tone (filed by the insurer, premium separate, Tech Rig coordinates), with the inline link insurance filing (`/trucking-insurance-filing/`). Render this as a clear "premium is separate, we coordinate the filing" line, not a Tech Rig price.
   - Government fee: a separate Slate line, `[VERIFY]`, no figure until confirmed.
   - The full setup inline link (`/compliance-services/`) closes the block as a Steel inline link.

7. H2 "MC authority FAQ" (Cloud surface): the system FAQ accordion (FAQPage schema). Two answers are load-bearing and must read with calm candour: "How long does it take to get an MC number?" (the mandatory 21-day protest period, plus dependence on BOC-3 and insurance, no promised date) and "Why did my authority not activate after 21 days?" (almost always a missing or incorrect BOC-3, insurance filing, or UCR). The dismissed-MC answer mirrors the worked example. Pair the timing answers in tone with the tracker. Chevron rotates, respects reduced motion.

8. Closing CTA band (full-bleed Ink, the template's closing emphasis): the brief's closing line "Ready to run for hire? Get your MC authority filed so it actually activates." as a styled paragraph, then the single dominant button "Get my MC authority" (Signal amber, Ink text), same route. One action only.

9. Mega-footer (global): the complete filing list lives here.

## Hierarchy and the visual path
Eye path: H1 -> primary amber CTA -> the tracker (the MC journey, protest period honest) -> what it is + USDOT-vs-MC -> the step-by-step stepper ending on the protest period -> the activation-trap callout (the page's signature insight) -> worked example + what you get -> pricing ($600 + components, fees separated) -> FAQ -> single closing CTA. Signal amber is rationed to the primary "Get my MC authority" action (hero and close only); the mid-page CTA and every inline link are Steel and subordinate. One primary action per view.

## Imagery and illustration
No photography. The Authority Status Tracker (full three-step MC variant, the most complete instance in the silo) in the hero; the USDOT-vs-MC two-item comparison diagram (matching the DOT page) in the what-it-is section; the how-to step-by-step numbered stepper ending on the 21-day protest period; small single-line icons on the "what you get" list. A subtle visual link between the stepper's protest-period step and the hero tracker's protest node reinforces the activation-trap story. All single-line SVG from the system, 2px stroke, lightweight for the weak CWV baseline (important on a page expanding from a thin ad template).

## Motion
Minimal. Hero tracker staggered reveal (<=200ms per step), the protest-period node settling into its fixed-federal-step state last. Accordion chevron. No count-up on the prices, no per-section scroll-fade, and explicitly no animated countdown on the 21-day protest period (it is a fixed federal step, never a timer). `prefers-reduced-motion` gives final static states (tracker resolved, no animation).

## CRO treatment
- One dominant action, "Get my MC authority", Signal amber, repeated at hero and close; the mid-page CTA is a subordinate Steel text link to the same route.
- The conversion lever unique to this page is the activation trap: the tracker, the step-by-step ending on the protest period, the trap callout, and the "why did my authority not activate after 21 days" FAQ all reinforce that filing the application is not the same as activating, and that Tech Rig makes sure BOC-3, insurance, and UCR are all correct so activation is not held up. This reframes the buyer's real fear (paying and still getting stuck) as the exact thing Tech Rig prevents.
- Fee transparency: the $600 service fee, the $100 BOC-3 component, the separate insurance premium, and the separate government fee are each shown distinctly, never blended, which is a trust asset for this buyer.
- Honest timing (the protest period shown as fixed and federal, no guaranteed date) reduces post-purchase "why isn't it active" anxiety, the same honesty the tracker encodes.
- Mobile: sticky bottom bar with "Get my MC authority" plus a tel: Call button; copy-first hero stack; the step-by-step stepper stacks vertically.

## OG image
Unique branded OG from the system template: Ink field, mono wordmark, title "MC Authority", category tag "Compliance" in Plex Mono, one relevant line icon (operating-authority / route or shield line icon), Signal rule. No placeholder.

## What Dev must preserve
- SEO copy, the heading structure, every internal link and destination, and the CTA wording exactly. The lede, "the trap" paragraph, and the bold lead-ins are styled paragraphs, never H-tags.
- Migration: keep the URL `/mc-registration/`; this is the same-URL repurpose. Preserve any existing ad-conversion tracking on the page when expanding it; remove the ads-only/noindex treatment and add to the sitemap (per `migration-plan.md`). Confirm the intake/payment route for the CTA.
- Price chips from the single source (`services.md`): the flat $600 MC state and the $100 BOC-3 component; insurance shown as "premium separate, filed by insurer, Tech Rig coordinates", never as a Tech Rig price. No price hardcoded. Do not state a specific government FMCSA fee until verified; the government-fee line stays `[VERIFY]`.
- The 21-day protest period is always presented as a fixed federal step, never as a countdown, timer, or guaranteed activation date, in the tracker, the stepper, copy, and motion.
- Amber-never-white-text; one Signal action per view; AA contrast; visible focus; reduced motion.
- Documented proof only (the one real California dismissed-MC worked example). No performance metrics, ratings, or invented testimonials. The case is framed as a past result.
- Decorative glyphs and the 01 to 06 step numbers via CSS or inline SVG, never typed into headings; numbering used only because this is a real sequence.
