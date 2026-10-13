"use server";

import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { service as serviceClient } from "@/lib/server/supabase";
import { decodeLeadAccessToken } from "@/lib/server/security";
import { computeQuickBuyPricing, isQuickBuyServiceKey, type QuickBuyServiceKey, type ServiceKey } from "@/lib/services-registry";
import { checkoutAddOns, validateCheckout, type CheckoutErrors } from "@/lib/quick-buy-checkout";
import { parsePreselectedAddOns, preselectQuery } from "@/lib/quick-buy-preselect";
import { QUICK_BUY_TOKEN_COOKIE } from "@/lib/server/quick-buy";
import { readAdClickIds } from "@/lib/server/ad-click-ids";

/** What the checkout form gets back when the order can't be placed. Field
 *  errors keep the visitor on the page with everything they typed. */
export type PlaceOrderState = { errors?: CheckoutErrors; formError?: string } | null;

/**
 * Submit for the one-screen quick-buy checkout (owner, 2026-10-13: the old
 * confirm and review screens merged). Trusts the signed lead token minted by
 * performLookup() to identify the lead, re-validates everything the form
 * validated (lib/quick-buy-checkout.ts, the same rules), then writes the
 * signed quick_buy_orders row and its filings in one go and hands off to
 * payment. No Supabase session is created or required.
 *
 * The token is carried forward in an httpOnly cookie, not the URL (same
 * pattern as `lead_claim_token` in dev/lib/server/lead-claim.ts), kept out of
 * the URL, browser history, referrers and server logs. Payment reads it again
 * (/api/quick-buy-checkout) to authorize the charge.
 */
export async function placeQuickBuyOrder(
  serviceKeyParam: string,
  usdot: string,
  _prev: PlaceOrderState,
  formData: FormData,
): Promise<PlaceOrderState> {
  if (!isQuickBuyServiceKey(serviceKeyParam)) notFound();
  const primary = serviceKeyParam as ServiceKey;
  const field = (name: string) => String(formData.get(name) || "").trim();

  const requested = (formData.getAll("service") as string[]).filter(isQuickBuyServiceKey);
  const decoded = decodeLeadAccessToken(formData.get("token"));
  // Expired/tampered token: re-run the lookup, keeping the ticked add-ons.
  if (!decoded) redirect(`/buy/${serviceKeyParam}/${usdot}/${preselectQuery(parsePreselectedAddOns(requested.join(","), primary))}`);

  const values = {
    first: field("first_name"),
    last: field("last_name"),
    email: field("email"),
    phone: field("phone"),
    sign: field("signature_name"),
    agree: formData.get("terms_accepted") != null,
  };
  const errors = validateCheckout(values);
  if (Object.keys(errors).length) return { errors };

  // The QUALIFYING CMV count for UCR bracket pricing (truck tractors +
  // straight trucks only, see the hidden field in page.tsx), not the
  // carrier's general reported power units. Null if unknown: the 0-2 bracket
  // default is applied only at pricing time (computeQuickBuyPricing).
  const num = (name: string) => {
    const raw = formData.get(name);
    return raw != null && raw !== "" ? Number(raw) : null;
  };
  const powerUnits = num("power_units");
  const truckTractors = num("truck_tractors");

  // Only add-ons this carrier is actually offered on screen (same
  // eligibility as the form), so a crafted request can't add anything else.
  const offerable = new Set<string>(checkoutAddOns(serviceKeyParam as QuickBuyServiceKey, truckTractors));
  const additional = Array.from(new Set(requested.filter((k) => offerable.has(k)))) as ServiceKey[];
  const selected: ServiceKey[] = [primary, ...additional];
  // DQ files are sold for one driver only (owner, 2026-10-13).
  const driverCount = selected.includes("dq-files") ? 1 : null;

  const db = serviceClient();
  const now = new Date().toISOString();
  const row = {
    lead_id: decoded.leadId,
    usdot_number: usdot,
    service_key: primary,
    power_units: powerUnits,
    truck_tractors: truckTractors,
    first_name: values.first,
    last_name: values.last,
    email: values.email,
    phone: values.phone || null,
    address_line1: field("address_line1") || null,
    address_line2: field("address_line2") || null,
    address_city: field("address_city") || null,
    address_state: field("address_state") || null,
    address_zip: field("address_zip") || null,
    address_country: field("address_country") || null,
    additional_service_keys: additional,
    driver_count: driverCount,
    signature_name: values.sign,
    terms_accepted_at: now,
    confirmed_at: now,
    status: "awaiting_payment",
    // Google Ads click id(s), for uploading a later offline sale (see
    // migrations 0017/0018: the google_ads_followup_sales view).
    ...(await readAdClickIds()),
  };

  // One lead can place several orders: a double submit, going back and
  // ordering again, or the thank-you page's "You may also need" buttons (same
  // USDOT, so performLookup reuses the same lead within its 30-minute
  // window). Order references are unique (migration 0008), so the first
  // order carries the lead's reference and each later one a numbered suffix
  // (DGR-20261005-003, then DGR-20261005-003-2, -3, ...), which keeps every
  // order traceable to its lead's alert email.
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
  if (!order) {
    return { formError: "We could not save your order. Nothing was charged and your details are still here. Please try again." };
  }

  // Filings for the full selection (service role: filings has no
  // client-write policy), priced exactly as payment will charge.
  const orderId = order.id;
  const pricing = computeQuickBuyPricing(selected, { powerUnits, driverCount });
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

  const store = await cookies();
  store.set(QUICK_BUY_TOKEN_COOKIE, formData.get("token") as string, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60, // 1 hour to complete payment
  });

  // ?placed=1 tells the payment screen this is the first arrival, so it fires
  // the "details submitted" conversion once (not on a reload or a return).
  redirect(`/buy/order/${orderId}/pay/?placed=1`);
}
