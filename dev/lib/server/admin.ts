import "server-only";
import { service } from "@/lib/server/supabase";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { User } from "@supabase/supabase-js";

/**
 * Back-office authorization (M5 §1). The privilege boundary: admin membership
 * lives in `admin_users`, which clients cannot read or write (RLS, no policy).
 * isAdmin() reads it ONLY via the service role, server-side. Never trust a
 * client-supplied role claim, and never put role in client-editable state.
 */
export async function isAdmin(userId: string): Promise<boolean> {
  try {
    const { data } = await service().from("admin_users").select("user_id").eq("user_id", userId).maybeSingle();
    return !!data;
  } catch (error) {
    console.error("admin check failed:", error instanceof Error ? error.message : error);
    return false;
  }
}

/** The signed-in user IF they are an admin, else null. Server-side only. */
export async function getAdminUser(): Promise<User | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  return (await isAdmin(user.id)) ? user : null;
}
