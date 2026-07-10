# Page design spec: /compliance-packages/ (the four compliance bundles) — DZ3

Design-only spec. Consumes `shared/page-briefs/compliance-packages.md` (SEO) and the structural
decisions in `shared/work-order-pricing-v2.md` (§1-§7). SEO owns copy, headings, CTA wording and
destinations, the service lists, and every figure; this defines look, layout, hierarchy, components,
imagery, motion, and the conversion path. Built on `design-system.md`; reuses the locked foundations
and adds new **components within** the system (no new colours, type, spacing, radius, or motion rules).

**Em-dash exception (sanctioned).** The house rule is "no em dashes," and it holds for all body and UI
copy on this page. The four package names are the single sanctioned exception: they are the client's
exact official product names and contain an em dash. Keep them verbatim, never convert the dash:
- Compliance Continuation — Non-CDL
- Compliance Continuation — CDL/Heavy
- Authority Launch — Non-CDL
- Authority Launch — CDL/Heavy

**Figures are derived, never hardcoded (the load-bearing rule for this page).** Every number shown
(each service price, itemized total, `+$N` rounding, standalone value, savings, discount %) renders from
the Dev registry's derived fields, whose single source is `services.md`. This spec shows layout with the
current values **as illustration only**; if a price moves, the registry recomputes and the UI follows.
No number is typed into markup twice. Where two figures could look contradictory, the spec says how they
reconcile (see "The bundle receipt" and "The derived-figures contract" below) so the design cannot drift.

---

## Page role
The four-bundle selector and the money page that replaces the single-package offer. One job: a carrier
lands, answers two implicit questions — *where am I* (new authority vs already running) and *what do I
drive* (a CDL/heavy vehicle or not) — and is routed to exactly one of four bundles, each shown as a lower
price than buying à la carte, with BOC-3 included in every one. Commercial, BOFU, proof over hype.
The organizing idea is a 2x2: **authority status x vehicle type**. Every component on the page restates
that same 2x2 so the choice stays legible.

## Section order and layout

1. **Header (global):** per `global-footer.md`. Persistent primary CTA "Choose your package" -> `/apply`
   (bundle selection).

2. **Hero (Paper, asymmetric two-column; copy-first stack on mobile).**
   - Left: H1 "Trucking Compliance Packages" (Archivo). The brief's hero lede as a styled Body L
     paragraph (buying filings one by one adds up; packages bundle at a lower price; BOC-3 in every one;
     pick by authority status and vehicle). Primary button "Choose your package" (Signal amber, Ink text)
     -> `/apply`. "Reviewed by Adam Smith, Co-Founder" credibility line beneath (mono label + name).
   - Right (signature visual): the **selector matrix** (component D) — the 2x2 of authority status x
     vehicle type — used here as an at-a-glance map of the four bundles, not the Authority Status Tracker.
     Per `design-system.md` §13, the tracker is scoped to authority-activation pages and is **omitted
     here**; this page is a pricing/selection page, and "Authority active" is not a status it asserts.

3. **H2 "Choose the package that matches your authority status and vehicle type"** (verbatim §5 heading).
   - The §5 supporting text as a styled Body paragraph (every package includes BOC-3, UCR 0-2, one
     driver; heavy packages add CDL compliance, IRP, IFTA; IRP/IFTA government fees separate).
   - The **CDL/non-CDL selector** (component D) rendered full-width here as the primary chooser, wired so
     a selection filters/emphasizes the matching cards below. Selector state is a progressive enhancement:
     with JS off, all four cards remain visible and comparable (no content hidden behind the control).

4. **H2 "Choose by the vehicle, not just the driver's license"** (verbatim §6 heading).
   - The §6 "choose by vehicle not driver" block as styled Body copy (verbatim).
   - The heavy/CDL clarification as a second styled paragraph.
   - The **passenger/hazmat custom-review note** rendered as a Highway Guide-Sign Callout
     (`design-system.md` §13): "Passenger and hazardous-material operations may require custom review,"
     with a subordinate Steel link to contact/custom quote. Shape + label carry it, not colour alone.

