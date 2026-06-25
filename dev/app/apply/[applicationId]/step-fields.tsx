import type { StepKey, ServiceKey } from "@/lib/services-registry";
import { isServiceKey } from "@/lib/services-registry";
import type { CarrierData } from "@/lib/lookup/types";

/**
 * Per-step field sets (M3 §5), rendered server-side and posted to saveStep.
 * Values pre-fill from the promoted columns / application_data (resume), and
 * carrier-identity additionally falls back to the immutable snapshot.
 */
export function StepFields({
  step,
  app,
  carrier,
  inputClass,
}: {
  step: StepKey;
  app: any;
  carrier: CarrierData | null;
  inputClass: string;
}) {
  const saved = (app.application_data?.[step] ?? {}) as Record<string, unknown>;
  const v = (key: string, fallback?: unknown) => String(saved[key] ?? fallback ?? "");
  const selected: ServiceKey[] = Array.isArray(app.selected_services)
    ? app.selected_services.filter(isServiceKey)
    : [];

  const Label = ({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) => (
    <label htmlFor={htmlFor} className="text-sm font-medium text-ink">
      {children}
    </label>
  );

  switch (step) {
    case "carrier-identity":
      return (
        <>
          <div>
            <Label htmlFor="company_legal_name">Legal company name</Label>
            <input id="company_legal_name" name="company_legal_name" required defaultValue={v("company_legal_name", app.company_legal_name ?? carrier?.legalName)} className={inputClass} />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="dba">DBA (optional)</Label>
              <input id="dba" name="dba" defaultValue={v("dba", app.dba ?? carrier?.dbaName)} className={inputClass} />
            </div>
            <div>
              <Label htmlFor="usdot_number">USDOT number</Label>
              <input id="usdot_number" name="usdot_number" inputMode="numeric" defaultValue={v("usdot_number", app.usdot_number ?? carrier?.usdotNumber)} className={inputClass} />
            </div>
            <div>
              <Label htmlFor="mc_number">MC number (optional)</Label>
              <input id="mc_number" name="mc_number" defaultValue={v("mc_number", app.mc_number ?? carrier?.mcNumber)} className={inputClass} />
            </div>
            <div>
              <Label htmlFor="power_units">Power units</Label>
              <input id="power_units" name="power_units" type="number" min={0} defaultValue={v("power_units", app.power_units ?? carrier?.powerUnits)} className={inputClass} />
            </div>
          </div>
          <div>
            <Label htmlFor="physical_address">Physical address</Label>
            <input id="physical_address" name="physical_address" required defaultValue={v("physical_address", carrier?.physicalAddress)} className={inputClass} />
          </div>
          <div>
            <Label htmlFor="mailing_address">Mailing address (if different)</Label>
            <input id="mailing_address" name="mailing_address" defaultValue={v("mailing_address")} className={inputClass} />
          </div>
        </>
      );

    case "business-details":
      return (
        <>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="entity_type">Legal entity type</Label>
              <select id="entity_type" name="entity_type" defaultValue={v("entity_type", app.entity_type) || "llc"} className={inputClass}>
                <option value="sole_proprietor">Sole proprietor</option>
                <option value="llc">LLC</option>
                <option value="corporation">Corporation</option>
                <option value="partnership">Partnership</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <Label htmlFor="formation_state">Formation state</Label>
              <input id="formation_state" name="formation_state" defaultValue={v("formation_state")} className={inputClass} />
            </div>
          </div>
          <div>
            <Label htmlFor="owner_name">Owner / officer name</Label>
            <input id="owner_name" name="owner_name" required defaultValue={v("owner_name")} className={inputClass} />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="tax_id_type">Tax ID type</Label>
              <select id="tax_id_type" name="tax_id_type" defaultValue={v("tax_id_type") || "none"} className={inputClass}>
                <option value="none">Prefer not to say yet</option>
                <option value="ein">EIN</option>
                <option value="ssn">SSN</option>
              </select>
            </div>
            <div>
              <Label htmlFor="tax_id">Tax ID (kept private)</Label>
              <input id="tax_id" name="tax_id" autoComplete="off" defaultValue={v("tax_id")} className={inputClass} />
            </div>
          </div>
        </>
      );

    case "operations":
      return (
        <>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="operation_scope">Operation scope</Label>
              <select id="operation_scope" name="operation_scope" defaultValue={v("operation_scope") || "interstate"} className={inputClass}>
                <option value="interstate">Interstate</option>
                <option value="intrastate">Intrastate</option>
              </select>
            </div>
            <div>
              <Label htmlFor="carrier_type">Carrier type</Label>
              <select id="carrier_type" name="carrier_type" defaultValue={v("carrier_type") || "for_hire"} className={inputClass}>
                <option value="for_hire">For hire</option>
                <option value="private">Private</option>
              </select>
            </div>
          </div>
          <label className="flex items-center gap-3 text-sm text-ink">
            <input type="checkbox" name="passenger" defaultChecked={!!saved.passenger} className="h-4 w-4 accent-steel" />
            We transport passengers
          </label>
          <label className="flex items-center gap-3 text-sm text-ink">
            <input type="checkbox" name="hazmat" defaultChecked={!!saved.hazmat} className="h-4 w-4 accent-steel" />
            We transport hazardous materials
          </label>
        </>
      );

    case "passenger":
      return (
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="passenger_seats">Passenger seats (max)</Label>
            <input id="passenger_seats" name="passenger_seats" type="number" min={0} defaultValue={v("passenger_seats")} className={inputClass} />
          </div>
          <div>
            <Label htmlFor="passenger_vehicle_count">Passenger vehicles</Label>
            <input id="passenger_vehicle_count" name="passenger_vehicle_count" type="number" min={0} defaultValue={v("passenger_vehicle_count")} className={inputClass} />
          </div>
        </div>
      );

    case "hazmat":
      return (
        <>
          <div>
            <Label htmlFor="hazmat_classes">Hazmat classes carried</Label>
            <input id="hazmat_classes" name="hazmat_classes" placeholder="e.g. Class 3, Class 8" defaultValue={v("hazmat_classes")} className={inputClass} />
          </div>
          <div>
            <Label htmlFor="hazmat_notes">Notes</Label>
            <input id="hazmat_notes" name="hazmat_notes" defaultValue={v("hazmat_notes")} className={inputClass} />
          </div>
        </>
      );

    case "vehicles":
      return (
        <>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="owned_units">Owned units</Label>
              <input id="owned_units" name="owned_units" type="number" min={0} defaultValue={v("owned_units")} className={inputClass} />
            </div>
            <div>
              <Label htmlFor="leased_units">Leased units</Label>
              <input id="leased_units" name="leased_units" type="number" min={0} defaultValue={v("leased_units")} className={inputClass} />
            </div>
          </div>
          <div>
            <Label htmlFor="cargo_types">Cargo types</Label>
            <input id="cargo_types" name="cargo_types" placeholder="e.g. general freight, refrigerated" defaultValue={v("cargo_types")} className={inputClass} />
          </div>
        </>
      );

    case "drivers":
      return (
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="driver_count">Number of drivers</Label>
            <input id="driver_count" name="driver_count" type="number" min={0} required defaultValue={v("driver_count")} className={inputClass} />
          </div>
          <div>
            <Label htmlFor="cdl_driver_count">CDL drivers</Label>
            <input id="cdl_driver_count" name="cdl_driver_count" type="number" min={0} defaultValue={v("cdl_driver_count")} className={inputClass} />
          </div>
        </div>
      );

    case "ucr-details":
      return (
        <div>
          <Label htmlFor="ucr_power_units">Power units (sets your UCR bracket)</Label>
          <input id="ucr_power_units" name="ucr_power_units" type="number" min={0} required defaultValue={v("ucr_power_units", app.power_units)} className={inputClass} />
          <p className="mt-1 text-xs text-slate">Over 100 power units is reviewed manually, not auto-priced.</p>
        </div>
      );

    case "service-specifics":
      return (
        <>
          {selected.includes("boc-3") ? (
            <label className="flex items-start gap-3 text-sm text-ink">
              <input type="checkbox" name="boc3_process_agent_ack" defaultChecked={!!saved.boc3_process_agent_ack} className="mt-1 h-4 w-4 accent-steel" />
              <span>
                I authorize DGR Tech Rig LLC, an FMCSA-listed blanket process-agent company, to file my BOC-3
                process-agent designation across all 50 states.
              </span>
            </label>
          ) : null}
          {selected.includes("mcs-150") ? (
            <div>
              <Label htmlFor="mcs150_update_reason">Reason for the Biennial Update</Label>
              <input id="mcs150_update_reason" name="mcs150_update_reason" placeholder="e.g. biennial update due" defaultValue={v("mcs150_update_reason")} className={inputClass} />
            </div>
          ) : null}
          {selected.includes("usdot-correction") ? (
            <div>
              <Label htmlFor="usdot_correction_details">What needs correcting on your USDOT record</Label>
              <input id="usdot_correction_details" name="usdot_correction_details" placeholder="e.g. address, legal name, phone, truck/driver count" defaultValue={v("usdot_correction_details")} className={inputClass} />
            </div>
          ) : null}
          {selected.includes("ifta-quarterly") ? (
            <div>
              <Label htmlFor="ifta_quarter">Which quarter to file</Label>
              <input id="ifta_quarter" name="ifta_quarter" placeholder="e.g. Q1 2026" defaultValue={v("ifta_quarter")} className={inputClass} />
            </div>
          ) : null}
          {selected.includes("motus-migration") ? (
            <div>
              <Label htmlFor="motus_migration_details">What is happening with your MOTUS or FMCSA Portal account</Label>
              <input id="motus_migration_details" name="motus_migration_details" placeholder="e.g. cannot claim USDOT, need Company Official assigned, MC missing in MOTUS" defaultValue={v("motus_migration_details")} className={inputClass} />
            </div>
          ) : null}
          {!selected.includes("boc-3") &&
          !selected.includes("mcs-150") &&
          !selected.includes("usdot-correction") &&
          !selected.includes("ifta-quarterly") &&
          !selected.includes("motus-migration") ? (
            <p className="text-slate">No additional details needed for the services you selected.</p>
          ) : null}
        </>
      );

    default:
      return null;
  }
}
