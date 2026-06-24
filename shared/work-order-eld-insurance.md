# Work order for Dev: reframe ELD and insurance (not handled directly)

Raised by SEO, 2026-06-21, on a client correction. **Tech Rig does NOT handle ELD or insurance directly.**
- **ELD:** referral only. Tech Rig refers clients to an ELD partner company (Motive) who supplies and sets up the device; the client buys directly from the partner. No Tech Rig fee. Never say "we set up / install / configure your ELD."
- **Insurance:** Tech Rig does not provide or handle insurance, does not file the BMC-91/MCS-90 (only the insurer can), and has no insurer partnerships. It coordinates with the client's own insurer so the filing clears. No Tech Rig price.

The updated SEO source copy is in `page-briefs/eld-services.md`, `page-briefs/trucking-insurance-filing.md`, and the rules in `../seo/context/brand-guidelines.md` / `services.md`. Use those as the canonical wording. Below is every place it appears in the built site (`dev/app/`).

## 1. `/eld-services/` (app/eld-services/page.tsx) — full reframe
Current copy presents ELD as a Tech Rig service. Replace per the rewritten `eld-services.md` brief. Specific fixes:
- **metadata.title** "ELD for Owner Operators and Fleets" is fine; **description** (lines ~34, ~39): remove "set up and supported. We help you choose, install, and run...". Use the brief's new meta: "ELD for owner operators, made simple. Tech Rig connects you with our trusted ELD partner for a compliant device, so your hours of service stay clean and audit-ready."
- **OG image** (app/eld-services/opengraph-image.tsx lines 6, 9) and page **openGraph.title** (~37): change "ELD Setup" to "ELD".
- **H1** (~115): "ELD Setup for Owner Operators and Fleets" to "ELD for Owner Operators and Fleets".
- **Hero** (~124-125): replace "Tech Rig helps you get the right ELD in place. We work with Motive as our ELD partner..." with the brief's hero: we do not sell or set up ELDs; we connect you with our trusted ELD partner.
- **"How we help" list** (~177, ~185): replace "We help you choose an ELD... working with Motive" and "We connect ELD into..." with the brief's "How ELD works with Tech Rig" bullets (we do not provide/install; we refer to the partner; you buy direct; no Tech Rig charge).
- **PriceChip** (~203) and the device-cost line (~205): REMOVE the price chip entirely (no Tech Rig fee). Keep a plain line that the device/subscription is paid to the partner.
- **FAQ** (~67-68, ~75-76): replace "Which ELD should I use? We work with Motive and help you pick" and "Can you help if my ELD is logging wrong? ...we make sure it is set up correctly" with the brief's FAQ ("Does Tech Rig set up my ELD? No, we refer you to our partner..."; "What does the referral cost? Nothing from Tech Rig").
- **CTA** (~133, ~249): "Set up my ELD" to "Get connected with our ELD partner". Wire to the partner referral link when supplied (until then `/contact-us/`).
- **Service JSON-LD** (~87, ~90): `serviceType` "ELD setup" to "ELD partner referral"; description must not say Tech Rig "helps choose, install, and configure" — say Tech Rig refers the carrier to its ELD partner. Do not emit an `offers`/price.
- **Tracker** (~45, ~57): the "ELD installed" node is fine as a carrier-readiness step, but the comment/label should not imply Tech Rig installs it.

## 2. `/trucking-insurance-filing/` (app/trucking-insurance-filing/page.tsx) — small reinforcement
The page is mostly correct (insurer files; Tech Rig coordinates). Two changes:
- **Hero** (~118-122): add the explicit line from the updated brief: "Tech Rig does not sell or handle insurance, and we are not partnered with any insurer. What we do is work with your own insurer so the required filing reaches FMCSA."
- Confirm there is **no Tech Rig price/PriceChip** for insurance on this page (it should be coordination only; "Contact for quote" if a CTA price is shown). The premium-is-separate line stays.
- Keep the rest ("Your insurer files it. We coordinate"), it already matches.

## 3. `/mc-registration/` (app/mc-registration/page.tsx) — fix one claim
- **Service description** (~96): "Tech Rig files your MC operating authority application, BOC-3, and insurance filing together" implies Tech Rig files insurance. Change to: files the MC application and BOC-3 and **coordinates** the insurance filing. Line ~130 ("lines up your insurance filing") is already fine.

## 4. `/` home (app/page.tsx) — fix the "we handle" list
- **~91-92:** the list "...BOC-3, UCR, insurance filing, driver compliance, IRP, IFTA, and ELD" under "we handle" implies Tech Rig handles insurance and ELD directly. Reword so insurance reads as coordination and ELD as via-partner, e.g.: "USDOT and MC authority, BOC-3, UCR, driver compliance, IRP and IFTA, plus ELD through our partner and insurance-filing coordination."
- **~215** ("We work with Motive for ELD and with OTR Solutions and RTS Financial...") is fine as a partner mention; leave it.

## 5. State pages TX/CA/NY/FL ("what we file" subset)
The "What we file for [state] carriers" cards/descriptions list "insurance filing" among items Tech Rig files (e.g. texas ~94, NY ~94, the full-setup card descriptions). Insurance is coordinated, not filed by Tech Rig. Fix: relabel the insurance item as "insurance-filing coordination" (or footnote it), so the "what we file" framing does not claim Tech Rig files insurance. ELD is not in these subsets; no change for ELD here.

## 6. `/about-us/` (app/about-us/page.tsx)
- **~179** "We keep working relationships with Motive for ELD, and OTR Solutions..." is fine (partner relationship). No change, but ensure it is not later expanded to imply Tech Rig provides ELD.

## 7. `/mc-dot-registration/` and `/boc-3-filing/`
- mc-dot "coordinates your insurance filing" (~121, ~152) is correct (coordination). ELD only appears in the "step up to the full package" list (~205); fine.
- boc-3 FAQ (~100) "Usually your MC application, insurance filing, and UCR. We can handle the full setup" is acceptable; optionally soften "handle the full setup" so it does not imply filing insurance. Low priority.

## Find-and-fix checklist (run site-wide before closing)
Search the built app for these and confirm none survive in a way that implies direct handling:
- ELD: "set up my ELD", "we set up", "install", "configure", "ELD setup" (as a Tech Rig service), any ELD PriceChip, `serviceType: "ELD setup"`.
- Insurance: "we file your insurance", "Tech Rig files ... insurance", any insurance PriceChip, "we handle insurance", "insurance partner".
Acceptable verbs: for ELD "refer / connect you with our ELD partner"; for insurance "coordinate with your insurer / your insurer files it".

## Sitemap/robots
No URL changes. `/eld-services/` and `/trucking-insurance-filing/` stay; only their copy, schema, and CTA change.
