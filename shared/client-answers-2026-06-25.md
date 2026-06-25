# Client Questions — Tech Rig (Completed)

Owner: orchestrator  
Original form created: 2026-06-25  
Completed by: DGR Tech Rig LLC  
Completion date: 2026-06-25

**Status:** 🟢 ANSWERED · 🟡 TO BE PROVIDED / FINALIZED DURING DEPLOYMENT

---

## 1. Factual claims to verify before publishing

### Q1.1 — Is Tech Rig a registered C/TPA with the FMCSA Drug & Alcohol Clearinghouse?
**Status:** 🟢 ANSWERED  
**Answer:** Yes. DGR Tech Rig LLC is registered as a C/TPA in the FMCSA Drug & Alcohol Clearinghouse. Written confirmation may be used for the website implementation.

### Q1.2 — Confirm the two partner referral links are final and live
**Status:** 🟢 ANSWERED  
**Answer:** Yes, both links are final:
- ELD / Motive: https://partners.gomotive.com/DGR-TECH-RIG
- LLC formation / Inc Authority: https://goto.incauthority.com/QY2keP

### Q1.3 — Confirm government-fee figures to publish
**Status:** 🟢 ANSWERED  
**Answer:** Publish only the UCR government-fee brackets on the UCR service page. State that Tech Rig charges a separate $50 filing fee. Do not display the full UCR fee table inside the application form.

UCR government-fee brackets:
- 0–2 vehicles: $46
- 3–5 vehicles: $138
- 6–20 vehicles: $276
- 21–100 vehicles: $963
- 101–1,000 vehicles: $4,592
- 1,001+ vehicles: $44,836

Do not publish a separate MC authority government-fee figure.

### Q1.4 — Confirm FMCSA is still mailing USDOT PINs
**Status:** 🟢 ANSWERED  
**Answer:** Yes. FMCSA is still mailing USDOT PINs to the address on record.

---

## 2. Billing model

### Q2.1 — How should recurring services be billed?
**Status:** 🟢 ANSWERED  
**Answer:** Use reminders before each due date, followed by a manual invoice. Auto-charge may also be offered when the client expressly agrees to recurring billing.

This applies to:
- UCR annual renewal
- Consortium annual renewal
- Driver Qualification file annual renewal
- IFTA quarterly filing

### Q2.2 — Confirm the $1,700 Full Initial Package contents
**Status:** 🟢 ANSWERED  
**Answer:** The $1,700 Full Initial Package is a discounted bundle that includes:
- MC authority and USDOT registration
- BOC-3 filing
- UCR registration for the 0–2 vehicle bracket
- Clearinghouse setup
- Consortium enrollment
- Pre-employment drug test
- IFTA setup fee
- IRP setup fee
- One Driver Qualification file

IRP and IFTA government, state, plate, permit, mileage, and jurisdiction charges are separate and collected later once calculated.

Additional DQ-file pricing:
- 1 driver: $200
- 2 drivers: $350 total
- 3 drivers: $450 total
- More than 3 drivers: custom quote

### Q2.3 — How should IRP/IFTA government and jurisdiction fees be presented?
**Status:** 🟢 ANSWERED  
**Answer:** At checkout, the customer pays Tech Rig’s setup fee only. When Tech Rig is ready to file the IRP or IFTA application, the applicable government/state amount will be calculated and sent to the customer for separate payment.

---

## 3. New services and page scope

### Q3.1 — Dedicated pages for USDOT Correction and IFTA Quarterly Filing?
**Status:** 🟢 ANSWERED  
**Answer:** Yes. Create separate dedicated service pages for:
- USDOT Correction — $125
- IFTA Quarterly Filing — $150 service fee, plus any applicable government amount

USDOT Correction includes:
- Address change
- Legal or business name change
- Email change
- Phone-number change
- Operating-authority status change
- Number of trucks change
- Number of drivers change

### Q3.2 — Reinstatement / legacy-to-MOTUS migration page?
**Status:** 🟢 ANSWERED  
**Answer:** Create a separate FMCSA Portal to MOTUS Migration service page priced at $125. Move the California legacy-account case study from the new-USDOT page to this page.

The page should also cover:
- Claiming an existing USDOT
- Company Official assignment
- Manual verification
- Missing MC authority in MOTUS
- Legacy FMCSA Portal account problems
- FMCSA support-ticket assistance

Expected turnaround: approximately 1–2 weeks.

---

## 4. Trust content

### Q4.1 — Testimonials: permission and attribution
**Status:** 🟢 ANSWERED  
**Answer:** Use first name plus company name for Felix, Marcus, and Freddie. Use only genuine statements they actually sent. Grammar may be cleaned up, but no claim may be invented or materially changed.

### Q4.2 — State market statistics
**Status:** 🟢 ANSWERED  
**Answer:** Remove unsupported numerical claims, including figures such as the Texas “$1.6T” claim, and replace them with general wording unless a reliable source is available.

Example replacement: “Texas is one of the largest freight and trucking markets in the United States.”

---

## 5. Deployment and provisioning

### Q5.1 — Stripe
**Status:** 🟢 ANSWERED / DEVELOPER TO VERIFY KEY TYPE  
**Answer:** Use the existing Tech Rig Stripe account. The payment key already connected to the current BOC-3 form is:

`mk_1TQSnGBUKzFDGSEhTE8lrbVQ`

The developer should verify whether this is the credential required for the new website. If Stripe also requires a standard live publishable, secret, or restricted key for deployment, the additional credential will be provided securely.

