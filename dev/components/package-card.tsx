import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Boc3IncludedBadge } from "@/components/boc3-included-badge";
import { BundleReceipt } from "@/components/bundle-receipt";
import { icons, type IconName } from "@/components/icons";
import { SERVICES, getBundleBreakdown, type BundleDef, type ServiceKey } from "@/lib/services-registry";
import { cn } from "@/lib/utils";

// Service page + icon per included key, for the card's included-services list.
// `drug-test` has no dedicated page (per compliance-services/page.tsx), so it
// renders without a link, matching the site's no-dead-links rule.
const SERVICE_LINK: Partial<Record<ServiceKey, { href?: string; icon: IconName }>> = {
  "mc-authority": { href: "/mc-registration/", icon: "shield" },
  "boc-3": { href: "/boc-3-filing/", icon: "filing" },
  ucr: { href: "/ucr-registration/", icon: "filing" },
  "dq-files": { href: "/driver-qualification-files/", icon: "filing" },
  clearinghouse: { href: "/fmcsa-clearinghouse-registration/", icon: "shield" },
  consortium: { href: "/drug-and-alcohol-consortium/", icon: "shield" },
  "drug-test": { icon: "shield" },
  irp: { href: "/irp-registration/", icon: "routeNode" },
  ifta: { href: "/ifta-registration/", icon: "routeNode" },
};

/**
 * The package (bundle) card (design spec §DZ3, component A). Content-bearing:
 * Cloud surface, 1px Slate outline, the card CTA is a solid Ink button (Signal
 * amber stays rationed to the page-level "Choose your package" actions).
 */
export function PackageCard({ bundle, id }: { bundle: BundleDef; id?: string }) {
  const breakdown = getBundleBreakdown(bundle.key);
  const eyebrow = `${bundle.forExistingCarrier ? "CONTINUATION" : "LAUNCH"} · ${
    bundle.vehicleClass === "non-cdl" ? "NON-CDL" : "CDL/HEAVY"
  }`;

  return (
    <div
      id={id}
      className="flex h-full scroll-mt-24 flex-col rounded-card border border-slate/15 bg-cloud p-6 shadow-card"
    >
      <p className="font-mono text-xs font-medium uppercase tracking-[0.08em] text-slate">{eyebrow}</p>
      <h3 className="mt-2 font-display text-2xl font-bold text-ink">{bundle.name}</h3>
      <div className="mt-3">
        <Boc3IncludedBadge longForm={bundle.forExistingCarrier} />
      </div>

      <p className="mt-4 font-mono text-4xl font-semibold tabular-nums text-ink">
        ${breakdown.finalPrice.toLocaleString("en-US")}
      </p>

      <p className="mt-4 text-sm text-slate">{bundle.whoItsFor}</p>
      <p className="mt-3 text-sm text-ink">{bundle.suggestedWording}</p>

      <ul className="mt-5 space-y-2.5 border-t border-slate/10 pt-5">
        {breakdown.lines
          .filter((l): l is typeof l & { key: ServiceKey } => l.key !== "ucr-gov-fee")
          .map((line) => {
            const meta = SERVICE_LINK[line.key];
            const Icon = meta ? icons[meta.icon] : null;
            return (
              <li key={line.key} className="flex items-center justify-between gap-3 text-sm">
                <span className="flex items-center gap-2 text-ink">
                  {Icon ? <Icon size={16} className="shrink-0 text-steel" /> : null}
                  {meta?.href ? (
                    <Link
                      href={meta.href}
                      className="font-medium text-steel underline-offset-4 hover:underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
                    >
                      {line.label}
                    </Link>
                  ) : (
                    <span>{line.label}</span>
                  )}
                </span>
                <span className="shrink-0 font-mono text-xs text-slate">${line.bundle}</span>
              </li>
            );
          })}
      </ul>

      <div className="mt-5">
        <BundleReceipt breakdown={breakdown} />
      </div>

      {bundle.vehicleClass === "cdl-heavy" ? (
        <p className="mt-3 border-l-2 border-slate/25 pl-3 text-xs text-slate">
          IRP and IFTA government, state, plate, credential, and jurisdiction fees are billed separately.
        </p>
      ) : null}

      <div className="mt-6">
        <Link
          href={`/apply/?bundle=${bundle.key}`}
          className={cn(buttonVariants({ variant: "solidInk", size: "md" }), "w-full")}
        >
          Get this package
        </Link>
      </div>
    </div>
  );
}
