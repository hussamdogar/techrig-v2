# Page design spec: /usdot-correction/ (USDOT Correction and Record Updates)

Design-only spec. Consumes `shared/page-briefs/usdot-correction.md`. SEO owns copy, headings, CTA wording and destinations, and the price; this defines look, layout, hierarchy, components, imagery, motion, and the conversion path. Built on `design-system.md`. No em dashes.

## Page role
A compact compliance money page for an ad-hoc record fix, BOFU navigational. One job: a carrier whose USDOT detail has changed (or who got flagged) files the correction through Tech Rig for a flat $125. The page does two things the brief leans on: disambiguate the correction from the two-year Biennial Update so the right buyer stays, and set honest expectations on FMCSA-controlled timing without promising a date. Follows the compliance money-page template, visually consistent with the hub and the other filing pages, distinguished by its ad-hoc "fix a specific detail" framing. Short by design (800 to 1,100 words), so the rhythm stays tight.

Tracker note: per design-system Section 13, the Authority Status Tracker is scoped to authority-activation pages only and is OMITTED here. A correction edits an already-issued record, so "Authority active" would assert a lifecycle status this page does not support. The hero uses a spot illustration instead (see Imagery).

## Section order and layout

1. Header (global, per `global-footer.md`). Persistent global "Start your compliance setup" CTA; the page's own primary action is "Correct my USDOT". Breadcrumb Home > Compliance Services > USDOT Correction below the header in the mono label treatment.

2. Hero (Paper, asymmetric two-column; copy-first stack on mobile)
   - Left: H1 "USDOT Correction and Record Updates" (Archivo). The brief's hero lede as a styled paragraph in Plex Sans Body L (never an H-tag). Primary button "Correct my USDOT" (Signal amber, Ink text) -> the `/apply/` flow for this service [VERIFY route, Dev wires]. Small "Reviewed by Adam Smith, Co-Founder" credibility line under the lede (mono label + name).
   - Right (signature visual): a spot illustration in the line system, a record/registration card with one field being corrected (a small stamp or edit tick), two-tone Ink/Steel with a single Signal accent on the corrected field. No tracker, no status assertion, no guaranteed date. Render the hero as a Standfirst Deck: the lede as the TL;DR, with the page's anchor facts (flat $125; normally same day; separate from the Biennial Update) as the numbered takeaways, each traceable to a brief sentence.

3. What it covers: H2 "What a USDOT correction covers" (Cloud surface). The seven-item scope as a clean line-led list (a small single-line icon per item: address, name, email, phone, status, trucks, drivers), content-bearing, not a decorative triplet. The "If you need the regular two-year filing instead, see the Biennial Update" line preserved exactly as a Steel contextual link to `/mcs-150-biennial-update/`. Render the correction-vs-biennial distinction as a light Eligibility Strip (this fixes a specific detail / the Biennial Update is the two-year filing), a structural rendering of the brief's own disambiguation, not an invented section.

4. Pricing: H2 "What our USDOT correction service costs" (Paper surface). The flat $125 mono price chip from the single source. The "covers filing the correction with FMCSA" line beside it as a Slate fee-honesty note. The "if your MOTUS account or USDOT link needs FMCSA support to unlock first, we handle that as part of the work" line as a second Slate line that forward-references the timing section, and carries the brief's `/motus-migration/` cross-link as a Steel inline anchor ("if the record is locked in MOTUS"). No government fee applies to a standard correction, so no gov-fee line is forced; do not invent a split where none exists.

5. How fast it is done: H2 "How fast it is done" (Cloud surface). The honest-timing block: "normally same day" set in mono as the lead state, then the "FMCSA linking or support can take roughly 7 to 10 business days, which is FMCSA's timeline, not ours" caveat as plain copy. Present timing as honest prose with mono figures, never a countdown, a progress bar, or a tracker. The "we keep your side moving and tell you where it stands" and "we do not promise an FMCSA-controlled date" lines stay verbatim as the reassurance.

