/**
 * Per-step validation (M3 §5). One zod schema per step; the same schema runs on
 * the client and is re-run server-side on every save (never trust the client).
 * Sensitive fields (EIN/SSN) are kept out of logs and never echoed to telemetry.
 */
import { z } from "zod";
import type { StepKey } from "@/lib/services-registry";

const optionalText = z.string().trim().optional().default("");

export const carrierIdentitySchema = z.object({
  company_legal_name: z.string().trim().min(1, "Legal name is required"),
  dba: optionalText,
  usdot_number: z
    .string()
    .trim()
    .regex(/^\d{0,12}$/, "Digits only")
    .optional()
    .default(""),
  mc_number: optionalText,
  physical_address: z.string().trim().min(1, "Physical address is required"),
  mailing_address: optionalText,
  power_units: z.coerce.number().int().min(0).max(100000).optional(),
});

export const businessDetailsSchema = z.object({
  entity_type: z.enum(["sole_proprietor", "llc", "corporation", "partnership", "other"]),
  formation_state: optionalText,
  owner_name: z.string().trim().min(1, "Owner name is required"),
  // Tax id is sensitive: validated for shape only, never logged.
  tax_id_type: z.enum(["ein", "ssn", "none"]).default("none"),
  tax_id: optionalText,
});

export const operationsSchema = z.object({
  operation_scope: z.enum(["interstate", "intrastate"]),
  carrier_type: z.enum(["for_hire", "private"]),
  passenger: z.coerce.boolean().default(false),
  hazmat: z.coerce.boolean().default(false),
});

export const passengerSchema = z.object({
  passenger_seats: z.coerce.number().int().min(0).optional(),
  passenger_vehicle_count: z.coerce.number().int().min(0).optional(),
});

export const hazmatSchema = z.object({
  hazmat_classes: optionalText, // free text / comma list of classes
  hazmat_notes: optionalText,
});

export const vehiclesSchema = z.object({
  owned_units: z.coerce.number().int().min(0).optional(),
  leased_units: z.coerce.number().int().min(0).optional(),
  cargo_types: optionalText,
});

export const driversSchema = z.object({
  driver_count: z.coerce.number().int().min(0),
  cdl_driver_count: z.coerce.number().int().min(0).optional(),
});

export const ucrDetailsSchema = z.object({
  ucr_power_units: z.coerce.number().int().min(0),
});

export const serviceSpecificsSchema = z.object({
  boc3_process_agent_ack: z.coerce.boolean().optional().default(false),
  mcs150_update_reason: optionalText,
});

export const STEP_SCHEMAS: Partial<Record<StepKey, z.ZodTypeAny>> = {
  "carrier-identity": carrierIdentitySchema,
  "business-details": businessDetailsSchema,
  operations: operationsSchema,
  passenger: passengerSchema,
  hazmat: hazmatSchema,
  vehicles: vehiclesSchema,
  drivers: driversSchema,
  "ucr-details": ucrDetailsSchema,
  "service-specifics": serviceSpecificsSchema,
};

/** Validate a step's form data; returns parsed data or field errors. */
export function validateStep(step: StepKey, data: Record<string, unknown>) {
  const schema = STEP_SCHEMAS[step];
  if (!schema) return { ok: true as const, data };
  const result = schema.safeParse(data);
  if (result.success) return { ok: true as const, data: result.data as Record<string, unknown> };
  return { ok: false as const, errors: result.error.flatten().fieldErrors };
}
