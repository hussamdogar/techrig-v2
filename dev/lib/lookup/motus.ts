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
import type {
  Boc3Filing,
  CarrierData,
  EquipmentSummary,
  InsuranceFiling,
  OperatingAuthority,
} from "./types";

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

// The safety-rating CODE is not in the MOTUS data (only the rating DATE,
// mxRatingDate); the code comes from the QCMobile backup. MOTUS leaves the
// rating null and surfaces the rating date separately (R3).
function getMotusSafetyRating(): string | null {
  return null;
}

// ---- R3: operating-authority ids + step-3 (getOAPublicView) parsing ----

/** Every entityOperatingAuthorityId from the step-1 carriers body (0..many). */
export function extractOaIds(carriers: any): string[] {
  const entity = carriers?.entity ?? carriers;
  const regs = Array.isArray(entity?.entityRegistrations) ? entity.entityRegistrations : [];
  const ids = regs.flatMap((r: any) =>
    (Array.isArray(r?.entityRegistrationOperatingAuthorities) ? r.entityRegistrationOperatingAuthorities : []).map(
      (o: any) => o?.entityOperatingAuthorityId,
    ),
  );
  return Array.from(new Set(ids.filter((id: unknown): id is string => typeof id === "string" && id !== "")));
}

// Choose the CURRENT filing: prefer an Active one; else the most recent by date.
// We display it WITH its true status (e.g. "Canceled"), never relabeling a
// historical filing as active (R3 §filings discipline).
function pickCurrent<T>(filings: T[], dateOf: (f: T) => string | null, statusOf: (f: T) => string | null): T | null {
  if (filings.length === 0) return null;
  const active = filings.find((f) => /active/i.test(statusOf(f) || ""));
  if (active) return active;
  return [...filings].sort((a, b) => (dateOf(b) || "").localeCompare(dateOf(a) || ""))[0] ?? null;
}

function mapInsurance(f: any): InsuranceFiling {
  return {
    insurer: firstString(f?.legacyFilerNumber?.companyName),
    form: firstString(f?.insuranceForm?.insuranceForm),
    formDesc: firstString(f?.insuranceForm?.insuranceFormDesc, f?.insuranceFormDesc),
    class: firstString(f?.insuranceClass?.insuranceClassDesc),
    coverageAmount: firstString(f?.maxCovAmount),
    effectiveDate: firstString(f?.effectiveDate),
    policyNumber: firstString(f?.policyNumber),
    status: firstString(f?.status?.filingStatusDesc),
  };
}
function mapBoc3(b: any): Boc3Filing {
  return {
    agentName: firstString(b?.blanketEntity?.entityName, b?.legacyFilerNumber?.companyName),
    filerNumber: firstString(b?.legacyFilerNumber?.filerNumber),
    status: firstString(b?.status?.filingStatusDesc),
    receivedDate: firstString(b?.receivedDate),
  };
}

/** Parse one getOAPublicView response into an OperatingAuthority. */
export function parseOaView(oa: any): OperatingAuthority {
  const insFilings = Array.isArray(oa?.insuranceFilings) ? oa.insuranceFilings : [];
  const bocFilings = Array.isArray(oa?.blanketFilings) ? oa.blanketFilings : [];
  const curIns = pickCurrent(
    insFilings,
    (f: any) => f?.effectiveDate ?? null,
    (f: any) => f?.status?.filingStatusDesc ?? null,
  );
  const curBoc = pickCurrent(
    bocFilings,
    (f: any) => f?.receivedDate ?? null,
    (f: any) => f?.status?.filingStatusDesc ?? null,
  );
  return {
    docketNumber: firstString(oa?.docketNumber),
    type: firstString(oa?.operatingAuthorityType?.operatingAuthorityTypeDesc),
    status: firstString(oa?.operatingAuthorityStatus?.operatingAuthorityStatusName),
    protestPeriodStartDate: firstString(oa?.protestPeriodStartDate),
    insurance: curIns ? [mapInsurance(curIns)] : [],
    boc3: curBoc ? [mapBoc3(curBoc)] : [],
  };
}

export function getEntityId(data: any): string | null {
  const entityId = data?.entityId ?? data?.entity?.entityId ?? null;
  return entityId ? String(entityId) : null;
}

/**
 * Build CarrierData from the three MOTUS sources: the step-1 carriers body
 * (USDOT status, MCS-150 dates, mileage, OA ids), the step-2 matrix
 * (classification + status flags + the entity detail used for equipment /
 * officer / address), and the step-3 OA views (MC docket, insurance, BOC-3).
 * `carriers` may equal `matrix` for the backward-compat matrix-only path.
 */
