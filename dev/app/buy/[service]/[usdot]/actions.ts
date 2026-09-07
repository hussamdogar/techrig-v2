"use server";

import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { service as serviceClient } from "@/lib/server/supabase";
import { decodeLeadAccessToken, isValidEmail, isValidPhone } from "@/lib/server/security";
import { isQuickBuyServiceKey, type ServiceKey } from "@/lib/services-registry";
import { QUICK_BUY_TOKEN_COOKIE } from "@/lib/server/quick-buy";

/**
 * Confirm-screen submit for the quick-buy fast path. Trusts the signed lead
 * token minted by performLookup() (the same primitive `/apply`'s lead_token
 * uses) to identify the lead, writes a quick_buy_orders row, then hands off to
 * the review & sign screen. No Supabase session is created or required.
 *
 * Filings are NOT created here — the review step is where the final service
 * list (primary + any upsells) is locked in, so filings are created there
 * instead (dev/app/buy/order/[orderId]/actions.ts).
 *
 * The token is carried forward in an httpOnly cookie, not the URL (same
 * pattern as `lead_claim_token` in dev/lib/server/lead-claim.ts) — kept out of
 * the URL, browser history, referrers, and server logs. It needs to survive
 * through review AND payment, so it's set once here and read again by both.
 */
export async function confirmQuickBuyOrder(serviceKeyParam: string, usdot: string, formData: FormData) {
  if (!isQuickBuyServiceKey(serviceKeyParam)) notFound();
  const serviceKey = serviceKeyParam as ServiceKey;

  const decoded = decodeLeadAccessToken(formData.get("token"));
  if (!decoded) redirect(`/buy/${serviceKeyParam}/${usdot}/`); // expired/tampered: re-run the lookup

  const firstName = String(formData.get("first_name") || "").trim() || null;
  const lastName = String(formData.get("last_name") || "").trim() || null;
  const email = String(formData.get("email") || "").trim() || null;
  const phone = String(formData.get("phone") || "").trim() || null;

  // Format-check before this ever reaches the DB or a Resend `to:` address —
  // email is required on the form, phone is optional (only checked if given).
  // Not full RFC validation, just enough to reject an obvious typo/garbage
  // value instead of silently storing it and wasting the receipt/admin-alert
  // send. Redirects back to re-enter details rather than failing silently.
  if (!email || !isValidEmail(email) || (phone && !isValidPhone(phone))) {
    redirect(`/buy/${serviceKeyParam}/${usdot}/?error=invalid_contact`);
  }

  // Despite the generic name, this is the QUALIFYING CMV count for UCR
  // bracket pricing (truck tractors + straight trucks only — see the hidden
  // field's comment in page.tsx), not the carrier's general reported power
  // units. Kept honest (null if unknown) — the 0-2-bracket default is applied
  // only at pricing time (computeQuickBuyPricing), not baked in here.
  const rawPowerUnits = formData.get("power_units");
  const powerUnits = rawPowerUnits != null && rawPowerUnits !== "" ? Number(rawPowerUnits) : null;
  // Raw signal for the review screen's dynamic "You may also need" upsell
  // menu — see review-form.tsx for the eligibility rule.
  const rawTruckTractors = formData.get("truck_tractors");
  const truckTractors = rawTruckTractors != null && rawTruckTractors !== "" ? Number(rawTruckTractors) : null;

  const db = serviceClient();
  const { data: order, error } = await db
    .from("quick_buy_orders")
    .insert({
      lead_id: decoded.leadId,
      usdot_number: usdot,
      service_key: serviceKey,
      power_units: powerUnits,
      truck_tractors: truckTractors,
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      reference_id: decoded.referenceId ?? null,
      confirmed_at: new Date().toISOString(),
      status: "awaiting_payment",
    })
    .select("id")
    .single();
  if (error || !order) redirect(`/buy/${serviceKeyParam}/${usdot}/?error=1`);

  const store = await cookies();
  store.set(QUICK_BUY_TOKEN_COOKIE, formData.get("token") as string, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60, // 1 hour to complete review + payment
  });

  redirect(`/buy/order/${order.id}/review/`);
}
