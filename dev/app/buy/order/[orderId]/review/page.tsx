import { notFound, redirect } from "next/navigation";
import { service } from "@/lib/server/supabase";
import { isQuickBuyServiceKey } from "@/lib/services-registry";
import { preselectQuery } from "@/lib/quick-buy-preselect";

/**
 * The old review & sign screen, retired when it merged into the one-screen
 * checkout at /buy/<service>/<usdot>/ (owner, 2026-10-13). Kept as a
 * redirect so bookmarks and orders started before the change still land
 * somewhere useful: a signed order goes to payment, an unsigned one back to
 * the checkout for its USDOT with its add-ons still ticked.
 */
export const dynamic = "force-dynamic";

export default async function QuickBuyReviewRedirect({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  const { data: order } = await service().from("quick_buy_orders").select("*").eq("id", orderId).maybeSingle();
  if (!order || !isQuickBuyServiceKey(order.service_key)) notFound();
  if (order.status === "paid" || order.status === "fulfilled") redirect(`/buy/order/${orderId}/thank-you/`);
  if (order.signature_name && order.terms_accepted_at) redirect(`/buy/order/${orderId}/pay/`);
  const additional = Array.isArray(order.additional_service_keys) ? order.additional_service_keys : [];
  redirect(`/buy/${order.service_key}/${order.usdot_number}/${preselectQuery(additional)}`);
}
