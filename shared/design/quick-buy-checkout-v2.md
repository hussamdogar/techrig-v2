# Quick-buy checkout v2: Review screen (step 2 of 3)

Status: APPROVED by owner 2026-10-13 and built (`dev/app/buy/[service]/[usdot]/checkout-form.tsx`). Header and footer are the slim checkout pair (`dev/components/checkout-chrome.tsx`: /lp header reduced to logo + call button, one-strip footer), not the mockup's. BOC-3 already on file: offered, worded for switching agents. Signature stays typed (no autofill). sessionStorage persistence was not built (a rejected submit no longer reloads, so input is kept anyway).
Mockup: `shared/design/mockups/quick-buy-checkout-v2.html` (phone 375 and laptop 1280, six scenarios, interactive).
Flow position: (1) service + USDOT entry, (2) THIS SCREEN, (3) Stripe payment, (4) thank you.

---

## 1. Design reasoning

The visitor already did the hard part (picked a service, typed a USDOT). This screen has three jobs, in this order:

1. **Reassure**: "Yes, that is my company, and this is exactly what I am paying." The FMCSA record and an always-visible total do this.
2. **Collect the minimum**: contact details are pre-filled, so the only things most people type are their signature name. One checkbox, one button.
3. **Offer more without friction or surprise**: one add-on shown, the rest one tap away, nothing charged that is not on screen.

Principles applied:

- **One column of decisions on phone, decisions plus a persistent receipt on laptop.** Phone users scroll; laptop users scan. The laptop gets a two-column layout with the order summary, signature and button in the right column, next to the total (Stripe Checkout pattern). The phone keeps one column in the same DOM order, so no duplicate fields exist.
- **Pre-filled contact data is shown as a confirmed summary with an Edit button**, not as six open fields. It cuts the phone page by roughly 280px and removes the "do I need to fill this in?" doubt. Fields open automatically when any required value is missing or invalid.
- **Signature lives next to the money.** Authorizing while looking at the total is honest and reduces "what did I agree to" disputes.
- **Sticky total bar on phone only.** The total is never more than a glance away, but the bar hides while the keyboard is open (it would cover the field) and when the in-page button is on screen (two primary buttons visible at once is noise).
- **Validate late, re-validate early.** No red text while someone is still typing. Errors appear on blur (format only, for fields with content) or on submit (required). Once a field has shown an error, it re-checks on every keystroke so the error clears the moment it is fixed.
- **Everything priced is visible.** Pre-ticked add-ons are promoted out of the "More services" list on load, and anything ticked inside that list is promoted when the list is collapsed. The summary always lists every charged line with a Remove control.

---

## 2. Tokens

Palette (from brand) plus three functional colours this screen needs. All text pairs pass WCAG AA.

| Token | Hex | Use | Contrast |
| --- | --- | --- | --- |
| ink | #0E2233 | text, headings | 16.6:1 on Cloud |
| steel | #225E8A | links, focus ring, selected states, icons | 6.9:1 on Cloud |
| signal | #E89A3C | primary button fill only | Ink on Signal 7.0:1 |
| signal-hover | #DC8A27 | primary button hover | Ink on it 6.2:1 |
| paper | #F7F5F1 | page background | |
| cloud | #FFFFFF | cards, inputs | |
| slate | #4F5E6B | captions, hints | 6.4:1 on Cloud, 6.0:1 on Paper |
| success | #2E7D5B | "Found in FMCSA records", step done | 5.0:1 on Cloud |
| error (new) | #B42318 | error text and borders | 6.5:1 on Cloud |
| error-50 (new) | #FDF1EF | server-error alert and checkbox-row tint | |
| success-50 (new) | #E9F3EE | verified pill background | |
| steel-50 (new) | #EDF3F8 | selected add-on card | |
| line (new) | #E3DFD7 | decorative card borders and dividers | decorative only |
| field (new) | #7E8D9B | input and checkbox borders | 3.4:1 on Cloud (meets 1.4.11 for UI components) |

Tailwind v4 `@theme` block:

