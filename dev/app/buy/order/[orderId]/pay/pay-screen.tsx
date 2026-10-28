"use client";

import { useState } from "react";
import Link from "next/link";
import { BuildingIcon, CheckSealIcon, ChevronDownIcon, ShieldIcon } from "@/components/icons";
import { PaymentForm } from "@/components/payment-form";
import {
  CHECKOUT_CARD,
  CHECKOUT_FOCUS,
  CHECKOUT_H2,
  CHECKOUT_SECONDARY_BUTTON,
  CheckoutSteps,
} from "@/components/checkout-ui";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * The quick-buy payment screen (shared/design/quick-buy-payment-thanks-v2.md
 * §3). Phones get the order as one line ("2 items: ...", total, "Show
 * details") above the card form, since they reviewed every line a screen ago;
 * from `lg` the full order sits in a right column that stays in view. "Edit
 * order" goes back to checkout, and hides while a payment is being confirmed.
 */

export type PayLine = { key: string; name: string; sub: string | null; amount: number | null };

const money = (n: number) => `$${n.toLocaleString("en-US")}`;

export function PayScreen({
  orderId,
  reference,
  usdot,
  legalName,
  lines,
  total,
  editHref,
  publishableKey,
}: {
  orderId: string;
  reference: string | null;
  usdot: string;
  legalName: string | null;
  lines: PayLine[];
  total: number;
  editHref: string;
  publishableKey: string;
}) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const nothingToPay = total <= 0;

  const orderCard = (
    <section aria-labelledby="h-order" className={cn(CHECKOUT_CARD, "lg:sticky lg:top-24 lg:col-start-2 lg:row-start-1")}>
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="h-order" className={CHECKOUT_H2}>
          Your order
        </h2>
        {processing || nothingToPay ? null : (
          <Link href={editHref} className={cn("text-sm font-semibold text-steel underline underline-offset-[3px]", CHECKOUT_FOCUS)}>
            Edit order
          </Link>
        )}
      </div>

      {/* Phone: the order in one line. */}
      <div className="lg:hidden">
        <div className="mt-2 flex items-end justify-between gap-4">
          <p className="text-sm text-slate">
            {lines.length} {lines.length === 1 ? "item" : "items"}: {lines.map((l) => l.name).join(", ")}
          </p>
          <span className="font-display text-[30px] font-extrabold leading-9 tabular-nums text-ink">{money(total)}</span>
        </div>
        <button
          type="button"
          aria-expanded={detailsOpen}
          aria-controls="order-details"
          onClick={() => setDetailsOpen((o) => !o)}
          className={cn("mt-1 inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-steel", CHECKOUT_FOCUS)}
        >
          {detailsOpen ? "Hide details" : "Show details"}
          <ChevronDownIcon size={16} className={cn("motion-safe:transition-transform", detailsOpen && "rotate-180")} />
        </button>
      </div>

      <div id="order-details" className={cn(detailsOpen ? "block" : "hidden", "lg:block")}>
        <ul className="mt-2 divide-y divide-line">
          {lines.map((l) => (
            <li key={l.key} className="flex items-start justify-between gap-4 py-3">
              <span>
                <span className="block font-medium text-ink">{l.name}</span>
                {l.sub ? <span className="block text-[13px] text-slate">{l.sub}</span> : null}
              </span>
              <span className="font-mono font-medium tabular-nums text-ink">{l.amount == null ? "Quote" : money(l.amount)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-1 flex items-baseline justify-between gap-4 border-t border-line pt-3">
          <span className="font-semibold text-ink">Total due now</span>
          <span className="font-display text-[30px] font-extrabold leading-9 tabular-nums text-ink">{money(total)}</span>
        </div>
        <p className="mt-1 text-[13px] text-slate">One-time payment. Nothing renews automatically.</p>
        <p className="mt-3 text-sm text-ink">
          For <strong className="font-semibold">{legalName ?? "your company"}</strong>, USDOT{" "}
          <span className="whitespace-nowrap font-mono">{usdot}</span>
          {reference ? (
            <span className="block text-slate">
              Order <span className="whitespace-nowrap font-mono">{reference}</span>
            </span>
          ) : null}
        </p>
      </div>
    </section>
  );

  return (
    <div className="mx-auto max-w-[1120px] px-4 pb-8 pt-4 lg:px-10 lg:pb-16 lg:pt-9">
      <CheckoutSteps current="Payment" />
      <h1 className="sr-only">{nothingToPay ? "Your order" : `Pay ${money(total)} for your order`}</h1>

      <div className="mt-4 grid gap-4 lg:mt-5 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start lg:gap-x-12">
        {orderCard}

        {nothingToPay ? (
          <section aria-labelledby="h-nothing" className={cn(CHECKOUT_CARD, "lg:col-start-1 lg:row-start-1")}>
            <span className="grid size-10 place-items-center rounded-full bg-status-active/10 text-status-active" aria-hidden="true">
              <CheckSealIcon size={22} />
            </span>
            <h2 id="h-nothing" className={cn(CHECKOUT_H2, "mt-3")}>
              Nothing to pay online
            </h2>
            <p className="mt-1.5 text-ink">
              Your order {reference ? <span className="font-mono">{reference}</span> : null} is saved. There is no online charge
              for it.
            </p>
            <p className="mt-1 text-sm text-slate">
              Questions? Call us at{" "}
              <a href={site.telHref} className={cn("font-semibold text-steel underline", CHECKOUT_FOCUS)}>
                {site.telephone}
              </a>
              .
            </p>
            <Link href="/" className={cn(CHECKOUT_SECONDARY_BUTTON, "mt-4")}>
              Back to home
            </Link>
          </section>
        ) : (
          <section aria-labelledby="h-pay" className={cn(CHECKOUT_CARD, "lg:col-start-1 lg:row-start-1")}>
            <h2 id="h-pay" className={cn(CHECKOUT_H2, "mb-4")}>
              Payment details
            </h2>
            {publishableKey ? (
              <PaymentForm
                endpoint="/api/quick-buy-checkout/"
                body={{ orderId }}
                returnPath={`/buy/order/${orderId}/thank-you/`}
                publishableKey={publishableKey}
                trackingEvent="quick_buy_payment_submit"
                look="checkout"
                amountLabel={money(total)}
                onProcessingChange={setProcessing}
              />
            ) : (
              <p className="rounded-[10px] border border-line bg-paper p-3.5 text-sm text-ink">
                Online payment is not available right now. Call us at{" "}
                <a href={site.telHref} className="font-semibold text-steel underline">
                  {site.telephone}
                </a>{" "}
                to complete your order.
              </p>
            )}

            <ul className="mt-5 grid gap-2.5 text-[13px] leading-[18px] text-slate">
              <li className="flex gap-2.5">
                <ShieldIcon size={18} className="shrink-0 text-steel" />
                <span>
                  <strong className="font-semibold text-ink">Secure payment by Stripe.</strong> Your card details go straight to
                  Stripe. We never see or store your card number.
                </span>
              </li>
              <li className="flex gap-2.5">
                <CheckSealIcon size={18} className="shrink-0 text-steel" />
                <span>
                  Read our{" "}
                  <Link href="/refund-policy/" className={cn("font-semibold text-steel underline underline-offset-2", CHECKOUT_FOCUS)}>
                    refund policy
                  </Link>
                  .
                </span>
              </li>
              <li className="flex gap-2.5">
                <BuildingIcon size={18} className="shrink-0 text-steel" />
                <span>DGR Tech Rig is a private filing service, not a government agency.</span>
              </li>
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
