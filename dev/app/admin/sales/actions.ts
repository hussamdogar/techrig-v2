"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getAdminUser } from "@/lib/server/admin";
import { service } from "@/lib/server/supabase";
import { businessLocalToUtc, type MatchMethod } from "@/lib/server/offline-conversions";
import { toE164 } from "@/lib/phone";

const back = (query: string) => redirect(`/admin/sales/?${query}`);
const field = (formData: FormData, name: string) => String(formData.get(name) ?? "").trim();

/**
 * Record a sale Google Ads couldn't see (closed by phone or after follow-ups)
 * so it can be uploaded as an offline conversion. Admin-gated server-side.
 *
 * The match method decides which Google upload the sale goes in, exactly once:
 *  - "call": the customer phoned us; matched by their number + call start time.
 *  - "click": a website lead closed later; matched by the ad click id saved on
 *    their lead/order, and/or their own email/phone (enhanced conversions).
 * A website order that was already paid online is refused: the purchase tag
 * already reported it, and uploading it again would count the sale twice.
 */
export async function recordOfflineSale(formData: FormData) {
  const admin = await getAdminUser();
  if (!admin) redirect("/login/?next=/admin/sales/");

  const method = field(formData, "match_method") as MatchMethod;
  if (method !== "call" && method !== "click") back("error=method");

  const reference = field(formData, "reference_id").toUpperCase() || null;
  const value = Number(field(formData, "value"));
  const soldAt = businessLocalToUtc(field(formData, "sold_at"));
  if (!Number.isFinite(value) || value <= 0) back("error=value");
  if (!soldAt || soldAt.getTime() > Date.now() + 60_000) back("error=sold_at");

  // Pull identifiers from the website lead/order this sale came from, if any.
  const db = service();
  let orderId: string | null = null;
  let clickIds = { gclid: null as string | null, gbraid: null as string | null, wbraid: null as string | null };
  let orderEmail: string | null = null;
  let orderPhone: string | null = null;
  if (reference) {
    const { data: order } = await db
      .from("quick_buy_orders")
      .select("id, status, email, phone, gclid, gbraid, wbraid")
      .eq("reference_id", reference)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (order?.status === "paid" || order?.status === "fulfilled") back("error=already_paid");
    if (order) {
      orderId = order.id;
      orderEmail = order.email;
      orderPhone = order.phone;
      clickIds = { gclid: order.gclid, gbraid: order.gbraid, wbraid: order.wbraid };
    } else {
      const { data: lead } = await db
        .from("leads")
        .select("gclid, gbraid, wbraid")
        .eq("reference_id", reference)
        .limit(1)
        .maybeSingle();
      if (!lead) back("error=reference");
      clickIds = { gclid: lead!.gclid, gbraid: lead!.gbraid, wbraid: lead!.wbraid };
    }
  }

  const email = (field(formData, "email") || orderEmail || "").toLowerCase() || null;
  const phone = toE164(field(formData, "phone") || orderPhone) ?? null;

  let callerPhone: string | null = null;
  let callStartedAt: Date | null = null;
  if (method === "call") {
    callerPhone = toE164(field(formData, "caller_phone")) ?? null;
    callStartedAt = businessLocalToUtc(field(formData, "call_started_at"));
    if (!callerPhone) back("error=caller_phone");
    if (!callStartedAt || callStartedAt.getTime() > soldAt!.getTime() + 60_000) back("error=call_started_at");
  } else if (!clickIds.gclid && !clickIds.gbraid && !clickIds.wbraid && !email && !phone) {
    back("error=no_identifier");
  }

  const { error } = await db.from("offline_conversions").insert({
    match_method: method,
    reference_id: reference,
    quick_buy_order_id: orderId,
    caller_phone: callerPhone,
    call_started_at: callStartedAt?.toISOString() ?? null,
    ...clickIds,
    email,
    phone,
    sold_at: soldAt!.toISOString(),
    value,
    notes: field(formData, "notes") || null,
    recorded_by: admin.id,
  });
  if (error) {
    console.error("offline sale insert failed:", error.message);
    back("error=save");
  }

  revalidatePath("/admin/sales/");
  back("saved=1");
}
