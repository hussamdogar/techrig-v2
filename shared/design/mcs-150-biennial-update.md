# Page design spec: /mcs-150-biennial-update/ (MCS-150 update and biennial filing)

Design-only spec. Consumes `shared/page-briefs/mcs-150-biennial-update.md`. SEO owns copy, headings, CTA wording and destinations, and the price; this defines look, layout, hierarchy, components, imagery, motion, and the conversion path. Built on `design-system.md`. No em dashes.

## Page role
A money page for a maintenance filing, with an informational-to-BOFU intent: many visitors arrive unsure whether they are due or what the MCS-150 even is, then convert. One job: explain the biennial update and out-of-cycle triggers honestly, make the lapse risk (deactivated USDOT) felt, and move the carrier to "update my MCS-150." The expertise angle (MOTUS, PINs, FMCSA callbacks) is the trust differentiator and earns visible space. This is the recurring-upkeep page the dispatch silo links back to, so it should read as the calm, competent place that keeps a number active.

Tracker note: per design-system Section 13, the Authority Status Tracker is OMITTED on record-upkeep pages. The MCS-150 maintains an existing record and does not run the authority-activation sequence, so an "Authority active" node would assert a lifecycle status this page does not own. The hero uses a spot illustration instead (see Imagery).

## Section order and layout

1. Header (global, per `global-footer.md`). Persistent primary CTA "Update my MCS-150". Breadcrumb Home > Compliance Services > MCS-150 Update below the header in the mono label treatment.

2. Hero (Paper, asymmetric two-column; copy-first stack on mobile)
   - Left: H1 "MCS-150 Update and Biennial Filing" (Archivo). Styled hero lede (Plex Sans Body L), never an H-tag. Primary button "Update my MCS-150" (Signal amber, Ink text) -> MCS-150/UCR intake, route to `/contact-us/` until confirmed [VERIFY route]. Small "Reviewed by Adam Smith, Co-Founder" credibility line under the lede (mono label + name).
   - Right (signature visual): a spot illustration in the line system, a USDOT record being kept current (a record or document with a refresh motif), two-tone Ink/Steel with one Signal accent on the updated field. No tracker, no "Authority active" assertion, no authority-lifecycle status, no guaranteed dates. The page protects an existing number rather than activating a new one; the lapse risk is carried by the trigger list and the inline deactivation cue in the body (section 4), not by a hero status node.

3. What it is: H2 "What the MCS-150 is". A plain Cloud text block, Grade 8, with a small single-line document icon. Establishes the form before risk and triggers. The "two reasons you file one" sentence sets up the next section; render the two reasons as a lightweight inline pair (biennial vs out-of-cycle), not numbered (it is a pair, not a sequence).

4. Applicability, stated honestly: H2 "When you need an MCS-150 update". The plain list of triggers (every two years; you moved; fleet changed; operation changed; reactivating) as a clean list with a small line icon per trigger, content-bearing not decorative. The biennial item notes the deadline is tied to the USDOT number (last two digits, odd/even) as written, described generally with no invented date. The "why the biennial update matters" lapse warning sits as a short emphasized line directly under the list, using the status palette deactivation cue (icon + label + color, never color alone) so the risk is felt without alarmist styling.

5. Pricing: the brief places the flat price inside the service-includes section, so render it there (section 6) as the mono price chip rather than inventing a separate pricing H2. Keep the chip a single flat `$125` from the single source, with the brief's "if FMCSA processing requires anything beyond the standard filing, we tell you before any extra step" as a Slate fee-honesty line beside it. No government fee applies to a standard MCS-150 filing, so no gov-fee line is forced here; the only separation note is the "anything beyond standard" caveat.

6. What you get when Tech Rig files it: H2 "What our MCS-150 update service includes". The four service points as a clear checklist (confirm the trigger; complete and submit; work MOTUS/PIN lockouts including the FMCSA callback; confirm it is reflected). Check marks status-active with icon. The flat `$125` price chip (section 5) anchors the bottom of this block, followed by the mid-page text-link CTA "Update my MCS-150" (Steel inline, subordinate to the hero primary).

7. The unique worked example: H2 "Why a wrong record is more than paperwork". The NJ power-only address-correction narrative (insurance-cancellation angle, corrected within 24 hours) as the page's quiet example callout: left Steel rule, Slate text. The "within 24 hours" is framed strictly as a past result, never a promise. This is the page's distinct facet; present once.

