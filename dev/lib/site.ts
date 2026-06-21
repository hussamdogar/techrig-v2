/**
 * Site-wide constants. Single source for brand names, NAP, and the regulated
 * FMCSA wording, reused by the header, footer, JSON-LD, and llms.txt so these
 * never drift. Values come from shared/schema-specs.md and project_config.md.
 *
 * Brand discipline: public brand is "Tech Rig"; the legal entity
 * "DGR Tech Rig LLC" appears only in the footer trust line, legal pages, and
 * schema. Never imply FMCSA endorsement or government affiliation.
 */
export const site = {
  name: "Tech Rig",
  legalName: "DGR Tech Rig LLC",
  url: "https://techrig.org",

  // Contact. telHref is the dialable form; telephone is the display form.
  telephone: "+1 917-909-2257",
  telHref: "tel:+19179092257",
  email: "info@techrig.org",

  // Registered address. Do not present as a walk-in office or add hours.
  address: {
    street: "30 N Gould St, Ste R",
    locality: "Sheridan",
    region: "WY",
    postalCode: "82801",
    country: "US",
  },

  areaServed: "United States",

  // Styled positioning line for the footer (a paragraph, never a heading).
  positioning:
    "Trucking compliance and dispatch, from your first filing to your next load.",

  // Regulated wording. Exact, never implying endorsement. Do not edit.
  fmcsaLine:
    "DGR Tech Rig LLC is officially listed by FMCSA as a BOC-3 blanket process-agent company.",
} as const;

/**
 * Where the transactional filing CTAs ("File my UCR", etc.) route. [VERIFY]:
 * the briefs target the intake form / /get-started; until Dev confirms that
 * route, they point to /contact-us/ (per the briefs). Centralised so confirming
 * the real route is a one-line change.
 */
export const filingCtaHref = "/contact-us/";

/**
 * Brand-owned social profiles. PENDING from the client: the array is empty, so
 * the footer social slot renders nothing (we never link to a placeholder or
 * "#"). When real alias/brand-owned URLs arrive, add them here and the footer
 * row populates automatically.
 */
export type SocialLink = { label: string; href: string };
export const socialLinks: SocialLink[] = [];