```css
@theme {
  --color-ink: #0E2233; --color-steel: #225E8A; --color-signal: #E89A3C; --color-signal-hover: #DC8A27;
  --color-paper: #F7F5F1; --color-cloud: #FFFFFF; --color-slate: #4F5E6B; --color-success: #2E7D5B;
  --color-error: #B42318; --color-error-50: #FDF1EF; --color-success-50: #E9F3EE; --color-steel-50: #EDF3F8;
  --color-line: #E3DFD7; --color-field: #7E8D9B;
  --font-display: "Archivo", system-ui, sans-serif;
  --font-sans: "IBM Plex Sans", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  --font-mono: "IBM Plex Mono", ui-monospace, monospace;
}
```

Typography (all prices use `tabular-nums`):

| Role | Phone | Laptop | Classes |
| --- | --- | --- | --- |
| H1 | Archivo 700, 26/32 | Archivo 700, 32/40 | `font-display font-bold text-[26px] leading-8 tracking-[-0.015em] lg:text-[32px] lg:leading-10` |
| H2 (section) | Archivo 700, 19/24 | same | `font-display font-bold text-[19px] leading-6` |
| Body and inputs | Plex Sans 16/24 | same | `text-base` (16px minimum on inputs prevents iOS zoom) |
| Labels | Plex Sans 600, 14/20 | same | `text-sm font-semibold` |
| Captions, hints | Plex Sans 400, 13 to 14 / 18 to 20, slate | same | `text-[13px] text-slate` / `text-sm text-slate` |
| Total amount | Archivo 800, 30/36 | same | `font-display font-extrabold text-[30px] leading-9 tabular-nums` |
| USDOT numbers | Plex Mono 500 | same | `font-mono font-medium` |

Shape and spacing: cards `rounded-[14px] border border-line bg-cloud p-4 lg:p-6 shadow-[0_1px_2px_rgba(14,34,51,.05)]`; inputs `rounded-[10px]`; primary button `rounded-xl`. Section gap 28px phone, 32px laptop. Side gutter 16px phone, 40px laptop.

Focus: every interactive element shows `outline-3 outline-steel outline-offset-2` on `:focus-visible`. Inputs use `focus:border-steel focus:ring-3 focus:ring-steel/30` instead.

Touch targets: inputs 52px tall, add-on rows at least 64px, primary button 56px (52px in the sticky bar), text links at least 44px tall via `min-h-11 inline-flex items-center`. Only the summary "Remove" link is smaller (28px, above the WCAG 2.5.8 24px minimum) because it duplicates the add-on checkbox.

---

## 3. Anatomy

One DOM, two layouts. Breakpoint: `lg` (1024px). Below it, the phone layout; at and above it, the laptop layout. (The mockup uses a container query at 960px only so it can render both frames on one page.)

DOM order:

```
header            logo | "Secure checkout" (lock icon)
form
  .main
    progress      Service (done) > Review (current) > Payment
    H1            visually hidden (sr-only) "{Service} for USDOT {number}"; no visible heading (owner 2026-10-13)
    section A     FMCSA record card (no heading or caption; aria-label "Your carrier record")
    section B     Contact details  (contact summary or fields)
    section C     Missing any of these?  (policy line, visible add-ons, "More services" disclosure)
  .aside
    card D        Order summary  (lines, Total due now, fee note, aria-live)
    card E        Authorize the filing  (signature, checkbox, button, trust)
sticky bar        Total due now {amount} | Continue to payment   (phone only)
```

### Phone (below lg)

- Header: `h-14 px-4 bg-cloud border-b border-line`, logo left, "Secure checkout" right (13px slate, green lock).
- Wrapper: `px-4 pt-4 pb-6`, single column, all sections stacked in DOM order. The summary and signature cards come after the add-ons, so the visitor reviews the final total immediately before signing.
- Sticky bar: `sticky bottom-0 z-10 flex items-center gap-3 px-4 pt-3 pb-[calc(14px+env(safe-area-inset-bottom))] bg-cloud border-t border-line shadow-[0_-8px_24px_rgba(14,34,51,.08)]`. Left: a button showing "Total due now" (12px slate) over the amount (Archivo 800, 22px); tapping it scrolls to and focuses the Order summary card. Right: primary button, `h-13 flex-1`, "Continue to payment".
  - Hidden (`translate-y-full invisible`, 220ms) when the in-page "Continue to payment" button is at least 50% visible (IntersectionObserver), and while any text input has focus (keyboard open).
  - The bar's button runs the same submit as the in-page button.
