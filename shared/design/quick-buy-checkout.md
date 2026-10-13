# Page spec: Quick-buy checkout (one screen: confirm, add-ons, sign)

Design spec for Dev. Version 1.0, 2026-10-13. Owner approved merging the two quick-buy screens between USDOT entry and payment into ONE screen. This spec designs that screen. No new colours, fonts, radii or shadows: every value below already exists in `dev/app/globals.css` and `design-system.md`. No em dashes.

Mockup: `shared/design/mockups/quick-buy-checkout.html` (desktop frame, 375px mobile frame, disclosure closed and open, live total, plus a states and edge-case board).

## 1. What changes

| Today | After |
| --- | --- |
| `/buy/[service]/[usdot]/` "Confirm your carrier record": carrier identity + contact fields, button "Continue to review" | Same URL now holds the whole step. |
| `/buy/order/[orderId]/review/` "Review your order": add-on checklist (all eligible add-ons visible), driver count, summary, signature, "Continue to payment" | Retired as a destination. Keep the route as a redirect (see section 10). |
| `/buy/order/[orderId]/pay/` | Unchanged. The single submit now lands here directly. |

One form, one submit, one primary button ("Continue to payment"). The add-on list changes shape: only one add-on row is visible by default (UCR in most cases), the rest sit in a collapsed disclosure.

Files Dev touches (design does not edit these): `dev/app/buy/[service]/[usdot]/page.tsx` and `actions.ts` (merge in `reviewAndSignQuickBuyOrder` logic), `dev/app/buy/order/[orderId]/review/review-form.tsx` (logic moves into a new client form for the confirm page), `dev/app/buy/order/[orderId]/review/page.tsx` (becomes a redirect).

## 2. Anatomy

```
Section surface="paper"  pt-8 md:pt-12
Container max-w-2xl (672px), single column at every width

  BOC-3 FILING · USDOT 1234567                 eyebrow, Plex Mono xs, uppercase, Slate
  Confirm your order                           H1, Archivo 800 text-3xl            [label: confirm]
  Check your details, add anything else you    lede, Slate
  need, and sign. You pay on the next screen.                                    [label: confirm]

  [ error summary, only after a rejected submit ]

  +-----------------------------------------------+
  | Your carrier                          (H2)    |  b. read-only, Cloud card (DocketSection)
  | Legal name    SAMPLE FREIGHT LINES LLC        |
  | USDOT #       1234567                         |
  | Power units   2                               |
  | Address       100 Example Rd, Springfield, IL |
  +-----------------------------------------------+

  Your contact details                    (H2)    c. no card, fields on Paper
  [ First name        ] [ Last name        ]        2-up from sm
  [ Email *           ] [ Phone            ]
  Pulled from your FMCSA record. Edit anything that is out of date.   (one helper line)

  You may also need                       (H2)    d.
  Bundle more of your compliance filings into this order: one payment, one confirmation.
  Each is a one-time payment. Nothing renews automatically.   (Ink, medium, always visible)
  +-----------------------------------------------+
  | [ ] UCR registration                    $100  |  featured row (always visible)
  |     Annual federal registration; ...          |
  |-----------------------------------------------|
  | 3 more filings              1 added    [v]    |  <summary> of native <details>
  |-----------------------------------------------|  (rows below only when open)
  | [ ] Driver qualification files      from $200 |
  | [x] Clearinghouse registration          $100  |
  | [ ] Drug & alcohol consortium           $120  |
  +-----------------------------------------------+

  Number of drivers                               e. only when DQ files is in the order
  ( 1 ) ( 2 ) ( 3 ) ( 4 or more )                    segmented radio group
  Sets your DQ files price. We'll follow up to collect each driver's documentation after purchase.

  +-----------------------------------------------+
  | Order summary                         (H2)    |  f. Cloud card
  | BOC-3 filing                            $45   |
  | Clearinghouse registration             $100   |
  | -------------------------------------------   |
  | Total due now                          $145   |  aria-live="polite"
  +-----------------------------------------------+

  Sign to confirm                         (H2)    g.
  Type your full legal name to sign
  [ Full legal name                             ]
  [ ] I agree to the terms of service and authorize this filing.

  [  Continue to payment  ]                       h. the only Signal element on the page
  Try another USDOT                               tertiary Steel link

  ---------------- mobile only, < md ----------------
  | Total due now                          $145   |  sticky total strip (no button), section 7
```

