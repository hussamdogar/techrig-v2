import { performLookup } from "@/lib/server/lookup-capture";

/**
 * POST /api/lookup-usdot  (Application Platform M1)
 *
 * Thin wrapper over the shared performLookup() path (also used by the
 * /lookup/[usdot]/ results page). Kept for programmatic / future /apply use; the
 * hero card now navigates to the results page rather than calling this directly.
 * The whole platform is noindex (ADR-5); this route sets X-Robots-Tag: noindex.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NOINDEX = { "X-Robots-Tag": "noindex" } as const;
function json(body: unknown, status = 200) {
  return Response.json(body, { status, headers: NOINDEX });
}

export async function POST(request: Request) {
  let usdotNumber: unknown;
  try {
    usdotNumber = (await request.json())?.usdotNumber;
  } catch {
    return json({ status: "error", message: "Invalid request body." }, 400);
  }

  const outcome = await performLookup(String(usdotNumber ?? ""), request.headers);

  switch (outcome.kind) {
    case "invalid":
      return json({ status: "error", message: "USDOT number must contain digits only." }, 400);
    case "rate_limited":
      return json({ status: "error", message: "Too many lookups. Please wait a few minutes and try again." }, 429);
    case "lookup_error":
      return json({ status: "error", message: "Lookup is temporarily unavailable. Try again in a moment." }, 502);
    case "done": {
      const { result, referenceId, token } = outcome;
      if (result.status === "success") {
        return json({ status: "success", carrier: result.carrier, referenceId, token });
      }
      if (result.status === "not_found") {
        return json({ status: "not_found", referenceId });
      }
      return json({ status: "manual_required", referenceId, token });
    }
  }
}
