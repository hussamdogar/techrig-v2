# Page design spec: /ucr-registration/ (UCR Registration)

Design-only spec. Consumes `shared/page-briefs/ucr-registration.md`. SEO owns copy, headings, CTA wording and destinations, and the pricing facts; this defines look, layout, hierarchy, components, imagery, motion, and the conversion path. Built on `design-system.md`. No em dashes.

## Page role
A compliance money page for an annual filing, BOFU navigational. One job: a carrier who knows they owe UCR (or suspects they do) files it through Tech Rig with confidence that the fleet bracket will be right. The page must answer two anxieties unique to UCR: "this comes due every year" and "am I paying the correct bracket." Honest applicability matters here, because not every operation owes UCR the same way. Follows the compliance money-page template; visually consistent with the hub and the other filing pages, distinguished by its own annual-renewal framing and its Maryland hotshot worked example.

## Section order and layout

1. Header (global): per `global-footer.md`. The page primary action is "File my UCR"; the global header keeps its standard "Start your compliance setup" CTA.

2. Hero (Paper, asymmetric two-column; copy-first stack on mobile)
   - Left: H1 "UCR Registration and Renewal" (Archivo). The brief's hero lede as a styled paragraph in Plex Sans Body L (never an H-tag). Primary button "File my UCR" (Signal amber, Ink text) routing to the `[VERIFY]` route (`/get-started` or the UCR intake form; `/contact-us/` until Dev confirms). Small "Reviewed by Adam Smith, Co-Founder" credibility line under the lede (mono label + name).
   - Right (signature visual): the Authority Status Tracker, scoped to where UCR sits. UCR is annual upkeep that keeps an active authority legal, not a step in first activation, so this instance is framed as a recurring-compliance variant: show the sequence resolving to "Authority active", then a distinct annual-renewal marker (a Plex Mono "renews annually" tag on the active node, using the status-progress treatment for the recurring step). Honesty rules apply: no guaranteed dates, no countdown that implies Tech Rig controls timing. This visually separates UCR from one-time filings like BOC-3.

3. H2 "What UCR registration is" (Cloud surface): the what-it-is block. Plain copy at the standard measure. The "who has to register" list rendered as a clean line-led list (small document or shield line icon per item, not decorative triplets). The applicability "Note" (purely intrastate and some operations differ; we tell you before you pay) set as a quiet callout with a left Steel rule and Slate text, so honest applicability reads as a reassurance, not fine print.

4. H2 "How UCR fees work (and why brackets matter)" (Paper surface): the bracket explainer, the section that earns this page's trust. Render the fleet-size brackets as a simple line table or stepped diagram in the line system (0 to 2, 3 to 5, 6 to 20, higher), brackets shown as relative steps so "the brackets jump fast" reads visually. Dollar amounts are `[VERIFY]` against the official UCR schedule: until verified, the bracket cells show the bracket label and a Plex Mono "fee set by bracket" placeholder, never an invented number. The "most common mistake we fix" line set as a Slate emphasis line beneath. Colour never the sole signal in the diagram.

5. H2 "What our UCR registration service costs" (Cloud surface): pricing, fees separated, the compliance template's pricing block. Use the 3-state price chip from the single source:
   - Tech Rig service fee: the "from" chip, "from $100" with the "from" set smaller in Slate.
   - BOC-3 plus UCR together: a flat chip "$200" with the label "BOC-3 + UCR, 0 to 2 vehicle bracket", shown as a quiet bundle option, not a competing primary.
   - Government UCR fee: paired as a separate Slate line "+ gov fee, set by fleet bracket", never blended into the service-fee number.
   - The "we do not advertise one flat price" paragraph as a styled Slate note reinforcing fee transparency.
   - Mid-page CTA: text link "File my UCR" (Steel), same route as hero. Not a second amber button.

6. H2 "What you get when Tech Rig files your UCR" (Paper surface): a four-item value list, content-bearing, each with a single-line icon (confirm bracket, submit registration, renewal reminder, line up with USDOT/MC/BOC-3). Typographic, not glossy cards. This is where the annual-reminder promise lands, so give the "remind you before the next annual renewal" item slightly more weight (it answers the recurring-fee anxiety).

