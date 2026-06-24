"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/** Update the signed-in user's profile (name, phone). Email is read-only. */
export async function updateProfile(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const full_name = String(formData.get("full_name") || "").trim() || null;
  const phone = String(formData.get("phone") || "").trim() || null;

  // RLS permits the owner to update only their own profile row.
  await supabase.from("profiles").update({ full_name, phone }).eq("id", user.id);
  revalidatePath("/account/");
}
