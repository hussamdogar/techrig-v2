import { getAdminUser } from "@/lib/server/admin";
import { service } from "@/lib/server/supabase";
import {
  callConversionsCsv,
  clickConversionsCsv,
  type OfflineConversionRow,
} from "@/lib/server/offline-conversions";

/**
 * POST /admin/sales/export/ -> a Google Ads upload CSV (Goals > Uploads).
 * Form fields: kind = "call" | "click"; include_exported = "1" to re-download
 * everything instead of only sales not yet exported. Rows included for the
 * first time are stamped exported_at, so the next download only has new ones
 * (Google would also reject exact duplicates, but this keeps files small).
 * POST, not GET: it has a side effect, and admin-gated server-side.
 */
export async function POST(request: Request) {
  const admin = await getAdminUser();
  if (!admin) return new Response("Not found", { status: 404 });

  const form = await request.formData();
  const kind = form.get("kind") === "call" ? "call" : "click";
  const includeExported = form.get("include_exported") === "1";

  const db = service();
  let query = db
    .from("offline_conversions")
    .select("id, match_method, caller_phone, call_started_at, gclid, email, phone, sold_at, value, currency")
    .eq("match_method", kind)
    .order("sold_at", { ascending: true });
  if (!includeExported) query = query.is("exported_at", null);
  const { data, error } = await query;
  if (error) return new Response("Export failed", { status: 500 });

  const rows = (data ?? []) as OfflineConversionRow[];
  const csv = kind === "call" ? callConversionsCsv(rows) : clickConversionsCsv(rows);

  if (rows.length && !includeExported) {
    await db
      .from("offline_conversions")
      .update({ exported_at: new Date().toISOString() })
      .in("id", rows.map((r) => r.id));
  }

  const date = new Date().toISOString().slice(0, 10);
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="google-ads-${kind}-conversions-${date}.csv"`,
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex",
    },
  });
}
