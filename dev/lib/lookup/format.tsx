/**
 * Shared carrier-record display formatting (M1 R1, extracted for the quick-buy
 * confirm screens). Used by `/lookup/[usdot]/` (the full docket) and
 * `/buy/[service]/[usdot]/` (the curated confirm subset) so both surfaces render
 * the same value exactly the same way. Every null shows "Not on file"
 * (standards.md, never fabricated).
 */

export function text(v: string | number | null | undefined): string | null {
  if (v === null || v === undefined || v === "") return null;
  return String(v);
}
export function bool(v: boolean | null | undefined): string | null {
  if (v === null || v === undefined) return null;
  return v ? "Yes" : "No";
}
export function date(v: string | null | undefined): string | null {
  if (!v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime())
    ? text(v)
    : d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" });
}
export function money(v: string | null | undefined): string | null {
  if (!v) return null;
  const n = Number(v);
  return Number.isNaN(n) ? text(v) : `$${n.toLocaleString("en-US")}`;
}

export function Row({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <dt className="text-sm text-slate">{label}</dt>
      <dd className="text-right text-sm font-medium text-ink">
        {value === null ? <span className="text-slate">Not on file</span> : value}
      </dd>
    </div>
  );
}

export function DocketSection({ title, rows }: { title: string; rows: { label: string; value: string | null }[] }) {
  return (
    <div className="rounded-card border border-slate/15 bg-cloud p-5">
      <h2 className="font-display text-lg font-bold text-ink">{title}</h2>
      <dl className="mt-2 divide-y divide-slate/10">
        {rows.map((r) => (
          <Row key={r.label} label={r.label} value={r.value} />
        ))}
      </dl>
    </div>
  );
}
