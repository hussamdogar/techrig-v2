# Page design spec: /about-us/ (About Tech Rig)

Design-only spec. Consumes `shared/page-briefs/about-us.md`. SEO owns copy, headings, CTA wording and destinations, the bios, and the internal links; this defines look, layout, hierarchy, components, imagery, motion, and the conversion path. Built on `design-system.md`. No em dashes.

## Page role
The company and trust page, and the canonical home of the two founder entities reused as author/reviewer across the money pages and blog. One job: convince a carrier that this is a hands-on team that does the filings, built on documented track record and the FMCSA listing, then offer one clear next step. This is a trust/E-E-A-T page, not a money page, so it leads with credibility and people, not a filing CTA. It is also a `PRESERVE + REBUILD` page being added to the sitemap, so it must read as a credible, current company page.

## Section order and layout

1. Header (global): the shared sticky header and matching mega-footer (per `global-footer.md`). The persistent header primary CTA remains the global compliance action; on this page the in-body dominant action is the single "Contact Tech Rig" close (see CRO).

2. Hero (Paper, asymmetric two-column; copy-first stack on mobile)
   - Left (dominant): H1 "About Tech Rig" (Archivo). The brief's lede as a styled Plex Sans Body L paragraph, never an H-tag; "Tech Rig" and "trucking compliance" appear here per the Three Kings check. The FMCSA listing sentence is part of the lede and should read as a worded credibility line, not a badge. This hero is people-and-story led, so it does not carry a filing CTA button; the single conversion action lives in the closing band, keeping one primary action for the page.
   - Right (signature visual, brand story not tracker): a quiet line-style "one team, whole journey" diagram, the two-node Get road-legal -> Keep loaded device from the system, expressing the dual-silo company in the brand's own visual language. The Authority Status Tracker is not required here (it belongs on the activation money pages); this two-node story diagram is the right About-page visual. If a later revision wants the tracker as a small trust accent in "Our track record," it may appear there in its final static state, but the hero stays the story diagram.
   - 5-second test: H1 names the company, the lede names "trucking compliance and dispatch built by people who do the filings," the diagram shows the dual-silo journey. No amber CTA competes above the fold; this is a deliberate trust-page choice, with the single action held for the close.

3. H2 "What we do": the dual-silo, one-team statement. Two short typographic lines (not matched cards, to avoid the symmetric-card reflex and the AI fingerprint) with the inline contextual links [compliance services](/compliance-services/) and [dispatch](/services/) on 1 to 3 word Steel anchors. Set as styled paragraphs with generous space; "one team for the whole journey" is the takeaway. Cloud surface.

4. H2 "Our track record": the design-system trust band, documented proof only, and the credibility heart of the page. Render the brief's documented figures in the mono "official record" treatment as a small stat set: dispatching since 2021 / around 100 carriers served; a compliance practice that has helped 40+ carriers across more than 10 states since 2025. The FMCSA line set as a worded, linked credibility statement, exact wording, never a government seal or endorsement badge. Partner relationships (Motive for ELD; OTR Solutions and RTS Financial for factoring) as plain text, not logo walls (logos need client approval and would read as endorsement). Include the system's graceful, empty-friendly review slot here so the client can populate testimonials later; it must read fine while empty, with no star widgets, no ratings, no invented testimonials. Paper surface.

5. H2 "Meet the team": EXACTLY TWO founder cards, aliases only, using the system's founder-card component. Never design for a third founder; the finance/strategy founder is not published. Two-up on desktop, stacked on mobile, equal-height, Cloud surface, 1px outline.
   - Each card: an illustrated line-style avatar in the system's two-tone line language, or a Plex Mono initial monogram on an Ink tile (photos are optional and need client approval; design for the no-photo case so the page ships without them). Name in Archivo, "Co-Founder" role as a mono label, the brief's bio in Plex Sans, and a stable anchor target so money-page and blog "Reviewed by" links land on the right founder.
   - Card 1: "Adam Smith, Co-Founder." anchor `#adam-smith`. Card 2: "Robert Hooke, Co-Founder." anchor `#robert-hooke`. The bios are the brief's exact text; the law-background and software-engineer-background lines stay as stated background, never a claim to practice law for clients. Avatars should be visually distinct from each other but share the line style; do not invent likenesses implying real photos.

