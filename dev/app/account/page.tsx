import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { AppShell } from "@/components/app-shell";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { updateProfile } from "./actions";

// Authed, noindex (ADR-5).
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Account",
  robots: { index: false, follow: false },
};

export default async function AccountPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login/?next=/account/");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, phone, email")
    .eq("id", user.id)
    .maybeSingle();

  const inputClass =
    "mt-1.5 w-full rounded-btn border border-slate/25 bg-paper px-3 py-2.5 text-ink outline-none placeholder:text-slate/60 focus-visible:border-steel focus-visible:ring-2 focus-visible:ring-steel/40";

  return (
    <AppShell email={user.email ?? ""} active="account">
      <h1 className="font-display text-3xl font-extrabold tracking-[-0.02em] text-ink">Account</h1>
      <p className="mt-2 text-slate">Your contact details for filings and updates.</p>

      <form action={updateProfile} className="mt-8 max-w-md space-y-5">
        <div>
          <label htmlFor="full_name" className="text-sm font-medium text-ink">
            Full name
          </label>
          <input
            id="full_name"
            name="full_name"
            type="text"
            autoComplete="name"
            defaultValue={profile?.full_name ?? ""}
            placeholder="Your name"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="phone" className="text-sm font-medium text-ink">
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            defaultValue={profile?.phone ?? ""}
            placeholder="(555) 555-5555"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="email" className="text-sm font-medium text-ink">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={profile?.email ?? user.email ?? ""}
            readOnly
            disabled
            className={`${inputClass} cursor-not-allowed text-slate`}
          />
          <p className="mt-1 text-xs text-slate">Email is your sign-in and can&apos;t be changed here.</p>
        </div>
        <button type="submit" className={buttonVariants({ variant: "primary", size: "md" })}>
          Save changes
        </button>
      </form>
    </AppShell>
  );
}
