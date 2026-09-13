"use client";

import { pushDataLayerEvent } from "@/lib/gtm";

/**
 * A <form> that also pushes a GTM dataLayer event the moment it is submitted,
 * before the server action runs. Drop-in replacement for a plain <form
 * action={...}>; only used where explicit funnel tracking is wanted (the
 * /buy/ quick-buy flow), so it has no effect anywhere it isn't placed.
 */
export function TrackedForm({
  action,
  event,
  data,
  className,
  children,
}: {
  action: (formData: FormData) => void | Promise<void>;
  event: string;
  data?: Record<string, unknown>;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <form action={action} onSubmit={() => pushDataLayerEvent(event, data)} className={className}>
      {children}
    </form>
  );
}