- Contact fields: first and last name side by side (`grid grid-cols-2 gap-3`), email and phone full width.

### Laptop (lg and up)

- Header: `h-18 px-10`.
- Wrapper: `mx-auto max-w-[1120px] px-10 pt-9 pb-18 grid grid-cols-[minmax(0,1fr)_400px] gap-12 items-start`.
- `.aside`: `sticky top-6`, but only while it fits: a ResizeObserver adds `static` when `aside.offsetHeight > window.innerHeight - 48` (happens with several add-ons plus inline errors). This avoids the bottom of a sticky column (the button) being unreachable.
- FMCSA record shows as a three-column row: USDOT, Power units, Address (2fr).
- Email and phone sit side by side.
- No sticky bar.

---

## 4. Sections in detail

### A. Carrier record
- No section heading or caption (owner, 2026-10-13): the H1 already names the service and USDOT. The section carries `aria-label="Your carrier record"` for screen readers.
- Card: legal name (no "Found in FMCSA records" pill, removed by owner 2026-10-13) (Archivo 700, 18px), then a definition list: USDOT number (mono), Power units, Physical address.
- Footer link with back-arrow icon: "Not you? Use a different USDOT". Goes to step 1 with the chosen service kept and the USDOT field cleared and focused. Not a button-styled element; it is a link (navigation).
- Read-only. Nothing here is a form field.

### B. Contact details
- Heading "Contact details" with no caption when FMCSA data is complete (owner, 2026-10-13). The missing-data caption still shows when fields open because data is missing.
- **Data complete** (first, last and a valid email from FMCSA): summary view. Name (600), email, phone (slate, or "No phone added"), and an outlined "Edit" button (`min-h-11 min-w-16`, `aria-label="Edit contact details"`). Edit swaps in the fields and focuses First name. There is no "Done" button: the fields stay open, which is simpler and the values are already saved in state.
- **Data missing or invalid** (any of first, last, email empty or malformed): fields open on load. Caption becomes the missing-data copy (see Copy). Fields that FMCSA did provide stay pre-filled.
- Fields and attributes:

| Field | type | inputmode | autocomplete | Other | Required |
| --- | --- | --- | --- | --- | --- |
| First name | text | | given-name | autocapitalize="words" enterkeyhint="next" | yes |
| Last name | text | | family-name | autocapitalize="words" enterkeyhint="next" | yes |
| Email | email | email | email | autocapitalize="off" spellcheck="false" | yes |
| Phone (optional) | tel | tel | tel-national | placeholder "(555) 555-0123", formats as you type to (XXX) XXX-XXXX, strips a leading 1 | no |

- Email typo assist: on blur, if the domain matches a known typo (gmial.com, gamil.com, gmai.com, gmail.co, yahooo.com, hotmial.com, outlok.com, and similar), show "Did you mean {corrected}?" with the corrected address as a button that applies it. Never auto-correct silently.
- Hints: email "Your receipt goes here." Phone "Only used if we need you to confirm a filing detail."

### C. Missing any of these?
- Heading "Missing any of these?" (owner, 2026-10-13).
- Policy line directly under the H2, always visible, Ink 14px 500 with a steel info icon: "Carriers get fined for gaps at inspections. One-time fees, no auto-renewals." (owner, 2026-10-13). The "one-time fees, no auto-renewals" part is the Google Ads billing disclosure and must stay.
- **Visible add-ons** = the featured add-on plus every pre-ticked add-on (from `?add=`), in catalogue order (UCR, BOC-3, DQ, Consortium, Clearinghouse).
- **Featured add-on rule**:
  1. Service is not UCR: feature UCR.
  2. Service is UCR and FMCSA shows no BOC-3 on file: feature BOC-3. (Without a BOC-3 the authority cannot go active, so it is the most likely real need, and the description says so using their own record.)
  3. Service is UCR, BOC-3 on file, carrier has truck tractors: feature Drug & alcohol consortium (a legal requirement for CDL drivers, low price).
  4. Service is UCR, BOC-3 on file, no truck tractors: feature DQ files.