6. H2 "How we work": the three operating-principle lines (we tell you which filings actually apply, we separate service fee from government and third-party costs, we do not promise activation dates we cannot control or publish numbers we cannot back up). Render as three short typographic value lines with bold styled lead-ins, not glossy cards. These principles are themselves trust signals and tie the page back to the system's honesty rules. Paper surface.

7. Closing CTA band: the page's single dominant action. The brief's closing line "Want a team that handles setup and keeps you loaded? Talk to us." as a styled lead paragraph, plus the button "Contact Tech Rig" (Signal amber, Ink text) routing to `/contact-us/`. This is the one Signal action on the page, deliberately held for the close so the body reads as trust-building, not selling. One clear action, no co-equal second button.

8. Mega-footer (global): the complete service lists live here.

## Hierarchy and the visual path
Eye path on first view: H1 -> the lede with the FMCSA credibility line -> the one-team story diagram -> down through what we do -> the documented track record (the proof core) -> the two founders (the people proof) -> how we work -> the single "Contact Tech Rig" close. Because this is a trust page, the Signal amber is rationed to the one closing action rather than the hero; everything above it is Ink and Steel, building credibility before the ask. The two founder cards are the only matched pair on the page and are content-bearing (real roles, real bios), which is the allowed exception to the no-symmetric-cards rule.

## Imagery and illustration
No photography (and specifically no stock highway imagery, a deliberate move away from the old site). Hero: the two-node Get road-legal -> Keep loaded line diagram. Track record: the mono stat set and the worded FMCSA line; no logo wall for partners. Founders: two illustrated line-style avatars or mono initial monograms, distinct but consistent. How we work: no icons needed, typographic. All single-line SVG, 2px stroke, lightweight to protect the weak CWV baseline SEO flagged.

## Motion
Minimal. The hero story diagram draws its two nodes with a calm fade/slide-in (<=200ms) on load. The track-record stat numbers may have a single calm fade-in but NO animated count-up (count-ups read as a gimmick and risk implying live metrics). No per-section scroll-fade. `prefers-reduced-motion` gives the static final states.

## CRO treatment
- One dominant action for the page: "Contact Tech Rig" -> `/contact-us/`, Signal amber, in the closing band; the body builds trust first, which is the right conversion logic for an About page.
- Trust is the entire conversion mechanism here: the documented since-2021 / ~100 carriers and 40+ / 10-states figures, the FMCSA listing line, the two named hands-on founders, and the honest "how we work" principles do the persuading. No metrics beyond the documented set, no ratings, no invented social proof.
- The founders give the money pages their author/reviewer credibility: this page is where "Reviewed by Adam Smith, Co-Founder" and the Robert Hooke references resolve, so the anchors and bios must be stable and consistent with those reuse points.
- Mobile: sticky bottom bar may carry the global compliance CTA plus a tel: Call button per the system; copy-first hero stack; founder cards stack to one column; the story diagram switches to vertical.

## OG image
Unique branded OG from the system template: Ink or Paper field, mono wordmark, title "About Tech Rig" in Archivo, category tag "Company" in Plex Mono, one relevant line icon (the one-team or shield mark), a Signal rule. Never a placeholder. Never includes founder likenesses or real names.

## What Dev must preserve
- SEO copy, the heading structure, the founder bios verbatim, every internal link and destination (`/compliance-services/`, `/services/`, `/how-to-start-a-trucking-company/`, `/contact-us/`), and the CTA wording exactly. The lede, the bold value lead-ins, and all positioning lines are styled paragraphs, never H-tags.
- Aliases only: "Adam Smith" and "Robert Hooke" in copy and in the `#adam-smith` / `#robert-hooke` anchors and schema; real names never appear in copy, markup, alt text, file names, or the OG image. Exactly two founders; never add a third.
- The two founder `@id`s here are the canonical author/reviewer entities reused across money pages and blog; keep the anchors stable.
- Amber-never-white-text; one Signal action per view (the close); AA contrast; visible keyboard focus; reduced-motion behavior; hit targets >=44px.
- Documented proof only: the since-2021 / ~100 / 40+ / 10-states lines and the FMCSA listing wording exactly. No "5-star" or ratings, no performance metrics, no fabricated awards or trust badges. Partner names as plain text, not endorsement logos.
- FMCSA wording exact; never imply government affiliation or endorsement. The "law background" stays background, not an offer to practice law. ADD this page to the XML sitemap (it was missing). Avatars and any glyphs via inline SVG or CSS, never typed into headings.
