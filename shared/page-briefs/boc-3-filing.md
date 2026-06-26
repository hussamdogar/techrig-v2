# Brief: /boc-3-filing/

## Meta
- **Action:** NEW (on-domain content page; active CTA into the new `/apply/` flow). **Bucket:** 1. **Intent:** BOFU. Legacy `boc-3.techrig.org` stays live until the new flow is tested, then 301s (drain per Q6.4) — it is NEVER the active CTA.
- **Primary:** boc-3 (3,600/KD10). **Secondaries:** boc-3 filing (1,600/KD14), what is a boc-3 (480), process agent trucking.
- **Word target:** 1,500+ (intent allows slightly less if every section earns its place; do not pad).

## Title tag (52 chars)
`BOC-3 Filing for Trucking: Process Agent | Tech Rig`

## Meta description (158 chars)
`BOC-3 filing done today. As an FMCSA-listed blanket process agent, Tech Rig files your BOC-3 across all 50 states for $100, one time, so your authority can activate.`

## Three Kings check
Primary "boc-3" in: title (yes), first paragraph (yes), H2s ("What a BOC-3 is", "How our BOC-3 filing works").

## Heading outline + copy

### H1: BOC-3 Filing (Blanket Process Agent)
**Hero lede:**
A BOC-3 is one of the small filings that quietly decides whether your operating authority activates. It names a process agent in every state where you operate, someone who can receive legal documents on your behalf. No BOC-3, no active authority. DGR Tech Rig LLC is officially listed by FMCSA as a BOC-3 blanket process-agent company, so we can file your BOC-3 across all 50 states, for $100, one time.

**Primary CTA (above fold):** button "File my BOC-3" → `/apply/?service=boc-3` (the in-app application flow). Mid-page and closing CTAs use the same route. (Do NOT point the active CTA at the legacy `boc-3.techrig.org`.)

### H2: What a BOC-3 is
The BOC-3 is the federal form that designates a process agent in each state: a person or company authorized to accept legal papers for you in that state. FMCSA requires it for motor carriers, brokers, and freight forwarders before operating authority can be granted. A "blanket" process agent covers all 50 states in one filing, which is why most carriers use a blanket company instead of naming individual agents state by state. The BOC-3 is filed electronically; it is not a printed certificate FMCSA hands you, and you can verify it on your public FMCSA record.

### H2: Who needs a BOC-3, and when
- Anyone applying for operating authority (an [MC number](/mc-registration/)) needs a BOC-3 before it activates.
- Brokers and freight forwarders need one too.
- You file it once during setup. It is generally a one-time filing. You only refile if you change process agents or another specific circumstance requires it.

Important: a BOC-3 is not an annual renewal. If anyone tells you to renew your BOC-3 every year as a matter of course, that is not how it normally works. (Your [UCR](/ucr-registration/), by contrast, is annual.)

### H2: How our BOC-3 filing works
Because we are an FMCSA-listed blanket process agent, your BOC-3 is direct, not outsourced:
1. You give us your company details through our [application](/apply/?service=boc-3).
2. We file your BOC-3 designating coverage across all 50 states.
3. Your filing posts to your FMCSA record, where it can be verified.
4. If your BOC-3 is part of getting your authority, we line it up with your MC application and insurance so activation is not held up.

**Price line:** $100, one time. Filing a BOC-3 with UCR at the same time is $200 for carriers in the 0 to 2 vehicle bracket, a common new-carrier combination.

**Mid-page CTA:** text link "File my BOC-3".

### H2: BOC-3 as part of getting road-legal
Real worked example (publishable, distinct to this page): a North Carolina power-only carrier first came to us just to buy a BOC-3. When we looked at her file, her self-filed USDOT and MC were full of errors, and because she had not established her MOTUS account yet, she was locked out of fixing them online. Claiming an existing USDOT on MOTUS needs a USDOT PIN, which FMCSA mails to the carrier, so she was waiting on the letter to arrive. We moved her forward with paper filings and then an official FMCSA callback to verify her identity and unlock the record. A simple BOC-3 request turned into untangling the whole authority, which is exactly the kind of thing we catch.

### H2: BOC-3 filing FAQ
FAQPage schema, Grade 8:
- "What is a BOC-3?" A federal filing that names a process agent in every state to receive legal documents for you. It is required before operating authority can activate.
- "How much does a BOC-3 cost?" $100, one time, with us. $200 if filed together with UCR for the 0 to 2 vehicle bracket.
- "Do I have to renew my BOC-3 every year?" No. It is generally a one-time filing. You refile only if you change process agents or a specific circumstance requires it.
- "Is the BOC-3 a certificate I print?" No. It is filed electronically and shows on your public FMCSA record, where it can be verified.
- "Can you file my BOC-3 today?" Yes. As an FMCSA-listed blanket process agent we file it directly. Government processing posts it to your record after.
- "Do I need anything else for my authority to activate?" Usually your MC application, insurance filing, and UCR. We can handle the [full setup](/compliance-services/) so nothing is missed.

### Closing CTA band
"Need a BOC-3 to activate your authority? File it directly with an FMCSA-listed process agent." Button "File my BOC-3".

## Internal links out
`/mc-registration/`, `/ucr-registration/`, `/compliance-services/`. The active CTA goes to `/apply/?service=boc-3` (the in-app flow). The legacy `boc-3.techrig.org` form is a drain-only endpoint until cutover, not linked as the CTA.

## Internal links in
Hub card + package; MC page (BOC-3 is required there); UCR page (bundle); pillar; "what is a process agent / BOC-3" blog feeder if present.

## Schema (JSON-LD)
- `Service` (serviceType "BOC-3 filing", provider DGR Tech Rig LLC, areaServed US, offers price 100 USD).
- `BreadcrumbList`: Home > Compliance Services > BOC-3 Filing.
- `FAQPage`.

## Proof / claims discipline
- FMCSA wording exact: "officially listed by FMCSA as a BOC-3 blanket process-agent company." Do not imply FMCSA endorsement or that we are FMCSA.
- Do NOT describe BOC-3 as an FMCSA-issued certificate/PDF (do-not-publish list).
- Do NOT call it an annual renewal.
- No guaranteed activation timeline.

## Reviewed-by
"Reviewed by Adam Smith, Co-Founder."

## Dev / Design notes
- Unique branded OG image ("BOC-3 Filing").
- CTA routes to `/apply/?service=boc-3` (D14). The legacy `boc-3.techrig.org` stays live until the new flow is tested, then 301s (Q6.4 / D11); handle any transition submissions manually.
- Price chip from single source.

## Uniqueness
Worked example = NC power-only, BOC-3 request that surfaced a MOTUS PIN lockout. Distinct from all other pages.