5. **H2 "The four packages"**: the four **package cards** (component A), laid out as the 2x2 (see the
   grid rules in component A). This is the visual centre of the page.

6. **H2 "BOC-3 Included in every package"** (§7): a short reinforcement band. Restates the **BOC-3
   Included badge** (component B) and, for the existing-carrier packages, the longer verbatim line
   ("BOC-3 filing when required or verification the existing BOC-3 is correctly on file"). Do NOT promote
   BOC-3 as its own package here.

7. **H2 "Compare the packages"**: the **comparison table** (component E), the §4 matrix.

8. **H2 "Additional drivers"**: the §8 bundle-DQ deck (1 = included, 2 = $350 total / +$150,
   3 = $450 total / +$100, >3 = custom), rendered with the Price-chip and mono figures, all derived.
   Subordinate Steel link to `/driver-qualification-files/`.

9. **H2 "Renewals and recurring billing"**: the §9 verbatim disclosure as calm Body copy (no amber, no
   alarm styling); a plain two-column "service / renewal cycle" list is optional if it traces to the
   brief's table.

10. **H2 "Packages FAQ"**: the system FAQ accordion (FAQPage schema). Grade 8. The "how do I pick"
    answer reinforces choose-by-vehicle.

11. **Closing CTA band (Ink):** the §closing line ("Not sure which one? Answer two questions and we will
    match you.") + the single dominant button "Choose your package" (Signal amber, Ink text) -> `/apply`.

12. **Mega-footer (global).**

---

## New components (within the locked system)

These are new, reusable **components**, not new foundations. Each is built only from existing tokens,
type roles, and the §13 pattern toolkit. The card, badge, and bundle-receipt are written so the compliance
hub's new package-selector section (SEO's hub-brief update) can reuse them without redefinition.

### A. Package (bundle) card
The content-bearing card from `design-system.md` §8, extended for a priced bundle. Cloud surface, 1px
Slate-16% outline, 8px radius, the single soft shadow token. Anatomy, top to bottom:

1. **Eyebrow row:** a Plex Mono category label pairing the two axes for this bundle, e.g.
   `CONTINUATION · NON-CDL` (mono label style, Slate, uppercase, tracking 0.08em). This is a structural
   UI label (design chrome, §13), derived from the bundle's authority-status and vehicle axes.
2. **Name:** the verbatim package name in Archivo H3 (keep the em dash).
3. **BOC-3 Included badge** (component B), inline directly under the name.
4. **Price:** the final bundle price as a flat Price chip (`design-system.md` §8), Plex Mono, tabular,
   at the large end of the price/number scale. Derived (400 / 1100 / 1000 / 1700 as illustration).
