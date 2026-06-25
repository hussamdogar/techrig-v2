# Brief: /ifta-quarterly-filing/

## Meta
- **Action:** NEW (per client 2026-06-25, Q3.1 / D4). **Bucket:** 1 (money). **Intent:** BOFU.
- **Primary:** ifta quarterly filing (verify vol). **Secondaries:** file ifta, ifta return service, ifta reporting.
- **Word target:** 800 to 1,100.
- **Distinct from `/ifta-registration/`** (the $175 setup). This is the recurring per-quarter return-filing service.

## Title tag (43 chars)
`IFTA Quarterly Filing Service | Tech Rig`

## Meta description (157 chars)
`Hand off your IFTA quarterly filing. Tech Rig prepares and files your fuel-tax return from your mileage and fuel records each quarter, for $150 plus the tax due.`

## Three Kings check
Primary "ifta quarterly filing" in: title (yes), first paragraph (yes), H2s ("What IFTA quarterly filing is", "What our IFTA quarterly filing costs").

## Heading outline + copy

### H1: IFTA Quarterly Filing Service
**Hero lede:**
IFTA is not a one-time setup. Every quarter you have to file a fuel-tax return that reconciles the miles you ran against the fuel you bought in each state, and a late or wrong return means penalties and audit risk. Tech Rig handles your IFTA quarterly filing: you send your mileage and fuel records, we prepare and file the return. Already set up for IFTA? This is the ongoing service that keeps you current.

**Primary CTA (above fold):** button "File my IFTA quarter" → the `/apply/` flow. [Dev wires route.]

### H2: What IFTA quarterly filing is
After your [IFTA registration](/ifta-registration/) is in place, you owe a return every quarter. The return totals your miles and fuel by jurisdiction and settles the difference, you either owe tax or carry a credit. Keeping clean mileage and fuel records as you go is what makes each quarter simple. We do the preparation and filing from those records.

### H2: What our IFTA quarterly filing costs
- **$150 per quarter**, our service fee, **plus any fuel tax due** to the jurisdictions (that government amount depends on your miles and fuel and is separate).
- This is a recurring service. We remind you before each quarterly deadline and invoice the filing; we only auto-charge if you have expressly agreed to it.

### H2: How fast it is done
Within 1 to 3 business days after we have your complete mileage and fuel records for the quarter. The sooner your records are in, the sooner we file ahead of the deadline.

### H2: IFTA quarterly filing FAQ
FAQPage schema, Grade 8:
- "How is this different from IFTA registration?" [IFTA registration](/ifta-registration/) is the one-time $175 setup. This is the recurring quarterly return you owe after you are set up.
- "What does it cost?" $150 per quarter for our service, plus any fuel tax due to the jurisdictions.
- "What do you need from me?" Your mileage and fuel records for the quarter. With complete records we file within 1 to 3 business days.
- "How often is it due?" Quarterly. We remind you before each deadline.

### Closing CTA band
"Quarter coming due? Send your records and we will file your IFTA return." Button "File my IFTA quarter".

## Internal links out
`/ifta-registration/`, `/irp-registration/`, `/compliance-services/`.

## Internal links in
`/ifta-registration/` (links to the recurring service); hub card; pillar (interstate cluster).

## Schema (JSON-LD)
- `Service` (serviceType "IFTA quarterly filing", provider {@id #org}, areaServed US, offers price 150 USD; do not encode the tax-due amount as the price).
- `BreadcrumbList`: Home > Compliance Services > IFTA Quarterly Filing.
- `FAQPage`.

## Proof / claims discipline
- $150 is the service fee; the fuel tax due is separate (government), never encoded as the price. Recurring billing = reminder + manual invoice; auto-charge only with consent (do not promise an automated reminder the system does not yet do).

## Reviewed-by
"Reviewed by Robert Hooke, Co-Founder."

## Dev / Design notes
- Registry entry already exists ($150 + gov). Currently only a section inside `ifta-registration/page.tsx`; build as a dedicated page. Unique branded OG image ("IFTA Quarterly Filing").

## Uniqueness
Lead = recurring quarterly return vs the one-time setup; distinct from `/ifta-registration/`.
