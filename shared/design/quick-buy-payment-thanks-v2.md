# Quick-buy payment and thank-you v2 (steps 3 and 4)

Status: proposal for owner review. Same design language as the built checkout v2 (`dev/app/buy/[service]/[usdot]/checkout-form.tsx`); tokens from `dev/app/globals.css`. Designed inside the existing slim chrome (`dev/components/checkout-chrome.tsx`), which is not changed.
Mockup: `shared/design/mockups/quick-buy-payment-thanks-v2.html` (phone 375 and laptop 1280, eleven scenarios, interactive fake card form).
Pages: `dev/app/buy/order/[orderId]/pay/page.tsx` + `dev/components/payment-form.tsx`, and `dev/app/buy/order/[orderId]/thank-you/page.tsx`.

Every existing function and tracking event stays: the `?placed=1` `quick_buy_details_submitted` event and admin alert on the pay page, the unsigned-order redirect, `quick_buy_payment_submit` (`submitted` / `failed`) in the form, the client-secret URL scrub, the verify-on-return logic, `purchase` / `quick_buy_payment_pending` / `quick_buy_payment_not_completed`, the `online_conversion_reported_at` stamp, and `remainingQuickBuyUpsells`. This spec changes layout, hierarchy, copy and a few props only.

---

## 1. Reasoning

**Payment.** The visitor has already confirmed the order and signed for it. This page has one job: get the card entered with no doubt left. So:
- The amount appears twice, in the order card total and in the button ("Pay $145"). A button with the amount in it removes the last "how much exactly?" moment.
- On phone the order card collapses to one line ("2 items: BOC-3 filing, UCR registration", plus the total), with "Show details". They reviewed every line one screen ago, so the card number field starts about 420px from the top of the screen instead of about 690px (measured in the mockup at 375px). On laptop the full order sits in the right column, in the same position as on the review screen.
- Stripe's card form is styled to match v2 exactly (inputs, labels, radius, focus ring, error colour) through the Appearance API, so it reads as one form, not an embedded widget.
- There are three trust lines and no more: Stripe security, the refund policy link, and the private-service disclaimer. The phone number is already in the header.
- "Edit order" is the way back. Card errors keep the card form on screen, with a plain message that says the card was not charged.
- No sticky bar on phone. The form is short, the Pay button sits right under the fields, and a sticky bar would fight the keyboard.

**Thank you.** This page has to make the visitor feel finished. Lead with a clear status and the order number they would quote on the phone (with Copy). Then say where the receipt went, what happens next with real timelines from the services registry (never new promises), and how to get help. A checklist for their USDOT sits right under the confirmation (see 4.2): what they ordered today, then other filings they may need. It reads as a status of their filings, not a sales block. It uses neutral secondary buttons with no amber and shows only after a confirmed payment.

---

## 2. Shared tokens and classes (match checkout-form.tsx)

