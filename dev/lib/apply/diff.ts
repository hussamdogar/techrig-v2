/**
 * Carrier pre-fill diff + OA-aware facts (M3 §6). Ported from boc3-form-new
 * `shared/motus-diff.ts` and extended to read the R3 operating-authority detail
 * the snapshot now carries. Pure logic (no MOTUS re-fetch in M3 — read the
 * immutable carrier_snapshots.data_json).
 */
import type { CarrierData } from "@/lib/lookup/types";
import type { ServiceKey } from "@/lib/services-registry";

export type DiffEntry = {
  field: string;
  label: string;
  snapshotValue: string | null;
  userValue: string | null;
  changed: boolean;
};

const norm = (v: unknown) => String(v ?? "").trim();

const DIFF_FIELDS: { field: string; label: string; snap: (c: CarrierData) => unknown }[] = [
  { field: "company_legal_name", label: "Company name", snap: (c) => c.legalName },
  { field: "usdot_number", label: "USDOT number", snap: (c) => c.usdotNumber },
  { field: "physical_address", label: "Physical address", snap: (c) => c.physicalAddress },
  { field: "power_units", label: "Power units", snap: (c) => c.powerUnits },
];

/** Diff the user's carrier-identity values against the immutable snapshot. */
export function buildCarrierDiff(
  snapshot: CarrierData | null,
  user: Record<string, unknown>,
): { changed: boolean; diff: DiffEntry[] } {
  if (!snapshot) return { changed: false, diff: [] };
  const entries = DIFF_FIELDS.map((f): DiffEntry => {
    const snapshotValue = norm(f.snap(snapshot)) || null;
    const userValue = norm(user[f.field]) || null;
    return {
      field: f.field,
      label: f.label,
      snapshotValue,
      userValue,
      changed: userValue !== null && norm(snapshotValue) !== norm(userValue),
    };
  });
  return { changed: entries.some((e) => e.changed), diff: entries.filter((e) => e.changed) };
}

/** An MCS-150 update is implied when carrier data changed and it is not already selected. */
export function computeNeedsMcs150(changed: boolean, selected: ServiceKey[]): boolean {
  return changed && !selected.includes("mcs-150");
}

export type CarrierFacts = {
  hasActiveMc: boolean;
  hasActiveBoc3: boolean;
  hasActiveInsurance: boolean;
  mcDocket: string | null;
  biennialDueDate: string | null;
  biennialDueSoon: boolean;
};

/** What the carrier already HAS, from the R3 operating-authority detail. Drives
 *  service pre-selection hints (e.g. do not push BOC-3 if a blanket filing is active). */
export function carrierFacts(snapshot: CarrierData | null): CarrierFacts {
  const oas = snapshot?.operatingAuthorities ?? [];
  const active = (s: string | null) => /active/i.test(s || "");
  const biennialDueDate = snapshot?.biennialDueDate ?? null;
  let biennialDueSoon = false;
  if (biennialDueDate) {
    const due = new Date(biennialDueDate).getTime();
    if (!Number.isNaN(due)) biennialDueSoon = due - Date.now() < 1000 * 60 * 60 * 24 * 90; // 90 days
  }
  return {
    hasActiveMc: oas.some((o) => active(o.status)),
    hasActiveBoc3: oas.some((o) => o.boc3.some((b) => active(b.status))),
    hasActiveInsurance: oas.some((o) => o.insurance.some((f) => active(f.status))),
    mcDocket: oas.find((o) => o.docketNumber)?.docketNumber ?? null,
    biennialDueDate,
    biennialDueSoon,
  };
}
