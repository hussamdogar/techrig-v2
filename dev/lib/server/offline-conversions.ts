import "server-only";
import { createHash } from "node:crypto";

/**
 * Offline conversions: sales that close by phone or after follow-ups, recorded
 * by staff in /admin/sales/ and uploaded to Google Ads as CSVs (Goals >
 * Uploads). Two Google formats, one per match method (see migration 0017):
 *   - 'call':  matched to Google's call record by caller number + start time
 *   - 'click': matched by the ad click id and/or the customer's email/phone
 */

/** Must match the conversion action names in Google Ads EXACTLY, or the
 *  upload is rejected. Create these two "Import" conversion actions first. */
export const OFFLINE_CONVERSION_NAMES = {
  call: "Phone sale (offline)",
  click: "Offline sale (follow-up)",
} as const;

export type MatchMethod = keyof typeof OFFLINE_CONVERSION_NAMES;

/** Staff enter times as they appear on the phone log / calendar, in US
 *  Eastern (the business's time zone). Converts "YYYY-MM-DDTHH:mm" (an
 *  <input type="datetime-local"> value) to the real UTC instant, DST-aware. */
export const BUSINESS_TIME_ZONE = "America/New_York";

export function businessLocalToUtc(local: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(local);
  if (!m) return null;
  const [, y, mo, d, h, mi] = m.map(Number);
  // Treat the wall time as UTC, see what that instant reads as in New York,
  // and shift by the difference. Done twice so a DST boundary between the
  // guess and the answer still lands on the right offset.
  const wall = Date.UTC(y, mo - 1, d, h, mi);
  let utc = wall;
  for (let i = 0; i < 2; i++) utc = wall - (zonedWallMs(utc) - utc);
  return new Date(utc);
}

/** The wall-clock time in BUSINESS_TIME_ZONE at `utcMs`, as if it were UTC. */
function zonedWallMs(utcMs: number): number {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: BUSINESS_TIME_ZONE,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
      .formatToParts(new Date(utcMs))
      .map((p) => [p.type, p.value]),
  );
  return Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour, +parts.minute, +parts.second);
}

/** Google's upload time format, in UTC (the CSV declares TimeZone=+0000). */
function googleTime(iso: string): string {
  return new Date(iso).toISOString().replace("T", " ").slice(0, 19);
}

/** Enhanced conversions for leads: SHA-256 of the normalized value. Google
 *  accepts hashed identifiers in uploads, so plain emails/phones never leave
 *  our systems inside a CSV. */
function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

/** Google's email normalization before hashing: trim, lowercase, and for
 *  gmail.com / googlemail.com drop the dots in the name part. */
function normalizeEmail(email: string): string {
  const [name, domain] = email.trim().toLowerCase().split("@");
  if (!domain) return email.trim().toLowerCase();
  return domain === "gmail.com" || domain === "googlemail.com"
    ? `${name.replace(/\./g, "")}@${domain}`
    : `${name}@${domain}`;
}

/** CSV cell: quote when needed, and neutralize leading =,+,-,@ so a value can
 *  never execute as a formula if someone opens the file in a spreadsheet
 *  (E.164 phone numbers start with + and are quoted for the same reason). */
function cell(value: string | number | null | undefined): string {
  const s = value == null ? "" : String(value);
  const safe = /^[=+\-@]/.test(s) && !/^\+\d+$/.test(s) ? `'${s}` : s;
  return /[",\n+]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
}

export type OfflineConversionRow = {
  id: string;
  match_method: MatchMethod;
  caller_phone: string | null;
  call_started_at: string | null;
  gclid: string | null;
  email: string | null;
  phone: string | null;
  sold_at: string;
  value: number;
  currency: string;
};

/** Google Ads "conversions from calls" upload file. */
export function callConversionsCsv(rows: OfflineConversionRow[]): string {
  const lines = [
    "Parameters:TimeZone=+0000",
    "Caller's Phone Number,Call Start Time,Conversion Name,Conversion Time,Conversion Value,Conversion Currency",
    ...rows.map((r) =>
      [
        cell(r.caller_phone),
        cell(r.call_started_at ? googleTime(r.call_started_at) : null),
        cell(OFFLINE_CONVERSION_NAMES.call),
        cell(googleTime(r.sold_at)),
        cell(Number(r.value).toFixed(2)),
        cell(r.currency),
      ].join(","),
    ),
  ];
  return lines.join("\n") + "\n";
}

/** Google Ads "conversions from clicks" upload file, with enhanced
 *  conversions for leads columns (hashed email / phone). Order ID is this
 *  sale's own row id (not the lead reference, which a repeat customer's second
 *  sale would share), so Google discards only a genuine re-upload. */
export function clickConversionsCsv(rows: OfflineConversionRow[]): string {
  const lines = [
    "Parameters:TimeZone=+0000",
    "Google Click ID,Conversion Name,Conversion Time,Conversion Value,Conversion Currency,Order ID,Email,Phone Number",
    ...rows.map((r) =>
      [
        cell(r.gclid),
        cell(OFFLINE_CONVERSION_NAMES.click),
        cell(googleTime(r.sold_at)),
        cell(Number(r.value).toFixed(2)),
        cell(r.currency),
        cell(r.id),
        cell(r.email ? sha256(normalizeEmail(r.email)) : null),
        cell(r.phone ? sha256(r.phone) : null),
      ].join(","),
    ),
  ];
  return lines.join("\n") + "\n";
}
