# Page design spec: /ifta-quarterly-filing/ (IFTA Quarterly Filing Service)

Design-only spec. Consumes `shared/page-briefs/ifta-quarterly-filing.md`. SEO owns copy, headings, CTA wording and destinations, and the price; this defines look, layout, hierarchy, components, imagery, motion, and the conversion path. Built on `design-system.md`. No em dashes.

## Page role
A compliance money page for a recurring service, BOFU navigational. One job: a carrier already set up for IFTA hands off the every-quarter fuel-tax return to Tech Rig for $150 per quarter plus the tax due. The page does three things the brief leans on: separate the $150 service fee from the variable fuel tax (a government amount) so pricing reads honestly, distinguish the recurring return from the one-time IFTA registration ($175 setup), and frame the recurring billing honestly (reminder plus manual invoice, auto-charge only with consent). Distinct from `/ifta-registration/`; the two cross-link. Compact (800 to 1,100 words).

Tracker note: per design-system Section 13, the Authority Status Tracker is OMITTED on fuel-tax pages; a quarterly return asserts no authority-lifecycle status. The hero uses a quarterly-cycle spot illustration instead (see Imagery). This page omits the tracker even though the older `/ifta-registration/` spec shows one; Section 13 is the governing rule.

## Section order and layout

1. Header (global, per `global-footer.md`). Persistent global compliance CTA; the page's own primary action is "File my IFTA quarter". Breadcrumb Home > Compliance Services > IFTA Quarterly Filing below the header in the mono label treatment.

2. Hero (Paper, asymmetric two-column; copy-first stack on mobile)
   - Left: H1 "IFTA Quarterly Filing Service" (Archivo). The brief's hero lede as a styled paragraph (Plex Sans Body L), never an H-tag, including the "Already set up for IFTA? This is the ongoing service that keeps you current" line. Primary button "File my IFTA quarter" (Signal amber, Ink text) -> the `/apply/` flow [VERIFY route, Dev wires]. Small "Reviewed by Robert Hooke, Co-Founder" credibility line under the lede (mono label + name).
   - Right (signature visual): a spot illustration of the quarterly cycle, four ordered quarter nodes (Q1 to Q4) in the line system reading as a recurring loop, two-tone Ink/Steel with one Signal accent on the current quarter. No tracker, no authority status. Render the hero as a Standfirst Deck: lede as TL;DR with the anchor facts ($150 per quarter; plus fuel tax due; filed in 1 to 3 business days) as takeaways, each traceable to a brief sentence.

3. What it is: H2 "What IFTA quarterly filing is" (Cloud surface). Plain copy at Grade 8. The "after your IFTA registration is in place" line keeps its Steel `/ifta-registration/` link. The "totals your miles and fuel by jurisdiction and settles the difference, you either owe tax or carry a credit" idea rendered as a lightweight two-outcome inline pair (owe tax / carry a credit), a pair not a sequence, structural only. The "keeping clean records as you go makes each quarter simple" line stays as written.

4. Pricing: H2 "What our IFTA quarterly filing costs" (Paper surface). This is the page's trust section, so render the fee as a Split-Ledger Fee Receipt, two lines never blended:
   - Tech Rig service fee: a flat mono chip "$150" with the label "per quarter" from the single source.
   - Fuel tax due: a separate Slate line "+ fuel tax due (varies, paid to the jurisdictions)", explicitly the government amount, never encoded as the price or blended into the $150.
   - The recurring-billing honesty line "we remind you before each quarterly deadline and invoice the filing; we only auto-charge if you have expressly agreed to it" as a Slate note beneath. Render it verbatim; do not add an "automatic reminder" claim or any countdown UI (the reminder flow is a fast-follow per work order D10).

5. How fast it is done: H2 "How fast it is done" (Cloud surface). The honest-timing block: "within 1 to 3 business days after we have your complete mileage and fuel records" with "1 to 3 business days" in mono, then the "the sooner your records are in, the sooner we file ahead of the deadline" line as plain copy. No countdown, no tracker.

6. FAQ: H2 "IFTA quarterly filing FAQ", the system FAQ accordion (FAQPage schema). The "how is this different from IFTA registration" answer keeps its `/ifta-registration/` link and the $175-vs-$150 distinction; the "what do you need from me" answer reinforces the records-in, file-in-1-to-3-days expectation; the "how often is it due" answer carries the recurring framing. Questions are accordion controls, not headings.

