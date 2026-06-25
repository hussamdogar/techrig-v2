# Page design spec: /motus-migration/ (FMCSA Portal to MOTUS Migration)

Design-only spec. Consumes `shared/page-briefs/motus-migration.md`. SEO owns copy, headings, CTA wording and destinations, and the price; this defines look, layout, hierarchy, components, imagery, motion, and the conversion path. Built on `design-system.md`. No em dashes.

## Page role
A compliance money page for a specialist migration service, BOFU navigational, and the longest of the three new pages (1,000 to 1,300 words). One job: a carrier whose older FMCSA Portal account will not move into MOTUS (a record that will not link, a USDOT that cannot be claimed, missing MC authority) hands the migration to Tech Rig for a flat $125. The expertise is the differentiator and earns visible space: this is the page that proves Tech Rig knows the MOTUS path. It now holds the relocated California dismissed-MC worked example (moved here from the MC pages per S2), so this is the one new page with a Client Case File. Reads as the calm, competent place that un-sticks a stranded record.

Tracker note: per design-system Section 13, the Authority Status Tracker is OMITTED here. The whole premise is that records are stranded and not yet usable, so an "Authority active" node would assert the exact status the page cannot support; omitting it is also the honest choice. The hero uses a migration spot illustration instead (see Imagery).

## Section order and layout

1. Header (global, per `global-footer.md`). Persistent global compliance CTA; the page's own primary action is "Start my MOTUS migration". Breadcrumb Home > Compliance Services > MOTUS Migration below the header in the mono label treatment.

2. Hero (Paper, asymmetric two-column; copy-first stack on mobile)
   - Left: H1 "FMCSA Portal to MOTUS Migration" (Archivo). The brief's hero lede as a styled paragraph (Plex Sans Body L), never an H-tag. Primary button "Start my MOTUS migration" (Signal amber, Ink text) -> the `/apply/` flow [VERIFY route, Dev wires]. Small "Reviewed by Robert Hooke, Co-Founder" credibility line under the lede (mono label + name).
   - Right (signature visual): a migration spot illustration in the line system, a record moving from a "legacy FMCSA Portal" node to a "MOTUS" node with a claim/unlock cue, two-tone Ink/Steel with one Signal accent on the claimed record. This is the page's signature explanatory asset. No tracker, no "active" status. Render the hero as a Standfirst Deck: lede as TL;DR with anchor facts (flat $125; about 1 to 2 weeks; for moving an older account into MOTUS) as takeaways, each traceable to a brief sentence.

3. What it covers: H2 "What MOTUS migration covers" (Cloud surface). The six-item scope as a clean line-led list (claiming an existing USDOT, Company Official assignment, manual identity verification, missing MC authority, legacy FMCSA Portal account problems, FMCSA support-ticket assistance), each with a small single-line icon, content-bearing. The "this is for moving an OLDER account; for a brand-new registration see USDOT registration; to fix details on a record you already control see USDOT Correction" copy rendered as a light Eligibility Strip (this applies / this is the wrong page, go here), preserving the `/dot-registration/` and `/usdot-correction/` Steel links exactly. A structural rendering of the brief's own disambiguation, not an invented section.

4. Pricing: H2 "What our MOTUS migration service costs" (Paper surface). The flat $125 mono price chip from the single source. The "any FMCSA government fee tied to a specific filing is separate and shown before you pay" line as a Split-Ledger-style Slate line beneath, paired with but distinct from the service fee. The government fee is conditional here (only when a specific filing applies), so render it as the honest caveat line the brief states, not a fabricated fixed amount.

5. How fast it is done: H2 "How fast it is done" (Cloud surface). The honest-timing block: "approximately 1 to 2 weeks" in mono, then the "MOTUS migrations depend on FMCSA processing and support response, which is outside our control, so we do not promise an exact date" caveat as plain copy, plus "we drive the tickets and the verification steps and keep you updated". No countdown, no tracker.

6. The worked example: H2 "A real migration we handled" (Cloud surface). The relocated California box-truck narrative rendered as a Client Case File: a redacted official-record treatment (left Steel rule, Slate text, mono field labels such as "What we did"), with a "PAST RESULT" tag in Plex Mono. Preserve the narrative exactly: an older operating authority that had been dismissed, a new operating-authority application, he keeps the old MC number though the authority age resets, the BOC-3 and UCR handled alongside, active now and hired a driver. Frame strictly as a past example, never a guarantee; no guaranteed-timeline styling. This is the page's distinct facet, present once.

7. FAQ: H2 "MOTUS migration FAQ", the system FAQ accordion (FAQPage schema). The "why won't my old account work in MOTUS" answer carries the legacy-portal framing; the "can you reinstate a dismissed MC" answer keeps the "new application, you usually keep the old MC number, the authority age resets" facts; the "do I need a USDOT PIN" answer keeps the "FMCSA mails it to the address on record" honesty and the callback/support workaround; the "how much and how long" answer carries $125 and about 1 to 2 weeks. Questions are accordion controls, not headings.

