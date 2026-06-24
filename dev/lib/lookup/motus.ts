/**
 * MOTUS provider (primary, ADR-7). Ported from boc3-form-new `src/shared/motus.ts`
 * and `api/lookup-usdot.ts`, which are proven against the live MOTUS API. The
 * normalizer is kept faithful; it is extended only to also surface the hero
 * card's display fields (MC number, safety rating, insurance on file, entity
 * type) via best-effort extraction with a null fallback. Field paths marked
 * VERIFY are confirmed against a live MOTUS response in the M1 acceptance test;
 * until then they fall back to null and the card shows "Not on file" (never a
 * fabricated value, per standards.md).
 */
import type { CarrierData, EquipmentSummary } from "./types";

const MOTUS_BASE = "https://motus.dot.gov/api";

export function toNumberOrNull(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return Number.isNaN(n) ? null : n;
}

function firstNumber(...values: unknown[]): number | null {
  for (const value of values) {
    const parsed = toNumberOrNull(value);
    if (parsed !== null) return parsed;
  }
  return null;
}

function firstString(...values: unknown[]): string | null {
  for (const value of values) {
    if (typeof value === "string" && value.trim() !== "") return value.trim();
    if (typeof value === "number") return String(value);
  }
  return null;
}

function getMotusEquipmentItemCount(item: any): number {
  const owned = firstNumber(
    item?.ownedEquipmentCount,
    item?.ownedVehicleCount,
    item?.ownedCount,
    item?.owned,
    item?.equipmentOwnership?.ownedEquipmentCount,
    item?.equipmentOwnership?.ownedVehicleCount,
    item?.equipmentOwnership?.ownedCount,
    item?.equipmentOwnership?.owned,
  );
  const termLeased = firstNumber(
    item?.termLeasedEquipmentCount,
    item?.termLeasedVehicleCount,
    item?.termLeasedCount,
    item?.termLeaseCount,
    item?.termLeased,
    item?.equipmentOwnership?.termLeasedEquipmentCount,
    item?.equipmentOwnership?.termLeasedVehicleCount,
    item?.equipmentOwnership?.termLeasedCount,
    item?.equipmentOwnership?.termLeaseCount,
    item?.equipmentOwnership?.termLeased,
  );
  const tripLeased = firstNumber(
    item?.tripLeasedEquipmentCount,
    item?.tripLeasedVehicleCount,
    item?.tripLeasedCount,
    item?.tripLeaseCount,
    item?.tripLeased,
    item?.equipmentOwnership?.tripLeasedEquipmentCount,
    item?.equipmentOwnership?.tripLeasedVehicleCount,
    item?.equipmentOwnership?.tripLeasedCount,
    item?.equipmentOwnership?.tripLeaseCount,
    item?.equipmentOwnership?.tripLeased,
  );
  if (owned !== null || termLeased !== null || tripLeased !== null) {
    return (owned ?? 0) + (termLeased ?? 0) + (tripLeased ?? 0);
  }
  return (
    firstNumber(
      item?.equipmentCount,
      item?.vehicleCount,
      item?.totalEquipmentCount,
      item?.totalCount,
    ) ?? 0
  );
}

function formatMotusAddress(location: any): string | null {
  if (!location) return null;
  const street = [location?.addressLine1, location?.addressLine2]
    .filter(Boolean)
    .join(" ")
    .trim();
  const lineTwo = [location?.city, location?.state, location?.zipCode]
    .filter(Boolean)
    .join(", ");
  const address = [street, lineTwo].filter(Boolean).join(", ");
  return address || null;
}

function getMotusPrimaryLocation(entity: any): any | null {
  const locations = Array.isArray(entity?.locations) ? entity.locations : [];
  return (
    locations.find((l: any) => l?.primaryAddressFlag && l?.isVerified) ||
    locations.find((l: any) => l?.primaryAddressFlag) ||
    locations[0] ||
    null
  );
}

function getMotusLegalName(entity: any): string | null {
  const names = Array.isArray(entity?.entityNames) ? entity.entityNames : [];
  return (
    entity?.entityName ||
    names.find((n: any) => String(n?.nameType || "").toLowerCase() === "legal")?.entityName ||
    names[0]?.entityName ||
    null
  );
}

function getMotusDbaName(entity: any): string | null {
  const names = Array.isArray(entity?.entityNames) ? entity.entityNames : [];
  return (
    names.find((n: any) => String(n?.nameType || "").toLowerCase() === "dba")?.entityName || null
  );
}

