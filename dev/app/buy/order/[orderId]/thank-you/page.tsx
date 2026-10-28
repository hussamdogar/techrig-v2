import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { service } from "@/lib/server/supabase";
import { stripe } from "@/lib/stripe";
import { GtmEvent } from "@/components/gtm-event";
import { TrackedAnchor } from "@/components/tracked-anchor";
import { AlertIcon, CheckIcon, ClockIcon, PhoneIcon } from "@/components/icons";
import {
  CHECKOUT_CARD,
  CHECKOUT_FOCUS,
  CHECKOUT_H2,
  CHECKOUT_PRIMARY_BUTTON,
  CHECKOUT_SECONDARY_BUTTON,
} from "@/components/checkout-ui";
import { quickBuyEnhancedConversionData } from "@/lib/server/quick-buy";
import { THANK_YOU_FILING_DESCRIPTION } from "@/lib/quick-buy-checkout";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";
import {
  SERVICES,
  computeQuickBuyPricing,
  netRevenue,
  remainingQuickBuyUpsells,
  type QuickBuyServiceKey,
} from "@/lib/services-registry";
import { CopyReference } from "./copy-reference";

// Noindex (checkout flow, matches /apply/[applicationId]/success).
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Thank you",
  robots: { index: false, follow: false },
};

type FilingRow = {
  service_key: string;
  service_name: string;
  price_amount: number | null;
  ucr_tier: string | null;
  expected_timeline: string | null;
};