Colours: `ink`, `steel`, `signal`, `signal-hover`, `paper`, `cloud`, `slate`, `status-active` (#2E7D5B success), `error`, `error-50`, `steel-50`, `line`, `field`. One new use: success tint `bg-status-active/10` for the paid badge, so no new token is needed.

| Element | Classes |
| --- | --- |
| Page wrapper | `mx-auto max-w-[1120px] px-4 pb-8 pt-4 lg:px-10 lg:pb-16 lg:pt-9` on `bg-paper` |
| Card | `rounded-[14px] border border-line bg-cloud p-4 shadow-[0_1px_2px_rgba(14,34,51,.05)] lg:p-6` |
| H2 | `font-display text-[19px] font-bold leading-6 text-ink` |
| Caption | `text-sm text-slate` / `text-[13px] text-slate` |
| Line item row | `flex items-start justify-between gap-4 py-3` inside `ul.divide-y.divide-line` |
| Line price | `font-mono font-medium tabular-nums text-ink` |
| Total | `font-display text-[30px] font-extrabold leading-9 tabular-nums text-ink` |
| Primary button | same as checkout: `flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-signal text-[17px] font-semibold text-ink shadow-[inset_0_-2px_0_rgba(14,34,51,.14),0_1px_2px_rgba(14,34,51,.12)] hover:bg-signal-hover active:translate-y-px focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-steel` |
| Secondary button (new) | `inline-flex min-h-11 items-center justify-center gap-1.5 rounded-[10px] border border-steel bg-cloud px-4 text-[15px] font-semibold text-steel hover:bg-steel-50` + FOCUS |
| Text link | `font-semibold text-steel underline underline-offset-[3px]` + FOCUS, `min-h-11 inline-flex items-center` when standalone |
| Alert (error) | `rounded-[10px] border border-error bg-error-50 px-3.5 py-3 text-sm font-medium text-error`, body line `font-normal text-ink` |
| Trust list | as checkout: `grid gap-2.5 text-[13px] leading-[18px] text-slate`, icon `size-[18px] shrink-0 text-steel`, lead `font-semibold text-ink` |
| Progress steps | the checkout `<ol>` markup, with Service and Review both done (green check) and Payment current (`aria-current="step"`) |

FOCUS = `outline-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-steel` (constant in checkout-form.tsx; move it to a shared file).

Layout breakpoint: `lg` (1024px), as on checkout.

---

## 3. Payment page

### Anatomy: phone

```
CheckoutHeader (Ink, wordmark, phone)            existing
progress     Service (done) - Review (done) - Payment (current)
h1 sr-only   "Pay $145 for your order"
card         Your order                              Edit order
             2 items: BOC-3 filing, UCR registration   $145
             Show details v
             (expanded: lines, Total due now, "One-time payment. Nothing renews
              automatically.", "For LEGAL NAME, USDOT n", "Order DGR-...")
card         Payment details
             [Stripe Payment Element]
             (card error alert)
             [ lock  Pay $145 ]
             (test-mode hint, test keys only)
             trust: Secure payment by Stripe... / Read our refund policy. / private service, not a government agency
CheckoutFooter                                     existing
```

- Order card above payment (DOM order). Collapsed summary: `flex items-end justify-between`; item text `text-sm text-slate` (all service names, comma separated); total at the 30px total style.
- "Show details" is a button (`aria-expanded`, `aria-controls`), `min-h-11 text-sm font-semibold text-steel`, chevron rotates. Collapsed by default on phone.
- "Edit order" (`text-sm`) links to `/buy/{service_key}/{usdot}/{preselectQuery(additional)}`. It is hidden while a payment is processing.

### Anatomy: laptop

- `lg:grid lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-12 lg:items-start lg:mt-5`.
- Left column: the Payment details card (`lg:col-start-1 lg:row-start-1`).
- Right column: the Your order card, always expanded, with the toggle and the collapsed summary hidden (`lg:hidden` on both, `lg:block` on details). It stays in view while scrolling: `lg:col-start-2 lg:row-start-1 lg:sticky lg:top-24`.

### Stripe integration (payment-form.tsx changes)

New props: `amountLabel: string` (for example "$145", for the button and the sr-only H1) and `appearance` (or hard-code the object below in the component, since `/apply` can use it too).

```ts
const appearance: Appearance = {
  theme: "stripe",
  labels: "above",
  variables: {
    colorPrimary: "#225E8A",
    colorBackground: "#FFFFFF",
    colorText: "#0E2233",
    colorTextSecondary: "#4F5E6B",
    colorTextPlaceholder: "#76838F",
    colorDanger: "#B42318",
    colorSuccess: "#2E7D5B",
    iconColor: "#4F5E6B",
    fontFamily: '"IBM Plex Sans", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    fontSizeBase: "16px",
    fontWeightNormal: "400",
    fontWeightMedium: "600",
    borderRadius: "10px",
    spacingUnit: "4px",
    gridRowSpacing: "14px",
    gridColumnSpacing: "12px",
    focusBoxShadow: "0 0 0 3px rgba(34, 94, 138, 0.28)",
    focusOutline: "none",
  },
  rules: {
    ".Label": { fontSize: "14px", fontWeight: "600", color: "#0E2233", marginBottom: "6px" },
    ".Input": { border: "1px solid #7E8D9B", boxShadow: "none", padding: "14px", fontSize: "16px", lineHeight: "22px" },
    ".Input:focus": { borderColor: "#225E8A", boxShadow: "0 0 0 3px rgba(34, 94, 138, 0.28)" },
    ".Input--invalid": { border: "2px solid #B42318", boxShadow: "none", color: "#0E2233" },
    ".Error": { fontSize: "14px", fontWeight: "500", color: "#B42318", marginTop: "6px" },
    ".Tab": { border: "1px solid #E3DFD7", boxShadow: "none" },
    ".Tab--selected": { borderColor: "#225E8A", backgroundColor: "#EDF3F8", boxShadow: "inset 0 0 0 1px #225E8A" },
    ".Tab:focus": { boxShadow: "0 0 0 3px rgba(34, 94, 138, 0.28)" },
  },
};
// Elements options
{ clientSecret, appearance, fonts: [{ cssSrc: "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&display=swap" }] }
// PaymentElement options
{ layout: { type: "tabs" }, wallets: { applePay: "auto", googlePay: "auto" }, fields: { billingDetails: { address: { country: "auto", postalCode: "auto" } } } }
```

Input height lands at 52px (14 + 22 + 14 + borders, about 52), matching v2 inputs. Wallet tabs only show if Apple Pay and Google Pay are enabled in the Stripe dashboard and the domain is registered (see Open questions).

Behaviour:
- Until `clientSecret` arrives and until PaymentElement fires `onReady`: show the skeleton (below), not plain text.
- On submit: `elements.submit()` first. On a `validation_error`, Stripe shows the message inline in the field. Show no alert; call `paymentElement.focus()`.
- Then `stripe.confirmPayment(...)`, unchanged. While it runs: `paymentElement.update({ readOnly: true })`, the button goes busy, and "Edit order" is hidden.
- On `card_error`: show the alert with `error.message` (Stripe's text, already plain language) plus the line "Your card was not charged. Try another card, or call your bank and then try again." Restore `readOnly: false`. Move focus to the alert (`tabIndex={-1}`).
- Any other error: show the alert "We could not complete the payment. Your card was not charged. Please try again, or call us at {phone}."
- The tracking pushes stay as they are.

### States

| State | What the visitor sees |
| --- | --- |
| Loading | Card fields as 52px skeleton blocks (`animate-pulse bg-line/60 rounded-[10px]`, static under reduced motion), and the button disabled with spinner and "Preparing secure payment...". sr-only `role="status"` reads "Preparing secure payment". |
| Ready | Payment Element and "Pay $145" with a lock icon. |
| Field errors | Stripe inline errors under each field (styled by `.Error`); focus on the first. No page alert. |
| Card declined | Error alert under the element (copy above). Fields keep their values. Button back to "Pay $145". |
| Processing | Element read-only, button spinner and "Processing payment...", `aria-busy`. Under the button: "Please keep this page open. This takes a few seconds." `role="status"`. |
| 3-D Secure | Stripe opens its own bank-verification modal over the page. The page stays in the processing state behind it. If the bank rejects, the declined state shows. Redirect-based methods leave the site and return to the thank-you page (verify-on-return handles it). |
| Could not start payment | Shown when the client-secret request fails. Error alert "We could not load the payment form." plus "Nothing was charged. Check your connection and try again, or call us at {phone}." A primary "Try again" button re-runs the fetch with no page reload. This replaces today's dead-end amber note. |
| Nothing to pay (total is $0) | The payment card is replaced by a card with a success badge, H2 "Nothing to pay online", "Your order {ref} is saved. There is no online charge for it.", "Questions? Call us at {phone}.", and a secondary "Back to home" button. The order card stays. |
| Missing publishable key (configuration error) | Not a customer state, but if it happens show "Online payment is not available right now. Call us at {phone} to complete your order." with no button. Log it. |

### Test mode
Keep the existing `pk_test_` hint, centred under the button, `text-xs text-slate`.

---

## 4. Thank-you page

Status: payment page approved as designed (section 3, unchanged). Thank-you page: owner chose variant A (filing checklist) on 2026-10-22. It was refined the same day to be shorter on phone and calmer in tone. This section specs the refined A.

### 4.1 Alternatives considered (not built)

- **B. Step 4 of "What happens next":** reads as advice, but mixes our promises with offers and still sits about 2 screens down on phone.
- **C. One suggestion:** the calmest option, but it is a judgement call on "most relevant" and hides the other filings behind a tap.
- **Previous:** the list at the bottom of the page. Mostly unseen.

A won because it puts the offer where people look, frames it as the state of their own filings, and still confirms the order when there is nothing else to offer.

### 4.2 Refinements to A, and why

- **Shorter, always-visible reasons instead of a "Why?" disclosure.**
  - The registry reasons (`QUICK_BUY_UPSELL_REASON`) run 3 to 4 lines on phone and include fear language ("risk roadside fines", "Required ...").
  - A "Why?" toggle would cut height, but it would hide the one line that tells a trucker what the thing is, and it adds a tap per row.
  - Truncating to one line with "more" looks broken on long service names.
  - So each open row gets a new one-sentence description (new map, see Copy), 1 to 2 lines at 375px. These are plain descriptions of what the service is, not consequences. `QUICK_BUY_UPSELL_REASON` stays for any other use.
- **Grouped hierarchy.** A green "Ordered today" label over the ticked rows (confirmation), then a dark-amber "Still pending" label over the open rows (owner, 2026-10-22). The "Skip any you already have..." note sits at the bottom of the card as a small italic footnote under a hairline.
- **Calmer open rows.** There is no empty "to-do" ring: an unticked circle implies something is missing. Price and an outlined "Order" button sit on the right; no amber, badges or urgency.
- **Tighter ticked rows.** One 28px line each (check, name). No per-row "Ordered today" text, because the group label says it once. Prices for ordered items stay in the Receipt card, so nothing charged is hidden.
- **Compact hero.** The 40px badge sits inline with the H1 instead of above it (saves about 60px on phone).
- **The card always shows when paid.** With nothing else to offer, it confirms what was ordered and says "That covers every filing we offer at checkout for this USDOT."

Measured in the mockup at 375 x 812, scroller height, including the 56px header:

| Case | Checklist top | Last ticked row ends | First open row ends | "What happens next" starts | Card height |
| --- | --- | --- | --- | --- | --- |
| 2 ordered + 3 other (CDL) | 305 | 446 | 631 | 871 (1.07 screens) | 525 |
| 3 ordered + 2 other | 305 | 480 | 665 | 816 (1.00) | 470 |
| Non-CDL, 4 trucks, 1 ordered + 2 other | 305 | 412 | 613 | 764 (0.94) | 418 |
| 1 ordered + 1 other | 305 | 412 | 613 | 659 | 313 |
| 1 ordered + 0 other | 305 | 412 | n/a | 516 | 170 |

All cases meet the targets. On the first screen you see the confirmation, the checklist heading, every ticked row and at least the first open row, and "What happens next" starts by 1.07 screens. Before the refinement: card 711px, timeline at 1096px (1.35 screens).

At 1280 x 800, the 2 + 3 case: checklist top 303, first open row ends 599, card ends about 762, so the whole checklist is above the fold. The timeline starts at 811.

### Anatomy: phone (DOM order)

```
CheckoutHeader
hero        [badge 40] H1 "Payment received"           (badge inline with H1)
            lead "Your order is paid and in our queue. We take it from here."
            [Order DGR-20261013-901 | Copy]
            mail icon  Your receipt is on its way to {email}.
card        H2  Your filings for USDOT {n}                (paid only; always shown when paid)
            H3  Ordered today                              (green label)
                (check) BOC-3 filing
                (check) UCR registration
            H3  Still pending                              (only if remainingQuickBuyUpsells is not empty)
                Clearinghouse registration                         $100
                Skipping driver queries is an ...                  [Order]
                Drug & alcohol consortium                          $120
                CDL drivers can't legally drive ...               [Order]
                Driver qualification files                         $200
                A missing file is one of the first ...          1 driver
                                                                 [Order]
                ----------------------------------------------------------
                footnote (small italic): Skip any you already have. Each is a separate
                one-time order with your details filled in. Nothing renews automatically.
            (no open rows: "That covers every filing we offer at checkout for this USDOT.")
card        What happens next  (3-step timeline, timings verbatim from expected_timeline)
aside       Receipt card, Help card (unchanged)
link        Back to home
CheckoutFooter
```

### Anatomy: laptop

- Grid unchanged: `lg:grid lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-x-12 lg:items-start`.
- Column 1, in order: hero, filings checklist, What happens next (`lg:col-start-1`).
- Column 2: Receipt + Help, unchanged (`lg:col-start-2 lg:row-start-1 lg:row-span-3 lg:sticky lg:top-24`).
- Open rows become one line each: name and description on the left, price, then the Order button (`lg:grid-cols-[minmax(0,1fr)_auto_auto] lg:items-center lg:gap-x-5`). The button is `lg:min-h-11`.
- H1 34/40 on laptop, 28/34 on phone.

### Components

- **Hero row**: `flex items-center gap-3`. Badge `grid size-10 shrink-0 place-items-center rounded-full` (paid `bg-status-active/10 text-status-active`; processing `bg-steel-50 text-steel`; failed `bg-error-50 text-error`), `aria-hidden`. H1 `font-display text-[28px] leading-[34px] font-extrabold tracking-[-0.02em] lg:text-[34px] lg:leading-10`, `tabIndex={-1}`, focused on load. Lead `mt-1.5 text-base text-ink`.
- **Order reference**: unchanged (chip with mono reference and Copy). The Copy button has `aria-label="Copy order number"`, and an sr-only `role="status"` announces "Order number copied".
- **Filings checklist card**:
  - Card classes, with `pb-1`, because the last row's padding closes the card.
  - H2 "Your filings for USDOT {n}" (`font-display text-[19px] font-bold leading-6`).
  - Group labels are real `<h3>`: `mt-3.5 text-[13px] leading-[18px] font-semibold`. "Ordered today" is `text-status-active` (5.0:1 on Cloud); "Still pending" is dark amber `text-[#9A5A0E]` (5.5:1 on Cloud; the Signal family used for in-progress states, darkened for AA text; owner 2026-10-22). Add it as a token if it is reused.
  - Ticked list: `mt-1.5 grid gap-1.5`. Each `li` is `flex min-h-7 items-center gap-2.5 font-semibold`, with a check badge `grid size-[22px] place-items-center rounded-full bg-status-active text-cloud` (`aria-hidden`). One row per `filings` entry.
  - Footnote (after the open rows, last thing in the card): `border-t border-line pt-3 text-xs leading-[17px] italic text-slate`.
  - Open list `mt-2`. Each `li` is `grid grid-cols-[minmax(0,1fr)_auto] gap-x-3 gap-y-1 items-start border-t border-line py-3`:
    - Left: name `text-[15px] leading-5 font-semibold`, description `mt-0.5 text-[13px] leading-[18px] text-slate`.
    - Right: `flex flex-col items-end gap-1` (on `lg`, `contents`) holding the price `font-mono font-medium text-[15px] leading-5 tabular-nums`, with a note under it `block text-xs text-slate` ("{tier} trucks" for UCR, "1 driver" for DQ).
    - The Order button: secondary style, `min-h-10 min-w-[72px] px-3.5 text-sm` (`lg:min-h-11`), visible text "Order", `aria-label="Order {name}, {price}"`, href `/buy/{key}/{usdot}/` (unchanged).
  - Row order follows `QUICK_BUY_SERVICE_KEYS` (BOC-3, UCR, Clearinghouse, Consortium, DQ files), as returned by `remainingQuickBuyUpsells`.
  - Prices: `computeQuickBuyPricing([key], { powerUnits: order.power_units, driverCount: 1 }).total`. That gives BOC-3 $45, Clearinghouse $100, Consortium $120, DQ files $200 (1 driver), and UCR by bracket: $100 for 0-2 trucks ($54 + $46), $218 for 3-5 ($80 + $138), $356 for 6-20, $1,043 for 21-100, and so on. Prices are shown plainly.
  - Empty case: no H3 "Other filings", just the note "That covers every filing we offer at checkout for this USDOT." (`my-2.5`).
- **Timeline, Receipt, Help**: unchanged from the previous version of this spec. The timeline title `<p>` has `m-0`. The reference inside it is `whitespace-nowrap`.

### Data

- Ticked rows: `filings` for this order (service_name), already loaded.
- Open rows: `remainingQuickBuyUpsells(order.truck_tractors, purchasedKeys)`, unchanged.
- Descriptions: new `THANK_YOU_FILING_DESCRIPTION: Record<QuickBuyServiceKey, string>` in `lib/quick-buy-checkout.ts` (see Copy).

### States

| State | Badge / H1 | Lead | Below |
| --- | --- | --- | --- |
| Paid, other filings available | check / "Payment received" | "Your order is paid and in our queue. We take it from here." | ref + Copy, receipt line, filings checklist (ticked + open), timeline, Receipt ("Total paid"), Help |
| Paid, nothing else to offer | same | same | same, with the checklist showing ticked rows and the "That covers every filing..." note |
| Processing | clock / "Payment processing" | as before | ref + Copy, receipt-pending line, timeline (step 1 current), "Your order" card, Help. No checklist. |
| Not completed | alert / "Payment not completed" | as before | "Try payment again", call line, order card, Help. No checklist, no timeline, no reference chip. |

Tracking is unchanged for every state.

## 5. Accessibility

- One H1 per page. Payment: sr-only "Pay {amount} for your order". Thank you: visible status H1. Heading order on the paid thank-you page: H1, H2 (Your filings), H3 (Ordered today), H3 (Other filings), H2 (What happens next), H2 (Receipt), H2 (Questions). No levels are skipped.
- Every thank-you Order button has a unique accessible name that starts with its visible text: "Order {service name}, {price}". The only disclosure on these pages is the payment page's order summary (`aria-expanded` / `aria-controls`); the thank-you page has none.
- The Stripe element handles its own labels and errors. Our alerts use `role="alert"`; processing and copy feedback use `role="status"`.
- Collapsible order summary: a real button with `aria-expanded` / `aria-controls`. The details stay in the DOM (just hidden) on phone, and are always shown at `lg`.
- Contrast: all pairs as in checkout v2 (Ink on Signal 7.0:1, Slate on Cloud 6.4:1, Error on Error-50 above 6:1, Steel on Steel-50 6.2:1).
- Targets of at least 44px on all links and buttons (Copy is 36px inside a 44px chip, above the 24px minimum).
- Reduced motion: no skeleton shimmer, no chevron animation.
- Decorative icons are `aria-hidden`.

---

## 6. Acceptance criteria

1. The payment button reads "Pay {total}" and the amount matches `pricing.total` and the PaymentIntent amount.
2. On a 375px phone the first card input sits within the first screen (no more than 450px from the top of the page, header included) with the order collapsed.
3. On laptop the order card is fully expanded in the right column and stays in view while scrolling.
4. The Payment Element matches v2 inputs: 52px tall, 10px radius, #7E8D9B border, steel focus ring, error border #B42318, IBM Plex Sans 16px.
5. While loading, a skeleton shows, never plain text, and the button cannot submit.
6. A declined card shows the alert including "Your card was not charged", keeps the entered details, and re-enables the button. Stripe validation errors show inline only.
7. While processing, the button is busy, the element is read-only, double submits are impossible, and "Edit order" is hidden.
8. A failed client-secret request shows a "Try again" button that retries without a page reload.
9. A $0 total shows the "Nothing to pay online" card, not the Stripe form.
10. The thank-you page shows the order reference with a working Copy, the receipt email address, and every filing's `expected_timeline` text verbatim.
11. When paid, the filings checklist sits directly under the confirmation. Ticked rows match `filings`. Open rows come from `remainingQuickBuyUpsells` and show the computed price (UCR by bracket, DQ for 1 driver), the one-line description and an outlined "Order" button with the existing link. With no open rows, the card shows the ticked rows and the "That covers..." note. No amber, strikethrough or badges. Descriptions lead with the consequence then a short definition (owner, 2026-10-22, see Copy); the card never tells this carrier that they personally are missing a filing.
12. Every existing tracking event fires under exactly the same conditions as today. A Help call button fires `call_click` with `location: "thank_you"`.
13. No em dashes in copy. No new timing promises beyond the registry text.
14. On a 375 x 812 phone with 2 ordered + 3 other filings: the confirmation, the checklist heading, all ticked rows and the first open row are on the first screen, and "What happens next" starts within 1.1 screens. There is no horizontal scroll at 375 or 1280.

---

## 7. Copy to confirm

Payment:
- sr-only H1: "Pay {amount} for your order"
- "Your order", "Edit order", "{n} items: {names}", "Show details" / "Hide details", "Total due now", "One-time payment. Nothing renews automatically.", "For {LEGAL NAME}, USDOT {n}", "Order {ref}"
- "Payment details", button "Pay {amount}", busy "Processing payment...", "Please keep this page open. This takes a few seconds."
- Loading: "Preparing secure payment..."
- Trust: "Secure payment by Stripe. Your card details go straight to Stripe. We never see or store your card number." / "Read our refund policy." / "DGR Tech Rig is a private filing service, not a government agency."
- Declined: "{Stripe message}" + "Your card was not charged. Try another card, or call your bank and then try again."
- Generic failure: "We could not complete the payment. Your card was not charged. Please try again, or call us at {phone}."
- Start failure: "We could not load the payment form." + "Nothing was charged. Check your connection and try again, or call us at {phone}." / "Try again"
- Nothing to pay: "Nothing to pay online" / "Your order {ref} is saved. There is no online charge for it." / "Questions? Call us at {phone}." / "Back to home"

Thank you:
- Paid: "Payment received" / "Your order is paid and in our queue. We take it from here." / "Your receipt is on its way to {email}."
- Processing: "Payment processing" / "Your bank is still confirming the payment. You do not need to stay on this page. We will email you as soon as it confirms." / "We will send your receipt to {email} once the payment confirms."
- Failed: "Payment not completed" / "The payment did not go through, so nothing was charged. Your order is saved, so you can try again without filling anything in." / "Try payment again" / "Or call us at {phone} and we will help."
- "Order", "Copy", "Copied"
- Timeline: "What happens next"; "Payment received" / "Confirmed under order {ref}."; "Payment confirming" / "Your bank is confirming it. We email you when it clears."; "We prepare and file" / "Expected timing for each filing:"; "We email you at each step" / "If we need anything from you, when your filing is submitted, and when it is complete."
- "Receipt", "Total paid"
- "Questions about your order?" / "Call us and mention order {ref}." / "Call {phone}"
- Filings checklist: "Your filings for USDOT {n}" / "Ordered today" / "Still pending" / footnote "Skip any you already have. Each is a separate one-time order with your details filled in. Nothing renews automatically." / "Order" (accessible name "Order {name}, {price}") / "{tier} trucks" / "1 driver" / "That covers every filing we offer at checkout for this USDOT."
- New one-line descriptions (thank-you only; owner 2026-10-22: lead with the consequence, then a short definition, so this card is the one place open rows may name a penalty):
  - BOC-3: "No BOC-3, no active authority. It names your process agent in every state."
  - UCR: "Running without UCR can mean fines at roadside inspections. The yearly registration for crossing state lines."
  - Clearinghouse: "Skipping driver queries is an audit violation. Your employer account in FMCSA's drug and alcohol database."
  - Consortium: "CDL drivers can't legally drive without a testing program. Your random drug and alcohol testing pool."
  - DQ files: "A missing file is one of the first things auditors flag. Your driver's required qualification record, owner-operators included."
- Copy button accessible name: "Copy order number"
- "Back to home"

---

## 8. Open questions for the owner

1. **Apple Pay and Google Pay.** Turning these on in the Stripe dashboard and registering techrig.org (and the staging domain) would put a one-tap wallet button above the card fields for most phone visitors. This is probably the biggest single conversion gain on this page. Enable?
2. **"Nothing was charged" on the not-completed page.** This is accurate for declined, abandoned and failed intents. Confirm you are comfortable stating it. The alternative is "The payment did not go through."
3. **Card statement name.** Do you know what the Stripe statement descriptor shows (for example DGR TECH RIG)? If so, a line like "Shows on your statement as {descriptor}" cuts "unknown charge" disputes.
4. **Thank-you descriptions.** Approve the five new one-line descriptions (Copy to confirm). They are derived from existing site copy, but shorter and without the fine and penalty language.
5. **Edit order creates a new order.** Going back and resubmitting makes a new order with a "-2" reference, and the first stays unpaid. Fine as is, or should the review screen reuse the unpaid order?
6. **Nothing-to-pay wording.** When can a quick-buy total actually be $0 now that DQ is a fixed 1-driver price? If never, this state is a safeguard and the copy can stay generic.
7. **"Ordered today" rows.** These list only what was bought in this order. If the same carrier bought other filings from us earlier (a separate order), should those also show as ticked? That needs a lookup by USDOT across orders.
