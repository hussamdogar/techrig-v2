import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";

/**
 * PDF generation (M6, pdf-lib). Two documents per completed application: an
 * acknowledgement (the FMCSA legal certification + the captured signature) and an
 * answers sheet (the application data as a Q&A list). Both paginate. Ported from
 * the legacy techrig-form pdfGenerator; the legal text is kept faithful (it is a
 * regulatory certification, not marketing copy).
 */

const PAGE = { w: 600, h: 850 };
const MARGIN = 44;
const SIZE = 10;
const LINE = SIZE + 4;

type Writer = { doc: PDFDocument; font: PDFFont; bold: PDFFont; page: PDFPage; y: number };

function newPage(w: Writer) {
  w.page = w.doc.addPage([PAGE.w, PAGE.h]);
  w.y = PAGE.h - MARGIN;
}

function wrap(font: PDFFont, textIn: string, size: number, maxWidth: number): string[] {
  const out: string[] = [];
  for (const para of textIn.split("\n")) {
    if (para.trim() === "") {
      out.push("");
      continue;
    }
    let line = "";
    for (const word of para.split(" ")) {
      const next = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(next, size) > maxWidth && line) {
        out.push(line);
        line = word;
      } else {
        line = next;
      }
    }
    if (line) out.push(line);
  }
  return out;
}

function writeLines(w: Writer, lines: string[], opts: { bold?: boolean; size?: number } = {}) {
  const size = opts.size ?? SIZE;
  const font = opts.bold ? w.bold : w.font;
  const lh = size + 4;
  for (const line of lines) {
    if (w.y < MARGIN + lh) newPage(w);
    if (line !== "") w.page.drawText(line, { x: MARGIN, y: w.y, size, font, color: rgb(0.1, 0.1, 0.1) });
    w.y -= lh;
  }
}

function para(w: Writer, textIn: string, bold = false) {
  writeLines(w, wrap(bold ? w.bold : w.font, textIn, SIZE, PAGE.w - MARGIN * 2), { bold });
  w.y -= 6; // paragraph spacing
}

async function startDoc(): Promise<Writer> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const w: Writer = { doc, font, bold, page: doc.addPage([PAGE.w, PAGE.h]), y: PAGE.h - MARGIN };
  return w;
}

const ACK_PARAGRAPHS = (fullName: string): string[] => [
  `I, ${fullName}, certify that I am familiar with the Federal Motor Carrier Safety Regulations and, if applicable, the Federal Hazardous Materials Regulations and the Federal Motor Carrier Commercial Regulations. Under penalties of perjury, under the laws of the United States of America, I certify that all information supplied on this form or relating to this application is true and correct. I further certify that I am qualified and authorized to file this application. I understand that willful misstatements or omissions of material facts constitute Federal criminal violations punishable under 18 U.S.C. section 1001 by imprisonment up to 5 years and fines up to $250,000 for each offense.`,
  `I, ${fullName}, the applicant, am willing and able to produce for review or inspection any documents requested for the purpose of determining compliance with applicable statutes and regulations administered by the Department of Transportation. I understand that I must produce such documents within 48 hours of any written request.`,
  `I, ${fullName}, further certify, under penalty of perjury, that I have not been convicted, after September 1, 1989, of any Federal or State offense involving the distribution or possession of a controlled substance, or that if I have, I am not ineligible to receive Federal benefits pursuant to Section 5301 of the Anti-Drug Abuse Act of 1988 (21 U.S.C. section 826).`,
  `By submitting this form and application to Tech Rig, I certify that all information I have provided is accurate and truthful. I authorize Tech Rig to act on my behalf in all matters related to FMCSA registration, including applying for a USDOT number, MC number, and any associated filings or compliance actions.`,
  `I authorize Tech Rig to create and manage a login.gov account on my behalf to facilitate the processing of my FMCSA registration. I grant Tech Rig permission to communicate with the FMCSA using the information I have provided and to represent my interests as necessary to complete the registration.`,
  `I agree to be contacted by Tech Rig via phone, email, and SMS for updates regarding my application and related services. Message and data rates may apply. I may reply STOP to unsubscribe.`,
  `I understand and accept that once my application process has started, all service fees are final and non-refundable, regardless of the outcome of the application or any decision made by the FMCSA.`,
  `I acknowledge that I have reviewed and accepted Tech Rig's Terms of Service, Privacy Policy, and Refund Policy, and the Power of Attorney provided by Tech Rig, granting Tech Rig the authority to act on my behalf as specified.`,
];

export async function generateAcknowledgementPDF(d: {
  fullName: string;
  signatureName: string;
  referenceId: string;
  acceptedAt?: string;
}): Promise<Uint8Array> {
  const w = await startDoc();
  const name = d.fullName || "the applicant";
  para(w, "Acknowledgement Agreement", true);
  para(w, `Reference: ${d.referenceId}`);
  for (const p of ACK_PARAGRAPHS(name)) para(w, p);
  w.y -= 10;
  para(w, `Signed: ${d.signatureName || name}`, true);
  const when = d.acceptedAt ? new Date(d.acceptedAt) : null;
  para(w, `Accepted: ${when && !Number.isNaN(when.getTime()) ? when.toUTCString() : "on submission"}`);
  return w.doc.save();
}

export async function generateAnswersPDF(d: {
  referenceId: string;
  rows: { label: string; value: string }[];
}): Promise<Uint8Array> {
  const w = await startDoc();
  para(w, "Application Answers", true);
  para(w, `Reference: ${d.referenceId}`);
  w.y -= 4;
  for (const row of d.rows) {
    writeLines(w, wrap(w.bold, row.label, SIZE, PAGE.w - MARGIN * 2), { bold: true });
    writeLines(w, wrap(w.font, row.value || "Not provided", SIZE, PAGE.w - MARGIN * 2));
    w.y -= 6;
  }
  return w.doc.save();
}
