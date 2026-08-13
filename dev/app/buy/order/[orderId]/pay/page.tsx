import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Container, Section } from "@/components/ui/container";
import { service } from "@/lib/server/supabase";
import { computeQuickBuyPricing, isQuickBuyServiceKey, SERVICES, type ServiceKey } from "@/lib/services-registry";
import { sendQuickBuyPaymentStepAdminAlert } from "@/lib/email/lifecycle";
import { PaymentForm } from "@/components/payment-form";

/**
 * Quick-buy payment screen. No auth gate: the order was created server-side by
 * the confirm-screen action and is loaded here via the service-role client
 * (quick_buy_orders has no client read policy at all — see migration 0008).
 * Ownership for the actual charge is enforced by /api/quick-buy-checkout via
 * the httpOnly lead-token cookie set at confirm time, not by this page.
 *
 * Priced from the FULL selected set (primary service + any upsells added on
 * the review screen), not just the primary. Uses computeQuickBuyPricing, not
 * computePricing — for quick-buy specifically, UCR's government fee is folded
 * into the one number shown/charged, not disclosed as a separate line (owner
 * decision; /apply and bundles keep the separate-disclosure behavior).
 */
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Payment",
  robots: { index: false, follow: false },
};

export default async function QuickBuyPayPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  const db = service();
  const { data: order } = await db.from("quick_buy_orders").select("*").eq("id", orderId).maybeSingle();
  if (!order || !isQuickBuyServiceKey(order.service_key)) notFound();
  // Review & sign hasn't happened yet: send them there first, not to payment.
  if (!order.signature_name || !order.terms_accepted_at) redirect(`/buy/order/${orderId}/review/`);

  // Owner wants to know when a client reaches checkout. Best-effort, never
  // blocks the render; fires once per page render (no idempotency guard),
  // same as the lookup alert in app/buy/[service]/[usdot]/page.tsx.
  await sendQuickBuyPaymentStepAdminAlert({
    leadId: order.lead_id,
    serviceName: SERVICES[order.service_key as ServiceKey].name,
    usdot: order.usdot_number,
    email: order.email,
    phone: order.phone,
  });

  const additional = (Array.isArray(order.additional_service_keys) ? order.additional_service_keys : []).filter(
    isQuickBuyServiceKey,
  ) as ServiceKey[];
  const selected = Array.from(new Set<ServiceKey>([order.service_key as ServiceKey, ...additional]));
  // order.power_units is the qualifying-CMV count (truck tractors + straight
  // trucks), not the carrier's general reported power units.
  const pricing = computeQuickBuyPricing(selected, {
    powerUnits: order.power_units,
    driverCount: order.driver_count,
  });

  const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY ?? "";

  return (
    <Section surface="paper" className="pt-8 md:pt-10">
      <Container className="max-w-2xl">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-slate">
          Payment · {order.reference_id ?? ""}
        </p>
        <h1 className="mt-2 font-display text-3xl font-extrabold tracking-[-0.02em] text-ink">Pay for your order</h1>

        <div className="mt-6 rounded-card border border-slate/15 bg-cloud p-5">
          <ul className="divide-y divide-slate/10">
            {pricing.lines.map((l) => (
              <li key={l.key + l.name} className="flex items-center justify-between gap-4 py-2 text-sm">
                <span className="text-ink">
                  {l.name}
                  {l.note ? <span className="block text-xs text-slate">{l.note}</span> : null}
                </span>
                <span className="font-mono font-medium text-ink">
                  {l.amount == null ? (l.manualReview ? "Quote" : "—") : `$${l.amount.toLocaleString("en-US")}`}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex items-center justify-between border-t border-slate/15 pt-3">
            <span className="font-display font-bold text-ink">Total due now</span>
            <span className="font-mono text-lg font-bold text-ink">${pricing.total.toLocaleString("en-US")}</span>
          </div>
        </div>

        <div className="mt-6">
          {pricing.total > 0 && publishableKey ? (
            <PaymentForm
              endpoint="/api/quick-buy-checkout/"
              body={{ orderId }}
              returnPath={`/buy/order/${orderId}/thank-you/`}
              publishableKey={publishableKey}
            />
          ) : (
            <p className="rounded-card border border-slate/15 bg-cloud p-4 text-sm text-ink">
              There&apos;s nothing to pay online for this order.{" "}
              <Link href="/" className="font-medium text-steel underline-offset-4 hover:underline">
                Back home
              </Link>
            </p>
          )}
        </div>
      </Container>
    </Section>
  );
}
