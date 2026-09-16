"use client";

import { usePathname } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { PhoneIcon } from "@/components/icons";
import { TrackedAnchor } from "@/components/tracked-anchor";
import { site } from "@/lib/site";

/**
 * The only reason any part of the footer needs client JS: this button only
 * renders on the /lp/... Google Ads landing pages (see site-footer.tsx),
 * which needs the current pathname to know that. Isolated in its own
 * component so <SiteFooter> itself stays a Server Component on every other
 * page of the site.
 */
export function FooterCallButton() {
  const pathname = usePathname();
  if (!pathname?.startsWith("/lp/")) return null;

  return (
    <TrackedAnchor
      href={site.telHref}
      event="call_click"
      data={{ location: "footer" }}
      className={`${buttonVariants({ variant: "outlineOnInk", size: "md" })} mb-5`}
    >
      <PhoneIcon size={18} aria-hidden="true" />
      Call now
      <span aria-hidden="true" className="before:content-['•']" />
      {site.telephone}
    </TrackedAnchor>
  );
}