- **Eligibility**: the purchased service is never offered. Consortium and Clearinghouse only when the carrier has truck tractors (CDL). Non-CDL carriers see only BOC-3, UCR, DQ.
- **Add-on card**: whole row is the `<label>` for a 24px custom checkbox. Grid `grid-cols-[24px_1fr_auto] gap-3 p-4 lg:px-5`. Name (600), optional tag "From your compliance check" (only on items that arrived pre-ticked), description (14px slate), price right-aligned (600, tabular) with a 12px note under it (UCR: "0-2 trucks" or "{n} trucks"; DQ: driver count).
  - Selected: `border-steel bg-steel-50 shadow-[inset_0_0_0_1px_var(--color-steel)]`, checkbox filled steel with white check.
  - BOC-3 description switches on the record: no BOC-3 on file vs already on file (see Copy).
- **More services disclosure**: a full-width dashed-border button (`min-h-15`), `aria-expanded`, `aria-controls`. Closed label "More services ({n})" with the short names of what is inside on a second line; open label "Hide more services". Chevron rotates 180 degrees.
  - When collapsing, any item ticked inside the list is promoted to the visible list, so nothing selected is ever hidden. Items are not moved while the list is open (no jumping under the finger).
  - If promotion empties the list, the disclosure disappears and focus moves to the section heading.
- **UCR price**: $100 for 0-2 power units. For larger fleets the server computes the price from the FMCSA power-unit count and passes it in; the note reads "{n} trucks". The screen never asks the visitor for a truck count.

### DQ files: always one driver
- Owner, 2026-10-13: DQ files are sold for **one driver only**, at $200. There is no driver-count control, no 4+ quote path and no `drivers` URL parameter. The DQ card shows "$200" with the note "1 driver"; the summary line sub-line is "1 driver".

### D. Order summary
- One line per item: name, sub-line, price. Purchased service sub-line "Your selection". DQ sub-line driver count. UCR sub-line "0-2 trucks, federal fee included".
- Add-on lines have a "Remove" text button (with hidden text "Remove {name}"); removing unticks the add-on and moves focus to the summary heading.
- Total row: "Total due now" (600) and amount (Archivo 800, 30px). Updates instantly.
- Fee note: "All fees included. Nothing is added at payment." 
- Screen reader: a visually hidden `aria-live="polite"` paragraph announces "Total due now $X" 500ms after the last change (debounced so rapid toggling does not spam).
- Prices display as whole dollars ($45). Stripe shows cents on the next screen.

### E. Authorize the filing
- Caption: "Typing your name signs this order for {LEGAL NAME}."
- Field "Your full legal name": `type="text" autocomplete="off" autocapitalize="words" spellcheck="false"`. Autofill is deliberately off: the signature must be typed, which is the point of a typed signature. Valid when it contains at least 2 letters.
- Checkbox row: 24px checkbox + "I agree to the terms of service and authorize this filing." The row is the label (large target). "terms of service" opens in a new tab (`target="_blank" rel="noopener"`, with hidden text "(opens in a new tab)") so the form is never lost.
- Server-error alert (only when the server fails), then the primary button, then the trust rows. No field-error summary box (owner, 2026-10-13).
- Primary button: `h-14 w-full rounded-xl bg-signal text-ink text-[17px] font-semibold hover:bg-signal-hover active:translate-y-px shadow-[inset_0_-2px_0_rgba(14,34,51,.14),0_1px_2px_rgba(14,34,51,.12)]`, right-arrow icon (SVG, `aria-hidden`). Never `disabled` before submit: a disabled button gives no reason; pressing it shows what is missing.
- Trust rows (13px slate, steel icons, bold lead in Ink):
  1. Card icon: "**Pay securely on the next step.** Card payment is handled by Stripe. We never see your card number."
  2. Shield icon: "**FMCSA-listed BOC-3 blanket process agent.** We file on your behalf."
  3. Building icon: "DGR Tech Rig is a private filing service, not a government agency."

On submit the server must store the authorization record: typed name, checkbox state, terms version, line items and total, timestamp (UTC), IP, user agent, USDOT.

---

## 5. States

