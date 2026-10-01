import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Container, Section } from "@/components/ui/container";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getAdminUser } from "@/lib/server/admin";
import { service } from "@/lib/server/supabase";
import { BUSINESS_TIME_ZONE, OFFLINE_CONVERSION_NAMES } from "@/lib/server/offline-conversions";
import { recordOfflineSale } from "./actions";

// Admin-only, noindex (ADR-5).
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Offline sales",
  robots: { index: false, follow: false },
};

const ERRORS: Record<string, string> = {
  method: "Choose how the customer reached us.",
  value: "Enter the sale value (your fee, in dollars).",
  sold_at: "Enter a valid sale date and time (not in the future).",
  reference: "No lead or order found with that reference number.",
  already_paid:
    "That order was already paid on the website, so Google Ads already counted it. If this is a separate, additional sale to the same customer, leave the reference blank and use the caller's number or their email instead.",
  caller_phone: "Enter the caller's phone number from your call log, including area code.",
  call_started_at: "Enter when the call started (it must be before the sale).",
  no_identifier:
    "Nothing to match this sale to an ad. Add the lead/order reference, or the customer's email or phone.",
  save: "Could not save the sale. Try again.",
};

type SaleRow = {
  id: string;
  match_method: "call" | "click";
  reference_id: string | null;
  caller_phone: string | null;
  gclid: string | null;
  email: string | null;
  phone: string | null;
  sold_at: string;
  value: number;
  notes: string | null;
  exported_at: string | null;
};

