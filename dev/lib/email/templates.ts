import { site } from "@/lib/site";

/**
 * Email templates (M6). Functional copy in brand voice: plain, em-dash-free, no
 * AI-tell filler. Honors the reframe: Tech Rig never "files your insurance" or
 * "sets up your ELD"; those are coordinate/referral only and never appear here.
 * Each template returns { subject, html, text }. A shared layout wraps the body;
 * promotional emails (the 72h coupon) carry the CAN-SPAM address + unsubscribe.
 */
export type RenderedEmail = { subject: string; html: string; text: string };

const BRAND = site.name;
const ADDRESS = `${site.legalName}, ${site.address.street}, ${site.address.locality}, ${site.address.region} ${site.address.postalCode}`;

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function layout({ heading, body, promoFooter }: { heading: string; body: string; promoFooter?: string }): string {
  return `<!doctype html><html><body style="margin:0;background:#f4f4f1;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#1a1a1a">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:24px">
    <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden">
      <tr><td style="padding:20px 28px;border-bottom:1px solid #ececec;font-weight:800;font-size:18px;letter-spacing:-0.02em">${BRAND}</td></tr>
      <tr><td style="padding:28px">
        <h1 style="margin:0 0 16px;font-size:22px;letter-spacing:-0.02em">${heading}</h1>
        ${body}
      </td></tr>
      <tr><td style="padding:18px 28px;border-top:1px solid #ececec;font-size:12px;color:#6b7280">
        ${BRAND} · <a href="mailto:${site.email}" style="color:#2f5d8a">${site.email}</a> · ${esc(site.telephone)}
        ${promoFooter ?? ""}
      </td></tr>
    </table>
  </td></tr></table></body></html>`;
}

const btn = (href: string, label: string) =>
  `<a href="${href}" style="display:inline-block;background:#1a1a1a;color:#fff;text-decoration:none;padding:11px 20px;border-radius:8px;font-weight:600">${label}</a>`;

const p = (s: string) => `<p style="margin:0 0 14px;font-size:15px;line-height:1.55">${s}</p>`;
const text = (...lines: string[]) => lines.join("\n\n") + `\n\n${BRAND} · ${site.email} · ${site.telephone}`;

// ---------------------------------------------------------------- welcome
export function welcomeEmail(d: { referenceId: string; companyName?: string | null }): RenderedEmail {
  const who = d.companyName ? esc(d.companyName) : "your carrier";
  return {
    subject: `Your ${BRAND} reference ${d.referenceId}`,
    html: layout({
      heading: "We've got your details",
      body:
        p(`Thanks for starting with ${BRAND}. We pulled the FMCSA record for ${who} and saved your reference <strong>${esc(d.referenceId)}</strong>.`) +
        p(`When you're ready, pick the filings you need and we'll take it from there.`) +
        p(btn(`${site.url}/dashboard/`, "Continue your application")),
    }),
    text: text(
      "We've got your details",
      `Thanks for starting with ${BRAND}. We pulled the FMCSA record for ${who} and saved your reference ${d.referenceId}.`,
      `Continue your application: ${site.url}/dashboard/`,
    ),
  };
}

// ---------------------------------------------------------------- receipt
export function receiptEmail(d: { referenceId: string; amount: number; services: string[] }): RenderedEmail {
  const list = d.services.map((s) => `<li>${esc(s)}</li>`).join("");
  return {
    subject: `Payment received, reference ${d.referenceId}`,
    html: layout({
      heading: "Payment received",
      body:
        p(`We've received your payment of <strong>$${d.amount.toLocaleString("en-US")}</strong> for reference <strong>${esc(d.referenceId)}</strong>. Your filings are queued.`) +
        `<ul style="margin:0 0 14px;padding-left:20px;font-size:15px;line-height:1.6">${list}</ul>` +
        p(`Government and state fees, where they apply, are paid to the agency directly and are shown separately.`) +
        p(btn(`${site.url}/dashboard/`, "Track your filings")),
    }),
    text: text(
      "Payment received",
      `We've received your payment of $${d.amount.toLocaleString("en-US")} for reference ${d.referenceId}. Your filings are queued.`,
      d.services.map((s) => `- ${s}`).join("\n"),
      `Track your filings: ${site.url}/dashboard/`,
    ),
  };
}

