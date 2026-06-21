# Brief: /ifta-registration/

## Meta
- **Action:** NEW. **Bucket:** 1. **Intent:** navigational / BOFU.
- **Primary:** ifta registration (480/KD28). **Secondaries:** ifta sticker, ifta filing, ifta application.
- **Word target:** 900 to 1,200 (tight; intent does not need a long page).
- **Pairs with** `/irp-registration/`.

## Title tag (43 chars)
`IFTA Registration and Filing | Tech Rig`

## Meta description (152 chars)
`IFTA registration and quarterly filing made simple. We set up your IFTA account and stickers so you report interstate fuel tax correctly and stay compliant.`

## Three Kings check
Primary "ifta registration" in: title (yes), first paragraph (yes), H2s ("What IFTA registration is", "What our IFTA registration service includes").

## Heading outline + copy

### H1: IFTA Registration and Filing
**Hero lede:**
IFTA registration is how interstate carriers report and pay fuel taxes across the states they run, through one quarterly return instead of dealing with each state separately. Get your IFTA account and stickers set up wrong, or miss a quarterly filing, and you face penalties and audit headaches. Tech Rig sets up your IFTA registration correctly so the fuel-tax side of running interstate is one less thing to worry about.

**Primary CTA (above fold):** button "Set up my IFTA" → IFTA intake form. Until confirmed, route to `/contact-us/`. [VERIFY route.]

### H2: What IFTA registration is
The International Fuel Tax Agreement (IFTA) simplifies fuel-tax reporting for carriers operating in more than one state or province. You register in your base jurisdiction, receive an IFTA license and decals (stickers) for your vehicles, and file one quarterly fuel-tax return that reconciles the fuel you bought against the miles you ran in each state. It applies to qualifying interstate vehicles, generally those over a weight threshold or with enough axles.

### H2: IFTA vs IRP
Short. [IRP](/irp-registration/) is about registration and apportioned plates. IFTA is about fuel tax. Most interstate carriers need both, and we set them up together, but they are separate programs.

### H2: What our IFTA registration service includes
- We confirm IFTA applies to your operation and identify your base jurisdiction.
- We complete your IFTA registration so you receive your license and decals.
- We explain the quarterly filing schedule and what records you need to keep (mileage and fuel receipts), so your returns are accurate.
- We coordinate IFTA with your [IRP](/irp-registration/) setup.

**Price line:** Our IFTA setup fee is $175. State fees are separate and shown up front.

### H2: IFTA registration FAQ
FAQPage schema, Grade 8:
- "What is an IFTA sticker?" A decal placed on your vehicle showing it is registered under the International Fuel Tax Agreement. You get them with your IFTA license.
- "How often do I file IFTA?" Quarterly. You report miles and fuel by state and settle the difference. Keeping mileage and fuel records as you go makes this simple.
- "Do I need IFTA and IRP?" Most interstate carriers need both. IFTA is fuel tax; [IRP](/irp-registration/) is plates and registration.
- "What if I run in only one state?" IFTA is for interstate operation. If you run purely intrastate, it may not apply. We confirm before you pay.

### Closing CTA band
"Running across state lines? Get your IFTA set up so quarterly filing is simple." Button "Set up my IFTA".

## Internal links out
`/irp-registration/` (paired), `/compliance-services/`. Funnel link to `/services/` optional.

## Internal links in
Hub card + package; pillar (step 8); IRP page (cross-link).

## Schema (JSON-LD)
- `Service` (serviceType "IFTA registration", provider {@id #org}, areaServed US, offers price 175 USD; state fees not encoded as price).
- `BreadcrumbList`: Home > Compliance Services > IFTA Registration.
- `FAQPage`.

## Proof / claims discipline
- Setup fee confirmed $175; state fees never encoded as price. No invented figures.

## Reviewed-by
"Reviewed by Robert Hooke, Co-Founder."

## Dev / Design notes
- Unique branded OG image ("IFTA Registration"). Price chip from single source once confirmed.

## Uniqueness
Lead = quarterly fuel-tax framing; distinct wording from the IRP page (registration/plates). No 8+ word sentence shared with the IRP page.
