# Page design spec: /compliance-services/ (Compliance hub)

Design-only spec. Consumes `shared/page-briefs/compliance-services-hub.md`. SEO owns copy, headings, CTA wording and destinations, and the service list; this defines look, layout, hierarchy, components, imagery, motion, and the conversion path. Built on `design-system.md`. No em dashes.

## Page role
The front door to the compliance silo and the primary destination from the home hero. One job: a new or returning carrier instantly understands "they do all my setup filings," is pushed toward the fixed $1,650 full package as the low-friction path, and can still pick any single filing. Compliance-led, BOFU, proof over hype.

## Section order and layout

1. Header (global): per `global-footer.md`. Persistent primary CTA "Start your compliance setup".

2. Hero (Paper, asymmetric two-column; copy-first stack on mobile)
   - Left: H1 "DOT and Trucking Compliance Services" (Archivo). Styled lede paragraph (the brief's hero paragraph, including the FMCSA process-agent line and the 10-states proof), Plex Sans Body L. Primary button "Start your compliance setup" (Signal amber, Ink text) -> `/mc-dot-registration/`. Secondary text link "or see the full package" (Steel) that scroll-anchors to the package section. Small "Reviewed by Adam Smith, Co-Founder" credibility line under the lede (mono label + name).
   - Right (signature visual): the Authority Status Tracker (Application filed -> 21-day protest period -> Authority active). This is the natural home for it: it sets honest expectations at the front door and visualizes the sequence the hub sells. Honesty rules apply (no guaranteed dates).

3. Featured offer: "The full compliance package" (the recommended path, highest visual weight after hero)
   - A single featured panel, emphasized per the system's featured treatment (2px Steel/Info accent border, otherwise standard surface, no glow). Heading H2 "The full compliance package".
   - The price as a flat price chip in the mono treatment: $1,650 (single source). One-line value paragraph.
   - Package contents as a two-column checklist, each item an inline 1 to 3 word contextual link with a small line icon (LLC formation, USDOT, MC authority, BOC-3, insurance filing coordination, UCR, DQ files, Clearinghouse, consortium, pre-employment drug test, IRP, IFTA, ELD). Check marks use the status-active color, never color alone (icon + label).
   - Fee-separation note in Slate beneath the list (government and third-party fees billed separately). 
   - Panel CTA "Start your compliance setup" -> `/mc-dot-registration/` (same primary destination, kept consistent).

4. H2 "What our DOT compliance services cover": the service-card grid (this is the canonical home of the service-card component; design once, reused on every hub). 3-column responsive, equal-height, Cloud surface, 1px outline. Each card = small line icon + service name (Steel link) + one plain-language line + price chip from the single source. Cards: USDOT, MC authority, BOC-3, UCR ("from $100" + "+ gov fee by fleet size" in the chip's gov line), IRP, IFTA, Clearinghouse, drug and alcohol consortium, DQ files, ELD, MCS-150 updates, trucking LLC (this one uses the chip's "Contact for quote" state, since LLC pricing is on hold). These are content-bearing cards (real price, real service), not the decorative icon-triplet reflex.

5. H2 "Why carriers choose our trucking compliance services": three proof-led value blocks, typographic not glossy. Lay out as three columns on desktop, stacked on mobile, each with a bold styled lead-in (a styled paragraph, not an H-tag) and a short proof line. Block 1 ("We catch what blocks activation") carries the real freight-forwarder worked example, set apart as a quiet example callout (left Steel rule, Slate text), and ties visually back to the hero tracker. Block 3 contains the funnel cross-link "dispatch you" -> `/services/` on a 1 to 3 word anchor. No invented metrics; only the documented track-record line.

6. H2 "How it works": a 4-step process, rendered as a clean numbered stepper in the line system. Numbered 01 to 04 is correct here because it is a genuine sequence (the system only bans numbering when content is not a sequence). Horizontal connected steps on desktop, vertical on mobile, Grade 8 copy. Reinforces the same "filed in order" story as the tracker.

7. H2 "Compliance services FAQ": the system FAQ accordion (FAQPage schema). The activation-timing answer is the honest-expectations moment: no guaranteed date, paired in tone with the tracker.

8. Closing CTA band: one line + the single dominant button "Start your compliance setup" -> `/mc-dot-registration/`.

9. Mega-footer (global): the complete filing list lives here too.

## Hierarchy and the visual path
Eye path: H1 -> primary amber CTA -> the $1,650 featured package (the path we want most carriers to take) -> the à la carte card grid for those who want one filing -> proof -> process -> FAQ -> single closing CTA. Signal amber is rationed to the primary action (hero, package panel, close); all card links and the secondary anchor are Steel and subordinate. One primary action per view.

## Imagery and illustration
No photography. The Authority Status Tracker in the hero; one line icon per service card and per package-checklist item; the how-it-works stepper as a line diagram. All single-line SVG from the system, lightweight for CWV.

## Motion
Minimal. Hero tracker staggered reveal (<=200ms steps). Accordion chevron. Optional one-time count-up is NOT used (avoid gimmicks); price chips render static. `prefers-reduced-motion` gives final states. No per-section scroll-fade.

## CRO treatment
- The $1,650 package is the friction-removing hero offer: "do not assemble this piece by piece." It gets the featured treatment and the primary CTA, so the low-effort path is the obvious one.
- The card grid serves the carrier who wants a single filing, without competing visually with the package.
- Fee transparency is explicit everywhere a price shows (service fee vs government fee), which is a trust asset for this buyer.
- Honest activation expectations (tracker + FAQ) reduce the anxiety that drives bounce.
- One dominant CTA, repeated and always routing to `/mc-dot-registration/`. Mobile: sticky bottom bar with that CTA plus a tel: Call button.

## OG image
Unique branded OG from the template: Ink field, mono wordmark, title "Compliance services", category tag "Compliance", a line icon, Signal rule.

## What Dev must preserve
- SEO copy, heading structure, every internal link and destination, and the service list exactly. Bold lead-ins and the lede are styled paragraphs, never H-tags.
- Price chips from the single source (`services.md`); trucking LLC shows the "Contact for quote" state; UCR shows service fee plus a separate government-fee line. No price may be hardcoded.
- Amber-never-white-text; one Signal action per view; AA contrast; visible focus; reduced motion.
- Documented proof only (the since-2021 / 40+ / 10-states line and the one real worked example). No performance metrics or ratings.
- FMCSA process-agent wording exact; never imply government affiliation or a guaranteed activation date.
- Decorative glyphs and check marks via CSS or inline SVG, never typed into headings.