// ---------------------------------------------------------------- 24h reminder
export function reminder24hEmail(d: { referenceId: string; resumeUrl: string }): RenderedEmail {
  return {
    subject: `Pick up where you left off, ${d.referenceId}`,
    html: layout({
      heading: "Still need to file?",
      body:
        p(`You started an application with ${BRAND} (reference <strong>${esc(d.referenceId)}</strong>) but haven't finished. We kept everything saved.`) +
        p(`We handle the paperwork, track each filing, and keep you posted at every step.`) +
        p(btn(d.resumeUrl, "Finish your application")),
    }),
    text: text(
      "Still need to file?",
      `You started an application with ${BRAND} (reference ${d.referenceId}) but haven't finished. We kept everything saved.`,
      `Finish your application: ${d.resumeUrl}`,
    ),
  };
}

// ---------------------------------------------- 72h reminder + coupon (PROMOTIONAL)
export function reminder72hEmail(d: { referenceId: string; resumeUrl: string; couponCode: string; unsubscribeUrl: string }): RenderedEmail {
  const promoFooter = `<div style="margin-top:10px">${ADDRESS}.<br><a href="${d.unsubscribeUrl}" style="color:#6b7280">Unsubscribe from reminders</a></div>`;
  return {
    subject: `A little off to finish your filing, ${d.referenceId}`,
    html: layout({
      heading: "Here's a hand to get it done",
      body:
        p(`Your application (reference <strong>${esc(d.referenceId)}</strong>) is still open. To help you across the line, use code <strong>${esc(d.couponCode)}</strong> at checkout.`) +
        p(`We file with FMCSA, track every step, and tell you the moment something changes.`) +
        p(btn(d.resumeUrl, "Finish and save")),
      promoFooter,
    }),
    text: text(
      "Here's a hand to get it done",
      `Your application (reference ${d.referenceId}) is still open. Use code ${d.couponCode} at checkout.`,
      `Finish and save: ${d.resumeUrl}`,
      `${ADDRESS}.`,
      `Unsubscribe: ${d.unsubscribeUrl}`,
    ),
  };
}

// ---------------------------------------------------------------- final per-service
export function finalEmail(d: { referenceId: string; companyName?: string | null; services: string[] }): RenderedEmail {
  const who = d.companyName ? esc(d.companyName) : "your carrier";
  const list = d.services.map((s) => `<li>${esc(s)}</li>`).join("");
  return {
    subject: `Your filings are complete, ${d.referenceId}`,
    html: layout({
      heading: "All done",
      body:
        p(`The work for ${who} (reference <strong>${esc(d.referenceId)}</strong>) is complete. Here's what we handled:`) +
        `<ul style="margin:0 0 14px;padding-left:20px;font-size:15px;line-height:1.6">${list}</ul>` +
        p(`Your acknowledgement and a copy of your answers are attached for your records.`) +
        p(btn(`${site.url}/dashboard/`, "View your documents")),
    }),
    text: text(
      "All done",
      `The work for ${who} (reference ${d.referenceId}) is complete. We handled:`,
      d.services.map((s) => `- ${s}`).join("\n"),
      "Your acknowledgement and answers are attached.",
      `${site.url}/dashboard/`,
    ),
  };
}

// ---------------------------------------------------------------- status change
export function statusChangeEmail(d: { referenceId: string; serviceName: string; statusLabel: string; statusMeaning: string }): RenderedEmail {
  return {
    subject: `${d.serviceName}: ${d.statusLabel}, ${d.referenceId}`,
    html: layout({
      heading: `${esc(d.serviceName)} update`,
      body:
        p(`Your <strong>${esc(d.serviceName)}</strong> filing (reference <strong>${esc(d.referenceId)}</strong>) is now <strong>${esc(d.statusLabel)}</strong>.`) +
        p(esc(d.statusMeaning)) +
        p(btn(`${site.url}/dashboard/`, "See full progress")),
    }),
    text: text(
      `${d.serviceName} update`,
      `Your ${d.serviceName} filing (reference ${d.referenceId}) is now ${d.statusLabel}. ${d.statusMeaning}`,
      `See full progress: ${site.url}/dashboard/`,
    ),
  };
}
