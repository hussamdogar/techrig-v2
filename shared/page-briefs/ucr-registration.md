# Brief: /ucr-registration/

## Meta
- **Action:** NEW. **Bucket:** 1 (money). **Intent:** navigational / BOFU.
- **Primary:** ucr registration (12,100/KD5). **Secondaries:** unified carrier registration (12,100), ucr filing, ucr renewal.
- **Word target:** 1,500+.
- **Note:** UCR is an annual filing. Do NOT confuse with BOC-3 (one-time). Government fee is set by federal fleet-size bracket; Tech Rig's service fee is separate.

## Title tag (43 chars)
`UCR Registration and Renewal | Tech Rig`

## Meta description (155 chars)
`UCR registration and annual renewal done for you. We file your Unified Carrier Registration, confirm your fleet bracket, and keep you legal to run interstate.`

## Three Kings check
Primary "ucr registration" in: title (yes), first paragraph (yes), H2s ("What UCR registration is", "What our UCR registration service costs").

## Heading outline + copy

### H1: UCR Registration and Renewal
**Hero lede:**
If you run a commercial vehicle across state lines, UCR registration is not optional, and it comes due every year. Miss it and you risk roadside fines and held loads in states that enforce it. Tech Rig files your Unified Carrier Registration for you, confirms the right fleet bracket so you do not overpay, and reminds you before the next renewal. You stay focused on freight, not federal forms.

**Primary CTA (above fold):** button "File my UCR" → `/apply/?service=ucr` (the in-app application flow). Mid-page and closing CTAs use the same route.

### H2: What UCR registration is
UCR (Unified Carrier Registration) is a federal program that requires motor carriers, brokers, freight forwarders, and leasing companies operating in interstate commerce to register and pay an annual fee based on fleet size. The money funds state enforcement of motor carrier safety programs. It is separate from your USDOT number and your operating authority: you can have an active USDOT and MC and still be out of compliance if your UCR is not paid for the current year.

Who has to register (plain list):
- Carriers running vehicles in interstate commerce.
- Brokers, freight forwarders, and leasing companies, even without trucks.
- New carriers, in their first year, as soon as they begin interstate operation.

Note: Not every operation owes UCR the same way. Purely intrastate carriers and some operations are treated differently. If you are not sure UCR applies to you, we will tell you before you pay.

### H2: How UCR fees work (and why brackets matter)
The government fee is tiered by the number of commercial vehicles you operate, and the brackets jump fast, so a miscount can cost you. Brokers and forwarders without vehicles pay the lowest bracket. **Display rule (client Q1.3): show the government brackets and the $50 Tech Rig filing fee as SEPARATE lines, not combined totals.** The government UCR fee by bracket:

| Bracket (qualifying CMVs) | Government fee |
|---|---|
| 0-2 | $46 |
| 3-5 | $138 |
| 6-20 | $276 |
| 21-100 | $963 |
| 101-1,000 | $4,592 |
| 1,001+ | $44,836 |

**Plus a separate Tech Rig filing fee of $50** (one line, shown apart from the government fee). The bracket is the number of qualifying trucks (CMVs). A business operating only non-CMVs stays in the 0-2 bracket even with more than two of them (for example, 20 non-CMVs still use the $46 bracket). Annual renewal. (Re-verify the government schedule each registration year. Do NOT show this table inside the `/apply` form, only the carrier's own bracket.)

What this means for you: the most common mistake we fix is a carrier who paid the wrong bracket. We confirm your correct bracket first, then file. **UCR is a separate annual obligation; it is not required to activate your MC authority.**

### H2: What our UCR registration service costs
- **Tech Rig filing fee:** $50.
- **Government UCR fee:** by bracket (table above), paid to the program and shown separately before you pay.

We do not advertise one flat UCR price for every carrier, because the government fee genuinely depends on your fleet size. You see both numbers up front.

**Mid-page CTA:** text link "File my UCR" → same route as hero.

### H2: What you get when Tech Rig files your UCR
- We confirm your fleet bracket so the fee is right.
- We complete and submit your registration for the current year.
- We keep a record and remind you before the next annual renewal, so you do not lapse.
- If your UCR is part of a larger setup, we line it up with your USDOT, MC, and BOC-3 so nothing blocks your authority.

### H2: New carrier? UCR fits into the bigger setup
Short funnel paragraph. UCR is one piece of getting road-legal. If you are still standing up your company, see how it fits with your [operating authority](/mc-registration/) and [BOC-3 filing](/boc-3-filing/), or have us handle the [full setup](/compliance-services/). Many of our clients start with a [BOC-3 and UCR](/boc-3-filing/) together, then add the rest.

Real worked example (publishable, distinct to this page): a Maryland CDL hotshot owner-operator came to us needing both company-level and driver-level compliance before he could haul. We handled his BOC-3, UCR, driver qualification file, consortium enrollment, Clearinghouse setup, and pre-employment drug test in about 7 days, and he began running after the protest period.

### H2: UCR registration FAQ
FAQPage schema, Grade 8:
- "Is UCR a one-time fee?" No. UCR is annual. You renew every year, usually before the new registration year opens. (BOC-3, by contrast, is generally one-time.)
- "What happens if I do not pay UCR?" In states that enforce it, you can be fined at roadside and your vehicle can be held until it is resolved. Renewing on time avoids this.
- "Do brokers need UCR?" Yes, brokers and freight forwarders register too, normally in the lowest bracket, even without trucks.
- "Can you tell me my correct bracket?" Yes. We confirm your vehicle count and the right bracket before filing so you do not over or underpay.
- "Do I pay the government fee to Tech Rig?" The government fee is separate and goes to the program. Our service fee is for filing it correctly and on time. You see both before you pay.

### Closing CTA band
"Due for UCR or starting fresh? We will file it right and remind you next year." Button "File my UCR".

## Internal links out
`/boc-3-filing/`, `/mc-registration/`, `/compliance-services/`, `/dot-registration/` (contextual). Funnel link to `/services/` optional in a closing line ("once you are running, keep the truck loaded").

## Internal links in
Hub card + package list; pillar; MCS-150 page ("annual upkeep"); every dispatch page's compliance-upkeep link; blog feeder "what is UCR" if one exists.

## Schema (JSON-LD)
- `Service` (serviceType "UCR registration", provider = DGR Tech Rig LLC, areaServed US, offers with priceCurrency USD and price "from 100"; do not encode the government fee as the price).
- `BreadcrumbList`: Home > Compliance Services > UCR Registration.
- `FAQPage` for the FAQ.

## Proof / claims discipline
- Bracket fees are the official 2026 UCR government schedule (sourced), not Tech Rig's fee. Re-verify each registration year (they can change). Keep the government fee visibly separate from the service fee.
- No guaranteed timelines. The 7-day example is a real past result, framed as such, not a promise.

## Reviewed-by
"Reviewed by Adam Smith, Co-Founder."

## Dev / Design notes
- Unique branded OG image ("UCR Registration").
- Title/meta reference a year only if Dev can maintain it; current copy keeps it evergreen (no year), preferred.
- Price chips from the single pricing source.

## Uniqueness
"Who this is for" worked example = Maryland CDL hotshot (driver + company compliance). Distinct from the hub's freight-forwarder example and other pages.