export default async function QuickBuyThankYouPage({
  params,
  searchParams,
}: {
  params: Promise<{ orderId: string }>;
  searchParams: Promise<{ payment_intent?: string; payment_intent_client_secret?: string; redirect_status?: string }>;
}) {
  const { orderId } = await params;
  const { payment_intent, payment_intent_client_secret, redirect_status } = await searchParams;

  // Stripe's return URL carries the PaymentIntent's client secret. Every page
  // URL is reported to analytics (GA4, Ads, Clarity, Brevo), so drop it (and
  // the unused redirect_status) before this page ever renders in a browser.
  // The PaymentIntent id alone is not sensitive and is all the verification
  // below needs.
  if (payment_intent_client_secret || redirect_status) {
    redirect(
      payment_intent
        ? `/buy/order/${orderId}/thank-you/?payment_intent=${encodeURIComponent(payment_intent)}`
        : `/buy/order/${orderId}/thank-you/`,
    );
  }

  const db = service();
  const { data: order } = await db.from("quick_buy_orders").select("*").eq("id", orderId).maybeSingle();
  if (!order) notFound();

  // Verify-on-return: trust the Stripe intent status, not the client redirect
  // alone, and confirm it actually belongs to THIS order (the webhook is the DB
  // source of truth and may have already settled it).
  let paid = order.status === "paid" || order.status === "fulfilled";
  let pending = false;
  // True only when this visit is the Stripe return for a payment that
  // succeeded: the one moment a sale should be reported to Google. A later
  // revisit (e.g. a paid order's review link redirects here) shows "paid" from
  // the DB but must not report the sale again.
  let intentSucceeded = false;
  if (payment_intent) {
    try {
      const intent = await stripe().paymentIntents.retrieve(payment_intent);
      if (intent.metadata?.quick_buy_order_id === orderId) {
        if (intent.status === "succeeded") {
          paid = true;
          intentSucceeded = true;
        }
        else if (intent.status === "processing") pending = true;
      }
    } catch {
      /* fall back to the DB status */
    }
  }

  const { data: filingsData } = await db
    .from("filings")
    .select("service_key, service_name, price_amount, ucr_tier, expected_timeline")
    .eq("quick_buy_order_id", orderId);
  const filings = (filingsData ?? []) as FilingRow[];

  // The "Still pending" rows of the filings checklist (owner, 2026-10-22,
  // shared/design/quick-buy-payment-thanks-v2.md §4): the OTHER quick-buy
  // services this order didn't buy, with the same fleet-based eligibility as
  // checkout (remainingQuickBuyUpsells) so the two never disagree. Each is a
  // new purchase through checkout; ?from= carries this order there, so the
  // checkout fills in this customer's own contact details, leaves out what
  // they already bought, and keeps the same lead.
  const purchasedKeys = new Set(filings.map((f) => f.service_key));
  const upsellKeys = remainingQuickBuyUpsells(order.truck_tractors, purchasedKeys);

  // The Google Ads / GA4 conversion event, fired only on the Stripe return of
  // a succeeded payment, in GA4's standard `ecommerce` shape (transaction id +
  // net revenue + line items). GTM's Ads purchase tag reads
  // ecommerce.value / ecommerce.transaction_id; the transaction id also lets
  // Ads and GA4 discard a duplicate if this page is reloaded. "processing" and
  // "not completed" get their own distinct, non-conversion events instead, so
  // a pending or failed payment is never mistaken for a sale.
  const purchase = intentSucceeded
    ? {
        ecommerce: {
          transaction_id: order.reference_id ?? orderId,
          value: filings.reduce((sum, f) => sum + netRevenue(f), 0),
          currency: "USD",
          items: filings.map((f) => ({
            item_id: f.service_key,
            item_name: f.service_name,
            price: netRevenue(f),
            quantity: 1,
          })),
        },
        service: order.service_key,
        user_data: await quickBuyEnhancedConversionData(order),
      }
    : null;

  // Record that this sale was reported to Google online, so the offline
  // export (google_ads_followup_sales, migration 0019) never uploads it again.
  // Paid orders without this stamp (a payment that settled later, or a
  // customer who never came back to this page) are uploaded from there.
  if (purchase && !order.online_conversion_reported_at) {
    await db
      .from("quick_buy_orders")
      .update({ online_conversion_reported_at: new Date().toISOString() })
      .eq("id", orderId);
  }

  const money = (n: number) => `$${n.toLocaleString("en-US")}`;
  const reference = order.reference_id ?? null;
  const totalPaid = filings.reduce((sum, f) => sum + (f.price_amount ?? 0), 0);
  const priceOf = (key: QuickBuyServiceKey) =>
    computeQuickBuyPricing([key], { powerUnits: order.power_units, driverCount: 1 }).lines[0];
  const state: "paid" | "processing" | "failed" = paid ? "paid" : pending ? "processing" : "failed";

  const receipt = (
    <section aria-labelledby="h-receipt" className={CHECKOUT_CARD}>
      <h2 id="h-receipt" className={CHECKOUT_H2}>
        {state === "paid" ? "Receipt" : "Your order"}
      </h2>
      <ul className="mt-2 divide-y divide-line">
        {filings.map((f) => (
          <li key={f.service_key} className="flex items-start justify-between gap-4 py-3">
            <span>
              <span className="block font-medium text-ink">{f.service_name}</span>
              {f.service_key === "ucr" && f.ucr_tier ? (
                <span className="block text-[13px] text-slate">{f.ucr_tier} trucks, government fee included</span>
              ) : f.service_key === "dq-files" ? (
                <span className="block text-[13px] text-slate">1 driver</span>
              ) : null}
            </span>
            <span className="font-mono font-medium tabular-nums text-ink">
              {f.price_amount == null ? "Quote" : money(f.price_amount)}
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-1 flex items-baseline justify-between gap-4 border-t border-line pt-3">
        <span className="font-semibold text-ink">{state === "paid" ? "Total paid" : "Total due now"}</span>
        <span className="font-display text-[30px] font-extrabold leading-9 tabular-nums text-ink">{money(totalPaid)}</span>
      </div>
      <p className="mt-1 text-[13px] text-slate">One-time payment. Nothing renews automatically.</p>
      <p className="mt-3 text-sm text-ink">
        USDOT <span className="whitespace-nowrap font-mono">{order.usdot_number}</span>
        {reference ? (
          <span className="block text-slate">
            Order <span className="whitespace-nowrap font-mono">{reference}</span>
          </span>
        ) : null}
      </p>
    </section>
  );

  const help = (
    <section aria-labelledby="h-help" className={CHECKOUT_CARD}>
      <div className="flex items-start gap-3">
        <PhoneIcon size={20} className="mt-0.5 shrink-0 text-steel" />
        <div>
          <h2 id="h-help" className="font-display text-[17px] font-bold leading-6 text-ink">
            Questions about your order?
          </h2>
          <p className="text-sm text-slate">
            Call us{reference ? (
              <>
                {" "}
                and mention order <span className="whitespace-nowrap font-mono">{reference}</span>
              </>
            ) : null}
            .
          </p>
          <TrackedAnchor
            href={site.telHref}
            event="call_click"
            data={{ location: "thank_you" }}
            className={cn(CHECKOUT_SECONDARY_BUTTON, "mt-2")}
          >
            <PhoneIcon size={16} />
            Call {site.telephone}
          </TrackedAnchor>
        </div>
      </div>
    </section>
  );

  return (
    <>
      {purchase ? (
        <GtmEvent event="purchase" data={purchase} />
      ) : paid ? null : pending ? (
        <GtmEvent event="quick_buy_payment_pending" data={{ orderId, service: order.service_key }} />
      ) : (
        <GtmEvent event="quick_buy_payment_not_completed" data={{ orderId, service: order.service_key }} />
      )}

      <div className="mx-auto max-w-[1120px] px-4 pb-8 pt-6 lg:grid lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start lg:gap-x-12 lg:px-10 lg:pb-16 lg:pt-10">
        <div className="grid gap-5 lg:col-start-1">
          {/* Status */}
          <section aria-labelledby="h-status">
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className={cn(
                  "grid size-10 shrink-0 place-items-center rounded-full",
                  state === "paid" && "bg-status-active/10 text-status-active",
                  state === "processing" && "bg-steel-50 text-steel",
                  state === "failed" && "bg-error-50 text-error",
                )}
              >
                {state === "paid" ? <CheckIcon size={22} strokeWidth={2.5} /> : state === "processing" ? <ClockIcon size={22} /> : <AlertIcon size={22} />}
              </span>
              <h1 id="h-status" className="font-display text-[28px] font-extrabold leading-[34px] tracking-[-0.02em] text-ink lg:text-[34px] lg:leading-10">
                {state === "paid" ? "Payment received" : state === "processing" ? "Payment processing" : "Payment not completed"}
              </h1>
            </div>
            <p className="mt-1.5 text-ink">
              {state === "paid"
                ? "Your order is paid and in our queue. We take it from here."
                : state === "processing"
                  ? "Your bank is still confirming the payment. You do not need to stay on this page. We will email you as soon as it confirms."
                  : "The payment did not go through. Your order is saved, so you can try again without filling anything in."}
            </p>

            {state === "failed" ? (
              <>
                <Link href={`/buy/order/${orderId}/pay/`} className={cn(CHECKOUT_PRIMARY_BUTTON, "mt-5")}>
                  Try payment again
                </Link>
                <p className="mt-3 text-center text-sm text-slate">
                  Or call us at{" "}
                  <TrackedAnchor
                    href={site.telHref}
                    event="call_click"
                    data={{ location: "thank_you" }}
                    className={cn("font-semibold text-steel underline", CHECKOUT_FOCUS)}
                  >
                    {site.telephone}
                  </TrackedAnchor>{" "}
                  and we will help.
                </p>
              </>
            ) : (
              <>
                {reference ? (
                  <div className="mt-3.5">
                    <CopyReference reference={reference} />
                  </div>
                ) : null}
                {order.email ? (
                  <p className="mt-3 text-sm text-ink">
                    {state === "paid" ? "Your receipt is on its way to " : "We will send your receipt to "}
                    <strong className="font-semibold">{order.email}</strong>
                    {state === "paid" ? "." : " once the payment confirms."}
                  </p>
                ) : null}
              </>
            )}
          </section>

          {/* Filings checklist: what they ordered, then what's still open. */}
          {state === "paid" ? (
            <section aria-labelledby="h-filings" className={cn(CHECKOUT_CARD, "pb-1 lg:pb-2")}>
              <h2 id="h-filings" className={CHECKOUT_H2}>
                Your filings for USDOT {order.usdot_number}
              </h2>
              <h3 className="mt-3.5 text-[13px] font-semibold leading-[18px] text-status-active">Ordered today</h3>
              <ul className="mt-1.5 grid gap-1.5">
                {filings.map((f) => (
                  <li key={f.service_key} className="flex min-h-7 items-center gap-2.5 font-semibold text-ink">
                    <span aria-hidden="true" className="grid size-[22px] shrink-0 place-items-center rounded-full bg-status-active text-cloud">
                      <CheckIcon size={13} strokeWidth={3} />
                    </span>
                    {f.service_name}
                  </li>
                ))}
              </ul>
              {upsellKeys.length ? (
                <>
                  <h3 className="mt-3.5 text-[13px] font-semibold leading-[18px] text-[#9a5a0e]">Still pending</h3>
                  <ul className="mt-2">
                    {upsellKeys.map((key) => {
                      const line = priceOf(key);
                      const price = line?.amount == null ? "Quote" : money(line.amount);
                      const note = key === "ucr" ? `${line?.ucrTier ?? "0-2"} trucks` : key === "dq-files" ? "1 driver" : null;
                      return (
                        <li
                          key={key}
                          className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-3 gap-y-1 border-t border-line py-3 lg:grid-cols-[minmax(0,1fr)_auto_auto] lg:items-center lg:gap-x-5"
                        >
                          <span>
                            <span className="block text-[15px] font-semibold leading-5 text-ink">{SERVICES[key].name}</span>
                            <span className="mt-0.5 block text-[13px] leading-[18px] text-slate">
                              {THANK_YOU_FILING_DESCRIPTION[key]}
                            </span>
                          </span>
                          <span className="flex flex-col items-end gap-1 lg:contents">
                            <span className="text-right font-mono text-[15px] font-medium leading-5 tabular-nums text-ink">
                              {price}
                              {note ? <span className="block font-body text-xs font-normal text-slate">{note}</span> : null}
                            </span>
                            <Link
                              href={`/buy/${key}/${order.usdot_number}/?from=${orderId}`}
                              aria-label={`Order ${SERVICES[key].name}, ${price}`}
                              className={cn(CHECKOUT_SECONDARY_BUTTON, "min-h-10 min-w-[72px] px-3.5 text-sm lg:min-h-11")}
                            >
                              Order
                            </Link>
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                  <p className="border-t border-line py-3 text-xs italic leading-[17px] text-slate">
                    Skip any you already have. Each is a separate one-time order with your details filled in. Nothing renews
                    automatically.
                  </p>
                </>
              ) : (
                <p className="my-2.5 text-[13px] leading-[18px] text-slate">
                  That covers every filing we offer at checkout for this USDOT.
                </p>
              )}
            </section>
          ) : null}

          {/* What happens next: timings verbatim from the services registry. */}
          {state !== "failed" ? (
            <section aria-labelledby="h-next" className={CHECKOUT_CARD}>
              <h2 id="h-next" className={CHECKOUT_H2}>
                What happens next
              </h2>
              <ol className="mt-3">
                <TimelineStep
                  marker={state === "paid" ? "done" : "now"}
                  number={1}
                  title={state === "paid" ? "Payment received" : "Payment confirming"}
                >
                  {state === "paid" ? (
                    <>
                      Confirmed{reference ? (
                        <>
                          {" "}
                          under order <span className="whitespace-nowrap font-mono">{reference}</span>
                        </>
                      ) : null}
                      .
                    </>
                  ) : (
                    "Your bank is confirming it. We email you when it clears."
                  )}
                </TimelineStep>
                <TimelineStep marker={state === "paid" ? "now" : "todo"} number={2} title="We prepare and file">
                  Expected timing for each filing:
                  <ul className="mt-2 grid gap-2">
                    {filings.map((f) => (
                      <li key={f.service_key} className="rounded-[10px] bg-paper px-3 py-2.5">
                        <span className="block text-[15px] font-semibold leading-5 text-ink">{f.service_name}</span>
                        <span className="mt-0.5 block text-[13px] leading-[18px] text-slate">
                          {f.expected_timeline ?? "Timeline shared after review"}
                        </span>
                      </li>
                    ))}
                  </ul>
                </TimelineStep>
                <TimelineStep marker="todo" number={3} title="We email you at each step" last>
                  If we need anything from you, when your filing is submitted, and when it is complete.
                </TimelineStep>
              </ol>
            </section>
          ) : null}
        </div>

        {/* Receipt and help: a right column on laptop that stays in view. */}
        <div className="mt-5 grid gap-5 lg:sticky lg:top-24 lg:col-start-2 lg:row-start-1 lg:mt-0">
          {receipt}
          {help}
        </div>

        {state !== "failed" ? (
          <p className="mt-6 lg:col-start-1">
            <Link href="/" className={cn("inline-flex min-h-11 items-center font-semibold text-steel underline underline-offset-[3px]", CHECKOUT_FOCUS)}>
              Back to home
            </Link>
          </p>
        ) : null}
      </div>
    </>
  );
}

function TimelineStep({
  marker,
  number,
  title,
  last,
  children,
}: {
  marker: "done" | "now" | "todo";
  number: number;
  title: string;
  last?: boolean;
  children: React.ReactNode;
}) {
  return (
    <li className={cn("relative pl-9", !last && "pb-[18px]")}>
      {last ? null : <span aria-hidden="true" className="absolute bottom-0.5 left-[11px] top-[26px] w-0.5 bg-line" />}
      <span
        aria-hidden="true"
        className={cn(
          "absolute left-0 top-0 grid size-6 place-items-center rounded-full border-2 text-xs font-semibold",
          marker === "done" && "border-status-active bg-status-active text-cloud",
          marker === "now" && "border-steel bg-steel text-cloud",
          marker === "todo" && "border-field bg-cloud text-slate",
        )}
      >
        {marker === "done" ? <CheckIcon size={13} strokeWidth={3} /> : number}
      </span>
      <p className="font-semibold leading-6 text-ink">{title}</p>
      <div className="mt-0.5 text-sm leading-5 text-slate">{children}</div>
    </li>
  );
}