## 3. Section by section

All inputs keep today's field class (single source, extract to a const if Dev wants):
`mt-1 w-full rounded-card border border-slate/25 bg-cloud px-4 py-3 text-ink outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel`
Note: today's inputs are `bg-paper` on a Paper section, so the field barely separates from the page. Change to `bg-cloud` (design-system §8 Forms: "inputs Cloud surface"). This is the only visual change to the fields.

Vertical rhythm between sections: `mt-8` (32px). Inside a section: heading to content `mt-3`.

### a. Header
- Eyebrow: `font-mono text-xs font-semibold uppercase tracking-[0.18em] text-slate`, content `{def.name} · USDOT {usdot}`. Unchanged from today.
- H1: `mt-1 font-display text-3xl font-extrabold tracking-[-0.02em] text-ink`. Text: "Confirm your order" (new, see section 12).
- Lede: `mt-3 text-slate`. Text in section 12.
- The stray `<p className="mt-2 text-sm text-ink">{def.name}</p>` at the bottom of the current page Container is removed (the eyebrow already carries the service name).

### b. Your carrier (read-only)
- Reuse `DocketSection` with `title="Your carrier"` and today's four rows (Legal name, USDOT #, Power units, Address). `mt-6` below the lede (or below the error summary).
- Read-only on purpose: these values come from FMCSA. No edit affordance. The existing "Try another USDOT" link at the bottom of the page is the escape hatch for a wrong carrier.

### c. Your contact details
- H2 `font-display text-lg font-bold text-ink` "Your contact details", then the same 2x2 grid as today: `mt-3 grid gap-4 sm:grid-cols-2`.
- Labels `text-sm font-medium text-ink`. Email gets a required marker: append ` (required)` in `font-normal text-slate` to the label rather than an asterisk (clearer, no glyph). First and last name stay `required` as today; mark them the same way. Phone stays optional (no marker).
- Add `autoComplete`: `given-name`, `family-name`, `email`, `tel`. Phone gets `inputMode="tel"`.
- Helper text: today the same helper repeats under all four fields (four identical lines). Replace with ONE line under the grid: `mt-2 text-xs text-slate`, text in section 12.

