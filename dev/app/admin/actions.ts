"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getAdminUser } from "@/lib/server/admin";
import { transitionFiling } from "@/lib/server/filing-transition";

/** Advance a filing's status from the back-office board. Admin-gated server-side. */
export async function adminTransition(filingId: string, formData: FormData) {
  const admin = await getAdminUser();
  if (!admin) redirect("/login/?next=/admin/");
  const to = formData.get("to_status");
  const note = typeof formData.get("note") === "string" ? (formData.get("note") as string) : null;
  await transitionFiling(admin.id, filingId, to, note);
  revalidatePath("/admin/");
}