5. **Who-it-is-for:** one styled Body line (the brief's "Who" sentence, verbatim).
6. **Suggested-wording line:** the brief's one-sentence value line as styled Body copy (verbatim).
7. **Included-services list:** each row = small line icon + service name (Steel inline link to that
   service page) + the service's in-bundle price as a small mono figure at the row's right. Check/inclusion
   is carried by the line icon + the service being listed, never colour alone. Order follows the brief.
   Existing-carrier cards (Continuation) omit MC+USDOT; Launch cards lead with it. CDL/Heavy cards add the
   five heavy rows (Clearinghouse, Consortium, drug test, IRP, IFTA).
8. **The bundle receipt** (component C): itemized in-bundle total -> `+$N` rounding -> final price, then
   the public display (standalone value, package price, savings, discount %).
9. **Fee note** (CDL/Heavy cards only): the §-fee line "IRP and IFTA government, state, plate, credential,
   and jurisdiction fees are billed separately," Small/Slate, as a Split-Ledger-style aside so the
   pass-through fees never blend into the bundle price.
10. **Card CTA:** "Get this package" -> `/apply` with that bundle pre-selected (Dev wires the
    pre-selection key; design the button, not the URL).

**CTA colour / amber rationing.** Four cards in one viewport cannot each carry a Signal-amber button
(that breaks the "roughly one Signal element per viewport" ration, §3). Resolution: **card CTAs are solid
Ink buttons** (strong, tappable, subordinate to Signal); the rationed Signal-amber action per viewport is
the page-level "Choose your package" in the hero and the closing band. Do not mark any card "most popular"
or "recommended" — that would be invented social proof (§8, §10). If the client later supplies real
data, a badge slot can be added; ship without it.

**Grid.** Desktop: a 2x2 grid that mirrors the conceptual matrix — **columns = vehicle** (Non-CDL left,
CDL/Heavy right), **rows = authority status** (Continuation top, Launch bottom). This aligns the two
denser CDL/Heavy cards in one column and keeps each column's vehicle story consistent with the selector
and the comparison table. Equal-height cards within a row; the receipt block bottom-aligns so the four
final prices sit on a common baseline. Tablet: 2-up (reading order Continuation Non-CDL, Continuation
CDL/Heavy, Launch Non-CDL, Launch CDL/Heavy). Mobile: 1-up stacked, same reading order.

### B. BOC-3 Included badge
A new small status/inclusion chip, distinct from the pill-shaped status tags (which are reserved for the
Authority Status Tracker). Rectangular chip, 4px radius (the chip radius token), Steel 1px outline on
Cloud, a small line "stamp/checkmark seal" icon (§6 icon set) + the mono label `BOC-3 INCLUDED` (Plex
Mono label style, Steel text). **Not amber** (amber is rationed and never text). Colour is not the sole
carrier: the icon + the word "Included" carry the meaning. Two content states, both from the brief:
- **Default:** the badge alone (`BOC-3 INCLUDED`).
- **Existing-carrier (Continuation cards + the §7 band):** the badge plus the longer verbatim line
  beneath it, "Includes BOC-3 filing when required or verification that the carrier's existing BOC-3 is
  correctly on file," as Small/Slate copy.
Reusable sitewide wherever a bundle is shown.

### C. The bundle receipt (itemized -> rounding -> savings)
Built on the **Split-Ledger Fee Receipt** / **Pre-Filing Manifest** patterns (§13): a costed sheet in
mono, two-line reconciliation, states carried by shape + label. This is the component that makes the
pricing transparent and must be **fully derived**. Layout inside each card (and reused in the hub
selector):

```
 In-bundle services        $396      <- sum of the listed in-bundle prices (derived)
 Rounding adjustment        +$4      <- final price minus itemized total (derived, always the +$N line)
 ─────────────────────────────
 Package price             $400      <- the bundle's final, rounded price (derived)

 Standalone value          $476      <- sum of the same services at standalone prices (derived)
 You save                   $76      <- standalone value minus package price (derived)
                          (16.0%)     <- savings / standalone value (derived, one decimal)
```

- Mono, tabular figures, right-aligned column so the digits line up; labels left in Small/Slate; the
  "Package price" and "You save" rows emphasized (Ink, slightly heavier) as the two numbers that convert.
- The `+$N` rounding line is **always** present and always derived as `final price − itemized in-bundle
  total` (currently `+$4` on all four; never hardcode "4"). If the sum ever rounds down, the component
  shows a `−$N` line the same way; do not assume the sign.
- "You save" and the discount % are the **net public figures** (standalone value − final price), which is
  the honest, real saving. Show one decimal on the percent to match the brief (16.0 / 18.6 / 11.2 / 15.0).

**The derived-figures contract (why two "discounts" do not contradict).** The itemized list sums to an
in-bundle total that is **more** discounted than the headline saving, because rounding adds a few dollars
back. For Bundle 1: the services are $80 cheaper in-bundle than standalone ($476 -> $396), then `+$4`
rounding lifts the charge to $400, so the **net** saving the customer sees is **$76 / 16.0%**, not $80.
The receipt shows this chain explicitly (value -> in-bundle -> +rounding -> price -> net saving) so the
two numbers read as one honest calculation, never as a mismatch. Same structure for all four:
$1,351/$1,096/+$4/$1,100/$251/18.6%; $1,126/$996/+$4/$1,000/$126/11.2%;
$2,001/$1,696/+$4/$1,700/$301/15.0%. All illustration only — derived at render.

### D. CDL/non-CDL selector + "choose by vehicle" block
A new segmented control expressing the 2x2, honouring "choose by the vehicle, not the driver."

- **Two axes, two controls.** Axis 1 = authority status (segmented: "Already running" / "New authority").
  Axis 2 = vehicle (segmented: "Non-CDL vehicle" / "CDL / heavy vehicle"). Rendered as two labelled
  segmented controls (Ink text, Steel selected-state fill at readable contrast, 6px radius, ≥44px hit
  targets, visible 2px Steel focus ring). Together they resolve to exactly one of the four bundles.
- **Hero rendering:** the same choice as a 2x2 **matrix map** — rows authority status, columns vehicle,
  each of the four cells naming its bundle and final price (derived) and linking to that card. This is the
  at-a-glance version; the segmented controls are the interactive version in section 3.
- **Behaviour:** selecting both axes highlights the one matching card and can scroll to it; the card CTA
  carries that bundle into `/apply`. Progressive enhancement only — with JS disabled, nothing is hidden;
  all four cards and the full comparison remain available.
- **"Choose by vehicle not driver" block (§6, verbatim):** styled Body copy directly under the selector,
  so the clarification sits with the control that needs it. Then the heavy/CDL clarification paragraph.
- **Passenger/hazmat:** the custom-review note as a Highway Guide-Sign Callout (pattern from §13) —
  "Passenger and hazardous-material operations may require custom review" — with a Steel link to custom
  review/contact. It is an off-ramp from the 2x2, styled as a quiet guide-sign, not an error state.

### E. Comparison table (§4)
The side-by-side matrix. A new table component in the line system (structure from line and space, not
heavy fills, per §5).

- **Columns:** the four packages, in the same left-to-right order as the card grid and selector
  (Continuation Non-CDL, Continuation CDL/Heavy, Launch Non-CDL, Launch CDL/Heavy). Column headers = the
  verbatim names (Archivo H4 / mono eyebrow), em dashes intact.
- **Rows:** the ten included services (brief §4 order), then the three figure rows — Standalone value,
  Final package price, Customer savings — all derived.
- **Cells:** inclusion shown as a line "check" icon for ✓ and an en-dash/"not included" glyph for —,
  each with an accessible label (icon + `sr-only` text), never colour alone. Figure rows in mono,
  tabular, right-aligned; the "Final package price" row emphasized (Ink) as the decisive line.
- **Sticky first column** (service names) and horizontal scroll on mobile: the table never forces the
  page body to scroll sideways; it scrolls within its own `overflow-x:auto` container. On narrow mobile,
  an alternative stacked read (one package per block, reusing the card list) is acceptable if the 4-column
  table cannot stay legible; the desktop/tablet view keeps the true side-by-side matrix.
- Every figure derived from the registry; the table restates no number that could drift independently of
  a card (same single source feeds both).

---

## Hierarchy and the visual path
Eye path: H1 -> hero amber "Choose your package" and the selector matrix (the 2x2 map) -> the section-3
segmented selector (make the choice) -> the four cards (confirm what is in it, see the price and the
saving) -> the comparison table (for the deliberate comparer) -> additional-drivers / renewals (objection
handling) -> FAQ -> single amber closing CTA. Signal amber is rationed to the page-level primary action
(hero + close); card CTAs are solid Ink; all service links and the custom-review off-ramp are Steel and
subordinate. One primary action per view.

## Imagery and illustration
No photography. Line icons only: one per service row (from the §6 icon set — MC/USDOT, BOC-3 stamp, UCR
document, DQ file, Clearinghouse, consortium, drug test, IRP plate, IFTA fuel), the BOC-3 stamp/seal in
the badge, check/exclusion glyphs in the comparison table, and the 2x2 matrix as a simple line diagram.
All inline SVG, lightweight for CWV. No decorative icon-triplets, no 3D, no gradient blobs.

## Motion
Minimal, per §9. Selector segmented-control state change (instant/≤120ms); optional ≤200ms
highlight/scroll-to on the matched card; accordion chevron. Price and receipt figures render static (no
count-up gimmick). `prefers-reduced-motion` gives final states with no transition. No per-section
scroll-fade.

## CRO treatment
- The selector removes the hardest part of the decision (which of four), and the choose-by-vehicle block
  pre-empts the most common mis-selection (CDL licence vs CDL vehicle). That is the conversion engine.
- Each card earns the price with the receipt: standalone value, the itemized bundle, the honest rounding,
  and the real saving — transparent pricing is a trust asset for this buyer (§10). No hidden numbers.
- BOC-3 Included on every card is a differentiator surfaced consistently (badge), not buried in prose.
- IRP/IFTA pass-through fees always shown as separate (fee note), never blended into the bundle price.
- Real saving framing only (standalone value − package price); no invented "was" price, no fake urgency,
  no "most popular" without client data.
- One dominant amber CTA per view, always routing to `/apply`. Mobile: sticky bottom bar with "Choose
  your package" + a tel: Call button (does not cover content; safe-area padding).

## Accessibility
- AA contrast on all text and UI (selected segmented-control state verified against its fill before
  build). Amber never carries text; Ink text on any amber surface only.
- Selector and CTAs keyboard-operable with visible 2px Steel focus ring, ≥44x44 hit targets; segmented
  controls exposed as a labelled radio group (role/`aria`), selection announced.
- Inclusion in cards and the comparison table carried by icon + text label, never colour alone; the
  comparison ✓/— cells have `sr-only` text.
- Comparison table scrolls within its own container; the page body never scrolls horizontally at 320px.
- Reduced motion fully honoured.

## OG image
Unique branded OG from the §8 template: Ink field, mono wordmark, title "Compliance Packages", category
tag "Compliance" (Plex Mono), one line icon (stacked-bundle or stamp), a Signal rule. Never a placeholder.

## Schema note (for Dev; design-adjacent)
The page carries `OfferCatalog` with the four bundles as `Offer`s (price = final bundle price), plus
`BreadcrumbList` and `FAQPage` (per the brief). Prices in schema read from the same single source as the
visible figures — never a second hardcoded copy.

## What Dev must preserve
- SEO copy, heading structure (verbatim H2s), every internal link and destination, the service lists, and
  the four package names **with their em dashes intact**. Suggested-wording, who-it-is-for, and lede are
  styled paragraphs, never H-tags.
- **Every figure derived from the registry (`services.md` single source):** service prices, itemized
  totals, the `+$N` rounding line (computed as final − itemized, sign not assumed), standalone value,
  savings, and discount %. No price hardcoded; no number restated where it could drift; the receipt, the
  cards, the comparison table, and the schema all read the same source.
- The bundle-receipt reconciliation shown explicitly (value -> in-bundle -> +rounding -> price -> net
  saving) so the in-bundle discount and the net saving never read as contradictory.
- Amber rationing: one Signal action per view (hero + close); card CTAs solid Ink; badge and selected
  states never amber-on-white text. AA contrast; visible focus; reduced motion.
- BOC-3 Included badge on every card; the existing-carrier longer line verbatim on Continuation cards and
  the §7 band; BOC-3 never promoted as a separate package here.
- IRP/IFTA government/pass-through fees always shown separate from the bundle price.
- No invented proof: no "most popular," no ratings, no fabricated saving or "was" price.
- The Authority Status Tracker is **omitted** on this page (out of its authority-activation scope, §13);
  the 2x2 selector matrix is the hero visual instead.
- Check/exclusion glyphs and icons via inline SVG/CSS, never typed into headings or copy.
