import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Container, Section } from "@/components/ui/container";
import { service } from "@/lib/server/supabase";
import { SERVICES, isQuickBuyServiceKey, type ServiceKey } from "@/lib/services-registry";
import { reviewAndSignQuickBuyOrder } from "../actions";
import { ReviewForm } from "./review-form";

/**
 * Quick-buy review & sign screen. Sits between confirm and payment: summarizes
 * the order, offers the other quick-buy services as upsells, collects the
 * UCR/DQ extra field for whatever ends up in the final selection, and gets a
 * typed-name signature + terms acceptance before payment is chargeable.
 */
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Review your order",
  robots: { index: false, follow: false },
};

export default async function QuickBuyReviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ orderId: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { orderId } = await params;
  const { error } = await searchParams;

  const db = service();
  const { data: order } = await db.from("quick_buy_orders").select("*").eq("id", orderId).maybeSingle();
  if (!order || !isQuickBuyServiceKey(order.service_key)) notFound();
  if (order.status === "paid" || order.status === "fulfilled") redirect(`/buy/order/${orderId}/thank-you/`);
  if (!order.confirmed_at) redirect(`/buy/${order.service_key}/`);

  const primaryKey = order.service_key as ServiceKey;
  const def = SERVICES[primaryKey];
  const submitAction = reviewAndSignQuickBuyOrder.bind(null, orderId);
  const initialAdditional = (Array.isArray(order.additional_service_keys) ? order.additional_service_keys : []).filter(
    isQuickBuyServiceKey,
  ) as ServiceKey[];

  return (
    <Section surface="paper" className="pt-8 md:pt-12">
      <Container className="max-w-2xl">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-slate">{order.reference_id ?? ""}</p>
        <h1 className="mt-1 font-display text-3xl font-extrabold tracking-[-0.02em] text-ink">Review your order</h1>
        <p className="mt-3 text-slate">Confirm what you&apos;re buying, sign, and continue to payment.</p>

        <div className="mt-6 rounded-card border border-slate/15 bg-cloud p-5">
          <p className="text-sm text-ink">
            {order.first_name} {order.last_name} · {order.email}
            {order.phone ? ` · ${order.phone}` : ""}
          </p>
          <p className="mt-1 text-sm text-slate">USDOT {order.usdot_number}</p>
          <p className="mt-3 font-medium text-ink">{def.name}</p>
        </div>

        {error ? (
          <p className="mt-4 rounded-card border border-signal/40 bg-signal/10 p-3 text-sm text-ink">
            Type your full legal name and accept the terms to continue.
          </p>
        ) : null}

        <ReviewForm
          action={submitAction}
          primaryKey={primaryKey}
          powerUnits={order.power_units}
          initialAdditional={initialAdditional}
          initialDriverCount={order.driver_count}
        />
      </Container>
    </Section>
  );
}
