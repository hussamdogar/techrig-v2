import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Session refresh + authed-route guard (M2). Runs in middleware: refreshes the
 * Supabase session cookie on each matched request, and redirects unauthenticated
 * users away from /dashboard and /account to /login (preserving where they were
 * headed via ?next=). Only the authed + auth routes are matched (see
 * middleware.ts), so the static marketing site is untouched.
 */
export async function updateSession(request: NextRequest): Promise<NextResponse> {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    },
  );

  // IMPORTANT: getUser() (not getSession) revalidates the token with Supabase.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  // Auth refresh + login redirect for authed routes. The /admin ROLE check is
  // enforced server-side in the admin pages/API (getAdminUser), not here.
  const isProtected = path.startsWith("/dashboard") || path.startsWith("/account") || path.startsWith("/admin");
  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }

  return response;
}
