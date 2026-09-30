import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Container, Section } from "@/components/ui/container";
import { service } from "@/lib/server/supabase";
import { quickBuyEnhancedConversionData } from "@/lib/server/quick-buy";
import { GtmEvent } from "@/components/gtm-event";
import { isQuickBuyServiceKey, type ServiceKey } from "@/lib/services-registry";
import { text, DocketSection } from "@/lib/lookup/format";
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

  // Deeper funnel signal than the USDOT lead (fired on the confirm screen):
  // the carrier gave us their own contact details and the order now exists.
  // Fired here, on arrival, rather than on the confirm form's submit, so a
  // submit the server rejected (bad email/phone) is never counted. Carries the
  // carrier's own contact details for Google Ads enhanced conversions, only
  // to the carrier who placed the order (see quickBuyEnhancedConversionData).
  // Skipped on the ?error= re-render so a failed signature isn't a new signal.
  const detailsEvent = error
    ? null
    : {
        lead_id: order.reference_id ?? orderId,
        service: order.service_key,
        user_data: await quickBuyEnhancedConversionData(order),
      };

  const primaryKey = order.service_key as ServiceKey;
  const submitAction = reviewAndSignQuickBuyOrder.bind(null, orderId);
  const initialAdditional = (Array.isArray(order.additional_service_keys) ? order.additional_service_keys : []).filter(
    isQuickBuyServiceKey,
  ) as ServiceKey[];

  return (
    <Section surface="paper" className="pt-8 md:pt-12">
      {detailsEvent ? <GtmEvent event="quick_buy_details_submitted" data={detailsEvent} /> : null}
      <Container className="max-w-2xl">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-slate">{order.reference_id ?? ""}</p>
        <h1 className="mt-1 font-display text-3xl font-extrabold tracking-[-0.02em] text-ink">Review your order</h1>
        <p className="mt-3 text-slate">Confirm what you&apos;re buying, sign, and continue to payment.</p>

        <div className="mt-6">
          <DocketSection
            title="Company details"
            rows={[
              { label: "Name", value: text(`${order.first_name ?? ""} ${order.last_name ?? ""}`.trim()) },
              { label: "Email", value: text(order.email) },
              { label: "Phone", value: text(order.phone) },
              { label: "USDOT #", value: text(order.usdot_number) },
            ]}
          />
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
          truckTractors={order.truck_tractors}
          initialAdditional={initialAdditional}
          initialDriverCount={order.driver_count}
        />
      </Container>
    </Section>
  );
}
