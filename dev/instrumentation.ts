import * as Sentry from "@sentry/nextjs";

// Next.js instrumentation hook (M7). Loads the Sentry config for the active
// runtime; both no-op without a DSN.
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs" && process.env.NODE_ENV === "development") {
    // Local dev only: Node races IPv6 against IPv4 with 250ms per attempt.
    // On a network without working IPv6 and a slow-ish IPv4 handshake (e.g.
    // motus.dot.gov via Akamai from abroad) both attempts time out and every
    // MOTUS lookup fails with "fetch failed". A 1s attempt window lets the
    // IPv4 connection finish. Production (Vercel) connects fast and is unchanged.
    const net = await import("node:net");
    net.setDefaultAutoSelectFamilyAttemptTimeout(1000);
  }
  if (process.env.NEXT_RUNTIME === "nodejs") await import("./sentry.server.config");
  if (process.env.NEXT_RUNTIME === "edge") await import("./sentry.edge.config");
}

// Captures errors thrown in App Router server components / route handlers.
export const onRequestError = Sentry.captureRequestError;
