/**
 * Reference-ID generator (M1). Ported from boc3-form-new's KV daily counter.
 * Format `DGR-YYYYMMDD-NNN` (ADR-6: keep the DGR prefix to stay consistent with
 * existing live records). The date stamp is US Eastern, matching the legacy
 * counter so the same per-day KV key is shared with in-flight legacy records.
 */
import "server-only";

function easternDateStamp(): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return `${get("year")}${get("month")}${get("day")}`;
}

/** Atomically allocate the next `DGR-YYYYMMDD-NNN` reference for today. */
export async function nextReferenceId(): Promise<string> {
  const stamp = easternDateStamp();
  const counterKey = `dgr-order-counter-${stamp}`;
  try {
    const { kv } = await import("@vercel/kv");
    const n = await kv.incr(counterKey);
    return `DGR-${stamp}-${String(n).padStart(3, "0")}`;
  } catch (error) {
    console.error("KV reference counter failed; using fallback:", error);
    const fallback = `${Date.now()}`.slice(-9);
    return `DGR-${stamp}-${fallback}`;
  }
}
