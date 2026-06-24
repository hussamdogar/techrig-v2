import Link from "next/link";
import { AuthorityStatusTracker } from "@/components/authority-status-tracker";
import { buttonVariants } from "@/components/ui/button";
import { STATUS_COPY, buildTrackerSteps, isFilingStatus, type FilingStatus } from "@/lib/apply/filing-status";

/**
 * Client-facing progress (M5 §5). For a paid application: each filing's real
 * status (plain-language label + meaning) with the AuthorityStatusTracker mapped
 * to its lifecycle stage, plus a timeline of the client-visible events. Honest:
 * shows the actual status, "needs your input" when awaiting_info, etc. No
 * fabricated timelines — the registry's expected timeline is shown as guidance.
 */
type Filing = { id: string; service_name: string; status: string; expected_timeline: string | null };
type Event = { to_status: string; note: string | null; created_at: string };

function fmtDate(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" });
}

export function ClientProgress({
  app,
  filings,
  events,
}: {
  app: { reference_id: string | null; company_legal_name: string | null; usdot_number: string | null; needs_mcs150_update: boolean };
  filings: Filing[];
  events: Event[];
}) {
  return (
    <>
      <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-slate">
        Application · {app.reference_id ?? ""}
      </p>
      <h1 className="mt-1 font-display text-3xl font-extrabold tracking-[-0.02em] text-ink">Your filings</h1>
      <p className="mt-2 text-slate">
        {app.company_legal_name ?? "Your carrier"} · USDOT {app.usdot_number ?? "—"}. Here&apos;s where each filing
        stands.
      </p>

      {app.needs_mcs150_update ? (
        <div className="mt-6 flex flex-col gap-3 rounded-card border border-signal/40 bg-signal/10 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-ink">Your details differ from the FMCSA record, so an MCS-150 update may be needed.</p>
          <Link href="/apply/" className={`${buttonVariants({ variant: "primary", size: "sm" })} shrink-0`}>
            Add MCS-150 update
          </Link>
        </div>
      ) : null}

      <div className="mt-7 space-y-5">
        {filings.map((f) => {
          const status = (isFilingStatus(f.status) ? f.status : "not_started") as FilingStatus;
          return (
            <div key={f.id} className="rounded-card border border-slate/15 bg-cloud p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="font-display text-lg font-bold text-ink">{f.service_name}</h2>
                <span className="font-mono text-xs uppercase tracking-[0.08em] text-steel">{STATUS_COPY[status].label}</span>
              </div>
              <p className="mt-1 text-sm text-slate">{STATUS_COPY[status].meaning}</p>
              <div className="mt-4">
                <AuthorityStatusTracker steps={buildTrackerSteps(status)} />
              </div>
              {f.expected_timeline ? (
                <p className="mt-3 text-xs text-slate">Typical timeline: {f.expected_timeline} (guidance, not a guarantee).</p>
              ) : null}
            </div>
          );
        })}
      </div>

      {events.length > 0 ? (
        <div className="mt-8 rounded-card border border-slate/15 bg-cloud p-5">
          <h2 className="font-display text-lg font-bold text-ink">Activity</h2>
          <ul className="mt-3 space-y-3">
            {events.map((e, i) => {
              const to = isFilingStatus(e.to_status) ? e.to_status : null;
              return (
                <li key={i} className="flex items-start justify-between gap-4 text-sm">
                  <span className="text-ink">
                    {to ? STATUS_COPY[to].label : e.to_status}
                    {e.note ? <span className="block text-xs text-slate">{e.note}</span> : null}
                  </span>
                  <span className="shrink-0 font-mono text-xs text-slate">{fmtDate(e.created_at)}</span>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      <p className="mt-6 text-sm">
        <Link href="/dashboard/" className="font-medium text-steel underline-offset-4 hover:underline">
          Back to dashboard
        </Link>
      </p>
    </>
  );
}
