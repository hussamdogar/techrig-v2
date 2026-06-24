import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { claimPendingLead } from "@/lib/server/lead-claim";

/**
 * Magic-link callback (M2). Exchanges the auth code for a session, then claims a
 * pending M1 lookup (if a lead-claim cookie is present) into the new user, and
 * redirects to `next` (default the dashboard). noindex via next.config header.
 */
export const dynamic = "force-dynamic";

/** Only allow internal redirect targets (no open redirect). */
function safeNext(next: string | null): string {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard/";
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const next = safeNext(searchParams.get("next"));

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data.user) {
      await claimPendingLead(data.user.id);
      return NextResponse.redirect(`${origin}${next}`);
    }
  }
  return NextResponse.redirect(`${origin}/login/?error=auth`);
}
