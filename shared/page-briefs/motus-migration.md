# Brief: /motus-migration/ (FMCSA Portal to MOTUS Migration)

## Meta
- **Action:** NEW service (per client 2026-06-25, Q3.2 / D5). **Bucket:** 1 (money). **Intent:** BOFU.
- **Primary:** fmcsa portal to motus migration (verify vol). **Secondaries:** claim usdot in motus, motus account help, fmcsa motus help, usdot reinstatement motus.
- **Word target:** 1,000 to 1,300.
- **URL:** `/motus-migration/`. Title carries the full service name "FMCSA Portal to MOTUS Migration."
- **Receives the relocated California legacy case study** (S2): the dismissed-MC reinstatement story moves here from `/mc-registration/` and `/mc-dot-registration/`.

## Title tag (50 chars)
`FMCSA Portal to MOTUS Migration | Tech Rig`

## Meta description (158 chars)
`Stuck moving an older FMCSA Portal account into MOTUS? Tech Rig handles claiming your USDOT, Company Official setup, and FMCSA support tickets, for a flat $125.`

## Three Kings check
Primary "FMCSA Portal to MOTUS migration" in: title (yes), first paragraph (yes), H2s ("What MOTUS migration covers", "What our MOTUS migration service costs").

## Heading outline + copy

### H1: FMCSA Portal to MOTUS Migration
**Hero lede:**
FMCSA's move from the legacy FMCSA Portal to the new MOTUS system has stranded a lot of established carriers. Records will not link, a USDOT cannot be claimed, MC authority does not show up, or the account simply will not come over. Tech Rig handles the FMCSA Portal to MOTUS migration: we get your existing record claimed and accessible in MOTUS so you can operate and file again, for a flat $125.

**Primary CTA (above fold):** button "Start my MOTUS migration" → the `/apply/` flow. [Dev wires route.]

### H2: What MOTUS migration covers
The scope the client confirmed:
- Claiming an existing USDOT number in MOTUS.
- Company Official assignment.
- Manual identity verification when the online path is blocked.
- Missing MC authority that does not appear in MOTUS.
- Legacy FMCSA Portal account problems.
- FMCSA support-ticket assistance to unlock or bridge the record.
This is for moving an OLDER account into MOTUS. For a brand-new registration, see [USDOT registration](/dot-registration/); to fix details on a record you already control, see [USDOT Correction](/usdot-correction/).

### H2: What our MOTUS migration service costs
- **$125**, flat, for handling the migration.
- Any FMCSA government fee tied to a specific filing is separate and shown before you pay.

### H2: How fast it is done
Approximately 1 to 2 weeks. MOTUS migrations depend on FMCSA processing and support response, which is outside our control, so we do not promise an exact date. We drive the tickets and the verification steps and keep you updated.

### H2: A real migration we handled
Worked example (real, relocated here; publishable, anonymized): a California box-truck owner had an older operating authority that had been dismissed and wanted it back so he could keep an aged MC for an Amazon requirement. A dismissed MC cannot simply be reinstated, so we set up his MOTUS access, filed a new operating-authority application (he keeps the old MC number, though the authority age resets), and handled the BOC-3 and UCR alongside it. He is active now and has hired a driver. The point: getting an older record working in MOTUS is rarely one click, and knowing the path is most of the job. (Frame as a past example, not a guarantee.)

### H2: MOTUS migration FAQ
FAQPage schema, Grade 8:
- "Why won't my old account work in MOTUS?" FMCSA's move off the legacy portal means many existing records have to be claimed, linked, or verified before you can use or file on them. That is what this service does.
- "Can you reinstate a dismissed MC?" A dismissed MC generally cannot be reinstated; we file a new operating-authority application and you usually keep the old MC number (the authority age resets). We handle this often.
- "Do I need a USDOT PIN?" Claiming an existing USDOT can require a USDOT PIN, which FMCSA mails to the address on record, so there may be a wait for it. We work around blocks with the FMCSA callback/support process.
- "How much and how long?" $125 flat; about 1 to 2 weeks depending on FMCSA.

### Closing CTA band
"Old account stuck outside MOTUS? We will get it claimed and working." Button "Start my MOTUS migration".

## Internal links out
`/dot-registration/` (new registration), `/usdot-correction/` (record edits), `/mc-registration/` (authority), `/compliance-services/`.

## Internal links in
From `/dot-registration/` (a "migrating an older account?" line), `/mc-registration/` and `/mc-dot-registration/` (where the dismissed-MC story used to live — link to this page instead), the hub, and the pillar.

## Schema (JSON-LD)
- `Service` (serviceType "FMCSA Portal to MOTUS migration", provider {@id #org}, areaServed US, offers price 125 USD).
- `BreadcrumbList`: Home > Compliance Services > MOTUS Migration.
- `FAQPage`.

## Proof / claims discipline
- No guaranteed FMCSA timeline. FMCSA IS still mailing USDOT PINs (do not say otherwise). The CA story is a real past example, anonymized, framed as past (not a guarantee).
- "MOTUS"/"MOTUS Portal" for current work; "legacy FMCSA Portal" only in this migration context.

## Reviewed-by
"Reviewed by Robert Hooke, Co-Founder" (systems/MOTUS fit).

## Dev / Design notes
- New registry service `motus-migration` ($125, ~1-2 week timeline). Unique branded OG image ("MOTUS Migration"). Design: reuse the locked service-page pattern (DZ1).

## Uniqueness
Lead = legacy-account-into-MOTUS; the CA dismissed-MC story lives ONLY here now (removed from the MC pages per S2).
