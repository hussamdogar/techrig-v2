import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Next.js Proxy (formerly "middleware"). Runs only on the Application Platform's
 * authed + auth routes (M2) — the static marketing site is NOT matched, so its
 * prerendered pages and performance are untouched. Session refresh + the
 * /dashboard, /account guard live in updateSession().
 */
export function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: ["/dashboard/:path*", "/account/:path*", "/login", "/auth/:path*"],
};
