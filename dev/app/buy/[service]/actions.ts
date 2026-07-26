"use server";

import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { isQuickBuyServiceKey } from "@/lib/services-registry";

/** Entry-screen submit: just routes to the confirm screen for this USDOT. The
 *  confirm screen itself runs performLookup() and handles invalid/not-found
 *  states, so this stays a plain redirect. */
export async function startQuickBuyLookup(service: string, formData: FormData) {
  if (!isQuickBuyServiceKey(service)) notFound();
  const usdot = String(formData.get("usdot") || "").trim();
  redirect(`/buy/${service}/${encodeURIComponent(usdot)}/`);
}
