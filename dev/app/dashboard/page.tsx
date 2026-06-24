import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { AppShell } from "@/components/app-shell";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// Authed, noindex (ADR-5). Dynamic: reads the session + the user's data.
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

type LeadRow = {
  id: string;
  usdot_number: string | null;
  lookup_status: string | null;
  created_at: string;
  carrier_snapshots: { data_json: { legalName?: string | null; authorityStatus?: string | null } | null }[] | null;
};

function fmtDate(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" });
}

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login/?next=/dashboard/");

  // RLS scopes these to the signed-in user's own rows.
  const { data } = await supabase
    .from("leads")
    .select("id, usdot_number, lookup_status, created_at, carrier_snapshots(data_json)")
    .order("created_at", { ascending: false });
  const lookups = (data ?? []) as LeadRow[];

  return (
    <AppShell email={user.email ?? ""} active="dashboard">
      <h1 className="font-display text-3xl font-extrabold tracking-[-0.02em] text-ink">Your dashboard</h1>
      <p className="mt-2 text-slate">Your saved USDOT lookups and your filings, in one place.</p>

      {/* Saved lookups */}
      <section className="mt-8">
        <h2 className="font-display text-xl font-bold text-ink">Saved lookups</h2>
        {lookups.length === 0 ? (
          <div className="mt-4 rounded-card border border-slate/15 bg-cloud p-6">
            <p className="text-slate">
              You haven&apos;t saved a lookup yet. Look up a USDOT number on the{" "}
              <Link
                href="/"
                className="font-medium text-steel underline-offset-4 hover:underline"
              >
                home page
              </Link>{" "}
              and choose &ldquo;Save and track&rdquo; to keep it here.
            </p>
          </div>
        ) : (
          <ul className="mt-4 space-y-3">
            {lookups.map((lead) => {
              const snap = lead.carrier_snapshots?.[0]?.data_json ?? null;
              return (
                <li
                  key={lead.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-card border border-slate/15 bg-cloud p-4"
                >
                  <div>
                    <p className="font-display font-semibold text-ink">
                      {snap?.legalName ?? `USDOT ${lead.usdot_number ?? ""}`}
                    </p>
                    <p className="mt-0.5 font-mono text-xs text-slate">
                      USDOT {lead.usdot_number ?? "—"}
                      {snap?.authorityStatus ? ` · ${snap.authorityStatus}` : ""} · {fmtDate(lead.created_at)}
                    </p>
                  </div>
                  {lead.usdot_number ? (
                    <Link
                      href={`/lookup/${lead.usdot_number}/`}
                      className="font-medium text-steel underline-offset-4 hover:underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
                    >
                      View docket
                    </Link>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* Applications (empty until M3) */}
      <section className="mt-10">
        <h2 className="font-display text-xl font-bold text-ink">Applications</h2>
        <div className="mt-4 rounded-card border border-slate/15 bg-cloud p-6">
          <p className="text-slate">
            You don&apos;t have any applications yet. When you&apos;re ready to get road-legal, start
            with your USDOT and authority filings.
          </p>
          <Link
            href="/dot-registration/"
            className={`${buttonVariants({ variant: "primary", size: "md" })} mt-4`}
          >
            Start an application
          </Link>
        </div>
      </section>
    </AppShell>
  );
}