| State | What changes |
| --- | --- |
| Default | Record card, contact summary, UCR (or featured) unticked, "More services" closed, summary shows the purchased service only, signature empty, sticky bar visible on phone. |
| Add-ons open | Disclosure expanded, remaining eligible add-ons listed below it. Button label "Hide more services". |
| DQ selected | DQ card selected at $200, summary adds "Driver qualification (DQ) files / 1 driver". |
| Pre-ticked arrival (`?add=dq,consortium`) | Those add-ons render ticked in the visible list with the "From your compliance check" tag, plus the featured add-on. Summary and total include them on first paint (server-rendered, no flash). Unknown or ineligible IDs in `?add=` are ignored. |
| UCR is the service | Featured add-on per the rule in section C. Subline reads "UCR registration for USDOT ...". |
| Missing contact data | Fields open on load, missing-data caption, present values kept. |
| Validation errors | See section 6. |
| Submitting | Button shows spinner + "Saving your order...", `aria-busy="true"`, `aria-disabled="true"`, click ignored (no double submit). Sticky bar button mirrors it ("Saving..."). Fields stay editable-looking but changes are ignored until the request returns. Then redirect to Stripe. |
| Server error | Alert above the button: "We could not save your order. Nothing was charged and your details are still here. Please try again." (`role="alert"`), button restored and focused. All input kept. |
| FMCSA lookup failed | Not this screen: step 1 handles not-found. If a record arrives without power units or address, show "Not listed" in slate for that value. |

Persistence: mirror form state (contact, add-ons, signature name, not the checkbox) to `sessionStorage` keyed by USDOT + service, so a refresh, the terms tab, or the browser Back button from Stripe restores everything.

---

## 6. Validation

| Field | When | Message |
| --- | --- | --- |
| First name | submit | Enter your first name. |
| Last name | submit | Enter your last name. |
| Email empty | submit | Enter your email so we can send your receipt. |
| Email malformed | blur (if not empty) and submit | Enter an email like name@example.com. |
| Phone | blur (if not empty) and submit | Enter a 10-digit US phone number, or leave it blank. |
| Signature | submit | Type your full legal name to sign. |
| Checkbox | submit | Check the box to authorize this filing. |

Rules:
- Before the first submit, only format errors appear, and only on blur.
- A field that has shown an error re-validates on every input and clears as soon as it is valid.
- On submit with errors: each invalid field gets `aria-invalid="true"`, a 2px error border, and an inline message (alert icon + text) linked by `aria-describedby`. The checkbox row gets an error-50 tint. There is no error summary box (owner, 2026-10-13): field errors show only under their fields. The form scrolls to the top-most invalid field (form order: first name, last name, email, phone, legal name, checkbox) and focuses it, scrolled to sit about 110px below the top (clears the header on phone).
- If contact is in summary view but a required value is invalid, the fields open automatically on submit.
- Nothing typed is ever cleared by validation or by a server error.

---

## 7. Accessibility

- Landmarks: `header`, `form`, a `nav aria-label="Checkout progress"` with `aria-current="step"` on Review. Each section has an H2 and `aria-labelledby`.
- Single H1. Headings name sections; no slogans as headings.
- Every input has a visible `<label>`. Required fields have `aria-required="true"`; the optional phone says "(optional)" in its label.
- Custom checkboxes are native `<input type="checkbox">` with `appearance:none`, so state and keyboard work natively. Driver choices are native radios in a fieldset.
- Disclosure button uses `aria-expanded` and `aria-controls`.
- Live total announced via a polite live region (debounced). The server error uses `role="alert"`; field errors are announced when focus lands on the invalid field (its message is linked by `aria-describedby`).
- Icons are inline SVG with `aria-hidden="true"`. No decorative glyphs typed into text.
- Contrast per section 2. Focus is always visible (3px steel).
- `prefers-reduced-motion`: no slide on the sticky bar, no chevron rotation transition, instant scroll.
- Zoom to 200% and 320px width: no horizontal scroll; the segmented control wraps to 2 x 2 below 340px (`grid-cols-2 min-[340px]:grid-cols-4`).

---

## 8. Acceptance criteria