7. Funnel cross-link: the brief specifies no dispatch funnel link, so do not invent one. The brief's compliance cross-links (`/ifta-registration/`, `/irp-registration/`, `/compliance-services/`) stay as Steel inline links where the copy places them (the IRP link pairs with the interstate-setup context). Keep the page lean.

8. Closing CTA band (full-bleed Ink): the brief's closing line "Quarter coming due? Send your records and we will file your IFTA return." as a styled paragraph, then the single dominant button "File my IFTA quarter" (Signal amber, Ink text), same route. One action only. This is the page's Highway Guide-Sign Callout.

9. Mega-footer (global).

## Hierarchy and the visual path
Eye path: H1 -> primary amber CTA -> the quarterly-cycle illustration -> what it is (with the registration cross-link) -> the Split-Ledger pricing (service fee vs fuel tax, the trust-builder) -> honest timing -> FAQ -> single closing CTA. Signal amber is rationed to the primary "File my IFTA quarter" action (hero, header, close). Every internal link, including both IFTA registration cross-links and IRP, is Steel and subordinate. One primary action per view.

## Imagery and illustration
No photography, and no Authority Status Tracker (per Section 13). Hero: a single-line quarterly-cycle motif (four quarter nodes as a loop), two-tone, one Signal accent on the current quarter. The Split-Ledger Fee Receipt in section 4 is the page's signature explanatory asset (service-fee line over a separate government-tax line). One small line icon in the what-it-is pair if it earns its place (a miles icon and a fuel icon). All single-line SVG, 2px stroke, lightweight for CWV.

## Motion
Minimal. Standfirst Deck takeaways fade in once (<=200ms). Optional subtle one-time draw on the quarterly-cycle loop when it enters view, no looping animation (it must not move while the user reads). Accordion chevron rotates. Price chip and the Split-Ledger receipt static; no count-up on "$150" or "1 to 3 business days". Sticky mobile CTA appears after the hero. `prefers-reduced-motion` gives final static states.

## CRO treatment
- One dominant action ("File my IFTA quarter"), Signal amber, at hero and close.
- The Split-Ledger fee separation is the conversion lever: showing $150 as the service fee and the fuel tax as a separate government amount removes the "what am I actually paying you" hesitation unique to a tax-bearing service.
- The registration-vs-quarterly distinction (hero line plus the FAQ) routes the not-yet-set-up carrier to `/ifta-registration/` and keeps the recurring-return buyer here.
- Honest recurring-billing copy (reminder plus manual invoice, consent-only auto-charge) builds trust and stays truthful to what the system does today.
- Honest timing (1 to 3 business days after complete records) sets expectations without a guarantee.
- Mobile: sticky bottom bar with "File my IFTA quarter" plus a tel: Call button; copy-first hero; the Split-Ledger receipt stacks (service-fee line above the tax line).

## OG image
Unique branded OG from the system template: Ink or Paper field, mono wordmark, title "IFTA Quarterly Filing", category tag "Compliance" in Plex Mono, one relevant line icon (quarterly cycle / fuel), Signal rule. Never a placeholder.

## What Dev must preserve
- SEO copy, the heading structure, every internal link and destination, and the $150 figure exactly. The hero lede and the recurring-billing note are styled paragraphs, never H-tags.
- The price chip from the single source (`services.md` / registry, entry exists at $150 + gov); flat `$150` labelled "per quarter", with the fuel tax due as a separate Slate line. The fuel tax is never encoded as the price or blended into the service fee (also a schema rule in the brief).
- No Authority Status Tracker on this page (per Section 13); do not add one by analogy to `/ifta-registration/`.
- Recurring billing rendered honestly: reminder plus manual invoice, auto-charge only with express consent. Do not promise an automated reminder the system does not yet do (work order D10), and add no countdown.
- Amber-never-white-text; one Signal action per view; AA contrast; visible keyboard focus; reduced-motion behavior; hit targets >=44px.
- Documented proof only: this page has no worked example, so render no proof block.
- Decorative glyphs and check marks via CSS or inline SVG, never typed into headings.
