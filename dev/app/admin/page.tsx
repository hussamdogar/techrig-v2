import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Container, Section } from "@/components/ui/container";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getAdminUser } from "@/lib/server/admin";
import { service } from "@/lib/server/supabase";
import { ALLOWED_TRANSITIONS, STATUS_COPY, isFilingStatus, type FilingStatus } from "@/lib/apply/filing-status";
import { adminTransition } from "./actions";

// Admin-only, noindex (ADR-5).
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Back office",
  robots: { index: false, follow: false },
};

type Filing = { id: string; service_name: string; status: string; price_amount: number | null; expected_timeline: string | null };
type AppRow = {
  id: string;
  reference_id: string | null;
  status: string;
  company_legal_name: string | null;
  usdot_number: string | null;
  total_amount: number | null;
  needs_mcs150_update: boolean;
  carrier_user_diff_json: { label: string }[] | null;
  updated_at: string;
  filings: Filing[];
  payments: { status: string }[];
};

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  // Server-side privilege gate (admin_users; never a client claim).
  const admin = await getAdminUser();
  if (!admin) redirect("/dashboard/");
  const { status: statusFilter } = await searchParams;

  // Admin reads all (service role, after the gate above).
  const { data } = await service()
    .from("applications")
    .select(
      "id, reference_id, status, company_legal_name, usdot_number, total_amount, needs_mcs150_update, carrier_user_diff_json, updated_at, filings(id, service_name, status, price_amount, expected_timeline), payments(status)",
    )
    .order("updated_at", { ascending: false })
    .limit(100);
  let apps = (data ?? []) as AppRow[];
  if (statusFilter && isFilingStatus(statusFilter)) {
    apps = apps.filter((a) => a.filings?.some((f) => f.status === statusFilter));
  }

  return (
    <Section surface="paper" className="pt-8 md:pt-10">
      <Container className="max-w-5xl">
        <div className="flex items-center justify-between gap-4">
          <h1 className="font-display text-3xl font-extrabold tracking-[-0.02em] text-ink">Back office</h1>
          <span className="font-mono text-xs text-slate">{admin.email}</span>
        </div>

        {/* Status filter */}
        <div className="mt-5 flex flex-wrap gap-2 text-xs">
          <a href="/admin/" className={cn("rounded-chip border px-2 py-1", !statusFilter ? "border-ink text-ink" : "border-slate/30 text-slate")}>
            All
          </a>
          {(Object.keys(STATUS_COPY) as FilingStatus[]).map((s) => (
            <a
              key={s}
              href={`/admin/?status=${s}`}
              className={cn("rounded-chip border px-2 py-1", statusFilter === s ? "border-ink text-ink" : "border-slate/30 text-slate")}
            >
              {STATUS_COPY[s].label}
            </a>
          ))}
        </div>

        <div className="mt-6 space-y-4">
          {apps.length === 0 ? (
            <p className="text-slate">No applications{statusFilter ? " with that filing status" : ""} yet.</p>
          ) : (
            apps.map((a) => (
              <div key={a.id} className="rounded-card border border-slate/15 bg-cloud p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-sm font-semibold text-ink">{a.reference_id ?? a.id.slice(0, 8)}</p>
                    <p className="mt-0.5 text-sm text-ink">
                      {a.company_legal_name ?? "—"} · USDOT {a.usdot_number ?? "—"}
                    </p>
                    <p className="mt-0.5 text-xs text-slate">
                      App: {a.status.replace(/_/g, " ")}
                      {a.payments?.some((p) => p.status === "paid") ? " · paid" : " · unpaid"}
                      {a.total_amount != null ? ` · $${Number(a.total_amount).toLocaleString("en-US")}` : ""}
                    </p>
                  </div>
                  {a.needs_mcs150_update || (a.carrier_user_diff_json?.length ?? 0) > 0 ? (
                    <span className="rounded-chip bg-signal/15 px-2 py-1 text-xs font-medium text-ink">
                      {a.needs_mcs150_update ? "MCS-150 implied" : "Carrier data changed"}
                    </span>
                  ) : null}
                </div>

                <ul className="mt-4 divide-y divide-slate/10">
                  {(a.filings ?? []).map((f) => {
                    const from = f.status as FilingStatus;
                    const nexts = ALLOWED_TRANSITIONS[from] ?? [];
                    return (
                      <li key={f.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                        <div>
                          <p className="text-sm font-medium text-ink">{f.service_name}</p>
                          <p className="text-xs text-slate">
                            {STATUS_COPY[from]?.label ?? from}
                            {f.expected_timeline ? ` · ${f.expected_timeline}` : ""}
                          </p>
                        </div>
                        {nexts.length > 0 ? (
                          <form action={adminTransition.bind(null, f.id)} className="flex items-center gap-2">
                            <select name="to_status" className="rounded-btn border border-slate/25 bg-paper px-2 py-1.5 text-sm text-ink">
                              {nexts.map((n) => (
                                <option key={n} value={n}>
                                  → {STATUS_COPY[n].label}
                                </option>
                              ))}
                            </select>
                            <input
                              name="note"
                              placeholder="Note (optional)"
                              className="w-40 rounded-btn border border-slate/25 bg-paper px-2 py-1.5 text-sm text-ink"
                            />
                            <button type="submit" className={cn(buttonVariants({ variant: "secondary", size: "sm" }))}>
                              Advance
                            </button>
                          </form>
                        ) : (
                          <span className="text-xs text-slate">No further action</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))
          )}
        </div>
      </Container>
    </Section>
  );
}