export function buildMotusCarrierData(carriers: any, matrix: any, oaViews: any[]): CarrierData {
  const entity = matrix?.entity;
  if (!entity || typeof entity !== "object") {
    throw new Error("Carrier data was not found in the MOTUS matrix response.");
  }
  const carriersEntity = carriers?.entity ?? carriers ?? entity;
  const detail = carriersEntity?.carrierEntityDetail ?? entity?.carrierEntityDetail ?? {};
  const matrixProperties = Array.isArray(matrix?.matrixProperties) ? matrix.matrixProperties : [];
  const primaryMatrix = matrixProperties[0] || null;
  const primaryOfficer = getMotusPrimaryOfficer(entity);
  const dotNumber = entity?.entityDotNumber?.dotNumber ?? null;
  const equipmentSummary = getMotusEquipmentSummary(entity);
  const reportedPoweredVehicles =
    equipmentSummary.truckTractors + equipmentSummary.straightTrucks + equipmentSummary.nonCommercialVehicles;
  const cdlLikely = equipmentSummary.truckTractors > 0;
  const businessType = entity?.carrierEntityDetail?.businessType?.businessTypeName ?? null;
  const registrationType = primaryMatrix?.registrationTypeLabel ?? null;

  const operatingAuthorities = oaViews.map(parseOaView);
  // The real MC docket is the OA view's docketNumber (step 3); fall back to the
  // matrix mxDocketNumber only when no OA view answered.
  const mcNumber =
    operatingAuthorities.find((oa) => oa.docketNumber)?.docketNumber ??
    firstString(primaryMatrix?.mxDocketNumber);
  const hasActiveInsurance = operatingAuthorities.some((oa) =>
    oa.insurance.some((f) => /active/i.test(f.status || "")),
  );

  return {
    entityId: entity?.entityId ?? null,
    legalName: getMotusLegalName(entity),
    dbaName: getMotusDbaName(entity),
    usdotNumber: dotNumber == null ? null : Number(dotNumber),
    mcNumber,
    physicalAddress: formatMotusAddress(getMotusPrimaryLocation(entity)),
    entityType: businessType ?? registrationType,
    authorityStatus: primaryMatrix?.operatingAuthorityStatus ?? null,
    safetyRating: getMotusSafetyRating(),
    insuranceOnFile: hasActiveInsurance ? "Yes" : null,
    allowedToOperate: entity?.outOfService === true ? "No" : "Yes",
    powerUnits: getMotusPowerUnits(entity),
    usdotStatus: firstString(
      carriersEntity?.entityDotNumber?.dotNumberStatus?.dotNumberStatus,
      entity?.entityDotNumber?.dotNumberStatus?.dotNumberStatus,
    ),
    mcs150Date: firstString(detail?.mcs150Date),
    biennialDueDate: firstString(detail?.biennialDueDate),
    mcs150Mileage: toNumberOrNull(detail?.mcs150Mileage),
    mcs150MileageYear: toNumberOrNull(detail?.mcs150MileageYear),
    recentMileage: toNumberOrNull(detail?.recentMileage),
    recentMileageYear: toNumberOrNull(detail?.recentMileageYear),
    safetyRatingDate: firstString(detail?.mxRatingDate),
    operatingAuthorities,
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
    raw: { carriers, matrix, oaViews },
  };
}

/** Backward-compat: normalize from the matrix alone (no step-1/step-3 data). */
export function normalizeMotusMatrixResponse(matrix: any): CarrierData {
  return buildMotusCarrierData(matrix, matrix, []);
}

const oaViewUrl = (id: string) =>
  `${MOTUS_BASE}/regulatedEntity/oa/${encodeURIComponent(id)}/getOAPublicView`;

/**
 * Fetch a carrier from MOTUS as a 3-step chain (R3):
 *   1. /carriers/{usdot}                        identity, MCS-150 dates, OA ids
 *   2. /public-registration-matrix/{entityId}   classification + status flags
 *   3. /regulatedEntity/oa/{id}/getOAPublicView (per OA id, parallel)
 *                                               MC docket, insurance, BOC-3
 * Each fetch carries the caller's AbortSignal. Returns null only for a CLEAN
 * not-found (404 / no entity); THROWS on transport errors so the orchestrator can
 * fail over. Step 3 is isolated per OA id: a failure there degrades only the
 * authority/filing sections; identity + matrix still render. Carriers with no OA
 * skip step 3 entirely.
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

  const carriers = await carrierRes.json();
  const entityId = getEntityId(carriers);
  if (!entityId) return null; // carrier endpoint returned no entity = not-found

  const matrixRes = await fetch(
    `${MOTUS_BASE}/public-registration-matrix/${encodeURIComponent(entityId)}`,
    { headers: { Accept: "application/json" }, signal },
  );
  // The entity exists, so a matrix failure is an error (fail over), not not-found.
  if (!matrixRes.ok) throw new Error(`MOTUS matrix lookup failed: ${matrixRes.status}`);
  const matrix = await matrixRes.json();

  // Step 3: one getOAPublicView per OA id, in parallel, each isolated.
  const oaViews = (
    await Promise.all(
      extractOaIds(carriers).map(async (id) => {
        try {
          const r = await fetch(oaViewUrl(id), { headers: { Accept: "application/json" }, signal });
          return r.ok ? await r.json() : null;
        } catch {
          return null;
        }
      }),
    )
  ).filter(Boolean);

  return buildMotusCarrierData(carriers, matrix, oaViews);
}
