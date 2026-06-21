/**
 * JSON-LD node builders. The site-wide contract is shared/schema-specs.md.
 * Locale en-US, currency USD. Never encode a government/third-party fee as
 * Tech Rig's price; never fabricate values, leave unknowns out.
 *
 * Pending from the client (omitted until supplied, never guessed): the logo URL
 * and the brand-owned social profile URLs (`sameAs`).
 */
import { site } from "@/lib/site";

export const ORG_ID = `${site.url}/#org`;
export const WEBSITE_ID = `${site.url}/#website`;

/** The canonical Organization node, referenced by @id everywhere. */
export function organizationNode() {
  return {
    "@type": "ProfessionalService",
    "@id": ORG_ID,
    name: site.name,
    legalName: site.legalName,
    url: `${site.url}/`,
    telephone: site.telephone,
    email: site.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    areaServed: { "@type": "Country", name: site.address.country },
    description:
      "Tech Rig handles trucking compliance and authority setup and dispatches owner-operators and small fleets across the United States.",
    knowsAbout: [
      "FMCSA compliance",
      "USDOT registration",
      "MC operating authority",
      "BOC-3",
      "UCR",
      "IRP",
      "IFTA",
      "ELD",
      "driver qualification files",
      "truck dispatch",
    ],
  };
}

/** The WebSite node. No SearchAction (there is no on-site search). */
export function websiteNode() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: `${site.url}/`,
    name: site.name,
    publisher: { "@id": ORG_ID },
  };
}

/* People (alias-only, per author.md). The finance/strategy founder is internal
   and is never published. Real legal names never appear. These @ids are reused
   as the reviewer reference on money pages. */
export const PERSON_IDS = {
  adam: `${site.url}/#adam-smith`,
  robert: `${site.url}/#robert-hooke`,
} as const;

export type Reviewer = keyof typeof PERSON_IDS;

const people: Record<Reviewer, { name: string; knowsAbout: string[]; description: string }> = {
  adam: {
    name: "Adam Smith",
    knowsAbout: [
      "FMCSA compliance",
      "operating authority",
      "BOC-3",
      "UCR",
      "MCS-150",
      "driver compliance",
    ],
    description:
      "Co-founder of Tech Rig; leads sales and trucking-compliance operations and holds a law degree.",
  },
  robert: {
    name: "Robert Hooke",
    knowsAbout: [
      "FMCSA registration",
      "authority filings",
      "BOC-3",
      "UCR",
      "compliance systems",
    ],
    description:
      "Co-founder of Tech Rig; works across sales and compliance with a software-engineering, systems-focused background.",
  },
};

export function personNode(who: Reviewer) {
  const p = people[who];
  return {
    "@type": "Person",
    "@id": PERSON_IDS[who],
    name: p.name,
    jobTitle: "Co-Founder",
    worksFor: { "@id": ORG_ID },
    knowsAbout: p.knowsAbout,
    description: p.description,
  };
}

/**
 * A Service node for a money page. price is the Tech Rig service fee only, in
 * USD; never the government fee. Omit price for quote/verify services. We do not
 * attach a Review object: the brand rule forbids review/rating markup until a
 * real public profile exists, so E-E-A-T comes from the Person entity in the
 * graph plus the visible "Reviewed by" line.
 */
export function serviceNode(input: {
  serviceType: string;
  name?: string;
  slug: string;
  description: string;
  /** Tech Rig service fee only. Omit for quote/verify. Use the floor for "from". */
  price?: number;
  /** A US state name to scope areaServed to (state pages). Defaults to the US. */
  areaServedState?: string;
}) {
  const node: Record<string, unknown> = {
    "@type": "Service",
    serviceType: input.serviceType,
    name: input.name ?? input.serviceType,
    url: `${site.url}${input.slug}`,
    provider: { "@id": ORG_ID },
    areaServed: input.areaServedState
      ? { "@type": "State", name: input.areaServedState }
      : { "@type": "Country", name: site.address.country },
    description: input.description,
  };
  if (input.price != null) {
    node.offers = {
      "@type": "Offer",
      priceCurrency: "USD",
      price: String(input.price),
    };
  }
  return node;
}

/**
 * Article node for a blog post (schema-specs.md: Article with author and dates).
 * author/dates are omitted when unknown rather than faked. The reviewer Person
 * is referenced by @id and must be emitted in the same @graph (via personNode).
 */
export function articleNode(input: {
  slug: string;
  headline: string;
  description: string;
  author?: Reviewer;
  datePublished?: string;
  dateModified?: string;
}) {
  const url = `${site.url}${input.slug}`;
  const node: Record<string, unknown> = {
    "@type": "Article",
    headline: input.headline,
    description: input.description,
    url,
    mainEntityOfPage: url,
    publisher: { "@id": ORG_ID },
    isPartOf: { "@id": WEBSITE_ID },
  };
  if (input.author) node.author = { "@id": PERSON_IDS[input.author] };
  if (input.datePublished) node.datePublished = input.datePublished;
  if (input.dateModified ?? input.datePublished)
    node.dateModified = input.dateModified ?? input.datePublished;
  return node;
}

/** BreadcrumbList. Pass crumbs in order; omit slug on the current (last) page. */
export function breadcrumbNode(crumbs: { name: string; slug?: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      ...(c.slug ? { item: `${site.url}${c.slug}` } : {}),
    })),
  };
}

/** FAQPage. The answer text MUST match the visible copy verbatim (schema parity). */
export function faqNode(items: { q: string; a: string }[]) {
  return {
    "@type": "FAQPage",
    mainEntity: items.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

/**
 * Augments the canonical Organization node (by @id, merged across the page) with
 * a hasOfferCatalog listing the services a hub offers. Used on the hub pages,
 * which per their briefs carry no Service node of their own (each Service lives
 * on its own page).
 */
export function offerCatalogNode(
  catalogName: string,
  items: { name: string; slug: string }[],
) {
  return {
    "@type": "ProfessionalService",
    "@id": ORG_ID,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: catalogName,
      itemListElement: items.map((it) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: it.name,
          url: `${site.url}${it.slug}`,
        },
      })),
    },
  };
}

/** AboutPage node whose mainEntity is the Organization. */
export function aboutPageNode(slug: string) {
  return {
    "@type": "AboutPage",
    url: `${site.url}${slug}`,
    mainEntity: { "@id": ORG_ID },
  };
}

/** Wraps one or more nodes in a single @graph document. */
export function graph(...nodes: object[]) {
  return { "@context": "https://schema.org", "@graph": nodes };
}
