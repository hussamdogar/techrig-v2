"use server";

import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { service as serviceClient } from "@/lib/server/supabase";
import { decodeLeadAccessToken, isValidEmail, isValidPhone } from "@/lib/server/security";
import { isQuickBuyServiceKey, remainingQuickBuyUpsells, type ServiceKey } from "@/lib/services-registry";
import { parsePreselectedAddOns, preselectQuery } from "@/lib/quick-buy-preselect";
import { QUICK_BUY_TOKEN_COOKIE } from "@/lib/server/quick-buy";
import { readAdClickIds } from "@/lib/server/ad-click-ids";

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

  const requestedAddOns = parsePreselectedAddOns(formData.get("add"), serviceKeyParam);
  const decoded = decodeLeadAccessToken(formData.get("token"));
  if (!decoded) redirect(`/buy/${serviceKeyParam}/${usdot}/${preselectQuery(requestedAddOns)}`); // expired/tampered: re-run the lookup

  const firstName = String(formData.get("first_name") || "").trim() || null;
  const lastName = String(formData.get("last_name") || "").trim() || null;
  const email = String(formData.get("email") || "").trim() || null;
  const phone = String(formData.get("phone") || "").trim() || null;
  const addressLine1 = String(formData.get("address_line1") || "").trim() || null;
  const addressLine2 = String(formData.get("address_line2") || "").trim() || null;
  const addressCity = String(formData.get("address_city") || "").trim() || null;
  const addressState = String(formData.get("address_state") || "").trim() || null;
  const addressZip = String(formData.get("address_zip") || "").trim() || null;
  const addressCountry = String(formData.get("address_country") || "").trim() || null;

  // Format-check before this ever reaches the DB or a Resend `to:` address —
  // email is required on the form, phone is optional (only checked if given).
  // Not full RFC validation, just enough to reject an obvious typo/garbage
  // value instead of silently storing it and wasting the receipt/admin-alert
  // send. Redirects back to re-enter details rather than failing silently.
  if (!email || !isValidEmail(email) || (phone && !isValidPhone(phone))) {
    redirect(`/buy/${serviceKeyParam}/${usdot}/?error=invalid_contact${preselectQuery(requestedAddOns, "&")}`);
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
  // Compliance-check add-ons, pre-ticked on the review screen. Only those this
  // order can actually offer there (the same truck-tractor gate the review
  // menu uses), so nothing gets charged that the visitor can't see and untick.
  const offerable = new Set<string>(remainingQuickBuyUpsells(truckTractors, [serviceKey]));
  const additionalServiceKeys = requestedAddOns.filter((k) => offerable.has(k));

  const db = serviceClient();
  const row = {
    lead_id: decoded.leadId,
    usdot_number: usdot,
    service_key: serviceKey,
    power_units: powerUnits,
    truck_tractors: truckTractors,
    first_name: firstName,
    last_name: lastName,
    email,
    phone,
    address_line1: addressLine1,
    address_line2: addressLine2,
    address_city: addressCity,
    address_state: addressState,
    address_zip: addressZip,
    address_country: addressCountry,
    additional_service_keys: additionalServiceKeys,
    confirmed_at: new Date().toISOString(),
    status: "awaiting_payment",
    // Google Ads click id(s), for uploading a later offline sale (see
    // migrations 0017/0018: the google_ads_followup_sales view).
    ...(await readAdClickIds()),
  };

  // One lead can place several orders: going back and confirming again, a
  // double submit, or the thank-you page's "You may also need" buttons (same
  // USDOT, so performLookup reuses the same lead within its 30-minute window).
  // Order references are unique (migration 0008), so the first order carries
  // the lead's reference and each later one a numbered suffix
  // (DGR-20261005-003, then DGR-20261005-003-2, -3, ...), which keeps every
  // order traceable to its lead's alert email. Without this, every order
  // after the first failed the unique check and the visitor hit ?error=1.
  const baseRef = decoded.referenceId ?? null;
  const MAX_ORDERS_PER_LEAD_REF = 20;
  let order: { id: string } | null = null;
  for (let n = 1; n <= MAX_ORDERS_PER_LEAD_REF; n++) {
    const reference_id = baseRef && n > 1 ? `${baseRef}-${n}` : baseRef;
    const { data, error } = await db
      .from("quick_buy_orders")
      .insert({ ...row, reference_id })
      .select("id")
      .single();
    order = data;
    // 23505 = unique_violation: that reference is taken, try the next suffix.
    // Any other error (or no reference to vary) is a real failure.
    if (!error || error.code !== "23505" || !baseRef) break;
  }
  if (!order) redirect(`/buy/${serviceKeyParam}/${usdot}/?error=1${preselectQuery(requestedAddOns, "&")}`);

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
