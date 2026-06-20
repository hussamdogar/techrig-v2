# Brief: /about-us/

## Meta
- **Action:** PRESERVE + REBUILD (page is live and engaged, pos 4.1, but must be ADDED to the sitemap and rebuilt for E-E-A-T). **Bucket:** 2. **Intent:** navigational / trust.
- **Primary:** about Tech Rig / brand. **Secondaries:** trucking compliance experts, FMCSA process agent.
- **Word target:** 800 to 1,200.
- **Critical:** founders appear under ALIASES only (Adam Smith, Robert Hooke). Real names never on the page or in schema. Finance/strategy founder is NOT published. See `author.md`.

## Title tag (38 chars)
`About Tech Rig | Trucking Compliance`

## Meta description (151 chars)
`About Tech Rig: a trucking compliance and dispatch team helping carriers since 2021. FMCSA-listed BOC-3 process agent, led by hands-on co-founders.`

## Three Kings check
Brand page; ensure "Tech Rig" and "trucking compliance" appear in the first paragraph and a H2.

## Heading outline + copy

### H1: About Tech Rig
**Lede:**
Tech Rig is a trucking compliance and dispatch company built by people who do the filings, not just talk about them. Since 2021 we have helped new motor carriers, owner-operators, and brokers get set up and stay loaded, across more than 10 states. We are officially listed by FMCSA as a BOC-3 blanket process-agent company.

### H2: What we do
Two short lines with links:
We handle the two things a trucking business needs: getting legally set up and staying that way (see [compliance services](/compliance-services/)), and keeping the truck earning once you are active (see [dispatch](/services/)). One team for the whole journey, from your first filing to your next load.

### H2: Our track record
Documented only:
- Dispatching carriers since 2021, around 100 served.
- A compliance practice that has helped 40+ carriers, owner-operators, and brokers across more than 10 states since 2025.
- Officially listed by FMCSA as a BOC-3 blanket process-agent company.
- Working relationships with Motive (ELD) and OTR Solutions and RTS Financial (factoring).

### H2: Meet the team
Two founder cards, aliases only.

**Adam Smith, Co-Founder.**
Adam leads our sales and trucking-compliance operations. He works directly with new motor carriers, owner-operators, and brokers to spot registration issues, complete the required filings, and untangle problems with operating authority, BOC-3, UCR, MCS-150 records, and driver compliance. His law background shows in how carefully he handles regulatory requirements and documentation.

**Robert Hooke, Co-Founder.**
Robert works across sales and compliance, helping clients with FMCSA registration, authority filings, BOC-3, UCR, and related requirements. A software engineer by training, he brings a systems mindset to how we manage client information, filings, and compliance workflows, which is part of why we move quickly on things like MOTUS issues.

(Do NOT add a third founder. Do NOT publish real names. Photos optional; if used, they must be consistent with the aliases and the client must supply/approve them.)

### H2: How we work
- We tell you which filings actually apply to your operation, not a one-size list.
- We separate our service fee from government and third-party costs, every time.
- We do not promise activation dates we cannot control, and we do not publish numbers we cannot back up.

### Closing CTA band
"Want a team that handles setup and keeps you loaded? Talk to us." Button "Contact Tech Rig" → `/contact-us/`.

## Internal links out
`/compliance-services/`, `/services/`, `/how-to-start-a-trucking-company/`, `/contact-us/`.

## Internal links in
Home, footer, money pages' "Reviewed by" links point to the matching founder anchor here.

## Schema (JSON-LD)
- `AboutPage` wrapping the content, `mainEntity` = the Organization {@id #org}.
- Two `Person` nodes: `#adam-smith` and `#robert-hooke` per `schema-specs.md`, `worksFor` {@id #org}, `jobTitle` "Co-Founder", `knowsAbout` lists, `description` from the bios above. `sameAs` only if alias-owned profiles are supplied.
- `BreadcrumbList`: Home > About.

## Proof / claims discipline
- Aliases only; real names never in copy or markup (the entire point of the alias strategy).
- No "5-star"/ratings, no performance metrics.
- FMCSA wording exact; "law background" stated as background, not a license to practice law for clients.

## Dev / Design notes
- Unique branded OG image ("About Tech Rig").
- The two Person `@id`s here are the canonical author/reviewer entities reused across money pages and blog posts.
- ADD this page to the XML sitemap (it was missing).

## Uniqueness
Bios are unique to this page; the founder roles/credentials are not repeated verbatim elsewhere (money pages use only the short "Reviewed by [name], Co-Founder" line).
