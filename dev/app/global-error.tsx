"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

/**
 * Catches an error in the ROOT LAYOUT itself (App Router convention:
 * app/global-error.tsx) — the one case app/error.tsx can't cover, since that
 * renders INSIDE the root layout. Must render its own full <html>/<body>;
 * deliberately minimal and self-contained (no design-system components, no
 * next/font) since this is the last line of defense if something more basic
 * is broken. Reports to Sentry same as app/error.tsx.
 */
export default function GlobalError({
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
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "#f7f5f1", color: "#0e2233" }}>
        <div style={{ maxWidth: 480, margin: "96px auto", padding: "0 24px", textAlign: "center" }}>
          <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#4f5e6b" }}>
            Error
          </p>
          <h1 style={{ marginTop: 8, fontSize: 28, fontWeight: 800 }}>Something went wrong</h1>
          <p style={{ marginTop: 16, color: "#4f5e6b" }}>
            That&apos;s on us, not you. Try reloading the page.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              marginTop: 32,
              padding: "12px 24px",
              borderRadius: 6,
              background: "#e89a3c",
              color: "#0e2233",
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
