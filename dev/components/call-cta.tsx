import { buttonVariants } from "@/components/ui/button";
import { PhoneIcon } from "@/components/icons";
import { TrackedAnchor } from "@/components/tracked-anchor";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Call-us actions for the services sold by phone (owner, 2026-11-12): USDOT,
 * MC, IRP, IFTA, IFTA quarterly, MOTUS migration, Biennial Update and USDOT
 * Correction. These pages used to send visitors into /apply, which needed a
 * login; the login is gone, so they call instead. Both fire `call_click`
 * with the given `location` (e.g. "mc_registration_hero").
 */
export function CallButton({ location, className }: { location: string; className?: string }) {
  return (
    <TrackedAnchor
      href={site.telHref}
      event="call_click"
      data={{ location }}
      className={cn(buttonVariants({ variant: "primary", size: "md" }), className)}
    >
      <PhoneIcon size={18} aria-hidden="true" />
      Call {site.telephone}
    </TrackedAnchor>
  );
}

/** The same action as an inline Steel text link, for mid-page mentions. */
export function CallLink({ location }: { location: string }) {
  return (
    <TrackedAnchor
      href={site.telHref}
      event="call_click"
      data={{ location }}
      className="font-medium text-steel underline-offset-4 hover:underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
    >
      Call {site.telephone}
    </TrackedAnchor>
  );
}