/** "YYYY-MM-DDTHH:mm" for now in the business time zone (datetime-local default). */
function nowInBusinessTime(): string {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: BUSINESS_TIME_ZONE,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
      .formatToParts(new Date())
      .map((x) => [x.type, x.value]),
  );
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}`;
}

const fmtDate = (iso: string) =>
  new Intl.DateTimeFormat("en-US", { timeZone: BUSINESS_TIME_ZONE, dateStyle: "medium", timeStyle: "short" }).format(
    new Date(iso),
  );

const inputClass = "mt-1 w-full rounded-btn border border-slate/25 bg-paper px-3 py-2 text-sm text-ink";
const labelClass = "block text-sm font-medium text-ink";
const hintClass = "mt-1 text-xs text-slate";

/**
 * Back office: record sales Google Ads can't see on its own (phone sales and
 * follow-up sales) and download them as Google Ads upload files. See
 * lib/server/offline-conversions.ts for the matching rules and formats.
 */
export default async function OfflineSalesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  const admin = await getAdminUser();
  if (!admin) redirect("/dashboard/");
  const { error, saved } = await searchParams;

  const db = service();
  const { data } = await db
    .from("offline_conversions")
    .select("id, match_method, reference_id, caller_phone, gclid, email, phone, sold_at, value, notes, exported_at")
    .order("sold_at", { ascending: false })
    .limit(50);
  const sales = (data ?? []) as SaleRow[];
  const pending = (m: "call" | "click") => sales.filter((s) => s.match_method === m && !s.exported_at).length;

  return (
    <Section surface="paper" className="pt-8 md:pt-10">
      <Container className="max-w-3xl">
        <div className="flex items-center justify-between gap-4">
          <h1 className="font-display text-3xl font-extrabold tracking-[-0.02em] text-ink">Offline sales</h1>
          <Link href="/admin/" className="text-sm text-steel underline-offset-4 hover:underline">
            Back office
          </Link>
        </div>
        <p className="mt-2 text-slate">
          Record every sale that closed by phone or after a follow-up, then upload the files to Google Ads each week
          (Goals, then Uploads). Sales paid on the website are counted automatically; don&apos;t record those here.
        </p>

        {error && ERRORS[error] ? (
          <p className="mt-5 rounded-card border border-signal/40 bg-signal/10 p-3 text-sm text-ink">{ERRORS[error]}</p>
        ) : null}
        {saved ? (
          <p className="mt-5 rounded-card border border-status-active/40 bg-status-active/10 p-3 text-sm text-ink">
            Sale recorded.
          </p>
        ) : null}

        {/* Record a sale */}
        <form action={recordOfflineSale} className="mt-6 space-y-5 rounded-card border border-slate/15 bg-cloud p-5">
          <h2 className="font-display text-lg font-bold text-ink">Record a sale</h2>

          <fieldset>
            <legend className={labelClass}>How did this customer reach us?</legend>
            <div className="mt-2 space-y-2 text-sm text-ink">
              <label className="flex items-start gap-2">
                <input type="radio" name="match_method" value="call" required className="mt-1" />
                <span>
                  <strong>They called us</strong> (from an ad or the website), and bought on the call or later.
                </span>
              </label>
              <label className="flex items-start gap-2">
                <input type="radio" name="match_method" value="click" className="mt-1" />
                <span>
                  <strong>Website lead we followed up</strong> (entered their USDOT or details online), and bought
                  later.
                </span>
              </label>
            </div>
          </fieldset>

          <div>
            <label htmlFor="reference_id" className={labelClass}>
              Lead / order reference <span className="font-normal text-slate">(if they used the website)</span>
            </label>
            <input id="reference_id" name="reference_id" placeholder="DGR-20261001-012" className={inputClass} />
            <p className={hintClass}>
              From the lead alert email or the order. Pulls in the ad click and contact details saved for it.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="caller_phone" className={labelClass}>
                Caller&apos;s phone number <span className="font-normal text-slate">(phone sales)</span>
              </label>
              <input id="caller_phone" name="caller_phone" inputMode="tel" placeholder="(555) 123-4567" className={inputClass} />
              <p className={hintClass}>Exactly as it appears in your call log.</p>
            </div>
            <div>
              <label htmlFor="call_started_at" className={labelClass}>
                When the call started <span className="font-normal text-slate">(Eastern)</span>
              </label>
              <input id="call_started_at" name="call_started_at" type="datetime-local" className={inputClass} />
              <p className={hintClass}>From the call log, to the minute.</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="email" className={labelClass}>
                Customer email <span className="font-normal text-slate">(optional)</span>
              </label>
              <input id="email" name="email" type="email" className={inputClass} />
            </div>
            <div>
              <label htmlFor="phone" className={labelClass}>
                Customer phone <span className="font-normal text-slate">(optional)</span>
              </label>
              <input id="phone" name="phone" inputMode="tel" className={inputClass} />
            </div>
          </div>
          <p className={hintClass}>
            Only needed for a website lead with no reference. Leave blank if the reference above is filled in.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="sold_at" className={labelClass}>
                Sale date and time <span className="font-normal text-slate">(Eastern)</span>
              </label>
              <input
                id="sold_at"
                name="sold_at"
                type="datetime-local"
                required
                defaultValue={nowInBusinessTime()}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="value" className={labelClass}>
                Sale value, USD
              </label>
              <input id="value" name="value" type="number" min="1" step="0.01" required className={inputClass} />
              <p className={hintClass}>Your fee only, without government fees (e.g. UCR&apos;s $46).</p>
            </div>
          </div>

          <div>
            <label htmlFor="notes" className={labelClass}>
              Notes <span className="font-normal text-slate">(optional, internal)</span>
            </label>
            <input id="notes" name="notes" placeholder="e.g. BOC-3 + UCR" className={inputClass} />
          </div>

          <button type="submit" className={cn(buttonVariants({ variant: "primary", size: "md" }))}>
            Record sale
          </button>
        </form>

        {/* Weekly export */}
        <div className="mt-8 rounded-card border border-slate/15 bg-cloud p-5">
          <h2 className="font-display text-lg font-bold text-ink">Download for Google Ads</h2>
          <p className="mt-1 text-sm text-slate">
            Upload each file in Google Ads under Goals, then Uploads. Each sale is in exactly one file. Conversion
            action names in Google Ads must match exactly: &ldquo;{OFFLINE_CONVERSION_NAMES.call}&rdquo; and &ldquo;
            {OFFLINE_CONVERSION_NAMES.click}&rdquo;.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {(
              [
                ["call", "Phone sales", "conversions from calls"],
                ["click", "Follow-up sales", "conversions from clicks"],
              ] as const
            ).map(([kind, label, googleType]) => (
              <form key={kind} action="/admin/sales/export/" method="post" className="rounded-card border border-slate/15 bg-paper p-4">
                <input type="hidden" name="kind" value={kind} />
                <p className="text-sm font-medium text-ink">{label}</p>
                <p className="text-xs text-slate">
                  Google upload type: {googleType}. {pending(kind)} new since the last download.
                </p>
                <label className="mt-2 flex items-center gap-2 text-xs text-slate">
                  <input type="checkbox" name="include_exported" value="1" /> Include already-downloaded sales
                </label>
                <button type="submit" className={cn(buttonVariants({ variant: "secondary", size: "sm" }), "mt-3")}>
                  Download CSV
                </button>
              </form>
            ))}
          </div>
        </div>

        {/* Recorded sales */}
        <h2 className="mt-10 font-display text-2xl font-extrabold tracking-[-0.02em] text-ink">Recorded sales</h2>
        <ul className="mt-4 divide-y divide-slate/10 rounded-card border border-slate/15 bg-cloud">
          {sales.length === 0 ? (
            <li className="p-4 text-sm text-slate">No offline sales recorded yet.</li>
          ) : (
            sales.map((s) => (
              <li key={s.id} className="flex flex-wrap items-start justify-between gap-3 p-4">
                <div>
                  <p className="text-sm font-medium text-ink">
                    ${Number(s.value).toLocaleString("en-US")} · {s.match_method === "call" ? "Phone sale" : "Follow-up sale"}
                    {s.reference_id ? <span className="font-mono text-xs text-slate"> · {s.reference_id}</span> : null}
                  </p>
                  <p className="text-xs text-slate">
                    {fmtDate(s.sold_at)} · matched by{" "}
                    {s.match_method === "call"
                      ? `caller ${s.caller_phone}`
                      : [s.gclid ? "ad click" : null, s.email ? "email" : null, s.phone ? "phone" : null]
                          .filter(Boolean)
                          .join(" + ")}
                    {s.notes ? ` · ${s.notes}` : ""}
                  </p>
                </div>
                <span
                  className={cn(
                    "rounded-chip px-2 py-1 text-xs",
                    s.exported_at ? "bg-status-active/12 text-status-active" : "bg-signal/15 text-ink",
                  )}
                >
                  {s.exported_at ? "Downloaded" : "Not downloaded yet"}
                </span>
              </li>
            ))
          )}
        </ul>
      </Container>
    </Section>
  );
}
