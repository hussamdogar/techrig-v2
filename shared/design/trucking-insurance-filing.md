# Page design spec: /trucking-insurance-filing/ (Insurance filing, BMC-91)

Design-only spec. Consumes `shared/page-briefs/trucking-insurance-filing.md`. SEO owns copy, headings, CTA wording and destinations, and the internal links; this defines look, layout, hierarchy, components, imagery, motion, and the conversion path. Built on `design-system.md`. No em dashes.

## Page role
A small, honest compliance money page that resolves one specific anxiety: "I bought insurance, so why has my authority not activated?" The job is to make the distinction "policy bought is not the same as filing in" land fast, explain the BMC-91 plainly, and move the carrier to one action: have Tech Rig coordinate the filing. This follows the compliance money-page template, but it is the low-priority, thin-term member of the silo, so it stays tight and useful, not padded, and it never invents a price. The page also has to read fine as the source for the short insurance section reused on `/mc-registration/`.

## Section order and layout

1. Header (global): the shared sticky header and matching mega-footer (per `global-footer.md`). Persistent primary CTA carries this page's single action "Get help with my filing".

2. Hero (Paper, asymmetric two-column; copy-first stack on mobile)
   - Left (dominant): H1 "Trucking Insurance Filing (BMC-91)" (Archivo). The brief's hero lede as a styled Plex Sans Body L paragraph, never an H-tag. The "policy bought vs filing in" sentence is the emotional core, so let it breathe as its own short line, not buried mid-paragraph. Then the single primary button "Get help with my filing" (Signal amber, Ink text), routing to the intake form, Dev `[VERIFY]`, until confirmed `/contact-us/`. A small "Reviewed by Adam Smith, Co-Founder" credibility line under the lede (mono label plus name), matching the hub's reviewed-by placement and linking to his founder anchor on `/about-us/`.
   - Right (signature visual, scoped): the Authority Status Tracker, but framed to this filing's place in the sequence. The insurance-filing step is the highlighted node; the surrounding nodes (Application filed -> 21-day protest period -> Authority active) stay present but quiet, so the carrier sees exactly where the insurance filing sits in the path to activation. Honesty rules apply: no guaranteed dates, no countdown, the protest period worded as a fixed federal step. This is the device that visually says "this filing is the piece between your paperwork and your active authority."
   - 5-second test: H1 names the filing and the form number, the lede names the policy-vs-filing distinction, the tracker shows the filing as the gate to activation. The amber CTA is the single Signal element above the fold.

3. H2 "What a BMC-91 filing is": a plain explanation block on Cloud surface. Set the brief's copy at Grade 8 in Plex Sans, max measure ~68ch. Pair it with one small single-line icon (a filing or certificate document with a Steel accent stroke); no decorative triplet. The key fact "the filing is made by your insurer, not by you" is pulled out as a short styled lead-in line so it is scannable.

4. H2 "Why the insurance filing trips up new carriers": the applicability and honesty section. Typographic, not glossy. The real generalized dismissed-authority reference (the Eduardo case, worded distinctly from `/mc-registration/`) is set apart as a quiet example callout: a left Steel rule, Slate text, no badge, no alarm-red. It is a cautionary fact, framed calmly per the brand's calm-under-pressure register. Paper surface so the callout reads as a quiet aside.

5. H2 "How we help with your insurance filing": the "what you get" block, rendered as a clean line-icon list (content-bearing rows, not the decorative icon-triplet reflex). Three rows, each a single-line icon plus the brief's bullet in Plex Sans. The third bullet carries the inline contextual links to [MC authority](/mc-registration/), [BOC-3](/boc-3-filing/), and [UCR](/ucr-registration/) on 1 to 3 word anchors in Steel, reinforcing "all the activation pieces go in together." Cloud surface.
   - Price treatment (critical): there is no standalone published price for this page. Do NOT render a flat or "from" price chip. Instead present the brief's price line as a styled fee-clarity note in Slate: the insurance premium is the insurer's and is separate; Tech Rig's role is coordinating the filing as part of authority setup. If a standalone service fee is later confirmed (Dev `[VERIFY]`), it renders through the single-source price chip's "from" state with a separate "+ insurer premium (set by your insurer)" line, never blended. Until then, no number appears. This keeps the page honest and on-template (service fee always separated from third-party cost) without inventing a price.

