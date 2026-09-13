"use client";

import { useEffect } from "react";
import { pushDataLayerEvent } from "@/lib/gtm";

/**
 * Fires one GTM dataLayer event when this mounts, then renders nothing. For
 * marking a funnel step reached from a Server Component page (which cannot
 * call browser APIs itself) without turning the whole page into a Client
 * Component, and for outcomes a plain page-view can't distinguish (e.g. the
 * quick-buy confirm screen: success vs. not-found vs. rate-limited all render
 * at the same URL).
 */
export function GtmEvent({ event, data }: { event: string; data?: Record<string, unknown> }) {
  useEffect(() => {
    pushDataLayerEvent(event, data);
    // Fire once per mount; a fresh `data` object literal on every parent
    // render must not retrigger this, so it is deliberately not a dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event]);
  return null;
}
