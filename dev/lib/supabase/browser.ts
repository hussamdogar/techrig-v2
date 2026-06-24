"use client";

import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser Supabase client (M2 auth). Used by the login form to request a
 * magic link. ANON key only; the service role never reaches the browser.
 */
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
