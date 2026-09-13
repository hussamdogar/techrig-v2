"use client";

import { pushDataLayerEvent } from "@/lib/gtm";

/**
 * A plain <a> (tel:, mailto:, or external) that also pushes a GTM dataLayer
 * event on click. Use TrackedLink instead for internal (next/link) routes.
 * Has no effect anywhere it isn't placed.
 */
export function TrackedAnchor({
  href,
  event,
  data,
  className,
  children,
  ...rest
}: {
  href: string;
  event: string;
  data?: Record<string, unknown>;
  className?: string;
  children: React.ReactNode;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className" | "children" | "onClick">) {
  return (
    <a href={href} className={className} onClick={() => pushDataLayerEvent(event, data)} {...rest}>
      {children}
    </a>
  );
}