8. Funnel cross-link: the brief specifies no dispatch funnel link, so do not invent one. The brief's compliance cross-links (`/dot-registration/`, `/usdot-correction/`, `/mc-registration/`, `/compliance-services/`) stay as Steel inline links where the copy places them (scope disambiguation in section 3, the MC link near the authority discussion). Keep them subordinate.

9. Closing CTA band (full-bleed Ink): the brief's closing line "Old account stuck outside MOTUS? We will get it claimed and working." as a styled paragraph, then the single dominant button "Start my MOTUS migration" (Signal amber, Ink text), same route. One action only. This is the page's Highway Guide-Sign Callout.

10. Mega-footer (global).

## Hierarchy and the visual path
Eye path: H1 -> primary amber CTA -> the migration illustration -> what it covers (scope list + eligibility disambiguation) -> $125 pricing with the conditional gov-fee caveat -> honest timing -> the California Client Case File (proof) -> FAQ -> single closing CTA. Signal amber is rationed to the primary "Start my MOTUS migration" action (hero, header, close). Every internal link, including the USDOT registration, USDOT Correction, and MC cross-links, is Steel and subordinate. One primary action per view. The page is the longest of the three, so it earns its sections (scope, expertise-by-example, FAQ) without padding.

## Imagery and illustration
No photography, and no Authority Status Tracker (per Section 13). Hero: a single-line migration motif (legacy FMCSA Portal node -> MOTUS node, record claimed/unlocked), two-tone, one Signal accent, the page's signature asset. One small line icon per scope item in section 3. The Client Case File uses the Steel-rule redacted-record treatment, no separate illustration. Optionally one small process-style line diagram in the expertise framing (blocked online path -> FMCSA support ticket -> record claimed) if it earns its place, in the line system, calm and typographic. All single-line SVG, 2px stroke, lightweight for CWV.

## Motion
Minimal. Standfirst Deck takeaways fade in once (<=200ms). Optional one-time draw on the migration motif or the process diagram when it enters view, no looping, not on every section. Accordion chevron rotates. Price chip and Case File static; no count-up on "$125", "1 to 2 weeks", or any figure in the worked example (prose, not a live counter). Sticky mobile CTA appears after the hero. `prefers-reduced-motion` gives final static states.

## CRO treatment
- One dominant action ("Start my MOTUS migration"), Signal amber, at hero and close.
- The expertise-by-example is the conversion lever: the carrier arrives already stuck and self-diagnosing, and the scope list plus the real California case show Tech Rig handles exactly the lockout they are hitting. Knowing the path is most of the job, and the page proves it.
- The Eligibility Strip routes the wrong-fit buyer (brand-new registration, or a simple detail correction) to the right page without losing them, and keeps the genuine migration buyer here.
- Flat $125 transparency with the honest "any specific filing fee is separate and shown before you pay" caveat removes both price and surprise-fee anxiety.
- Honest timing (about 1 to 2 weeks, framed as FMCSA-dependent) and the past-tense case study avoid implying a guaranteed outcome or date.
- Mobile: sticky bottom bar with "Start my MOTUS migration" plus a tel: Call button; copy-first hero; scope list, Case File, and FAQ stack.

## OG image
Unique branded OG from the system template: Ink or Paper field, mono wordmark, title "MOTUS Migration", category tag "Compliance" in Plex Mono, one relevant line icon (migration/claim), Signal rule. Never a placeholder.

## What Dev must preserve
- SEO copy, the heading structure, every internal link and destination, and the $125 figure exactly. The hero lede, the timing caveat, and the worked-example narrative are styled paragraphs, never H-tags.
- The price chip from the single source (`services.md` / registry; new service `motus-migration` at $125, approximately 1 to 2 weeks). Flat `$125`, no price hardcoded; the conditional FMCSA government fee is never encoded as the price and never shown as a fixed invented amount.
- No Authority Status Tracker on this page (per Section 13); do not add status labels or any authority-lifecycle text. The records here are by definition not yet active.
- Honest framing only: no guaranteed FMCSA timeline, no guaranteed outcome. The California case is a real, anonymized past example, framed as past, present once. FMCSA is still mailing USDOT PINs (do not say otherwise). Use "MOTUS" or "MOTUS Portal" for current work and "legacy FMCSA Portal" only in this migration context.
- Amber-never-white-text; one Signal action per view; AA contrast; visible keyboard focus; reduced-motion behavior; hit targets >=44px.
- The dismissed-MC story lives only on this page now (removed from the MC pages per S2); do not duplicate it elsewhere.
- Decorative glyphs and check marks via CSS or inline SVG, never typed into headings.
