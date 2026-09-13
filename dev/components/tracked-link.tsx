"use client";

import Link from "next/link";
import { pushDataLayerEvent } from "@/lib/gtm";

/**
 * A next/link that also pushes a GTM dataLayer event on click, before
 * navigating. Drop-in replacement for <Link> wherever a click is a funnel
 * signal worth tracking (the boc-3 demo page's CTAs, the /buy/ flow's "back"
 * links); has no effect anywhere it isn't placed.
 */
export function TrackedLink({
  href,
  event,
  data,
  className,
  children,
}: {
  href: string;
  event: string;
  data?: Record<string, unknown>;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className={className} onClick={() => pushDataLayerEvent(event, data)}>
      {children}
    </Link>
  );
}
