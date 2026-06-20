# Page design spec: /trucking-llc/ (Trucking LLC formation)

Design-only spec. Consumes `shared/page-briefs/trucking-llc.md`. SEO owns copy, headings, CTA wording and destinations, and the internal links; this defines look, layout, hierarchy, components, imagery, motion, and the conversion path. Built on `design-system.md`. No em dashes.

## Page role
A high-value compliance money page that sells the first step of a trucking business: the entity. The job is to make the "clean entity that your authority, insurance, and bank account all attach to" angle land, establish that order and matching details matter, and move the carrier to a quote action. This follows the compliance money-page template, with one structural difference the brief makes explicit: the price is on hold, so this page uses the price chip's "Contact for quote" state and routes to a quote/contact action, not a published-price filing flow. It is BOFU and commercial, so trust and "do it in the right order" do the persuading.

## Section order and layout

1. Header (global): the shared sticky header and matching mega-footer (per `global-footer.md`). Persistent primary CTA carries this page's single action "Form my trucking LLC".

2. Hero (Paper, asymmetric two-column; copy-first stack on mobile)
   - Left (dominant): H1 "Form an LLC for Your Trucking Company" (Archivo). The brief's hero lede as a styled Plex Sans Body L paragraph, never an H-tag. The "clean entity that your authority, insurance, and bank account all attach to" idea is the page's spine, so let that sentence carry visual weight in the lede. Then the single primary button "Form my trucking LLC" (Signal amber, Ink text), routing to the intake/quote form, Dev `[VERIFY]`, until confirmed `/contact-us/`. A small "Reviewed by Adam Smith, Co-Founder" credibility line under the lede (mono label plus name), linking to his founder anchor on `/about-us/`.
   - Right (signature visual, reframed for "entity first"): the Authority Status Tracker, extended at its front with a prepended "Company formed" node so the sequence reads `Company formed -> Application filed -> 21-day protest period -> Authority active`, with the "Company formed" node highlighted as this page's step. This visualizes the brief's core "LLC, then authority" order: the entity is the foundation everything else attaches to. Honesty rules apply: no guaranteed dates, the protest period worded as a fixed federal step. This is the natural signature visual because the page's whole argument is about sequence.
   - 5-second test: H1 names the action, the lede names the "clean entity everything attaches to" benefit, the tracker shows the LLC as step one of the path to active authority. The amber CTA is the single Signal element above the fold.

