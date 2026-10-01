/**
 * Normalize a phone number to E.164 (what Google Ads requires for enhanced
 * conversions and call-conversion uploads). Carriers here are US/Canada
 * (NANP), so a bare 10- or 11-digit number gets +1; anything unrecognisable
 * returns undefined, never a guess.
 */
export function toE164(phone: string | null | undefined): string | undefined {
  if (!phone) return undefined;
  const digits = phone.replace(/\D/g, "");
  if (phone.trim().startsWith("+") && digits.length >= 8 && digits.length <= 15) return `+${digits}`;
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return undefined;
}
