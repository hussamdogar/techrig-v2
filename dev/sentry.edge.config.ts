import { initSentry } from "@/lib/sentry-init";

// Edge runtime Sentry (proxy/middleware). No-ops without SENTRY_DSN.
initSentry(process.env.SENTRY_DSN, "server");
