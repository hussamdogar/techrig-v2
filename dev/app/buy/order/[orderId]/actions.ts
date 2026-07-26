"use server";

import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { service as serviceClient } from "@/lib/server/supabase";
import { verifyLeadAccessToken } from "@/lib/server/security";
import { QUICK_BUY_TOKEN_COOKIE } from "@/lib/server/quick-buy";
import { computeQuickBuyPricing, isQuickBuyServiceKey, type ServiceKey } from "@/lib/services-registry";

/**
 * Review & sign submit for the quick-buy fast path. Locks in the FINAL service
 * list (the primary service from confirm + any upsells checked here), the
 * UCR/DQ extra field if either ends up in that list, and a typed-name
 * signature + terms acceptance. Then (re)creates the order's filings from the
 * full selection — idempotent, so resubmitting (e.g. after a validation error)
 * replaces rather than duplicates, same pattern as submitApplication in
 * dev/app/apply/actions.ts.
 *
 * Authorized the same way as /api/quick-buy-checkout: the httpOnly lead-token
 * cookie set at confirm time, verified against the order's lead_id.
 */
export async function reviewAndSignQuickBuyOrder(orderId: string, formData: FormData) {
  const db = serviceClient();
  const { data: order } = await db.from("quick_buy_orders").select("*").eq("id", orderId).maybeSingle();
  if (!order || !isQuickBuyServiceKey(order.service_key)) notFound();
  if (order.status === "paid" || order.status === "fulfilled") redirect(`/buy/order/${orderId}/thank-you/`);

  const store = await cookies();
  const token = store.get(QUICK_BUY_TOKEN_COOKIE)?.value;
  if (!verifyLeadAccessToken(token, order.lead_id)) redirect(`/buy/${order.service_key}/`); // lost the capability token: restart

  const primaryKey = order.service_key as ServiceKey;
  const additional = (formData.getAll("service") as string[])
    .filter(isQuickBuyServiceKey)
    .filter((k) => k !== primaryKey) as ServiceKey[];
  const allSelected = Array.from(new Set<ServiceKey>([primaryKey, ...additional]));

  // Power units is never a form field — it's auto-detected at confirm time
  // (or defaults to the 0-2 bracket in computeQuickBuyPricing when unknown),
  // so it just carries forward from the order unchanged.
  const powerUnits = order.power_units;
  const driverCount = allSelected.includes("dq-files") ? Number(formData.get("driver_count")) || null : null;

  const signatureName = String(formData.get("signature_name") || "").trim();
  const termsAccepted = formData.get("terms_accepted") != null;
  if (!signatureName || !termsAccepted) redirect(`/buy/order/${orderId}/review/?error=1`);

  await db
    .from("quick_buy_orders")
    .update({
      additional_service_keys: additional,
      driver_count: driverCount,
      signature_name: signatureName,
      terms_accepted_at: new Date().toISOString(),
    })
    .eq("id", orderId);

  // Replace filings with the full selected set (service role: filings has no
  // client-write policy). Idempotent: safe to resubmit.
  const pricing = computeQuickBuyPricing(allSelected, { powerUnits, driverCount });
  await db.from("filings").delete().eq("quick_buy_order_id", orderId);
  const rows = pricing.filings.map((f) => ({
    quick_buy_order_id: orderId,
    service_key: f.service_key,
    service_name: f.service_name,
    price_amount: f.price_amount,
    ucr_tier: f.ucr_tier,
    status: f.status,
    expected_timeline: f.expected_timeline,
  }));
  if (rows.length) await db.from("filings").insert(rows);

  redirect(`/buy/order/${orderId}/pay/`);
}