function getMotusPrimaryOfficer(entity: any): any | null {
  const officers = Array.isArray(entity?.entityOfficers) ? entity.entityOfficers : [];
  return officers[0] || null;
}

function getMotusPrimaryEmail(entity: any): string | null {
  const emails = Array.isArray(entity?.emailAddresses) ? entity.emailAddresses : [];
  return emails.find((i: any) => i?.primaryAddressFlag)?.emailAddress || emails[0]?.emailAddress || null;
}

function getMotusPrimaryPhone(entity: any): string | null {
  const phones = Array.isArray(entity?.phoneNumbers) ? entity.phoneNumbers : [];
  return phones[0]?.phoneNumber || null;
}

function getMotusEquipmentSummary(entity: any): EquipmentSummary {
  const equipment = Array.isArray(entity?.entityEquipment) ? entity.entityEquipment : [];
  return equipment.reduce(
    (summary: EquipmentSummary, item: any) => {
      const count = getMotusEquipmentItemCount(item);
      const typeName = String(item?.equipmentType?.equipmentTypeName || "").toUpperCase();
      const typeDesc = String(item?.equipmentType?.equipmentTypeDesc || "").toLowerCase();
      if (typeName === "B" || typeDesc.includes("truck tractor")) summary.truckTractors += count;
      else if (typeName === "A" || typeDesc.includes("straight truck")) summary.straightTrucks += count;
      else if (typeName === "C" || typeDesc.includes("trailer")) summary.trailers += count;
      else if (typeDesc.includes("non-commercial")) summary.nonCommercialVehicles += count;
      return summary;
    },
    { truckTractors: 0, straightTrucks: 0, trailers: 0, nonCommercialVehicles: 0 },
  );
}

function getMotusPowerUnits(entity: any): number | null {
  const detail = entity?.carrierEntityDetail;
  const eq = getMotusEquipmentSummary(entity);
  const equipmentPowerUnits = eq.truckTractors + eq.straightTrucks;
  const detailCandidates = [
    toNumberOrNull(detail?.nbrPowerUnit),
    toNumberOrNull(detail?.avgPowerUnit),
    toNumberOrNull(detail?.straightTruckTotal),
  ].filter((v): v is number => v !== null);
  const positive = [
    ...detailCandidates.filter((v) => v > 0),
    ...(equipmentPowerUnits > 0 ? [equipmentPowerUnits] : []),
  ];
  if (positive.length > 0) return Math.max(...positive);
  if (detailCandidates.length > 0) return Math.max(...detailCandidates);
  return equipmentPowerUnits;
}

// MC docket lives in the matrix as `mxDocketNumber` (confirmed against a live
// MOTUS response). It is null for carriers without operating authority, which is
// honest: the card then shows "Not on file".
function getMotusMcNumber(primaryMatrix: any): string | null {
  return firstString(primaryMatrix?.mxDocketNumber, primaryMatrix?.docketNumber);
}
// Safety rating and insurance-on-file are NOT present in the MOTUS public
// registration matrix (confirmed against a live response: only mxRatingDate and
// isOAInsuranceRequired exist). They come from the QCMobile backup instead, so
// MOTUS leaves them null and the card shows "Not on file".
function getMotusSafetyRating(): string | null {
  return null;
}
function getMotusInsuranceOnFile(): string | null {
  return null;
}

export function getEntityId(data: any): string | null {
  const entityId = data?.entityId ?? data?.entity?.entityId ?? null;
  return entityId ? String(entityId) : null;
}

