# Schema specs (JSON-LD) — site-wide contract

For the Dev agent. The machine-readable layer required by `_shared/standards.md`. All types are JSON-LD in a `<script type="application/ld+json">`. Locale en-US, currency USD. Never encode a government/third-party fee as Tech Rig's `price`. Never fabricate values; leave unknowns out rather than guessing.

## Entity model
- **Publisher / business entity:** `DGR Tech Rig LLC` (legal name), brand name `Tech Rig`. One canonical Organization node, referenced by `@id` everywhere.
- **People:** two public co-founders, published under aliases only (see `seo/context/author.md`). Real names never appear in markup. The finance/strategy founder is NOT published.

## 1. Organization (site-wide, in the global head or home)
- `@type`: `ProfessionalService` (a subtype of LocalBusiness, fits a service business with an address) with `@id` `https://techrig.org/#org`.
- `name`: "Tech Rig"; `legalName`: "DGR Tech Rig LLC".
- `url`: https://techrig.org/ ; `logo`: the team delivers the logo asset directly to the Dev staging repo; Dev wires the hosted path here ; `image`: same.
- `telephone`: +1-917-909-2257 ; `email`: info@techrig.org.
- `address` (`PostalAddress`): 30 N Gould St, Ste R, Sheridan, WY 82801, US. (Registered address; do not add `openingHours` or imply a walk-in office.)
- `areaServed`: United States (`Country` "US").
- `sameAs` (brand profiles, confirmed 2026-06-21): `https://www.facebook.com/Techrigllc`, `https://www.instagram.com/tech_rig/`, `https://www.linkedin.com/company/tech-rig`, `https://www.tiktok.com/@tech_rig`, `https://share.google/YidOXkc3mu7ZlQqEq` (Google Business Profile).
- `description`: one sentence from the About blurb in `author.md`.
- `knowsAbout`: FMCSA compliance, USDOT registration, MC operating authority, BOC-3, UCR, IRP, IFTA, ELD, driver qualification files, truck dispatch.
- Optional `hasOfferCatalog` on the hub referencing each Service.
- Do NOT add `aggregateRating`/`review` until a real public review profile exists (do-not-publish list).

## 2. Person (two, alias-only) — for /about-us/ and as `author`/`reviewer`
Two nodes, referenced by `@id`:
- `https://techrig.org/#adam-smith` — `name` "Adam Smith", `jobTitle` "Co-Founder", `worksFor` {@id #org}, `knowsAbout` [FMCSA compliance, operating authority, BOC-3, UCR, MCS-150, driver compliance], `description` from `author.md` (law background). `sameAs` only if alias-owned profiles are supplied.
- `https://techrig.org/#robert-hooke` — `name` "Robert Hooke", `jobTitle` "Co-Founder", `worksFor` {@id #org}, `knowsAbout` [FMCSA registration, authority filings, BOC-3, UCR, compliance systems], `description` from `author.md` (software-engineering background).
- These `@id`s are reused as the `reviewer` on money pages and `author` on expert articles.

## 3. Service (one per money page)
Template (fill per brief's "Schema" block):
- `@type`: `Service`; `serviceType`: per brief (e.g. "UCR registration").
- `provider`: {@id #org}.
- `areaServed`: US.
- `offers` (`Offer`): `priceCurrency` "USD", `price` = Tech Rig service fee only (e.g. "100", "300", "600", "125"). For UCR use the service fee ("100") and describe the government fee in copy, not in `price`. Omit `price` where it is on hold (FMCSA authority letter, LLC/consultancy).
- `provider` carries the FMCSA-listed process-agent fact in copy, not as a schema credential claim.
- Money pages add `review`/`reviewer` referencing the relevant Person `@id` ("Reviewed by ...").

Per-page serviceType + price: USDOT registration 300 · MC operating authority 600 · BOC-3 filing 100 · UCR registration 100 (from) · MCS-150 update 125 · IRP registration [service fee VERIFY] · IFTA registration [VERIFY] · Clearinghouse 100 · drug & alcohol consortium 150 · DQ file 200 · ELD setup [VERIFY] · trucking LLC [Contact for quote, omit price].

## 4. FAQPage (pages with a real FAQ block)
- One `FAQPage` per page that has Q&A, each `Question` + `acceptedAnswer` matching the visible copy verbatim (no hidden/extra Q&A; Google requires parity).
- Present in batch-1 briefs: hub, UCR, MCS-150, DOT, MC, BOC-3.

## 5. BreadcrumbList (every page)
- Home > Compliance Services > [Page]. Compliance filing pages nest under the hub even though URLs are flat (breadcrumb is logical, not path-based). Dispatch pages: Home > Dispatch Services > [Page].

## 6. Article (blog posts only)
- `@type` `Article` (or `BlogPosting`), `author` = a Person `@id` (alias) for expert posts or {@id #org} for brand posts, `publisher` {@id #org}, `datePublished` + `dateModified` (real dates), `image`, `headline` (matches H1, no banned words).

## 7. Open Graph + Twitter (every page)
- Unique per page: `og:title`, `og:description`, `og:url`, `og:image` (a unique branded image generated per page by Dev, never a placeholder), `og:type` (website/article), `twitter:card` summary_large_image.

## 8. llms.txt (site root)
- Generate `/llms.txt` listing the brand, what Tech Rig does, the compliance and dispatch service URLs with one-line descriptions, and contact. Keep claims aligned with `brand-guidelines.md` (FMCSA wording, no guarantees).

## Global guardrails (recap from brand-guidelines.md)
- No `aggregateRating`/`review` stars until a real public profile exists.
- No `priceValidUntil`/guaranteed-timeline style claims.
- FMCSA wording exact; never imply government affiliation/endorsement.
- Real names never in markup; aliases only.