7. H2 "New carrier? UCR fits into the bigger setup" (Cloud surface): the funnel cross-link section plus this page's unique worked example.
   - Short funnel paragraph with the brief's inline 1 to 3 word contextual links exactly as written: operating authority (`/mc-registration/`), BOC-3 filing (`/boc-3-filing/`), full setup (`/compliance-services/`), BOC-3 and UCR (`/boc-3-filing/`). Steel inline links, never buttons.
   - The Maryland CDL hotshot worked example as a quiet example callout: left Steel rule, Slate text, set apart from the running copy. It ties visually back to the hero tracker (company plus driver compliance completed, then running after the protest period). Real past result, not a promise; no guaranteed timeline styling on the "about 7 days".

8. H2 "UCR registration FAQ" (Paper surface): the system FAQ accordion (FAQPage schema). The "Is UCR a one-time fee?" answer is the honest-expectations moment that distinguishes UCR (annual) from BOC-3 (one-time); pair it in tone with the tracker's annual-renewal marker. Chevron rotates, respects reduced motion.

9. Closing CTA band (full-bleed Ink, the template's closing emphasis): the brief's closing line as a styled paragraph, then the single dominant button "File my UCR" (Signal amber, Ink text), same route. One action only.

10. Mega-footer (global): the complete filing list lives here.

## Hierarchy and the visual path
Eye path: H1 -> primary amber CTA -> the tracker (sets the annual expectation) -> what it is -> the bracket explainer (the trust-builder) -> pricing with fees separated -> what you get -> funnel cross-link + worked example -> FAQ -> single closing CTA. Signal amber is rationed to the primary "File my UCR" action (hero and close only); every other link, including the mid-page CTA and all cross-links, is Steel and subordinate. One primary action per view.

## Imagery and illustration
No photography. The Authority Status Tracker (annual-renewal variant) in the hero; the fleet-bracket stepped diagram in the fees section (the page's signature explanatory asset); one single-line icon per item in the "who has to register" and "what you get" lists. All single-line SVG from the system, 2px stroke, lightweight for the weak CWV baseline.

## Motion
Minimal. Hero tracker staggered reveal (<=200ms per step), the annual-renewal marker draws last. Accordion chevron. No count-up on the bracket figures, no per-section scroll-fade. `prefers-reduced-motion` gives final static states (tracker shows resolved state with the annual marker, no animation).

## CRO treatment
- One dominant action, "File my UCR", Signal amber, repeated at hero and close; the mid-page CTA is a subordinate Steel text link to the same route.
- Bracket transparency is the conversion lever unique to this page: showing that the government fee genuinely depends on fleet size, and that Tech Rig confirms the bracket first, removes the "am I overpaying" hesitation. Service fee is always visually separated from the government fee.
- The annual-renewal framing (tracker marker + the reminder promise + the FAQ) turns the recurring nature from a downside into a reason to use Tech Rig (we remind you so you do not lapse).
- Honest applicability callout reduces wrong-fit bounce.
- Mobile: sticky bottom bar with "File my UCR" plus a tel: Call button; copy-first hero stack; bracket diagram stacks vertically.

## OG image
Unique branded OG from the system template: Ink field, mono wordmark, title "UCR Registration", category tag "Compliance" in Plex Mono, one relevant line icon (annual filing / calendar-cycle line icon), Signal rule. No placeholder.

## What Dev must preserve
- SEO copy, the heading structure, every internal link and destination, and the CTA wording exactly. The lede, the applicability note, and the "we do not advertise one flat price" line are styled paragraphs, never H-tags.
- Price chips from the single source (`services.md`): UCR service fee shows the "from $100" state with a separate government-fee line; the BOC-3 + UCR $200 bundle is the flat state. No price hardcoded, and the government fee is never encoded as the price.
- No fabricated bracket dollar amounts: the bracket cells stay `[VERIFY]` until checked against the official UCR schedule.
- Amber-never-white-text; one Signal action per view; AA contrast; visible focus; reduced motion.
- Documented proof only (the one real Maryland worked example). No performance metrics, ratings, or invented testimonials. The "about 7 days" is framed as a past result, never a guarantee, and the tracker shows no guaranteed activation date.
- Decorative glyphs and check marks via CSS or inline SVG, never typed into headings.
