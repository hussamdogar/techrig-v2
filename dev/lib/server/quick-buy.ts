import "server-only";
import { cookies } from "next/headers";
import { service } from "@/lib/server/supabase";
import { verifyLeadAccessToken } from "@/lib/server/security";
import { toE164 } from "@/lib/phone";

/** Shared cookie name for the quick-buy fast path's lead-token handoff between
 *  the confirm screen and /api/quick-buy-checkout. See actions.ts + the
 *  checkout route for how it's set/read. */
export const QUICK_BUY_TOKEN_COOKIE = "quick_buy_token";

/**
 * The carrier's legal (or DBA) name, for admin notifications. quick_buy_orders
 * itself has no company-name column — this reads it from the immutable
 * carrier_snapshots row the original lookup wrote (lib/server/lookup-capture.ts),
 * keyed by the order's lead_id. Null if no snapshot exists (e.g. a not-found
 * lookup never wrote one).
 */
export async function getQuickBuyCompanyName(leadId: string): Promise<string | null> {
  const db = service();
  const { data } = await db
    .from("carrier_snapshots")
    .select("data_json")
    .eq("lead_id", leadId)
    .order("fetched_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  const carrier = data?.data_json as { legalName?: string | null; dbaName?: string | null } | null;
  return carrier?.legalName ?? carrier?.dbaName ?? null;
}

/** Google Ads enhanced-conversions payload (the `user_data` shape GTM's
 *  User-Provided Data variable reads). Sent in plain text; GTM normalizes and
 *  hashes it before it leaves the browser. */
export type EnhancedConversionUserData = {
  email?: string;
  phone_number?: string;
  address?: {
    first_name?: string;
    last_name?: string;
    street?: string;
    city?: string;
    region?: string;
    postal_code?: string;
    country?: string;
  };
};

/** An order's stored carrier address as one line ("123 Main St, Suite 2,
 *  Springfield, IL 62701"), or null when none was on the FMCSA record. For
 *  the internal admin alerts. */
export function formatQuickBuyAddress(o: {
  address_line1?: string | null;
  address_line2?: string | null;
  address_city?: string | null;
  address_state?: string | null;
  address_zip?: string | null;
}): string | null {
  const cityLine = [o.address_city, [o.address_state, o.address_zip].filter(Boolean).join(" ")].filter(Boolean).join(", ");
  const parts = [o.address_line1, o.address_line2, cityLine].filter((v): v is string => !!v && !!v.trim());
  return parts.length ? parts.join(", ") : null;
}

type QuickBuyOrderContact = {
  lead_id: string;
  email: string | null;
  phone: string | null;
  first_name: string | null;
  last_name: string | null;
  address_line1: string | null;
  address_city: string | null;
  address_state: string | null;
  address_zip: string | null;
  address_country: string | null;
};

/**
 * The order's contact details for Google Ads enhanced conversions, or
 * undefined. Only returned to the carrier who placed the order: the
 * review/thank-you URLs are not secret on their own (they end up in analytics
 * as page URLs), so the details are included only when this browser holds the
 * order's own quick-buy lead-token cookie, set at confirm time.
 */
export async function quickBuyEnhancedConversionData(
  order: QuickBuyOrderContact,
): Promise<EnhancedConversionUserData | undefined> {
  const token = (await cookies()).get(QUICK_BUY_TOKEN_COOKIE)?.value;
  if (!verifyLeadAccessToken(token, order.lead_id)) return undefined;

  const orUndefined = (v: string | null) => v?.trim() || undefined;
  const country = order.address_country && /^[A-Za-z]{2}$/.test(order.address_country)
    ? order.address_country.toUpperCase()
    : undefined;
  return {
    email: orUndefined(order.email)?.toLowerCase(),
    phone_number: toE164(order.phone),
    address: {
      first_name: orUndefined(order.first_name),
      last_name: orUndefined(order.last_name),
      street: orUndefined(order.address_line1),
      city: orUndefined(order.address_city),
      region: orUndefined(order.address_state),
      postal_code: orUndefined(order.address_zip),
      country,
    },
  };
}
