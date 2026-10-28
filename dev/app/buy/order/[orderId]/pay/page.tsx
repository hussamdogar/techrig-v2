import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { service } from "@/lib/server/supabase";
import { computeQuickBuyPricing, isQuickBuyServiceKey, SERVICES, type ServiceKey } from "@/lib/services-registry";
import { sendQuickBuyPaymentStepAdminAlert } from "@/lib/email/lifecycle";
import { formatQuickBuyAddress, quickBuyEnhancedConversionData } from "@/lib/server/quick-buy";
import { preselectQuery } from "@/lib/quick-buy-preselect";
import { GtmEvent } from "@/components/gtm-event";
import { PayScreen, type PayLine } from "./pay-screen";

/**
 * Quick-buy payment screen. No auth gate: the order was created server-side by
 * the checkout action (app/buy/[service]/[usdot]/actions.ts) and is loaded here via the service-role client
 * (quick_buy_orders has no client read policy at all — see migration 0008).
 * Ownership for the actual charge is enforced by /api/quick-buy-checkout via
 * the httpOnly lead-token cookie set at confirm time, not by this page.
 *
 * Priced from the FULL selected set (primary service + any upsells added on
 * the checkout screen), not just the primary. Uses computeQuickBuyPricing, not
 * computePricing — for quick-buy specifically, UCR's government fee is folded
 * into the one number shown/charged, not disclosed as a separate line (owner
 * decision; /apply and bundles keep the separate-disclosure behavior).
 */
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Payment",
  robots: { index: false, follow: false },
};

export default async function QuickBuyPayPage({
  params,
  searchParams,
}: {
  params: Promise<{ orderId: string }>;
  searchParams: Promise<{ placed?: string }>;
}) {
  const { orderId } = await params;
  const { placed } = await searchParams;
  const db = service();
  const { data: order } = await db.from("quick_buy_orders").select("*").eq("id", orderId).maybeSingle();
  if (!order || !isQuickBuyServiceKey(order.service_key)) notFound();
  // Not signed yet (only possible for an order started before the checkout
  // screens merged): back to the checkout for this USDOT to sign.
  if (!order.signature_name || !order.terms_accepted_at) {
    const additional = Array.isArray(order.additional_service_keys) ? order.additional_service_keys : [];
    redirect(`/buy/${order.service_key}/${order.usdot_number}/${preselectQuery(additional)}`);
  }

  // Deeper funnel signal than the USDOT lead: the carrier gave us their own
  // contact details, signed, and the order now exists. Fired on arrival from
  // the checkout (?placed=1, set by its action), so a server-rejected submit
  // never counts and a later return to this page doesn't either. A reload
  // keeps the param, but Ads dedupes on the transaction id (the order's
  // reference). Not stripped from the URL: GTM's History Change trigger would
  // log that as an extra page view. Carries the carrier's own contact
  // details for Google Ads enhanced conversions, only to the carrier who
  // placed the order (see quickBuyEnhancedConversionData).
  const detailsEvent =
    placed === "1"
      ? {
          lead_id: order.reference_id ?? orderId,
          service: order.service_key,
          user_data: await quickBuyEnhancedConversionData(order),
        }
      : null;

  // Owner wants to know when a client reaches checkout. Best-effort, never
  // blocks the render; fires once per page render (no idempotency guard),
  // same as the lookup alert in app/buy/[service]/[usdot]/page.tsx.
  await sendQuickBuyPaymentStepAdminAlert({
    leadId: order.lead_id,
    serviceName: SERVICES[order.service_key as ServiceKey].name,
    usdot: order.usdot_number,
    email: order.email,
    phone: order.phone,
    address: formatQuickBuyAddress(order),
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

  // The carrier's legal name for "For {name}, USDOT ..." (from the lookup
  // snapshot; orders don't store it).
  const { data: snapshot } = await db
    .from("carrier_snapshots")
    .select("data_json")
    .eq("lead_id", order.lead_id)
    .order("fetched_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  const legalName = (snapshot?.data_json as { legalName?: string | null } | undefined)?.legalName ?? null;

  const lines: PayLine[] = pricing.lines.map((l) => ({
    key: l.key,
    name: l.name,
    sub: l.key === "ucr" ? `${l.ucrTier ?? "0-2"} trucks, government fee included` : l.key === "dq-files" ? "1 driver" : null,
    amount: l.amount,
  }));

  return (
    <>
      {detailsEvent ? <GtmEvent event="quick_buy_details_submitted" data={detailsEvent} /> : null}
      <PayScreen
        orderId={orderId}
        reference={order.reference_id}
        usdot={order.usdot_number}
        legalName={legalName}
        lines={lines}
        total={pricing.total}
        editHref={`/buy/${order.service_key}/${order.usdot_number}/${preselectQuery(additional)}`}
        publishableKey={publishableKey}
      />
    </>
  );
}