1. On a 375px phone with complete FMCSA data, a visitor can go from page load to Stripe with: type signature name, tap checkbox, tap Continue. Nothing else is required.
2. Exactly one add-on card is visible on load unless add-ons arrived pre-ticked; every pre-ticked add-on is visible, ticked and included in the total on first paint.
3. The featured add-on follows the four-step rule in section C, using the FMCSA BOC-3 and truck-tractor flags.
4. Clearinghouse and Consortium never render for a carrier without truck tractors. The purchased service never renders as an add-on.
5. "Carriers get fined for gaps at inspections. One-time fees, no auto-renewals." is visible under the add-ons heading at all times, at every breakpoint.
6. After collapsing "More services", every ticked add-on is visible outside the list. The summary lists every charged item.
7. The total equals the sum of the summary lines, updates on every change without a reload, and matches the amount the server sends to Stripe (server recomputes from IDs; it never trusts a client total).
8. DQ files: always 1 driver, $200. No driver-count control anywhere.
9. UCR price comes from the server based on power units; $100 for 0-2.
10. Submit with empty signature or unticked checkbox: no request is sent, inline errors appear under each invalid field, and the page scrolls to and focuses the top-most one.
11. The phone sticky bar is hidden while a text input has focus and while the in-page Continue button is at least half visible; it never covers an input or an error.
12. Laptop: the right column is sticky only when it fits the viewport.
13. Double-tapping Continue sends one request. A failed request shows the server error and keeps all input.
14. All inputs are at least 16px font, 52px tall; the email field opens the email keyboard and the phone field the number pad on iOS and Android.
15. No console errors; Lighthouse accessibility 100 on this screen.
16. Copy contains no em dashes.

---

## 9. Copy to confirm

New or changed UI copy for owner sign-off:

- H1: none visible (owner, 2026-10-13). A screen-reader-only H1 "{Service} for USDOT {number}" keeps one heading per page.
- Progress steps: "Service", "Review", "Payment"
- Header: "Secure checkout"
- Link "Not you? Use a different USDOT"
- "Contact details" (no caption; owner 2026-10-13)
- Missing data: "FMCSA does not list contact details for this USDOT. Add where we should send your receipt and filing updates."
- Hints: "Your receipt goes here." / "Only used if we need you to confirm a filing detail." / "Did you mean {email}?"
- Add-on descriptions:
  - BOC-3 (none on file): "FMCSA shows no BOC-3 on file for you. Your authority cannot go active without one."
  - BOC-3 (on file): "FMCSA already shows a BOC-3 for you. Only needed if you are switching process agents."
  - UCR: "Required every year to cross state lines. Running without it can mean fines at roadside inspections." (owner, 2026-10-13)
  - DQ: "Needed for owner-operators and drivers both. A missing file is one of the first things auditors flag, and it can cost you your authority." (owner, 2026-10-13)
  - Consortium: "Enrollment in a random drug and alcohol testing pool for CDL drivers."
  - Clearinghouse: "Employer setup in the FMCSA Drug and Alcohol Clearinghouse."
- Tag: "From your compliance check"
- Disclosure: "More services ({n})" / "Hide more services"
- Summary: "Order summary", "Your selection", "Total due now", "Remove"
- Fee note: "All fees included. Nothing is added at payment."
- "Authorize the filing" / "Typing your name signs this order for {LEGAL NAME}." / "Your full legal name"
- Checkbox: "I agree to the terms of service and authorize this filing."
- Button: "Continue to payment" / busy "Saving your order..."
- Trust: "Pay securely on the next step. Card payment is handled by Stripe. We never see your card number." / "FMCSA-listed BOC-3 blanket process agent. We file on your behalf." / "DGR Tech Rig is a private filing service, not a government agency."
- Errors: as listed in section 6, plus the server error message.

---

## 10. Open questions for the owner

1. ~~DQ 4+ quote path~~ Resolved 2026-10-13: DQ is always one driver, so there is no quote path.
2. **BOC-3 already on file**: keep offering it (inside "More services", with the "switching agents" description) or hide it entirely?
3. ~~Quote turnaround~~ Resolved: no quote path.
4. **Support phone in the header**: a "Questions? Call {number}" link would be a strong trust cue for this audience on phone. Is there a staffed number to show?
5. **Signature autofill**: proposal keeps browser autofill off for the signature name so it is consciously typed. Accept the extra typing, or allow autofill (or a "Sign as {First Last}" one-tap fill) for speed?
6. **UCR tiers above 2 trucks**: confirm the server provides the computed price and label for larger fleets; this screen only displays it.
