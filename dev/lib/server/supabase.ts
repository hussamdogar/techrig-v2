/**
 * Supabase clients (M1). Reuses the existing live Supabase project (ADR-6) via
 * env. Two server-side clients:
 *  - service(): full-access service-role client for trusted server routes
 *    (the lookup endpoint's lead/snapshot inserts, and admin). NEVER import this
 *    into a client component or expose the key to the browser.
 *  - anon(): anon-key client for RLS-scoped access (future SSR/client paths).
 */
import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let serviceClient: SupabaseClient | null = null;
let anonClient: SupabaseClient | null = null;

/** Service-role client (bypasses RLS). Server-only, trusted routes/admin. */
export function service(): SupabaseClient {
  if (!url || !serviceKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  }
  if (!serviceClient) {
    serviceClient = createClient(url, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  return serviceClient;
}

/** Anon-key client (RLS-scoped). */
export function anon(): SupabaseClient {
  if (!url || !anonKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  }
  if (!anonClient) {
    anonClient = createClient(url, anonKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  return anonClient;
}