/** Normalize the MOTUS public-registration-matrix response to CarrierData. */
export function normalizeMotusMatrixResponse(response: any): CarrierData {
  const entity = response?.entity;
  if (!entity || typeof entity !== "object") {
    throw new Error("Carrier data was not found in the MOTUS matrix response.");
  }
  const matrixProperties = Array.isArray(response?.matrixProperties) ? response.matrixProperties : [];
  const primaryMatrix = matrixProperties[0] || null;
  const primaryOfficer = getMotusPrimaryOfficer(entity);
  const dotNumber = entity?.entityDotNumber?.dotNumber ?? null;
  const equipmentSummary = getMotusEquipmentSummary(entity);
  const reportedPoweredVehicles =
    equipmentSummary.truckTractors + equipmentSummary.straightTrucks + equipmentSummary.nonCommercialVehicles;
  const cdlLikely = equipmentSummary.truckTractors > 0;
  const businessType = entity?.carrierEntityDetail?.businessType?.businessTypeName ?? null;
  const registrationType = primaryMatrix?.registrationTypeLabel ?? null;

  return {
    entityId: entity?.entityId ?? null,
    legalName: getMotusLegalName(entity),
    dbaName: getMotusDbaName(entity),
    usdotNumber: dotNumber == null ? null : Number(dotNumber),
    mcNumber: getMotusMcNumber(primaryMatrix),
    physicalAddress: formatMotusAddress(getMotusPrimaryLocation(entity)),
    entityType: businessType ?? registrationType,
    authorityStatus: primaryMatrix?.operatingAuthorityStatus ?? null,
    safetyRating: getMotusSafetyRating(),
    insuranceOnFile: getMotusInsuranceOnFile(),
    allowedToOperate: entity?.outOfService === true ? "No" : "Yes",
    powerUnits: getMotusPowerUnits(entity),
    contactFirstName: primaryOfficer?.firstName || null,
    contactLastName: primaryOfficer?.lastName || null,
    contactPhone: primaryOfficer?.phoneNumber || getMotusPrimaryPhone(entity),
    contactEmail: primaryOfficer?.email || getMotusPrimaryEmail(entity),
    driverTotal: toNumberOrNull(entity?.carrierEntityDetail?.driverTotal),
    cdlDriverTotal: toNumberOrNull(entity?.carrierEntityAnswer?.totalCdl),
    businessType,
    registrationType,
    isInterstate: typeof primaryMatrix?.isInterstate === "boolean" ? primaryMatrix.isInterstate : null,
    isIntrastate: typeof primaryMatrix?.isIntrastate === "boolean" ? primaryMatrix.isIntrastate : null,
    isForHire: typeof primaryMatrix?.isForhire === "boolean" ? primaryMatrix.isForhire : null,
    isPrivate: typeof primaryMatrix?.isPrivate === "boolean" ? primaryMatrix.isPrivate : null,
    canDesignateBoc3:
      typeof primaryMatrix?.canDesignateProcessAgentBoc3 === "boolean"
        ? primaryMatrix.canDesignateProcessAgentBoc3
        : null,
    insuranceRequired:
      typeof primaryMatrix?.isOAInsuranceRequired === "boolean" ? primaryMatrix.isOAInsuranceRequired : null,
    hasProtestPeriod:
      typeof primaryMatrix?.hasProtestPeriod === "boolean" ? primaryMatrix.hasProtestPeriod : null,
    isNewEntrant: typeof primaryMatrix?.isNewEntrant === "boolean" ? primaryMatrix.isNewEntrant : null,
    equipmentSummary,
    reportedPoweredVehicles,
    cdlLikely,
    cdlSignalReason: cdlLikely ? "Truck tractor reported in FMCSA/MOTUS equipment data" : null,
    operationType: registrationType,
    source: "motus",
    raw: response,
  };
}

/**
 * Fetch a carrier from MOTUS: entity lookup, then the registration matrix. Each
 * fetch carries the caller's AbortSignal so the failover timeout can cut it off.
 * Returns null only for a CLEAN not-found (404 or no entity); THROWS on any
 * transport/server error or timeout so the orchestrator can tell "no such
 * carrier" apart from "provider unavailable" and pick the right status.
 */
export async function fetchMotusCarrier(
  usdot: string,
  signal: AbortSignal,
): Promise<CarrierData | null> {
  const carrierRes = await fetch(`${MOTUS_BASE}/carriers/${encodeURIComponent(usdot)}`, {
    headers: { Accept: "application/json" },
    signal,
  });
  if (carrierRes.status === 404) return null; // clean not-found
  if (!carrierRes.ok) throw new Error(`MOTUS carrier lookup failed: ${carrierRes.status}`);

  const entityId = getEntityId(await carrierRes.json());
  if (!entityId) return null; // carrier endpoint returned no entity = not-found

  const matrixRes = await fetch(
    `${MOTUS_BASE}/public-registration-matrix/${encodeURIComponent(entityId)}`,
    { headers: { Accept: "application/json" }, signal },
  );
  // The entity exists, so a matrix failure is an error (fail over), not not-found.
  if (!matrixRes.ok) throw new Error(`MOTUS matrix lookup failed: ${matrixRes.status}`);

  return normalizeMotusMatrixResponse(await matrixRes.json());
}
