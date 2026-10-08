"use server";

import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { isQuickBuyServiceKey } from "@/lib/services-registry";
import { parsePreselectedAddOns, preselectQuery } from "@/lib/quick-buy-preselect";

/** Entry-screen submit: just routes to the confirm screen for this USDOT. The
 *  confirm screen itself runs performLookup() and handles invalid/not-found
 *  states, so this stays a plain redirect. Pre-selected add-ons from the
 *  compliance check (`add`, see lib/quick-buy-preselect.ts) ride along. */
export async function startQuickBuyLookup(service: string, formData: FormData) {
  if (!isQuickBuyServiceKey(service)) notFound();
  const usdot = String(formData.get("usdot") || "").trim();
  const add = parsePreselectedAddOns(formData.get("add"), service);
  redirect(`/buy/${service}/${encodeURIComponent(usdot)}/${preselectQuery(add)}`);
}
