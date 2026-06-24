"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CLAIM_COOKIE } from "@/lib/server/lead-claim";

/**
 * "Save & track this lookup" (M2 §3). Stashes the signed lead token in an
 * httpOnly cookie (kept out of the URL/logs) and sends the user into the
 * magic-link flow. After auth, /auth/callback claims the lead into their account.
 */
export async function startClaim(formData: FormData) {
  const token = String(formData.get("token") || "").trim();
  if (token) {
    const store = await cookies();
    store.set(CLAIM_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 60, // 30 minutes to complete sign-in
    });
  }
  redirect("/login/?next=/dashboard/");
}