6. FAQ: H2 "USDOT correction FAQ", the system FAQ accordion (FAQPage schema). The "is this the same as the biennial update" answer keeps its `/mcs-150-biennial-update/` link; the "how long does it take" answer carries the honest timing. Questions are accordion controls, not headings.

7. Funnel cross-link: the brief specifies no dispatch funnel link for this page, so do not invent one. The brief's compliance cross-links (`/dot-registration/`, `/compliance-services/`, `/motus-migration/`) live where the copy places them as Steel inline links (the MOTUS link pairs with the unlock note in sections 4 and 5; the DOT and hub links sit in the running copy). Keep the page lean.

8. Closing CTA band (full-bleed Ink, the template's closing emphasis): the brief's closing line "Something on your USDOT out of date? We will correct it, fast." as a styled paragraph, then the single dominant button "Correct my USDOT" (Signal amber, Ink text), same route. One action only. This is the page's Highway Guide-Sign Callout.

9. Mega-footer (global).

## Hierarchy and the visual path
Eye path: H1 -> primary amber CTA -> the record-correction spot illustration -> what it covers (scope list + correction-vs-biennial) -> $125 pricing -> honest timing -> FAQ -> single closing CTA. Signal amber is rationed to the primary "Correct my USDOT" action (hero, header, close). Every internal link, including the Biennial Update and MOTUS cross-links, is Steel and subordinate. One primary action per view. The page is short, so sections stay dense with no filler bands.

## Imagery and illustration
No photography, and no Authority Status Tracker (per Section 13). Hero: a single-line record/registration-card illustration with one corrected field, two-tone, one Signal accent. One small single-line icon per scope item in section 3 (address, name, email, phone, status, trucks, drivers). All single-line SVG, 2px stroke, lightweight for the weak CWV baseline. This page should be especially fast given its tight scope.

## Motion
Minimal. Standfirst Deck takeaways fade in once (<=200ms), no looping stagger. Accordion chevron rotates. Price chip static; no count-up on "$125" or on the "7 to 10 business days" figure (these are data and prose, not live counters). Sticky mobile CTA appears after the hero. `prefers-reduced-motion` gives final static states.

## CRO treatment
- One dominant action ("Correct my USDOT"), Signal amber, at hero and close; the short page needs no mid-page amber button.
- The correction-vs-Biennial disambiguation is the routing lever: it keeps the ad-hoc-fix buyer here and sends the two-year-filing buyer to the right page without losing either.
- Flat $125 transparency for a low-consideration filing removes price hesitation; the "we handle the MOTUS unlock as part of the work" note removes surprise-step anxiety.
- Honest FMCSA timing (same day, with the 7 to 10 day caveat framed as FMCSA's, not ours) avoids implying a guaranteed turnaround.
- Mobile: sticky bottom bar with "Correct my USDOT" plus a tel: Call button; copy-first hero; scope list and FAQ stack.

## OG image
Unique branded OG from the system template: Ink or Paper field, mono wordmark, title "USDOT Correction", category tag "Compliance" in Plex Mono, one relevant line icon (record/edit), Signal rule. Never a placeholder.

## What Dev must preserve
- SEO copy, the heading structure, every internal link and destination, and the $125 figure exactly. The hero lede and the timing reassurance are styled paragraphs, never H-tags.
- The price chip from the single source (`services.md` / registry, entry exists at $125); flat `$125`, no price hardcoded. No fabricated government-fee line where none applies.
- No Authority Status Tracker on this page (per Section 13); do not add one by analogy to other compliance specs. No status labels, protest-period figure, or authority-lifecycle text.
- Honest timing only: "normally same day" with the 7 to 10 business-day FMCSA caveat framed as FMCSA-controlled; no guaranteed date, no countdown. FMCSA still mails USDOT PINs; use "MOTUS" for current records, not "FMCSA Portal".
- Amber-never-white-text; one Signal action per view; AA contrast; visible keyboard focus; reduced-motion behavior; hit targets >=44px.
- Documented proof only: this page has no worked example, so render no proof block (do not invent one).
- Decorative glyphs and check marks via CSS or inline SVG, never typed into headings.