6. H2 (funnel cross-link forward): the deliberate styled handoff to the rest of the silo. Following the money-page template, this page funnels forward to `/compliance-services/` (have us handle the whole setup) as the natural next step, since the insurance filing is one piece of a larger activation. Design it as a quiet styled bridge (a short lead line plus a 1 to 3 word contextual Steel anchor to `/compliance-services/`), not a second amber button competing with the hero and close. This is the compliance-internal funnel step, distinct from the dispatch funnel the larger money pages use, and it fits the brief's "links out to `/compliance-services/`" instruction.

7. H2 "Insurance filing FAQ": the system FAQ accordion (FAQPage schema). One question per row, chevron rotates (respects reduced motion). The "why has my authority not activated when I already have insurance" answer is the honest-expectations moment and should echo, in tone, the hero tracker's framing: policy and filing are two different things, no guaranteed timeline. The "does this cost extra" answer reinforces the fee-separation note above. Cloud surface.

8. Closing CTA band: the brief's closing line "Waiting on your authority? Make sure the insurance filing is actually in." as a styled lead paragraph, plus the single dominant button "Get help with my filing" (Signal amber, Ink text), same destination as the hero. One clear action, no co-equal second button.

9. Mega-footer (global): the complete filing list lives here.

## Hierarchy and the visual path
Eye path on first view: H1 -> primary amber "Get help with my filing" -> the scoped tracker (which shows the filing as the gate to activation) -> what it is -> why it trips carriers -> how we help -> FAQ -> single closing CTA. Signal amber is rationed to the one action (hero, close, and the persistent header CTA). The reviewed-by name, the example callout, and every internal link are Steel or Ink and subordinate. One primary action per view. The page is short by design; the hierarchy is shallow and fast, matching the thin-term brief.

## Imagery and illustration
No photography. Hero: the scoped Authority Status Tracker with the insurance-filing node highlighted. "What it is": one filing/certificate line icon. "Why it trips carriers": the quiet example callout (rule and text, no icon needed). "How we help": one single-line icon per row (tell you what is needed, coordinate with insurer, line up with other filings). All single-line SVG, 2px stroke, lightweight to protect the weak CWV baseline SEO flagged. This page is deliberately light on illustration, fitting its low-priority, build-last status.

## Motion
Minimal. Hero tracker reveals its steps with a calm staggered fade (<=200ms each) on load, the highlighted insurance node settling last so the eye lands on it. Accordion chevron rotates. Sticky mobile CTA appears after the hero scrolls past. No per-section scroll-fade. `prefers-reduced-motion` gives the static final state (tracker shown complete with the insurance node highlighted, no animation).

## CRO treatment
- One dominant action (Get help with my filing), Signal amber, repeated at hero and close and held in the sticky header; everything else subordinate. The page drives to the filing-coordination intake, per the system.
- The scoped tracker is the trust and expectation device: it shows the carrier exactly where the insurance filing sits in the path to activation, which is the precise source of this buyer's anxiety, and it sets honest expectations (no guaranteed date) up front.
- Fee transparency as a trust asset: the premium-is-separate, no-invented-price treatment is this page's version of the system's service-fee-vs-third-party-fee discipline, and reads as honesty, not evasion.
- Honest proof only: the reviewed-by line and the generalized real example persuade; no metrics, no ratings, no guaranteed timeline.
- Mobile: sticky bottom bar with the "Get help with my filing" CTA plus a tel: Call button; copy-first hero stack; the tracker switches to its vertical orientation with the insurance node highlighted.

## OG image
Unique branded OG from the system template: Ink or Paper field, mono wordmark, title "Insurance Filing" in Archivo, category tag "Compliance" in Plex Mono, one filing/certificate line icon, a Signal rule. Never a placeholder.

## What Dev must preserve
- SEO copy, the heading structure, every internal link and destination (`/mc-registration/`, `/boc-3-filing/`, `/ucr-registration/`, `/compliance-services/`), and the CTA wording exactly. The hero lede, the reviewed-by line, and the price-clarity note are styled paragraphs, never H-tags.
- No published price: render no price chip unless a standalone service fee is confirmed; if confirmed, use the single-source chip's "from" state with the insurer premium shown as a separate line, never blended. No number may be hardcoded or invented.
- The Authority Status Tracker is scoped to this filing's place in the sequence and never shows a guaranteed activation date or countdown.
- Amber-never-white-text; one Signal action per view; AA contrast; visible keyboard focus; reduced-motion behavior; hit targets >=44px.
- Documented proof only: the reviewed-by line and the generalized real example, worded distinctly from `/mc-registration/`. Never imply Tech Rig sells or sets insurance premiums. No performance metrics or star ratings anywhere.
- FMCSA and regulatory wording exact; never imply government affiliation or endorsement. Decorative glyphs and any check marks via inline SVG or CSS, never typed into headings.
