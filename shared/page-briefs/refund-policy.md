# Brief: /refund-policy/ (copy for Dev — client Q6.3 / D9)

## Meta
- **Action:** REBUILD the stub `/refund-policy/` page with the copy below (client answers 2026-06-25). **Bucket:** legal/utility (noindex optional per standards; keep crawlable, no schema needed beyond BreadcrumbList).
- **Title tag:** `Refund Policy | Tech Rig`
- **Meta description:** `Tech Rig's refund policy: when a full or partial refund applies, how processing fees work, and which government and third-party fees are non-refundable.`
- **Dev also:** reword the PDF acknowledgement (`dev/lib/pdf/generate.ts:76`) — the current "all service fees are final and non-refundable, regardless of the outcome" line CONTRADICTS the new 3-day/no-work-started full-refund clause. Replace it with a short line consistent with this policy (e.g. "Refunds are governed by our Refund Policy at techrig.org/refund-policy/").

## Publishable copy

### H1: Refund Policy
*Last updated: June 25, 2026*

This policy explains when refunds apply to Tech Rig (DGR Tech Rig LLC) services. It covers our service fees only. Government, laboratory, partner, and other third-party fees follow the rules below.

### H2: Full refund (within 3 days, before work begins)
You may receive a full refund of your service fee when all of the following are true:
- No work has started.
- No filing has been submitted to FMCSA or any other agency.
- No consultation or service has been delivered.
- You request the refund within 3 days of payment.

In this case we refund your payment in full, less only the actual payment-processing fee that our payment processor does not return to us. For example, if you paid $100 and the non-refundable processing fee is $3, we refund $97.

### H2: Partial refund (work started, nothing filed)
If we have started reviewing or preparing your order but have not yet submitted a filing, you may be eligible for a partial refund of up to 75% of the service fee, depending on the work already completed.

### H2: When service fees are non-refundable
- Filing fees become non-refundable once work has substantially started or a filing has been submitted to FMCSA or another agency.
- Government, laboratory, partner, and third-party fees are non-refundable once they have been paid or committed on your behalf.
- Service fees are non-refundable when the order cannot proceed because the client has been inactive for 30 days due to missing documents or a delayed response.

### H2: Recurring and renewable services
Renewable services (such as UCR, consortium enrollment, Driver Qualification files, and IFTA quarterly filing) are invoiced before each renewal. We only auto-charge a renewal when you have expressly agreed to recurring billing.

### H2: How to request a refund
Contact us at info@techrig.org or +1 (917) 909-2257 with your order details. We will confirm which part of your payment is eligible under this policy before processing any refund.

## Claims / discipline
- No flat $50 processing fee anywhere (removed per client). The only deduction on an otherwise-full refund is the actual non-returned payment-processing fee.
- Do not promise refunds on government/third-party fees once paid/committed.
- Keep the "auto-charge only with express consent" wording consistent with the billing model in `services.md`.
- Updated-policy date must read June 25, 2026.

## Internal links in
Footer (legal column), checkout/terms references, the PDF acknowledgement line.
