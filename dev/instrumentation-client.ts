import * as Sentry from "@sentry/nextjs";
import { initSentry } from "@/lib/sentry-init";

// Browser Sentry (M7). No-ops without NEXT_PUBLIC_SENTRY_DSN. The publishable DSN
// is the only Sentry value that reaches the client.
initSentry(process.env.NEXT_PUBLIC_SENTRY_DSN, "client");

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
