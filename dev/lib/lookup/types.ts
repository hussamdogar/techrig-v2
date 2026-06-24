/**
 * Provider-agnostic carrier data shape (Application Platform M1, ADR-7).
 *
 * Both lookup providers (MOTUS primary, FMCSA QCMobile backup) normalize their
 * raw responses into THIS shape, so the API, the hero card, and the stored
 * carrier snapshot never care which provider answered. The richer MOTUS-only
 * fields (diff/CDL signals, equipment) are preserved for the later application
 * engine; a backup provider that cannot supply a field sets it to null. Per
 * standards.md we never fabricate a value: a missing field is null and renders
 * as "Not on file", never a guessed value.
 */

export type EquipmentSummary = {
  truckTractors: number;
  straightTrucks: number;
  trailers: number;
  nonCommercialVehicles: number;
};

/** One insurance filing on an operating authority (R3, MOTUS step 3). */
export type InsuranceFiling = {
  insurer: string | null;
  form: string | null;
  formDesc: string | null;
  class: string | null;
  coverageAmount: string | null;
  effectiveDate: string | null;
  policyNumber: string | null;
  status: string | null;
};

/** One BOC-3 / blanket process-agent filing (R3, MOTUS step 3). */
export type Boc3Filing = {
  agentName: string | null;
  filerNumber: string | null;
  status: string | null;
  receivedDate: string | null;
};

/** One operating authority with its MC docket and current filings (R3). */
export type OperatingAuthority = {
  docketNumber: string | null; // e.g. "MC1004652"
  type: string | null;
  status: string | null; // "Active" | ...
  protestPeriodStartDate: string | null;
  /** The current/most-relevant insurance filing (0 or 1), with its true status. */
  insurance: InsuranceFiling[];
  /** The current/most-relevant BOC-3 filing (0 or 1). */
  boc3: Boc3Filing[];
};

export type CarrierData = {
  // Identity
  entityId: string | null;
  legalName: string | null;
  dbaName: string | null;
  usdotNumber: number | null;
  mcNumber: string | null;
  physicalAddress: string | null;

  // Classification / status (the hero result panel reads these)
  entityType: string | null; // operation/business type, the "Entity type" row
  authorityStatus: string | null; // the "Authority status" chip
  safetyRating: string | null; // the "Safety rating" row
  insuranceOnFile: string | null; // the "Insurance on file" row ("Yes" | "No" | null)
  allowedToOperate: string | null;
  powerUnits: number | null;

  // Contact (not shown on the card; used to pre-fill the application later)
  contactFirstName: string | null;
  contactLastName: string | null;
  contactPhone: string | null;
  contactEmail: string | null;

  // Registration & filing dates (R3, MOTUS step 1)
  usdotStatus: string | null;
  mcs150Date: string | null;
  biennialDueDate: string | null;
  mcs150Mileage: number | null;
  mcs150MileageYear: number | null;
  recentMileage: number | null;
  recentMileageYear: number | null;
  safetyRatingDate: string | null;

  // Operating authorities with MC docket + insurance + BOC-3 (R3, MOTUS step 3).
  // Empty for carriers with no operating authority (new entrant / intrastate).
  operatingAuthorities: OperatingAuthority[];

  // Richer MOTUS signals kept for the application engine + MCS-150 diff (M3+)
  driverTotal: number | null;
  cdlDriverTotal: number | null;
  businessType: string | null;
  registrationType: string | null;
  isInterstate: boolean | null;
  isIntrastate: boolean | null;
  isForHire: boolean | null;
  isPrivate: boolean | null;
  canDesignateBoc3: boolean | null;
  insuranceRequired: boolean | null;
  hasProtestPeriod: boolean | null;
  isNewEntrant: boolean | null;
  equipmentSummary: EquipmentSummary;
  reportedPoweredVehicles: number;
  cdlLikely: boolean;
  cdlSignalReason: string | null;
  operationType: string | null;

  // Provenance
  source: LookupProvider;
  raw: unknown;
};

/** Which provider produced a snapshot. `manual` = neither provider answered. */
export type LookupProvider = "motus" | "qcmobile" | "manual";

export type LookupStatus = "success" | "not_found" | "manual_required";

export type LookupResult = {
  status: LookupStatus;
  carrier?: CarrierData;
  /** The provider that answered (or attempted last). */
  provider: LookupProvider;
};
