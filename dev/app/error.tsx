"use client";

import { useEffect } from "react";
import Link from "next/link";
import * as Sentry from "@sentry/nextjs";
import { Container, Section } from "@/components/ui/container";
import { buttonVariants } from "@/components/ui/button";

/**
 * Catches a render/runtime error anywhere below the root layout (App Router
 * convention: app/error.tsx). Renders inside the root layout, so header/
 * footer still show. Reports to Sentry (no-ops without a DSN, see
 * lib/sentry-init.ts) since an error boundary catching it does NOT
 * automatically send it there on its own.
 */
export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <Section surface="paper" className="pt-16 md:pt-24">
      <Container className="max-w-xl text-center">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-slate">Error</p>
        <h1 className="mt-2 font-display text-3xl font-extrabold tracking-[-0.02em] text-ink">
          Something went wrong
        </h1>
        <p className="mt-4 text-slate">
          That&apos;s on us, not you. Try again, or head back to the homepage. If it keeps happening,
          let us know and we&apos;ll fix it.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button type="button" onClick={() => reset()} className={buttonVariants({ variant: "primary", size: "md" })}>
            Try again
          </button>
          <Link
            href="/"
            className="font-medium text-steel underline-offset-4 hover:underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
          >
            Back to homepage
          </Link>
        </div>
      </Container>
    </Section>
  );
}
