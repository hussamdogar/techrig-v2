# Page design spec: /mc-dot-registration/ (DOT+MC authority bundle)

Design-only spec. Consumes `shared/page-briefs/mc-dot-registration.md`. SEO owns copy, headings, CTA wording and destinations, the filing list, and prices; this defines look, layout, hierarchy, components, imagery, motion, and the conversion path. Built on `design-system.md`. No em dashes.

## Page role
The bundle money page: the "get my MC and DOT done together, in the right order" offer. It is the conversion target the compliance hub hero points to, and the lateral landing spot from `/dot-registration/` (USDOT only) and `/mc-registration/` (MC only). One job: a new for-hire carrier understands they need the set rather than one filing, sees the pieces line up into an activated authority, and starts the package. Combined value is the whole pitch, so the design sells the bundle as one coordinated process, not five line items. BOFU, proof over hype.

## Section order and layout

1. Header (global, per `global-footer.md`). Persistent primary CTA "Get my authority package". Breadcrumb Home > Compliance Services > MC and DOT Authority sits below the header in the mono label treatment.

2. Hero (Paper, asymmetric two-column; copy-first stack on mobile)
   - Left: H1 "Get Your MC and DOT Number Together" (Archivo). Styled hero lede paragraph (Plex Sans Body L), never an H-tag. Primary button "Get my authority package" (Signal amber, Ink text) -> bundle intake / `/get-started` [VERIFY route]. Small "Reviewed by Adam Smith, Co-Founder" credibility line under the lede (mono label + name).
   - Right (signature visual): the Authority Status Tracker showing the full sequence the bundle delivers (Application filed -> 21-day federal protest period -> Authority active). Because this page sells every step at once, the tracker is scoped to the whole journey rather than one filing, and reads as the visual promise of the offer. Honesty rules apply: no guaranteed dates, the protest period is the fixed federal step.

3. What it is: H2 "What the trucking authority package includes". This is the heart of the page, so it carries the most weight after the hero, presented as the bundle, not a card grid.
   - The five core pieces as one connected checklist on a single Cloud panel (USDOT registration, MC operating authority, BOC-3 filing, UCR registration, insurance filing coordination). Each line: small line icon + the contextual 1 to 3 word inline link exactly as the brief sets it (`/dot-registration/`, `/mc-registration/`, `/boc-3-filing/`, `/ucr-registration/`, `/trucking-insurance-filing/`) + its short descriptor. Check marks use status-active color with the icon, never color alone. Render the items as a vertical sequence joined by a thin Steel connector rule so the set reads as "filed in order," which is the differentiator from buying one filing. The BOC-3 line carries the FMCSA-listed process-agent fact as worded text, not a badge.
   - The step-up line ("Need driver compliance and interstate filings too ... full compliance package at $1,650") sits beneath the panel as a quiet Slate cross-link to `/compliance-services/`, visually subordinate so it routes the bigger-need carrier up without competing with the package CTA.

4. Applicability (honest): there is no standalone "who needs it" H2 in the brief, so fold the honest framing into the hero lede and the includes panel as written ("most new for-hire carriers do not need one filing, they need the set"). Do not invent a section or restate copy. The step-up line already handles "you may need more than this."

5. Pricing: H2 "What it costs". Mono price chips, single source.
   - Present the bundle as the four core service-fee chips it sums from (USDOT $300, MC $600, BOC-3 $100, UCR from $100), shown in a compact mono price block so the carrier sees the combined value transparently. If the client sets a bundled price, the single source supplies one flat "from" chip instead; design supports either by rendering whatever the source returns. UCR keeps its "from $100" state.
   - Fee separation is explicit: a Slate line states government fees and the insurance premium are separate and shown up front, paired with but visually distinct from the service-fee chips. Never blend a government fee or premium into a service-fee number.
   - The "$1,650 full package" reference links to `/compliance-services/` as a Slate cross-link, not a second price chip competing with the bundle.

6. What you get when Tech Rig files it: covered by the includes panel (section 3) plus the worked example below. The bundle's "what you get" is the coordinated sequence itself, so no separate glossy benefits grid is added.

