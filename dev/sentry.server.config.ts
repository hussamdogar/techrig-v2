import { initSentry } from "@/lib/sentry-init";

// Server (Node.js runtime) Sentry. No-ops without SENTRY_DSN.
initSentry(process.env.SENTRY_DSN, "server");