### d. Add-ons: "You may also need"
Header block, unchanged copy:
- H2 "You may also need".
- Intro `mt-1 text-sm text-slate` (today's "Bundle more of ..." line).
- Billing disclosure `mt-1 text-sm font-medium text-ink`: "Each is a one-time payment. Nothing renews automatically." ALWAYS rendered whenever the add-ons section renders, outside the disclosure, never inside it (Google Ads pricing policy).

List card: `mt-3 overflow-hidden rounded-card border border-slate/15 bg-cloud`, rows separated by `divide-y divide-slate/10`.

Featured row and disclosure rows share one row component:
- Whole row is the `<label>` (bigger tap target on mobile than today's checkbox-plus-name label): `flex cursor-pointer gap-3 px-4 py-3 hover:bg-paper/60` with `has-[:focus-visible]:outline-2 has-[:focus-visible]:-outline-offset-2 has-[:focus-visible]:outline-steel`.
- Checkbox `mt-0.5 h-5 w-5 shrink-0 rounded border-slate/40 accent-steel` (20px box, the row gives the 48px hit area).
- Body: `min-w-0 flex-1`, name `text-sm font-medium text-ink`, reason `mt-0.5 text-xs text-slate` (`QUICK_BUY_UPSELL_REASON[key]`), savings line `text-xs font-semibold text-status-active` only when `savings > 0` (keep today's logic).
- Price: `shrink-0 text-right font-mono text-sm text-ink`, struck "was" price above it as today.
- Checked row: `bg-steel/5` so a ticked item reads at a glance in the collapsed/open list.

Disclosure (native `<details>` as the last child of the list card):
- `<details>` wraps a `<summary>` plus a `<ul>` of rows.
- `<summary>`: `flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-medium text-steel hover:bg-paper/60 [&::-webkit-details-marker]:hidden focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-steel`.
  - Left: "{n} more filings" (n = number of rows inside, never counts the featured row).
  - Right: status `text-xs font-normal text-slate`: "None added" when nothing inside is ticked, "{k} added" in `font-semibold text-ink` when k > 0. Then a chevron (inline SVG, 16px, `transition-transform group-open:rotate-180 motion-reduce:transition-none`, `aria-hidden`).
  - `<details>` gets `className="group"` for the chevron.
- Rows inside: `border-t border-slate/10` on the inner `<ul>`, same row component.
- No height animation (native open/close is instant; respects the motion policy for free).

### e. Number of drivers (only when DQ files is in the order)
- Rendered when `dq-files` is the primary or is ticked. Position: directly under the add-ons card, `mt-6`.
- Change the control from a free number input to a segmented radio group (fewer keystrokes, no invalid values, and it maps exactly to the price table):
  - `<fieldset>` with `<legend className="text-sm font-medium text-ink">Number of drivers</legend>`.
  - Options 1, 2, 3, "4 or more" (posts `4`). Each option: `relative` label containing a visually hidden radio (`peer sr-only`) and a box `flex min-h-12 min-w-14 items-center justify-center rounded-btn border border-slate/25 bg-cloud px-4 font-mono text-sm text-ink peer-checked:border-ink peer-checked:bg-ink peer-checked:text-cloud peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-steel`. Group: `mt-2 flex flex-wrap gap-2`.
  - Selected state uses Ink, not Signal (Signal stays on the one primary button).
  - Default selection: `1` (today's default).
- Helper `mt-2 text-xs text-slate`: today's sentence, unchanged.
- "4 or more": the DQ line in the summary shows "Quote" with the existing note ("More than 3 drivers: custom quote") and the total excludes it, exactly as `calculateDqFiles` does today. No new behavior.
- When DQ is unticked, the field unmounts and `driver_count` is not posted (today's behavior).

### f. Order summary
- Card `mt-8 rounded-card border border-slate/15 bg-cloud p-5`, H2 "Order summary" `font-display text-lg font-bold text-ink`. Today's card has no heading; it gets one so the section is findable by heading navigation.
- Lines: primary service first, then add-ons in the order shown above. Each line: name `text-sm text-ink` + secondary line `text-xs text-slate` + amount `font-mono font-medium text-ink`, struck "was" price as today.
- Change: the secondary line under each item shows the pricing note (`line.note`, as the pay page does: "Includes your government registration fee, based on your fleet size on file.", "2 drivers, flat total"), not the "why you need this" reason. The reason already sits directly above in the add-on rows, so repeating it is noise, and using `note` makes this card match the pay screen's card line for line.
- Total row: `mt-3 flex items-center justify-between border-t border-slate/15 pt-3`, "Total due now" `font-display font-bold text-ink`, amount `font-mono text-lg font-bold text-ink`. Wrap the total row in `aria-live="polite" aria-atomic="true"` so a screen reader hears the new total after each tick.
- Live update: recompute with `computeQuickBuyPricing` on every change, as today (server recomputes on submit and at charge time).

### g. Sign to confirm
- H2 "Sign to confirm", then today's field and checkbox, unchanged copy:
  - Label "Type your full legal name to sign", input `name="signature_name"`, `required`, placeholder "Full legal name", `autoComplete="name"`.
  - Do NOT prefill from first/last name: the typed act is the authorization record.
  - Terms: whole line is the label, checkbox `mt-0.5 h-5 w-5`, `required`, terms link opens in a new tab as today.

### h. Primary action
- `<button type="submit">` with `buttonVariants({ variant: "primary", size: "md" })` + `mt-6 w-full sm:w-auto`. Label "Continue to payment" (unchanged).
- The ONLY Signal element on the screen. No Signal on the featured add-on, the disclosure, the driver selector, or the sticky strip.
- Below it, `mt-4`, "Try another USDOT" as today (Steel tertiary link).

## 4. Add-on rules (resolves the edge cases)

Let `remaining = remainingQuickBuyUpsells(truckTractors, [primary])` (unchanged function).

1. **Featured add-on.** First key in this priority list that is in `remaining`: `["ucr", "dq-files", "boc-3", "clearinghouse", "consortium"]`.
   - Primary is anything but UCR: UCR is featured (owner decision).
   - **Primary is UCR: DQ files is featured.** Reasoning: a UCR buyer is an already-operating carrier renewing an annual registration, so BOC-3 (a one-time filing that activates authority) is most likely already on file. DQ files apply to every carrier with a driver, including an owner-operator driving their own truck, and are offered to every fleet (no truck-tractor gate). See open question 1 for the alternative (feature BOC-3 only when the FMCSA record shows no BOC-3 on file).
2. **Disclosure holds 2 or more items:** render it collapsed (unless rule 4 applies).
3. **Disclosure would hold exactly 1 item:** do not render a disclosure. Show that item as a second visible row. A toggle that hides one row costs a click and saves about 60px. **Disclosure would hold 0 items:** no disclosure. **`remaining` is empty:** hide the entire add-ons section, including the H2 and the billing disclosure line.
   - In practice: a carrier with truck tractors always gets 1 featured + 3 in the disclosure (or 1 + 2 when the primary is Clearinghouse or Consortium). A carrier with no truck tractors gets `boc-3 / ucr / dq-files` minus the primary = 2 items, which by this rule are both visible rows and there is no disclosure. See open question 2 (owner asked for UCR only visible; this rule shows 2 rows for no-tractor carriers).
4. **Pre-ticked add-ons (`?add=`).** If ANY pre-ticked key lands inside the disclosure, the `<details>` renders with `open` on the server (SSR, so it is open before hydration and with JS off). The summary status already reads "{k} added". Nothing that is charged may be hidden on first paint. The visitor may collapse it afterwards; the "{k} added" status and the order summary still show every ticked item.
   - Positions never change when ticked (no "promote ticked items to the top"): rows stay where they were so nothing jumps under the pointer.
5. **Unticking:** all add-ons, including pre-ticked ones, stay untickable (today's behavior).
6. **Order of rows inside the disclosure:** the remaining priority order from rule 1.

## 5. States

| State | What the visitor sees |
| --- | --- |
| Default | Sections a to h, disclosure closed, no driver field (unless DQ is primary), summary with the primary line only. |
| Disclosure open | Rows visible inside the card, chevron rotated. Summary status keeps showing "None added" / "{k} added". |
| Pre-ticked arrival | Disclosure open on first paint if any ticked item is inside it. Ticked rows have `bg-steel/5`. Summary lists them. |
| DQ driver field shown | Field mounts under the add-ons card, default "1". Summary DQ line updates with the selection; "4 or more" shows "Quote". |
| Submitting | Button `disabled`, `aria-disabled`, label stays "Continue to payment" with a 16px spinner before it (inline SVG, `motion-safe:animate-spin`, `aria-hidden`), form `aria-busy="true"`. Use `useFormStatus().pending`. Prevents double orders. |
| Error | See section 8. |
| Lookup states (not found, invalid, rate limited, lookup error, loading) | Unchanged from today's confirm page. |

## 6. Layout: single column at every width (recommendation)

Keep `max-w-2xl` single column on desktop. Do not build a two-column layout with a sticky summary on `lg`.
- The owner's order ends as a document: itemized amount, then the signature that authorizes it, then the button. A sticky right-hand summary would separate the authorized amount from the signature and would pull the button away from the signature or duplicate it.
- The content is narrow by nature (two-up fields, five short line items at most). A second column would mostly be empty space next to the carrier card and the contact fields.
- Continuity: the entry screen (`max-w-xl`) and the pay screen (`max-w-2xl`, same summary card) are single column. The visitor sees the same card again on the next screen.
- At 1280x800 with the disclosure closed, the summary card sits about one scroll below the add-ons. When the disclosure is open the summary moves down by about 200px; acceptable on desktop.

## 7. Mobile (375px): sticky total strip, no sticky button

Recommendation: a mobile-only (`md:hidden`) sticky strip that shows the live total, with NO button.
- Why a strip: on a phone the add-ons, the driver field and the summary are about 1.5 screens apart, so ticking a box gives no visible price feedback. Live price feedback at the point of choice is the conversion job here.
- Why no button: the lp pages' sticky bar (`dev/app/lp/_shared/sticky-cta.tsx`) carries a CTA because its target is a single field. Here a "Continue to payment" in the bar would either submit before the signature (native validation then yanks the visitor down to the signature field) or need a second label like "Review and sign". Either way it is a second primary per view, which breaks the Signal ration.
- Behavior (same IntersectionObserver approach as `sticky-cta.tsx`): visible only while the add-ons section (or the driver field) is on screen AND the order summary card is not. Hidden on first paint (starts `translate-y-full`, `inert`, `aria-hidden`), slides in with `transition-transform duration-300 motion-reduce:transition-none`.
- Classes: `fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-4 border-t border-slate/15 bg-cloud px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-card md:hidden`. Left "Total due now" `text-sm font-medium text-ink` (plus "{n} items" in `text-xs text-slate`), right amount `font-mono text-lg font-bold text-ink`.
- `aria-hidden="true"` always: the summary's `aria-live` total already announces changes; announcing twice is noise.
- Mobile layout otherwise: fields stack 1-up, buttons full width, card padding `p-4` (keep `sm:p-5`).

## 8. Errors: placement and focus

Behavior change Dev must make: today both actions `redirect()` with `?error=`, which reloads the page and throws away everything the visitor typed and ticked. On a single screen that would wipe the contact edits, the add-ons, the driver count and the signature. Use `useActionState` (or return field errors from the action) so the server responds with errors and the form keeps every value. Keep `?error=` handling only as a no-JS fallback.

Client side (first line of defense, no change in approach): native `required` and `type="email"` on name, email, signature and terms. The browser focuses the first invalid field.

Server side (email or phone rejected, signature/terms missing, save failure):
1. **Error summary** directly under the lede, above "Your carrier": `mt-4 rounded-card border border-signal/40 bg-signal/10 px-4 py-3 text-sm text-ink` (today's pattern), with a 16px warning icon (inline SVG, Ink stroke) so it is not colour alone. `role="alert"`, `tabIndex={-1}`, and focus it after the response renders. Content: one bold line, then a list of in-page links, one per error, each pointing at its field id (`#email`, `#phone`, `#signature_name`, `#terms_accepted`).
2. **Inline error** under each failing field: `mt-1 flex gap-1.5 text-xs font-medium text-ink` with the same icon. The input gets `aria-invalid="true"`, `aria-describedby` pointing at the error, and `border-2 border-ink` (not an amber border: amber on white is about 2.3:1 and fails the 3:1 non-text contrast floor).
3. Save failure (`?error=1` today) has no field: summary only, existing message.
4. Error messages: reuse today's strings (`CONFIRM_ERROR_MESSAGES` and the review page's signature line). Split the email/phone message per field only if the action can tell which one failed; otherwise attach it to both.

## 9. Accessibility

- Disclosure: native `<details>/<summary>`. It ships keyboard (Enter and Space), focus and the expanded state to assistive tech with no ARIA. Do not put interactive elements inside `<summary>`. Checkboxes inside a closed `<details>` are still submitted with the form (they are not removed from the DOM), which is what we want.
  - If Dev needs controlled state in React, use `open={open}` plus `onToggle` and read `e.currentTarget.open`; do not swap to a `<button aria-expanded>` unless there is a real need.
- Headings: H1, then H2 for each section (Your carrier, Your contact details, You may also need, Order summary, Sign to confirm). Driver count is a `<fieldset>/<legend>`, not a heading.
- Live total: `aria-live="polite" aria-atomic="true"` on the total row only.
- Focus ring: 2px Steel, 2px offset everywhere (inset `-outline-offset-2` on full-width rows inside the card so the ring is not clipped by `overflow-hidden`).
- Hit targets: every row and radio option is at least 48px tall; checkboxes and radios 20px with the full row as the label.
- Reduced motion: chevron rotation and sticky-strip slide disabled with `motion-reduce:transition-none`; spinner uses `motion-safe:animate-spin`.
- Contrast: all pairings are existing verified tokens (Ink on Cloud/Paper, Slate on Cloud/Paper, Steel on Cloud, Ink on Signal for the button, Cloud on Ink for the selected driver option).

## 10. Things Dev must carry across (outside design, flagged so they are not lost)

- **Review route:** `/buy/order/[orderId]/review/` becomes a redirect: to `/pay/` if the order is signed, otherwise back to `/buy/{service}/{usdot}/` (keeps old emails, back-button history and bookmarks working).
- **Order creation timing:** today an order row (with contact details) exists after step one, before signing, and shows in the admin list. Merged, nothing is saved until the single submit. See open question 3.
- **Analytics:** three events collapse into one submit: `quick_buy_confirm_submit`, `quick_buy_details_submitted` (fired on arrival at review, carries Ads enhanced-conversion data) and `quick_buy_review_submit`. Dev and the owner must decide which event name the merged submit fires and where `quick_buy_details_submitted` moves (likely on arrival at `/pay/`), and update the GTM tags and Google Ads conversion actions to match. `quick_buy_confirm_view` and `quick_buy_lead` stay on this page unchanged.
- **Hidden inputs:** token, add, power_units, truck_tractors, address fields all carry over unchanged.

## 11. Acceptance criteria

1. One screen at `/buy/[service]/[usdot]/` with sections in this order: header, Your carrier, Your contact details, You may also need, Number of drivers (conditional), Order summary, Sign to confirm, Continue to payment.
2. Exactly one Signal-filled element on the page at any time (the submit button). The mobile strip has no button.
3. With a truck-tractor carrier and primary BOC-3: UCR row visible, a closed disclosure reading "3 more filings / None added", and the billing disclosure line visible above the list.
4. With primary UCR: DQ files is the featured row; UCR appears nowhere in the list.
5. With a no-tractor carrier: two visible rows, no disclosure.
6. With `?add=` containing a key that lives in the disclosure: the disclosure is open in the server-rendered HTML (view source shows `<details open>`), the row is ticked, and the summary lists it.
7. Ticking or unticking any add-on, or changing the driver count, updates the summary and "Total due now" with no reload; the total equals `computeQuickBuyPricing` for that selection, and the pay screen shows the same total.
8. DQ ticked shows the driver radios (default 1). "4 or more" shows "Quote" on the DQ line and the total excludes it.
9. Submitting with a server-rejected email keeps every typed value, tick and the signature; the error summary receives focus and links to the field; the field has `aria-invalid`.
10. Submitting disables the button and shows the spinner; a double click creates one order.
11. Keyboard only: every control reachable in visual order, disclosure opens with Enter and Space, visible focus ring on every control.
12. At 375px: no horizontal scroll, all fields 1-up, button full width, sticky strip appears only while add-ons are on screen and the summary is not, and it never covers the submit button.
13. No em dashes in any string. No new tokens.

## 12. Labels needing owner/SEO confirmation

New or changed UI strings. Short labels only; everything else reuses existing copy.

| Where | Proposed | Replaces |
| --- | --- | --- |
| H1 | Confirm your order | "Confirm your carrier record" / "Review your order" |
| Lede | Check your details, add anything else you need, and sign. You pay on the next screen. | "Check the details below, then continue to review your order." / "Confirm what you're buying, sign, and continue to payment." |
| Carrier card title | Your carrier | "Carrier identity" (owner-specified) |
| Contact H2 | Your contact details | (new; owner-specified) |
| Contact helper (one line) | Pulled from your FMCSA record. Edit anything that is out of date. | "Pulled from your FMCSA record, edit if needed." x4 |
| Required marker | (required) | (none) |
| Disclosure summary | {n} more filings | (new) |
| Disclosure status | None added / {k} added | (new) |
| Driver option | 4 or more | (free number input) |
| DQ add-on price label | from $200 | "$200 per driver" (misleading: 2 drivers are $350 total, not $400) |
| Summary H2 | Order summary | (card had no heading; owner-specified) |
| Error summary heading | Check the highlighted details. | (new) |
| Sticky strip | Total due now, {n} items | (new; reuses "Total due now") |

## 13. Open questions for the owner

1. **Featured add-on when the primary is UCR:** this spec features DQ files. Alternative: feature BOC-3 only when the FMCSA lookup shows no BOC-3 on file (the lookup already returns BOC-3 filings), otherwise DQ files. Worth it?
2. **No-tractor carriers:** the disclosure would hold one item, so this spec shows two visible rows and no toggle. Confirm, or keep strictly "UCR only visible" and accept a one-item disclosure.
3. **Abandoned checkouts:** today the order (with edited contact details) is saved when the visitor leaves step one, so you can follow up with people who stopped before signing. Merged, nothing is saved until they sign. Do you want a background save of the contact details (on blur or on first add-on tick) to keep that follow-up list?
4. **Ads conversions:** which merged event should count as the "details submitted" conversion in Google Ads (see section 10)?
5. **"4 or more" drivers:** today 4+ drivers produce a "Quote" DQ line and the visitor pays for everything else now. Keep that, or route 4+ driver orders to a call?
