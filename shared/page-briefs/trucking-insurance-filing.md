# Brief: /trucking-insurance-filing/

## Meta
- **Action:** NEW (low priority; build last). **Bucket:** 1. **Intent:** navigational / BOFU (CPC ~$33, very low volume).
- **Primary:** bmc-91 filing (70/KD1). **Secondaries:** trucking insurance filing, fmcsa insurance filing, proof of insurance fmcsa.
- **Word target:** 700 to 1,000 (thin term; keep it useful, not padded). Also surfaced as a section on `/mc-registration/`.

## Title tag (47 chars)
`Trucking Insurance Filing (BMC-91) | Tech Rig`

## Meta description (154 chars)
`Trucking insurance filing explained. Your authority activates only after your insurer files proof with FMCSA. We coordinate the filing so it lands on time.`

## Three Kings check
Primary "bmc-91 filing" in: title (yes), first paragraph (yes), H2s ("What a BMC-91 filing is", "How we help with your insurance filing"). Secondary "trucking insurance filing" carries the title's plain-language label.

## Heading outline + copy

### H1: Trucking Insurance Filing (BMC-91)
**Hero lede:**
Your operating authority does not activate the moment you buy insurance. It activates after your insurer files proof of that coverage with FMCSA, usually on a form like the BMC-91. This is one of the quiet steps that strands new carriers: they have a policy, they have an application, and they still cannot operate because the filing is not in. Tech Rig makes sure your insurance filing is coordinated so it lands and your authority can activate.

**Primary CTA (above fold):** button "Get help with my filing" → intake form. Until confirmed, route to `/contact-us/`. [VERIFY route.]

### H2: What a BMC-91 filing is
The BMC-91 (and related forms) is how an insurer certifies to FMCSA that a motor carrier has the required public liability coverage. FMCSA needs this proof on file before granting or activating operating authority. The filing is made by your insurance company, not by you directly, which is why timing and coordination matter: if the insurer has not filed, your authority waits, no matter how complete the rest of your paperwork is.

### H2: Why the insurance filing trips up new carriers
A carrier can finish the MC application and the BOC-3 and still sit at the end of the 21-day protest period unable to activate, because the insurance filing was the missing piece. We have seen an authority dismissed entirely after a carrier missed the insurance and BOC-3 deadlines. The filing itself is straightforward; making sure it is actually in, on time, alongside your other filings, is the part worth getting right.

### H2: How we help with your insurance filing
- We tell you exactly what filing your authority needs and when.
- We coordinate with your insurer so the proof is filed with FMCSA, not left pending.
- We line the filing up with your [MC authority](/mc-registration/), [BOC-3](/boc-3-filing/), and [UCR](/ucr-registration/) so all the activation pieces are in together.

**Price line:** Your insurance premium is set by your insurer and is separate. Tech Rig's role is coordinating the filing as part of your authority setup. [VERIFY whether a standalone service fee applies; otherwise present it as included in authority setup.]

### H2: Insurance filing FAQ
FAQPage schema, Grade 8:
- "What is a BMC-91 filing?" It is how your insurer proves to FMCSA you carry the required liability coverage. FMCSA needs it on file before your authority activates.
- "Do I file it, or does my insurance company?" Your insurer files it. We coordinate so it actually gets done on time.
- "Why has my authority not activated when I already have insurance?" Often the proof has not been filed with FMCSA yet. Having a policy and having the filing in are two different things.
- "Does this cost extra?" Your premium is separate and set by your insurer. We coordinate the filing as part of your authority setup.

### Closing CTA band
"Waiting on your authority? Make sure the insurance filing is actually in." Button "Get help with my filing".

## Internal links out
`/mc-registration/`, `/boc-3-filing/`, `/ucr-registration/`, `/compliance-services/`.

## Internal links in
Hub card + package; `/mc-registration/` (insurance section links here); pillar (step 5).

## Schema (JSON-LD)
- `Service` (serviceType "FMCSA insurance filing coordination", provider {@id #org}, areaServed US; omit `price` unless a standalone fee is confirmed).
- `BreadcrumbList`: Home > Compliance Services > Insurance Filing.
- `FAQPage`.

## Proof / claims discipline
- Never imply Tech Rig sells or sets insurance premiums; we coordinate the FMCSA filing.
- Dismissed-authority reference is the real Eduardo case, generalized here without repeating the `/mc-registration/` sentences.
- No guaranteed activation timeline.

## Reviewed-by
"Reviewed by Adam Smith, Co-Founder."

## Dev / Design notes
- Unique branded OG image ("Insurance Filing"). Build last per priority.

## Uniqueness
Lead = "policy bought vs filing in" distinction; generalized dismissed-authority reference worded distinctly from `/mc-registration/`.