8. Expertise: H2 "MOTUS, PINs, and why updates get stuck". This is the credibility centerpiece, so give it real presence without glossiness: a short Cloud block in plain copy, optionally with one small process-style line diagram showing the blocked-online-path -> FMCSA callback -> record unlocked workaround in the line system. It demonstrates daily-work competence; keep it typographic and calm, not a feature card.

9. FAQ: H2 "MCS-150 update FAQ", the system FAQ accordion (FAQPage schema). The "how long does it take" answer is the honest-expectations moment (no promised date); the "I do not have my USDOT PIN" answer reinforces the MOTUS expertise. Questions are accordion controls, not headings.

10. Funnel cross-link forward to dispatch: the brief marks the dispatch funnel link optional. Include a quiet single-line styled handoff to `/services/` before the close on a 1 to 3 word anchor, Steel, consistent with every compliance page ending in a forward path. Keep it light given the maintenance (not new-authority) intent.

11. Closing CTA band: one line + the single dominant button "Update my MCS-150" -> intake / `/contact-us/` until confirmed [VERIFY route]. Supporting line is a styled paragraph.

12. Mega-footer (global).

## Hierarchy and the visual path
Eye path: H1 -> primary amber CTA -> the record-current spot illustration -> what it is -> when you need it (triggers + lapse risk) -> what we do + the $125 chip -> the worked-example proof -> the MOTUS/PIN expertise -> FAQ -> dispatch handoff -> single closing CTA. Signal amber is rationed to the primary action (hero, close, header CTA). The mid-page CTA, all internal links, and the handoff are Steel and subordinate. One primary action per view.

## Imagery and illustration
No photography, and no Authority Status Tracker (per Section 13). Hero: a spot illustration of a USDOT record kept current (a record or document with a refresh motif), two-tone, one Signal accent. One small line icon per trigger in the "when you need it" list (a moving/address icon, a fleet/truck-count icon, an operation-change icon, a reactivate/refresh icon, a clock for biennial). The MOTUS section may use one small line process diagram (blocked path -> callback -> unlocked). Worked example uses the Steel-rule callout, no illustration. All single-line SVG, lightweight for CWV.

## Motion
Minimal. Hero spot illustration fades in once (<=200ms). Optional one-time draw on the MOTUS process diagram when it enters view, no looping and not on every section. Accordion chevron rotates. Price chip static, no count-up on the "24 hours" figure (it is prose, not a live counter). Sticky mobile CTA appears after the hero. `prefers-reduced-motion` gives final static states.

## CRO treatment
- One dominant action ("Update my MCS-150"), Signal amber, repeated at hero and close, plus a subordinate Steel mid-page text link so a convinced reader can act without scrolling back.
- The lapse risk (USDOT deactivation) is the primary motivator and is made felt through the trigger list and the status cue, honestly, without scare tactics.
- The flat $125 chip is full price transparency for a low-consideration filing; the "anything beyond standard, we tell you first" line removes surprise-fee anxiety.
- The MOTUS/PIN expertise section converts the carrier who is already stuck and self-diagnosing online, by showing Tech Rig handles exactly the lockout they are hitting.
- Honest timing (FAQ + the past-tense "24 hours") avoids implying a guaranteed turnaround.
- Mobile: sticky bottom bar with the primary CTA plus a tel: Call button; copy-first hero; trigger list and includes stack.

## OG image
Unique branded OG from the system template: Ink or Paper field, mono wordmark, title "MCS-150 Update", category tag "Compliance" in Plex Mono, one relevant line icon (document/refresh), Signal rule. Never a placeholder.

## What Dev must preserve
- SEO copy, the heading structure, every internal link and destination, and the $125 figure exactly. The hero lede, the lapse warning, and the worked-example narrative are styled paragraphs, never H-tags.
- The price chip from the single source (`services.md`), flat `$125`; no price hardcoded. No fabricated government-fee line where none applies.
- No Authority Status Tracker on this page (per Section 13); do not add one by analogy to other compliance specs. No "Authority active" node or authority-lifecycle status label in the hero; the lapse risk stays an inline body cue (icon + label + color), never a hero status node.
- Amber-never-white-text; one Signal action per view; AA contrast; visible keyboard focus; reduced-motion behavior; hit targets >=44px.
- Documented proof only: the one real NJ worked example, with "within 24 hours" framed as past. No guaranteed turnaround, no invented biennial deadline for the reader, no metrics or ratings.
- Status meaning carried by icon + label + color together, never color alone (the deactivation cue especially).
- Decorative glyphs and check marks via CSS or inline SVG, never typed into headings.