7. The unique worked example: H2 "Why a trucking authority package beats filing piecemeal". The narrative paragraph is the persuasion, set as a quiet example callout (left Steel rule, Slate text), tied visually back to the hero tracker so the reader connects "filed in one day, waited out the protest period, active and hiring" to the steps above. This is the page's distinct facet (CA dismissed-MC carrier, one-day combined-filing speed angle); present it once, no repetition of the `/mc-registration/` telling.

8. FAQ: H2 "Trucking authority package FAQ", the system FAQ accordion (FAQPage schema). The "how long until I am active" answer is the honest-expectations moment, matched in tone to the tracker (no promised date). Questions render as accordion controls, not headings.

9. Funnel cross-link forward to dispatch: a deliberate styled handoff before the close, on the brief's closing funnel intent. Short bridge line with a 1 to 3 word inline link to `/services/` ("authority active, keep your truck loaded"). Steel treatment, designed as a real handoff, not an afterthought link.

10. Closing CTA band: one line + the single dominant button "Get my authority package" -> bundle intake / `/get-started` [VERIFY route]. Supporting line is a styled paragraph.

11. Mega-footer (global): the complete filing list lives here.

## Hierarchy and the visual path
Eye path: H1 -> primary amber CTA -> the tracker (the activated-authority promise) -> the includes checklist (the bundle as one sequence) -> what it costs (transparent combined value) -> the worked-example proof -> FAQ -> dispatch handoff -> single closing CTA. Signal amber is rationed to the primary action (hero and close, and the persistent header CTA); every inline filing link, the step-up line, and the dispatch handoff are Steel and subordinate. One primary action per view, and it always routes to the bundle intake.

## Imagery and illustration
No photography. Hero: the Authority Status Tracker scoped to the full journey. Includes panel: one small line icon per filing (document for USDOT, stamp for BOC-3, shield for UCR, a route/authority node for MC, a filing for insurance), joined by a thin connector to read as a sequence. Worked example: no illustration, just the Steel-rule callout. All single-line SVG from the system, lightweight for the weak CWV baseline.

## Motion
Minimal. Hero tracker reveals its steps with a calm staggered fade (<=200ms each) on load. The includes connector may draw once after the tracker settles, reinforcing the sequence; no looping. Accordion chevron rotates. Price chips render static, no count-up. Sticky mobile CTA appears after the hero scrolls past. `prefers-reduced-motion` gives final static states.

## CRO treatment
- One dominant action (get the package), Signal amber, repeated at hero and close, always routing to the bundle intake. Every other link is subordinate.
- The bundle is sold as friction removal: "do not file these five things separately, in the wrong order." The connected checklist and the tracker make the coordinated path the obvious one.
- Pricing is a trust asset: service fees shown in mono, government fees and insurance premium separated and stated up front. The $1,650 full package is a cross-link, never a competing chip.
- Honest activation expectations (tracker + the "how long until I am active" FAQ) reduce the day-21 anxiety the worked example names.
- Mobile: sticky bottom bar with "Get my authority package" plus a tel: Call button; copy-first hero; the includes sequence stacks vertically (its natural mobile form).

## OG image
Unique branded OG from the system template: Ink field, mono wordmark, title "MC + DOT Authority Package", category tag "Compliance" in Plex Mono, one relevant line icon (authority node or document set), Signal rule. Never a placeholder.

## What Dev must preserve
- SEO copy, the heading structure, every internal link and destination, and the price figures exactly. The hero lede, the step-up line, and the worked-example narrative are styled paragraphs, never H-tags.
- Price chips from the single source (`services.md`): the four service-fee chips, UCR in its "from $100" state, or a single bundled "from" chip if the source defines one. No price hardcoded; government fees and insurance premium never folded into a service-fee number.
- Preserve the ad-conversion tracking on this repurposed URL.
- Amber-never-white-text; one Signal action per view; AA contrast; visible keyboard focus; reduced-motion behavior; hit targets >=44px.
- Documented proof only: the one real CA worked example, framed as past. No guaranteed activation date, no invented bundle price, no metrics or ratings.
- FMCSA process-agent wording exact (BOC-3 line); never imply government affiliation or a seal.
- Decorative glyphs and check marks via CSS or inline SVG, never typed into headings.
