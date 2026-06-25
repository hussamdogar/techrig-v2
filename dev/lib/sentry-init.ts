import * as Sentry from "@sentry/nextjs";

/**
 * Shared Sentry init (M7). No-ops without a DSN (local/sandbox stay quiet). PII is
 * scrubbed: sendDefaultPii is off and beforeSend strips request cookies/headers/
 * body and any user identifier, so carrier data (EIN/SSN/name) never leaves the
 * app in an error event.
 */
export function initSentry(dsn: string | undefined, runtime: "server" | "client") {
  if (!dsn) return;
  Sentry.init({
    dsn,
    tracesSampleRate: 0.1,
    sendDefaultPii: false,
    environment: process.env.VERCEL_ENV ?? "development",
    beforeSend(event) {
      if (event.request) {
        delete event.request.cookies;
        delete event.request.headers;
        delete event.request.data;
        delete event.request.query_string;
      }
      delete event.user;
      return event;
    },
    // Client-only: keep replay/session noise out unless explicitly added later.
    ...(runtime === "client" ? {} : {}),
  });
}
