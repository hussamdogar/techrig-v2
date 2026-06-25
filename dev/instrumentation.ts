import * as Sentry from "@sentry/nextjs";

// Next.js instrumentation hook (M7). Loads the Sentry config for the active
// runtime; both no-op without a DSN.
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") await import("./sentry.server.config");
  if (process.env.NEXT_RUNTIME === "edge") await import("./sentry.edge.config");
}

// Captures errors thrown in App Router server components / route handlers.
export const onRequestError = Sentry.captureRequestError;
