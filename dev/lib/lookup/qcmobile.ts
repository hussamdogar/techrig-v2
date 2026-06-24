/**
 * FMCSA QCMobile provider (backup, ADR-7). Official API:
 *   GET https://mobile.fmcsa.dot.gov/qc/services/carriers/{usdot}?webKey={key}
 * Requires a free `FMCSA_WEBKEY` (the one new credential for M1). The response is
 * normalized into the SAME CarrierData shape as MOTUS so the card/DB are
 * provider-agnostic. QCMobile does not return every MOTUS field (MC number,
 * matrix flags); those are left null and render as "Not on file" (standards.md).
 */
import type { CarrierData } from "./types";

const QC_BASE = "https://mobile.fmcsa.dot.gov/qc/services";

// QCMobile safety-rating codes → readable labels.
const SAFETY_RATING: Record<string, string> = {
  S: "Satisfactory",
  C: "Conditional",
  U: "Unsatisfactory",
};

function num(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return Number.isNaN(n) ? null : n;
}

function str(value: unknown): string | null {
  if (typeof value === "string" && value.trim() !== "") return value.trim();
  if (typeof value === "number") return String(value);
  return null;
}

function qcAddress(c: any): string | null {
  const street = str(c?.phyStreet);
  const tail = [c?.phyCity, c?.phyState, c?.phyZipcode].filter(Boolean).join(", ");
  return [street, tail].filter(Boolean).join(", ") || null;
}

/** Normalize a QCMobile `content.carrier` object into CarrierData. */
export function normalizeQcMobileResponse(response: any): CarrierData {
  const c = response?.content?.carrier;
  if (!c || typeof c !== "object") {
    throw new Error("Carrier data was not found in the QCMobile response.");
  }

  const safetyCode = str(c?.safetyRating);
  const bipdOnFile = num(c?.bipdInsuranceOnFile);
  const statusCode = str(c?.statusCode);

  return {
    entityId: null,
    legalName: str(c?.legalName),
    dbaName: str(c?.dbaName),
    usdotNumber: num(c?.dotNumber),
    mcNumber: null, // QCMobile carrier endpoint does not return the MC docket
    physicalAddress: qcAddress(c),
    entityType: str(c?.carrierOperation?.carrierOperationDesc),
    authorityStatus: statusCode === "A" ? "Active" : statusCode === "I" ? "Inactive" : null,
    safetyRating: safetyCode ? (SAFETY_RATING[safetyCode] ?? safetyCode) : null,
    insuranceOnFile: bipdOnFile === null ? null : bipdOnFile > 0 ? "Yes" : "No",
    allowedToOperate: str(c?.allowedToOperate) === "Y" ? "Yes" : str(c?.allowedToOperate) === "N" ? "No" : null,
    powerUnits: num(c?.totalPowerUnits),
    // R3 fields: the QCMobile carrier endpoint does not expose the operating-
    // authority view, MCS-150 dates, or filings, so these are null/empty on the
    // backup path. The backup only answers when MOTUS is unreachable entirely.
    usdotStatus: statusCode === "A" ? "Active" : statusCode === "I" ? "Inactive" : null,
    mcs150Date: null,
    biennialDueDate: null,
    mcs150Mileage: null,
    mcs150MileageYear: null,
    recentMileage: null,
    recentMileageYear: null,
    safetyRatingDate: null,
    operatingAuthorities: [],
    contactFirstName: null,
    contactLastName: null,
    contactPhone: str(c?.telephone),
    contactEmail: null,
    driverTotal: num(c?.totalDrivers),
    cdlDriverTotal: null,
    businessType: null,
    registrationType: str(c?.carrierOperation?.carrierOperationDesc),
    isInterstate: c?.carrierOperation?.carrierOperationCode === "A" ? true : null,
    isIntrastate: null,
    isForHire: null,
    isPrivate: null,
    canDesignateBoc3: null,
    insuranceRequired: (() => {
      const req = num(c?.bipdInsuranceRequired);
      return req === null ? null : req > 0;
    })(),
    hasProtestPeriod: null,
    isNewEntrant: null,
    equipmentSummary: { truckTractors: 0, straightTrucks: 0, trailers: 0, nonCommercialVehicles: 0 },
    reportedPoweredVehicles: num(c?.totalPowerUnits) ?? 0,
    cdlLikely: false,
    cdlSignalReason: null,
    operationType: str(c?.carrierOperation?.carrierOperationDesc),
    source: "qcmobile",
    raw: response,
  };
}

/**
 * Fetch a carrier from QCMobile. Returns null only for a CLEAN not-found (404 or
 * empty content); THROWS when the backup is unavailable (no webKey configured,
 * or a transport/server error) so the orchestrator counts that as "unavailable",
 * not "no such carrier".
 */
export async function fetchQcMobileCarrier(
  usdot: string,
  signal: AbortSignal,
): Promise<CarrierData | null> {
  const webKey = process.env.FMCSA_WEBKEY;
  if (!webKey) throw new Error("QCMobile webKey (FMCSA_WEBKEY) is not configured");

  const res = await fetch(
    `${QC_BASE}/carriers/${encodeURIComponent(usdot)}?webKey=${encodeURIComponent(webKey)}`,
    { headers: { Accept: "application/json" }, signal },
  );
  if (res.status === 404) return null; // clean not-found
  if (!res.ok) throw new Error(`QCMobile lookup failed: ${res.status}`);

  const json = await res.json();
  if (!json?.content?.carrier) return null; // QCMobile returns empty content for unknown DOT
  return normalizeQcMobileResponse(json);
}