Receipt details:
- Business: DGR TECH RIG LLC
- Email: info@techrig.org
- Address: 30 N Gould Street, Sheridan, Wyoming
- Sales tax: No sales tax is currently charged

### Q5.2 — Resend email configuration
**Status:** 🟢 ANSWERED / FINAL CONFIGURATION MAY BE ADJUSTED BY DEVELOPER  
**Answer:** Preferred configuration:
- Authenticated sending domain: mail.techrig.org
- From: info@techrig.org
- Reply-to: info@techrig.org

The developer may recommend a technically better configuration. DNS access is available for SPF and DKIM setup.

### Q5.3 — FMCSA QCMobile webKey
**Status:** 🟡 TO BE PROVIDED DURING DEPLOYMENT  
**Answer:** Hussam has the QCMobile webKey and will provide it to the developer.

### Q5.4 — Production domain, DNS, auth redirects, and Sentry
**Status:** 🟢 ANSWERED  
**Answer:**
- Production domain: techrig.org
- DNS access: Available
- Supabase auth redirect domain: Configure for techrig.org and any required production callback URLs
- Sentry: Yes, add Sentry error tracking

---

## 6. Back-office and cutover

### Q6.1 — Admin access
**Status:** 🟢 ANSWERED  
**Answer:** Initial admin/back-office access should be limited to info@techrig.org. Specific team responsibilities will be assigned later.

### Q6.2 — Service turnaround times and filing ownership
**Status:** 🟢 TURNAROUND TIMES ANSWERED / TEAM OWNERSHIP TO BE FINALIZED  
**Answer:**
- BOC-3: Same business day when the order and required information are received during business hours.
- UCR: Same day when the carrier is present in the UCR database. A new USDOT may take 1–2 days to appear.
- USDOT registration: Filed within 24 hours and active immediately after successful submission.
- MC authority application: Filed within 24 hours. Activation is subject to the 21-day protest period and requires BOC-3 and insurance. If either requirement remains missing after the protest period, activation remains pending until it is submitted.
- USDOT Correction: Normally same day when the MOTUS account is active and the USDOT record is linked. FMCSA linking/support issues may take approximately 7–10 business days.
- Biennial Update: Normally same day when the MOTUS account and USDOT record are accessible. The same 7–10 business-day FMCSA support delay may apply when linking is required.
- Clearinghouse setup: Within 1 business day.
- Consortium enrollment: Within 1–2 business days.
- Driver Qualification file: Within 1–3 business days after all required documents are received.
- Pre-employment drug test: Scheduled after consortium enrollment according to the carrier or driver’s availability.
- IRP setup: Varies by state and document availability.
- IFTA setup: Varies by state and document availability.
- IFTA quarterly filing: Within 1–3 business days after complete mileage and fuel records are received.
- FMCSA Portal to MOTUS Migration: Approximately 1–2 weeks.

Team ownership: Not yet finalized. Initial admin access remains with info@techrig.org.

### Q6.3 — Refund policy
**Status:** 🟢 ANSWERED  
**Answer:** Update the refund policy as follows:

- Remove the flat $50 processing fee entirely.
- A customer may receive a full service refund when no work has started, no filing has been submitted, and no consultation or service has been delivered, provided the request is made within 3 days.
- Deduct only the actual payment-processing fee that is not returned to Tech Rig by the payment processor.
- Example: If a customer paid $100 and the non-refundable processing fee was $3, refund $97.
- A partial refund of up to 75% may be considered when review or preparation has started but the filing has not been submitted.
- Filing fees become non-refundable once work has substantially started or a filing has been submitted to FMCSA or another agency.
- Government, laboratory, partner, and third-party fees are non-refundable once paid or committed.
- Renewable services are invoiced before renewal; auto-charge is used only with the customer’s express agreement.
- Updated-policy date: June 25, 2026.

### Q6.4 — Cutover and legacy forms
**Status:** 🟢 ANSWERED  
**Answer:**
- form.techrig.org is not currently in active use.
- boc-3.techrig.org is live and customers are still using it.
- Keep boc-3.techrig.org live until the new application and payment flow have been fully tested.
- Redirect the old BOC-3 site after successful testing, using the developer’s recommended cutover timing.
- Any submissions received during a short transition can be handled manually.
- Import all historical records that can be imported without delaying launch.
- Imported historical orders should remain editable in the new dashboard.
- If the old system does not support a practical export, the developer should inspect the database and preserve the old system as a historical record rather than delay launch.

---

## Additional implementation confirmations

- DGR Tech Rig LLC is the legal/registered business name to use for the Clearinghouse C/TPA claim.
- UCR service page: show government brackets plus a separate $50 Tech Rig filing fee; do not show the full table in the form.
- Full package: present as a discounted $1,700 bundle only if the sum of individual listed prices is higher.
- IRP and IFTA prices shown on the website are Tech Rig setup fees only.
- Admin email: info@techrig.org.
- Unsupported state statistics should be removed or generalized.
- Testimonials must use real client wording only.

## Remaining handoff items

These are not unanswered business questions; they are deployment credentials or implementation checks:
- Existing payment key provided above; developer to verify whether any additional Stripe live credential is required
- QCMobile webKey — Hussam will provide
- Legacy BOC-3 export/database inspection — developer to assess
- Final team filing responsibilities — to be assigned later
- Final redirect timing — developer recommendation after testing
- Final Resend configuration — developer may adjust if technically necessary
