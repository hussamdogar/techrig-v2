/**
 * Dynamic stepper / state machine (M3 §4). The active steps are the union of the
 * selected services' requiredSteps, in the canonical STEP_ORDER, plus the always
 * present `services` (selection) and `review`, plus the conditional `passenger`
 * and `hazmat` steps which appear only when the operations step flags them.
 */
import { SERVICES, STEP_ORDER, type ServiceKey, type StepKey } from "@/lib/services-registry";

export const STEP_META: Record<StepKey, { title: string }> = {
  services: { title: "Choose your services" },
  "carrier-identity": { title: "Carrier identity" },
  "business-details": { title: "Business details" },
  operations: { title: "Operations" },
  passenger: { title: "Passenger operations" },
  hazmat: { title: "Hazardous materials" },
  vehicles: { title: "Vehicles & equipment" },
  drivers: { title: "Drivers" },
  "ucr-details": { title: "UCR details" },
  "service-specifics": { title: "Service specifics" },
  review: { title: "Review & submit" },
};

export type OperationsFlags = { passenger?: boolean; hazmat?: boolean };

/** The ordered set of steps to render for the given services + operations flags. */
export function activeSteps(selected: ServiceKey[], flags: OperationsFlags): StepKey[] {
  const required = new Set<StepKey>(["services", "carrier-identity", "review"]);
  for (const key of selected) {
    const def = SERVICES[key];
    if (def && !def.informationalOnly) def.requiredSteps.forEach((s) => required.add(s));
  }
  const hasOperations = required.has("operations");
  return STEP_ORDER.filter((step) => {
    // passenger/hazmat only when operations is in play AND the flag is set
    if (step === "passenger") return hasOperations && !!flags.passenger;
    if (step === "hazmat") return hasOperations && !!flags.hazmat;
    return required.has(step);
  });
}

/** The next/previous active step relative to `current` (null at the ends). */
export function adjacentStep(
  steps: StepKey[],
  current: StepKey,
  direction: "next" | "prev",
): StepKey | null {
  const i = steps.indexOf(current);
  if (i === -1) return null;
  const j = direction === "next" ? i + 1 : i - 1;
  return steps[j] ?? null;
}

/** Resolve a requested step to a valid active step (fallback to the first). */
export function resolveStep(steps: StepKey[], requested: string | undefined): StepKey {
  if (requested && (steps as string[]).includes(requested)) return requested as StepKey;
  return steps[0] ?? "services";
}
