import { getAdminUser } from "@/lib/server/admin";
import { checkRateLimit } from "@/lib/server/security";
import { transitionFiling } from "@/lib/server/filing-transition";

/**
 * POST /api/filings/[id]/transition  (M5). Admin-only filing status transition.
 * Server-side admin gate, rate-limited; delegates the state-machine validation +
 * event write to transitionFiling(). Returns 403 (not admin), 422 (disallowed
 * transition), or the new status. Never client-writable (the gate + service role).
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const json = (body: unknown, status = 200) => Response.json(body, { status, headers: { "X-Robots-Tag": "noindex" } });

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminUser();
  if (!admin) return json({ error: "Forbidden" }, 403);

  if (!(await checkRateLimit({ headers: request.headers, key: "filing-transition", limit: 120, windowMs: 15 * 60 * 1000 }))) {
    return json({ error: "Too many requests." }, 429);
  }

  const { id } = await params;
  let body: { to_status?: unknown; note?: unknown };
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid request." }, 400);
  }

  const result = await transitionFiling(admin.id, id, body.to_status, typeof body.note === "string" ? body.note : null);
  return result.ok ? json(result) : json({ error: result.error }, result.code);
}
