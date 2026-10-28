"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { loadStripe, type Appearance } from "@stripe/stripe-js";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { buttonVariants } from "@/components/ui/button";
import { AlertIcon } from "@/components/icons";
import { CHECKOUT_PRIMARY_BUTTON, CheckoutSpinner } from "@/components/checkout-ui";
import { pushDataLayerEvent } from "@/lib/gtm";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Stripe payment form (M4). A client island used ONLY on payment routes, so
 * Stripe stays out of every other bundle. It POSTs `body` to `endpoint` for a
 * server-priced PaymentIntent client secret, mounts the embedded PaymentElement,
 * and confirms with a return_url to `returnPath` (verify-on-return there). The
 * publishable key is passed from the server (it is public, not a secret).
 *
 * Generic across both checkout paths: `/apply`'s pay page passes
 * `endpoint="/api/checkout/"`, `body={ applicationId }`,
 * `returnPath="/apply/{id}/success/"`; the quick-buy pay page passes
 * `endpoint="/api/quick-buy-checkout/"`, `body={ orderId }`,
 * `returnPath="/buy/{orderId}/thank-you/"`.
 *
 * `trackingEvent` is opt-in GTM funnel tracking (a plain string, safe to pass
 * from a Server Component page): when given, a submit attempt and a failed
 * confirmation each push it to the dataLayer with a `status`. Only the
 * quick-buy pay page passes it, so `/apply`'s checkout is unaffected.
 *
 * `look="checkout"` (quick-buy, shared/design/quick-buy-payment-thanks-v2.md
 * §3) styles Stripe's fields like the rest of the checkout, shows the amount
 * on the button, a skeleton while loading, plain-language alerts and a retry
 * when the payment can't start. Without it the form keeps its original look.
 */

/** Stripe Appearance matching the checkout's own inputs (52px, 10px radius,
 *  field border, steel focus ring, error red, IBM Plex Sans). */
const CHECKOUT_APPEARANCE: Appearance = {
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
const CHECKOUT_FONTS = [{ cssSrc: "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&display=swap" }];

type Look = "default" | "checkout";

export function PaymentForm({
  endpoint,
  body,
  returnPath,
  publishableKey,
  trackingEvent,
  look = "default",
  amountLabel,
  onProcessingChange,
}: {
  endpoint: string;
  body: Record<string, string>;
  returnPath: string;
  publishableKey: string;
  trackingEvent?: string;
  look?: Look;
  /** e.g. "$145": shown on the checkout-look button ("Pay $145"). */
  amountLabel?: string;
  /** Tells the page when a payment is being confirmed (e.g. to hide "Edit order"). */
  onProcessingChange?: (processing: boolean) => void;
}) {
  const stripePromise = useMemo(() => loadStripe(publishableKey), [publishableKey]);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const bodyKey = JSON.stringify(body);
  // Stripe's own key prefix, not an env flag: this way the test-card hint
  // below disappears automatically the moment live keys (pk_live_...) are
  // configured, with nothing to remember to delete before launch.
  const isTestMode = publishableKey.startsWith("pk_test_");
  const checkout = look === "checkout";

  useEffect(() => {
    let active = true;
    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: bodyKey,
    })
      .then((r) => r.json())
      .then((d) => {
        if (!active) return;
        if (d.clientSecret) setClientSecret(d.clientSecret);
        else setError(d.error ?? "Could not start payment.");
      })
      .catch(() => active && setError("Could not start payment."));
    return () => {
      active = false;
    };
    // `attempt` re-runs the request for the checkout look's "Try again".
  }, [endpoint, bodyKey, attempt]);

  if (error) {
    if (!checkout) return <p className="rounded-card border border-signal/40 bg-signal/10 p-3 text-sm text-ink">{error}</p>;
    return (
      <>
        <CheckoutAlert
          title="We could not load the payment form."
          body={`Nothing was charged. Check your connection and try again, or call us at ${site.telephone}.`}
        />
        <button
          type="button"
          onClick={() => {
            setError(null);
            setAttempt((n) => n + 1);
          }}
          className={cn(CHECKOUT_PRIMARY_BUTTON, "mt-4")}
        >
          Try again
        </button>
      </>
    );
  }
  if (!clientSecret) {
    if (!checkout) return <p className="text-sm text-slate">Preparing secure payment…</p>;
    return <CheckoutSkeleton />;
  }

  return (
    <Elements
      stripe={stripePromise}
      options={
        checkout
          ? { clientSecret, appearance: CHECKOUT_APPEARANCE, fonts: CHECKOUT_FONTS }
          : { clientSecret, appearance: { theme: "stripe" } }
      }
    >
      <ConfirmForm
        returnPath={returnPath}
        isTestMode={isTestMode}
        trackingEvent={trackingEvent}
        checkout={checkout}
        amountLabel={amountLabel}
        onProcessingChange={onProcessingChange}
      />
    </Elements>
  );
}

