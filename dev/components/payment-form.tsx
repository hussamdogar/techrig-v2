"use client";

import { useEffect, useMemo, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { buttonVariants } from "@/components/ui/button";
import { pushDataLayerEvent } from "@/lib/gtm";
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
 */
export function PaymentForm({
  endpoint,
  body,
  returnPath,
  publishableKey,
  trackingEvent,
}: {
  endpoint: string;
  body: Record<string, string>;
  returnPath: string;
  publishableKey: string;
  trackingEvent?: string;
}) {
  const stripePromise = useMemo(() => loadStripe(publishableKey), [publishableKey]);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const bodyKey = JSON.stringify(body);
  // Stripe's own key prefix, not an env flag: this way the test-card hint
  // below disappears automatically the moment live keys (pk_live_...) are
  // configured, with nothing to remember to delete before launch.
  const isTestMode = publishableKey.startsWith("pk_test_");

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
  }, [endpoint, bodyKey]);

  if (error) return <p className="rounded-card border border-signal/40 bg-signal/10 p-3 text-sm text-ink">{error}</p>;
  if (!clientSecret) return <p className="text-sm text-slate">Preparing secure payment…</p>;

  return (
    <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: "stripe" } }}>
      <CheckoutForm returnPath={returnPath} isTestMode={isTestMode} trackingEvent={trackingEvent} />
    </Elements>
  );
}

function CheckoutForm({
  returnPath,
  isTestMode,
  trackingEvent,
}: {
  returnPath: string;
  isTestMode: boolean;
  trackingEvent?: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!stripe || !elements) return;
    setSubmitting(true);
    setMessage(null);
    if (trackingEvent) pushDataLayerEvent(trackingEvent, { status: "submitted" });
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: `${window.location.origin}${returnPath}` },
    });
    // We only reach here if confirmation failed before the redirect; success
    // navigates away to returnPath, tracked there instead.
    if (error) {
      setMessage(error.message ?? "Payment could not be completed.");
      if (trackingEvent) pushDataLayerEvent(trackingEvent, { status: "failed", message: error.message });
    }
    setSubmitting(false);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <PaymentElement />
      {message ? <p className="text-sm text-ink">{message}</p> : null}
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
