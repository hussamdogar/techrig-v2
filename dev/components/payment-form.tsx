"use client";

import { useEffect, useMemo, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Stripe payment form (M4). A client island used ONLY on the payment route, so
 * Stripe stays out of every other bundle. It asks /api/checkout for a
 * server-priced PaymentIntent client secret, mounts the embedded PaymentElement,
 * and confirms with a return_url to the success page (verify-on-return there).
 * The publishable key is passed from the server (it is public, not a secret).
 */
export function PaymentForm({ applicationId, publishableKey }: { applicationId: string; publishableKey: string }) {
  const stripePromise = useMemo(() => loadStripe(publishableKey), [publishableKey]);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/checkout/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ applicationId }),
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
  }, [applicationId]);

  if (error) return <p className="rounded-card border border-signal/40 bg-signal/10 p-3 text-sm text-ink">{error}</p>;
  if (!clientSecret) return <p className="text-sm text-slate">Preparing secure payment…</p>;

  return (
    <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: "stripe" } }}>
      <CheckoutForm applicationId={applicationId} />
    </Elements>
  );
}

function CheckoutForm({ applicationId }: { applicationId: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!stripe || !elements) return;
    setSubmitting(true);
    setMessage(null);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: `${window.location.origin}/apply/${applicationId}/success/` },
    });
    // We only reach here if confirmation failed before the redirect.
    if (error) setMessage(error.message ?? "Payment could not be completed.");
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
      <p className="text-center text-xs text-slate">Test mode. Use card 4242 4242 4242 4242, any future date and CVC.</p>
    </form>
  );
}