function ConfirmForm({
  returnPath,
  isTestMode,
  trackingEvent,
  checkout,
  amountLabel,
  onProcessingChange,
}: {
  returnPath: string;
  isTestMode: boolean;
  trackingEvent?: string;
  checkout: boolean;
  amountLabel?: string;
  onProcessingChange?: (processing: boolean) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [ready, setReady] = useState(!checkout);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ title: string; body: string } | string | null>(null);
  const alertRef = useRef<HTMLDivElement>(null);

  const setBusy = useCallback(
    (busy: boolean) => {
      setSubmitting(busy);
      onProcessingChange?.(busy);
      elements?.getElement("payment")?.update({ readOnly: busy });
    },
    [elements, onProcessingChange],
  );

  useEffect(() => {
    if (message && checkout) alertRef.current?.focus();
  }, [message, checkout]);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!stripe || !elements || submitting) return;
    setMessage(null);
    if (checkout) {
      // Stripe shows its own messages under each field; focus the first one.
      const { error: validationError } = await elements.submit();
      if (validationError) {
        elements.getElement("payment")?.focus();
        return;
      }
    }
    setBusy(true);
    if (trackingEvent) pushDataLayerEvent(trackingEvent, { status: "submitted" });
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: `${window.location.origin}${returnPath}` },
    });
    // We only reach here if confirmation failed before the redirect; success
    // navigates away to returnPath, tracked there instead.
    if (error) {
      if (!checkout) setMessage(error.message ?? "Payment could not be completed.");
      else if (error.type === "card_error" || error.type === "validation_error") {
        setMessage({
          title: error.message ?? "Your card was declined.",
          body: "Your card was not charged. Try another card, or call your bank and then try again.",
        });
      } else {
        setMessage({
          title: "We could not complete the payment.",
          body: `Your card was not charged. Please try again, or call us at ${site.telephone}.`,
        });
      }
      if (trackingEvent) pushDataLayerEvent(trackingEvent, { status: "failed", message: error.message });
    }
    setBusy(false);
  }

  if (!checkout) {
    return (
      <form onSubmit={onSubmit} className="space-y-5">
        <PaymentElement />
        {message ? <p className="text-sm text-ink">{typeof message === "string" ? message : message.title}</p> : null}
        <button
          type="submit"
          disabled={!stripe || submitting}
          className={cn(buttonVariants({ variant: "primary", size: "md" }), "w-full disabled:opacity-70")}
        >
          {submitting ? "Processing…" : "Pay now"}
        </button>
        {isTestMode ? (
          <p className="text-center text-xs text-slate">Test mode. Use card 4242 4242 4242 4242, any future date and CVC.</p>
        ) : null}
      </form>
    );
  }

  return (
    <form onSubmit={onSubmit} aria-busy={submitting || undefined}>
      {/* The skeleton stands in until Stripe has drawn its fields. The element
          keeps its full width meanwhile (height 0, not sr-only) so its iframe
          lays out at the right size. */}
      {ready ? null : <CheckoutSkeleton fieldsOnly />}
      <div className={cn(!ready && "h-0 overflow-hidden")}>
        <PaymentElement
          onReady={() => setReady(true)}
          options={{
            layout: { type: "tabs" },
            wallets: { applePay: "auto", googlePay: "auto" },
            fields: { billingDetails: { address: { country: "auto", postalCode: "auto" } } },
          }}
        />
      </div>
      {message && typeof message !== "string" ? (
        <div className="mt-4">
          <CheckoutAlert ref={alertRef} title={message.title} body={message.body} />
        </div>
      ) : null}
      <button
        type="submit"
        disabled={!stripe || !ready}
        aria-disabled={submitting || undefined}
        className={cn(CHECKOUT_PRIMARY_BUTTON, "mt-4 disabled:cursor-not-allowed disabled:opacity-70", submitting && "cursor-progress")}
      >
        {submitting ? (
          <>
            <CheckoutSpinner />
            Processing payment...
          </>
        ) : !ready ? (
          <>
            <CheckoutSpinner />
            Preparing secure payment...
          </>
        ) : (
          <>
            <LockIcon />
            Pay {amountLabel ?? "now"}
          </>
        )}
      </button>
      {submitting ? (
        <p role="status" className="mt-2 text-center text-[13px] text-slate">
          Please keep this page open. This takes a few seconds.
        </p>
      ) : null}
      {isTestMode ? (
        <p className="mt-2 text-center text-xs text-slate">Test mode. Use card 4242 4242 4242 4242, any future date and CVC.</p>
      ) : null}
    </form>
  );
}

/** Placeholder blocks where Stripe's fields will appear (no shimmer under
 *  reduced motion). */
function CheckoutSkeleton({ fieldsOnly }: { fieldsOnly?: boolean }) {
  const block = "h-[52px] rounded-[10px] bg-line/60 motion-safe:animate-pulse";
  return (
    <div aria-busy="true">
      <p role="status" className="sr-only">
        Preparing secure payment
      </p>
      <div className="grid gap-3.5" aria-hidden="true">
        <div className="h-4 w-28 rounded bg-line/60" />
        <div className={block} />
        <div className="grid grid-cols-2 gap-3">
          <div className={block} />
          <div className={block} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className={block} />
          <div className={block} />
        </div>
      </div>
      {fieldsOnly ? null : (
        <button type="button" disabled className={cn(CHECKOUT_PRIMARY_BUTTON, "mt-4 cursor-not-allowed opacity-70")}>
          <CheckoutSpinner />
          Preparing secure payment...
        </button>
      )}
    </div>
  );
}

function CheckoutAlert({ title, body, ref }: { title: string; body: string; ref?: React.Ref<HTMLDivElement> }) {
  return (
    <div
      ref={ref}
      role="alert"
      tabIndex={-1}
      className="flex gap-2.5 rounded-[10px] border border-error bg-error-50 px-3.5 py-3 text-sm font-medium text-error outline-none"
    >
      <AlertIcon size={18} className="mt-px shrink-0" />
      <div>
        <p>{title}</p>
        <p className="mt-0.5 font-normal text-ink">{body}</p>
      </div>
    </div>
  );
}

function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}
