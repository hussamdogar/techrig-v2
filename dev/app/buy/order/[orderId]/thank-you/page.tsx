import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container, Section } from "@/components/ui/container";
import { buttonVariants } from "@/components/ui/button";
import { service } from "@/lib/server/supabase";
import { stripe } from "@/lib/stripe";
import { GtmEvent } from "@/components/gtm-event";
import { SERVICES, remainingQuickBuyUpsells, QUICK_BUY_UPSELL_REASON } from "@/lib/services-registry";

// Noindex (checkout flow, matches /apply/[applicationId]/success).
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Thank you",
  robots: { index: false, follow: false },
};

type FilingRow = { service_key: string; service_name: string; price_amount: number | null; expected_timeline: string | null };

export default async function QuickBuyThankYouPage({
  params,
  searchParams,
}: {
  params: Promise<{ orderId: string }>;
  searchParams: Promise<{ payment_intent?: string; redirect_status?: string }>;
}) {
  const { orderId } = await params;
  const { payment_intent } = await searchParams;

  const db = service();
  const { data: order } = await db.from("quick_buy_orders").select("*").eq("id", orderId).maybeSingle();
  if (!order) notFound();

  // Verify-on-return: trust the Stripe intent status, not the client redirect
  // alone, and confirm it actually belongs to THIS order (the webhook is the DB
  // source of truth and may have already settled it).
  let paid = order.status === "paid" || order.status === "fulfilled";
  let pending = false;
  if (payment_intent) {
    try {
      const intent = await stripe().paymentIntents.retrieve(payment_intent);
      if (intent.metadata?.quick_buy_order_id === orderId) {
        if (intent.status === "succeeded") paid = true;
        else if (intent.status === "processing") pending = true;
      }
    } catch {
      /* fall back to the DB status */
    }
  }

  const { data: filingsData } = await db
    .from("filings")
    .select("service_key, service_name, price_amount, expected_timeline")
    .eq("quick_buy_order_id", orderId);
  const filings = (filingsData ?? []) as FilingRow[];

  // Post-purchase upsell (owner-directed, 2026-08): suggest the OTHER
  // quick-buy services this order didn't already buy, using the same
  // fleet-based eligibility as the review step's "You may also need"
  // checklist (eligibleQuickBuyUpsells, lib/services-registry.ts) so the two
  // never recommend different things for the same carrier. Each option is a
  // full new purchase (its own confirm -> review -> pay), not a one-click
  // add-on: this checkout has no saved account or card to charge again
  // off-session, so a second purchase is the only thing that doesn't require
  // new payment infrastructure. The USDOT is pre-filled via the URL so the
  // visitor never has to retype it.
  const purchasedKeys = new Set(filings.map((f) => f.service_key));
  const upsellKeys = remainingQuickBuyUpsells(order.truck_tractors, purchasedKeys);

  // The Google Ads / GA4 conversion event, fired only on a confirmed paid
  // order: transaction id + value + line items, the standard shape those
  // tools expect to attribute an ad click to actual revenue. "processing" and
  // "not completed" get their own distinct, non-conversion events instead, so
  // a pending or failed payment is never mistaken for a sale in GTM/Ads.
  const orderValue = filings.reduce((sum, f) => sum + (f.price_amount ?? 0), 0);

  return (
    <Section surface="paper" className="pt-10 md:pt-14">
      {paid ? (
        <GtmEvent
          event="purchase"
          data={{
            transaction_id: order.reference_id ?? orderId,
            value: orderValue,
            currency: "USD",
            items: filings.map((f) => ({ item_id: f.service_key, item_name: f.service_name, price: f.price_amount })),
          }}
        />
      ) : pending ? (
        <GtmEvent event="quick_buy_payment_pending" data={{ orderId, service: order.service_key }} />
      ) : (
        <GtmEvent event="quick_buy_payment_not_completed" data={{ orderId, service: order.service_key }} />
      )}
      <Container className="max-w-2xl">
        {paid ? (
          <>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-status-active">Paid</p>
            <h1 className="mt-2 font-display text-3xl font-extrabold tracking-[-0.02em] text-ink">Payment received</h1>
            <p className="mt-3 text-slate">
              Thanks. Your order <span className="font-mono text-ink">{order.reference_id ?? ""}</span> is paid and
              your filing is queued. We&apos;ll be in touch at the contact info you confirmed.
            </p>
          </>
        ) : pending ? (
          <>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-slate">Processing</p>
            <h1 className="mt-2 font-display text-3xl font-extrabold tracking-[-0.02em] text-ink">Payment processing</h1>
            <p className="mt-3 text-slate">Your payment is processing. We&apos;ll email you as soon as it confirms.</p>
          </>
        ) : (
          <>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-ink">Not completed</p>
            <h1 className="mt-2 font-display text-3xl font-extrabold tracking-[-0.02em] text-ink">Payment not completed</h1>
            <p className="mt-3 text-slate">Your payment didn&apos;t go through. You can try again.</p>
            <Link href={`/buy/order/${orderId}/pay/`} className={`${buttonVariants({ variant: "primary", size: "md" })} mt-5`}>
              Try again
            </Link>
          </>
        )}

        {paid || pending ? (
          <div className="mt-7 rounded-card border border-slate/15 bg-cloud p-5">
            <h2 className="font-display text-lg font-bold text-ink">What happens next</h2>
            <ul className="mt-3 divide-y divide-slate/10">
              {filings.map((f) => (
                <li key={f.service_name} className="flex items-center justify-between gap-4 py-2 text-sm">
                  <span className="text-ink">{f.service_name}</span>
                  <span className="text-right text-xs text-slate">{f.expected_timeline ?? "Timeline shared after review"}</span>
                </li>
              ))}
            </ul>
            <Link href="/" className={`${buttonVariants({ variant: "primary", size: "md" })} mt-5`}>
              Back home
            </Link>
          </div>
        ) : null}

        {paid && upsellKeys.length > 0 ? (
          <div className="mt-6 rounded-card border border-slate/15 bg-paper p-5">
            <h2 className="font-display text-lg font-bold text-ink">You may also need</h2>
            <p className="mt-1 text-sm text-slate">
              Add another compliance filing for USDOT {order.usdot_number}.
            </p>
            <ul className="mt-3 divide-y divide-slate/10">
              {upsellKeys.map((key) => (
                <li key={key} className="flex items-center justify-between gap-4 py-3">
                  <div>
                    <p className="text-sm text-ink">{SERVICES[key].name}</p>
                    <p className="mt-0.5 text-xs text-slate">{QUICK_BUY_UPSELL_REASON[key]}</p>
                  </div>
                  <Link
                    href={`/buy/${key}/${order.usdot_number}/`}
                    className={`${buttonVariants({ variant: "secondary", size: "sm" })} shrink-0`}
                  >
                    Start
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </Container>
    </Section>
  );
}
