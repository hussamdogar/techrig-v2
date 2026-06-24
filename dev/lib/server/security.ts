/**
 * Server-only security helpers (M1). Ported from boc3-form-new `api/_security.ts`:
 *  - HMAC-signed lead access token (pre-account resume-by-link, 7d TTL). We store
 *    only the token HASH in the DB and hand the token to the client once.
 *  - Rate limiting via Vercel KV with an in-memory fallback when KV is down.
 * Adapted from the legacy Node `req` object to the App Router `Headers`.
 * Never log raw tokens or PII (standards / architecture §7).
 */
import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

const DEFAULT_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

type LeadTokenPayload = { leadId: string; referenceId?: string; exp: number };

function base64UrlEncode(value: string | Buffer): string {
  return Buffer.from(value).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
function base64UrlDecode(value: string): Buffer {
  const padded = value.padEnd(value.length + ((4 - (value.length % 4)) % 4), "=");
  return Buffer.from(padded.replace(/-/g, "+").replace(/_/g, "/"), "base64");
}
function getTokenSecret(): string {
  const secret = process.env.LEAD_ACCESS_TOKEN_SECRET;
  if (!secret) throw new Error("Missing LEAD_ACCESS_TOKEN_SECRET environment variable.");
  return secret;
}
function sign(encodedPayload: string): string {
  return base64UrlEncode(createHmac("sha256", getTokenSecret()).update(encodedPayload).digest());
}

/** Mint a signed lead token. The token is returned to the client; only its hash is stored. */
export function createLeadAccessToken({
  leadId,
  referenceId,
  ttlMs = DEFAULT_TOKEN_TTL_MS,
}: {
  leadId: string;
  referenceId?: string | null;
  ttlMs?: number;
}): string {
  const payload: LeadTokenPayload = {
    leadId: leadId.trim(),
    ...(referenceId ? { referenceId: referenceId.trim() } : {}),
    exp: Date.now() + ttlMs,
  };
  const encoded = base64UrlEncode(JSON.stringify(payload));
  return `${encoded}.${sign(encoded)}`;
}

/** Constant-time verify of a lead token against an expected lead/reference. */
export function verifyLeadAccessToken(
  token: unknown,
  expectedLeadId: string,
  expectedReferenceId?: string | null,
): boolean {
  const value = String(token || "").trim();
  const leadId = expectedLeadId.trim();
  if (!value || !leadId) return false;

  const [encoded, signature] = value.split(".");
  if (!encoded || !signature) return false;

  const expected = sign(encoded);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;

  try {
    const payload = JSON.parse(base64UrlDecode(encoded).toString("utf8")) as LeadTokenPayload;
    if (payload.leadId !== leadId || payload.exp < Date.now()) return false;
    const ref = String(expectedReferenceId || "").trim();
    if (ref && payload.referenceId && payload.referenceId !== ref) return false;
    return true;
  } catch {
    return false;
  }
}

/** Stable hash of a token for at-rest storage (we never store the raw token). */
export function hashAccessToken(token: string): string {
  return createHmac("sha256", getTokenSecret()).update(token).digest("hex");
}

/**
 * Verify a lead token's signature + expiry and return its payload, WITHOUT
 * needing the leadId up front (the lead→account claim reads the leadId out of the
 * token). Returns null if the signature is bad, the token is malformed, or it has
 * expired.
 */
export function decodeLeadAccessToken(
  token: unknown,
): { leadId: string; referenceId?: string } | null {
  const value = String(token || "").trim();
  const [encoded, signature] = value.split(".");
  if (!encoded || !signature) return null;

  const expected = sign(encoded);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  try {
    const payload = JSON.parse(base64UrlDecode(encoded).toString("utf8")) as LeadTokenPayload;
    if (typeof payload.leadId !== "string" || payload.exp < Date.now()) return null;
    return { leadId: payload.leadId, referenceId: payload.referenceId };
  } catch {
    return null;
  }
}

/** Minimal header accessor: satisfied by both `Headers` and Next's ReadonlyHeaders. */
type HeaderGetter = { get(name: string): string | null };

/** Client IP from the proxy headers (Vercel sets x-forwarded-for). */
export function getClientIp(headers: HeaderGetter): string {
  const forwarded = headers.get("x-forwarded-for") || "";
  return forwarded.split(",")[0]?.trim() || headers.get("x-real-ip") || "unknown";
}

// In-memory fallback so a KV outage degrades to per-instance limiting, not failure.
const memoryStore = new Map<string, { count: number; resetAt: number }>();
function checkInMemory(rlKey: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = memoryStore.get(rlKey);
  if (!entry || entry.resetAt < now) {
    memoryStore.set(rlKey, { count: 1, resetAt: now + windowMs });
    return true;
  }
  entry.count += 1;
  return entry.count <= limit;
}

/**
 * Sliding-window rate limit keyed by route + IP. KV primary (shared across
 * instances), in-memory fallback. Returns true if the request is allowed.
 */
export async function checkRateLimit({
  headers,
  key,
  limit,
  windowMs,
}: {
  headers: HeaderGetter;
  key: string;
  limit: number;
  windowMs: number;
}): Promise<boolean> {
  const rlKey = `rate-limit:${key}:${getClientIp(headers)}`;
  try {
    const { kv } = await import("@vercel/kv");
    const count = await kv.incr(rlKey);
    if (count === 1) await kv.expire(rlKey, Math.ceil(windowMs / 1000));
    return count <= limit;
  } catch (error) {
    console.error("KV rate limit failed; using in-memory fallback:", error);
    return checkInMemory(rlKey, limit, windowMs);
  }
}

/** USDOT format guard (architecture §7): digits only, 1 to 12 chars. */
export function isValidUsdot(value: unknown): boolean {
  return /^\d{1,12}$/.test(String(value || "").trim());
}
