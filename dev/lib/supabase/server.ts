import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

/**
 * Cookie-aware Supabase client for Server Components, Route Handlers, and Server
 * Actions (M2 auth). Uses the ANON key + the user's session cookies, so RLS
 * applies as that user. The service-role client (lib/server/supabase.ts) stays
 * separate for trusted server-only writes; never use it for user-scoped reads.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // Called from a Server Component (cookies are read-only there); the
            // middleware refreshes the session cookie instead. Safe to ignore.
          }
        },
      },
    },
  );
}