3. Featured offer / price treatment (critical, replaces the flat-price block): a single quiet panel using the price chip's "Contact for quote" state. NO published LLC price appears anywhere on the page (pricing is on hold per the brief and `services.md`). The chip renders "Contact for quote" in the mono treatment; beneath it, a styled Slate fee-clarity line states that formation pricing depends on state and scope and that state filing fees are separate and set by the state. The panel's action is the contextual [Contact us for a quote](/contact-us/) route (the brief's quote destination), styled as a Steel inline anchor inside the panel, with the hero's amber "Form my trucking LLC" remaining the single primary action for the view. This keeps fee transparency (service vs state fee) without inventing a number, and keeps one Signal action per view.

4. H2 "Why form an LLC for your trucking company": three proof-led value points (liability separation, clean entity for everything downstream, credibility with brokers and factoring), laid out as three typographic columns on desktop, stacked on mobile. Each has a bold styled lead-in (a styled paragraph, not an H-tag) and the brief's short supporting line; the "clean entity for everything downstream" point carries the inline [USDOT](/dot-registration/) and [MC authority](/mc-registration/) links on 1 to 3 word Steel anchors. The brief's "wrong-setup is a real and costly mistake we have corrected" lesson is set apart as a quiet example callout (left Steel rule, Slate text), worded distinctly from the hub's freight-forwarder example, calm not alarmist. Cloud surface.

5. H2 "What our LLC for trucking company setup includes": the "what you get" block, rendered as a clean line-icon list (content-bearing rows, not the decorative icon-triplet reflex). Four rows, each a single-line icon plus the brief's bullet in Plex Sans; the "company details consistent with the FMCSA filings that come next" row carries the inline [USDOT](/dot-registration/) and [MC authority](/mc-registration/) links. Check or completion marks use the status-active color with an icon plus label, never color alone. Paper surface so the list reads as the second band.

6. H2 "LLC, then authority: the right order": the sequence section, the visual payoff of the hero tracker. Render the brief's order (USDOT -> MC authority -> BOC-3 -> insurance -> UCR, with LLC as step one) as a clean horizontal connected stepper on desktop, vertical on mobile, in the system's line language using the status palette, Grade 8 copy. This is a genuine sequence, so connected ordered steps are correct (the 01 to 04 style numbering pattern is allowed here because it is a real order, but keep it restrained). The inline links to [USDOT number](/dot-registration/), [MC authority](/mc-registration/), [BOC-3](/boc-3-filing/), [UCR](/ucr-registration/), the [guide to starting a trucking company](/how-to-start-a-trucking-company/), and the [full setup](/compliance-services/) all sit on 1 to 3 word Steel anchors. Cloud surface.

7. H2 (funnel cross-link forward): per the money-page template, a deliberate styled handoff forward. This page's forward path is into the rest of the compliance setup, so the handoff routes to [full setup](/compliance-services/) (have us do it all as one package), already introduced in the sequence section above. Design it as a quiet styled bridge with a short lead line and a 1 to 3 word contextual Steel anchor, not a second amber button. This is the compliance-internal funnel step appropriate to an entity-formation page (the dispatch funnel belongs to the activation money pages and dispatch silo).

8. H2 "Trucking LLC FAQ": the system FAQ accordion (FAQPage schema). One question per row, chevron rotates (respects reduced motion). The "how much does it cost" answer mirrors the Contact-for-quote treatment: it depends on state and scope, state filing fees separate, no published number. The "do I need an LLC" and "which state" answers stay at Grade 8 and avoid any legal-advice framing (this is formation and filing support, not law practice). Cloud surface.

9. Closing CTA band: the brief's closing line "Starting your trucking company? Set the entity up right before you file for authority." as a styled lead paragraph, plus the single dominant button "Form my trucking LLC" (Signal amber, Ink text), same destination as the hero. One clear action, no co-equal second button.

10. Mega-footer (global): the complete filing list lives here.

## Hierarchy and the visual path
Eye path on first view: H1 -> primary amber "Form my trucking LLC" -> the "entity first" tracker (LLC as step one) -> the Contact-for-quote panel (no price, clear next step) -> why an LLC -> what is included -> the ordered sequence -> FAQ -> single closing CTA. Signal amber is rationed to the one action (hero, close, and the persistent header CTA). The reviewed-by name, the Contact-for-quote anchor, the example callout, and every internal link are Steel or Ink and subordinate. One primary action per view.

## Imagery and illustration
No photography. Hero: the Authority Status Tracker with a prepended, highlighted "Company formed" node. "Why an LLC": the quiet example callout (rule and text). "What is included": one single-line icon per row (form LLC, obtain EIN, match FMCSA details, hand off to setup). "The right order": the line-system ordered stepper using the status palette. All single-line SVG, 2px stroke, lightweight to protect the weak CWV baseline SEO flagged.

## Motion
Minimal. Hero tracker reveals its steps with a calm staggered fade (<=200ms each) on load, the highlighted "Company formed" node settling first so the eye reads the sequence left to right as "start here." The "right order" stepper does not re-animate on scroll (no per-section scroll-fade). Accordion chevron rotates. Sticky mobile CTA appears after the hero scrolls past. `prefers-reduced-motion` gives the static final states.

## CRO treatment
- One dominant action (Form my trucking LLC), Signal amber, repeated at hero and close and held in the sticky header; everything else subordinate. The page drives to the quote/intake action, per the brief.
- Price on hold handled as a trust asset, not a gap: the Contact-for-quote state plus the "state filing fees are separate" note reads as honest fee transparency (service vs state fee) rather than hidden pricing, which would read as risk to this buyer. No invented price anywhere.
- The "entity first" tracker and the "right order" stepper are the persuasion engine: they make the case that doing it in order with matching details is what keeps an authority from stalling, which is the page's real value over a generic LLC mill.
- Honest proof only: the reviewed-by line and the generalized wrong-setup lesson persuade; no metrics, no ratings, no guaranteed timeline, no legal-advice framing.
- Mobile: sticky bottom bar with the "Form my trucking LLC" CTA plus a tel: Call button; copy-first hero stack; the tracker and the order stepper switch to vertical.

## OG image
Unique branded OG from the system template: Ink or Paper field, mono wordmark, title "Trucking LLC" in Archivo, category tag "Compliance" in Plex Mono, one entity/formation line icon, a Signal rule. No price on the OG image. Never a placeholder.

## What Dev must preserve
- SEO copy, the heading structure, every internal link and destination (`/dot-registration/`, `/mc-registration/`, `/boc-3-filing/`, `/ucr-registration/`, `/how-to-start-a-trucking-company/`, `/compliance-services/`, `/contact-us/`), and the CTA wording exactly. The hero lede, the reviewed-by line, the bold value lead-ins, and the fee-clarity note are styled paragraphs, never H-tags.
- The price chip shows the "Contact for quote" state only; NO LLC price is published, hardcoded, or invented until confirmed. State filing fees are always shown as separate from any Tech Rig fee.
- The Authority Status Tracker (with the prepended "Company formed" node) never shows a guaranteed activation date or countdown.
- Amber-never-white-text; one Signal action per view; AA contrast; visible keyboard focus; reduced-motion behavior; hit targets >=44px.
- Documented proof only: the reviewed-by line and the generalized wrong-setup lesson, worded distinctly from the hub. No performance metrics or star ratings. No legal-advice framing: this is formation and filing support, not law practice.
- FMCSA and regulatory wording exact; never imply government affiliation. Numbering used only for the genuine "right order" sequence. Decorative glyphs and check marks via inline SVG or CSS, never typed into headings.
