import type { Metadata } from "next";
import Link from "next/link";
import { Container, Section } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbNode, graph } from "@/lib/schema";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service | Tech Rig",
  description:
    "Tech Rig's terms of service: acceptance, ordering and pricing, payments, refunds, liability, and dispute resolution for our compliance and registration services.",
  alternates: { canonical: "/terms-of-service/" },
};

// Shared styles for the legal copy, matching /refund-policy/'s established pattern.
const h2 = "mt-12 font-display text-2xl font-bold tracking-[-0.01em] text-ink";
const p = "mt-4 max-w-[68ch] text-slate";
const ul = "mt-4 max-w-[68ch] list-disc space-y-2 pl-6 text-slate";
const ol = "mt-4 max-w-[68ch] list-decimal space-y-2 pl-6 text-slate";
const link =
  "font-medium text-steel underline-offset-4 hover:underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel";

export default function Page() {
  return (
    <>
      <JsonLd data={graph(breadcrumbNode([{ name: "Home", slug: "/" }, { name: "Terms of Service" }]))} />
      <Section surface="paper" className="pt-8 md:pt-12">
        <Container className="max-w-3xl">
          <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Terms of Service" }]} />
          <h1 className="mt-6 font-display text-[clamp(2.25rem,4.5vw,3.5rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-ink">
            Terms &amp; Conditions
          </h1>
          <p className="mt-4 text-sm italic text-slate">Effective Date: October 1, 2024</p>

          <p className={p}>
            Welcome to the Tech Rig website and services. These Terms and Conditions (&ldquo;Terms&rdquo;), in
            conjunction with our{" "}
            <Link href="/privacy-policy/" className={link}>
              Privacy Policy
            </Link>
            ,{" "}
            <Link href="/refund-policy/" className={link}>
              Refund Policy
            </Link>
            , and any other linked agreements, govern your use and access of our website, features, and services. By
            accessing or using this website, you agree to comply with and be legally bound by these Terms. Please
            read them carefully before continuing to use the site.
          </p>

          <h2 className={h2}>1. Acceptance of Terms</h2>
          <p className={p}>
            By using the Tech Rig website, you affirm that you have read, understood, and agreed to be bound by
            these Terms and all applicable laws and regulations. If you do not agree, you may not access or use the
            website. Tech Rig reserves the right to update or modify these Terms at any time. Continued use of the
            website following any updates signifies your acceptance of the revised Terms.
          </p>

          <h2 className={h2}>2. User Eligibility</h2>
          <p className={p}>
            This website is intended for individuals who are at least 18 years of age. By using the site, you
            confirm that you meet this age requirement and have the authority to enter into these Terms. You are
            responsible for ensuring that all individuals accessing the site through your account also comply with
            these Terms.
          </p>

          <h2 className={h2}>3. Changes and Access Restrictions</h2>
          <p className={p}>
            Tech Rig reserves the right to modify, suspend, or discontinue any aspect of the website or services
            without prior notice. We may also limit access to specific areas or features as needed.
          </p>

          <h2 className={h2}>4. Scope of Services</h2>
          <p className={p}>Tech Rig offers the following services:</p>
          <ul className={ul}>
            <li>
              Obtaining and Registering of USDOT numbers and related services including Biennial Updates,
              Reactivations, and Deactivations.
            </li>
            <li>
              FMCSA-related services, including MC Number registration, Carrier Authority, Reinstatement, Revocation
              and other related filings such as Name Change, Detachment, Reattachment, Clearinghouse and Unified
              Carrier Registration.
            </li>
            <li>Unified Carrier Registration for carriers, brokers, freight forwarders, and leasing entities.</li>
            <li>Broker compliance and registration services.</li>
            <li>Compliance assistance with FMCSA regulations such as MCS-150, UCR, and BOC-3 filings.</li>
          </ul>

          <h2 className={h2}>5. Ordering Services</h2>
          <p className={p}>
            Customers may request services via the Tech Rig website or through live customer support channels. By
            placing an order, you agree to provide information that is accurate, current, and complete. All filings
            and registrations will be processed based solely on the information you submit. Tech Rig is not
            responsible or liable for any errors, delays, rejections, fines, penalties, or other damages of any kind
            resulting from false, outdated, incomplete, or inaccurate information provided by you or on your behalf.
            It is your sole responsibility to ensure the accuracy and completeness of all submitted details.
          </p>

          <h2 className={h2}>6. Processing and Authorization</h2>
          <p className={p}>
            Upon receiving all required information and payment, Tech Rig will initiate the service process.
            Customers authorize Tech Rig to charge the provided payment method. The registration process begins upon
            payment confirmation and is typically processed within 48 business hours (Monday&ndash;Friday, excluding
            holidays). Express Processing orders receive priority.
          </p>

          <h2 className={h2}>7. Pricing</h2>
          <p className={p}>
            All service fees offered by Tech Rig are transparently displayed on our official website and reflect the
            current rates for the services available at the time of your order. Pricing is determined based on a
            variety of factors, including but not limited to: the type of regulatory filing, level of complexity,
            processing speed (e.g., standard vs. express), and any supplemental support services requested.
          </p>
          <p className={p}>
            Tech Rig reserves the right to modify, update, or discontinue pricing for any of its services at any
            time, with or without prior notice. Changes in pricing will not affect orders that have already been
            submitted and paid in full prior to the adjustment, unless additional services are added or requested
            afterward.
          </p>
          <p className={p}>
            Customers are solely responsible for reviewing and confirming the most current pricing prior to
            submitting an order. Reliance on outdated or cached pricing information, third-party quotes, or
            screenshots will not be accepted as valid grounds for fee disputes.
          </p>
          <p className={p}>
            All listed prices are in U.S. dollars and do not include applicable federal, state, or local taxes,
            which may be added during checkout or invoicing and are the sole responsibility of the Customer.
            Additional fees may apply for rush services, corrections due to customer errors, document resubmissions,
            or government filing fees, which are passed through without markup.
          </p>
          <p className={p}>
            Tech Rig is not responsible for pricing discrepancies caused by technical errors, website caching, or
            third-party resellers. We reserve the right to cancel or reject any order with incorrect pricing due to
            technical issues or misrepresentation.
          </p>

          <h2 className={h2}>8. Payments</h2>
          <p className={p}>
            By purchasing or utilizing any services offered by Tech Rig, you (the &ldquo;Customer&rdquo;) agree to
            pay all associated fees as indicated at the time of order or as otherwise agreed in writing. All payments
            must be made in full before any services will commence, unless expressly stated otherwise in a separate
            agreement.
          </p>
          <p className={p}>
            The Customer is required to provide accurate and up-to-date billing information, including but not
            limited to the full legal name, complete billing address, valid telephone number, and current,
            authorized payment method. The Customer understands and agrees that any misrepresentation or omission of
            required billing information may result in service delays, suspension, or termination.
          </p>
          <p className={p}>
            Tech Rig utilizes third-party payment processors, including but not limited to Stripe, to handle all
            transactions securely. By submitting payment information, the Customer authorizes Tech Rig and its
            payment processors to charge the specified amount for the services requested, including any applicable
            taxes or fees required by law.
          </p>
          <p className={p}>
            <strong className="text-ink">Important Notice on Chargebacks:</strong> The Customer expressly agrees not
            to initiate any chargeback or payment dispute with their bank or payment provider, and instead commits to
            resolving any billing concerns directly with Tech Rig through our support and dispute resolution process.
            Unauthorized chargebacks will be considered a breach of these Terms and may result in immediate service
            termination, account suspension, collections action, and legal proceedings. The Customer acknowledges
            that all services are custom, regulatory in nature, and often non-refundable once submitted or processed.
          </p>

          <h2 className={h2}>9. Collections</h2>
          <p className={p}>
            Late payments may incur a 1.5% monthly interest fee on outstanding balances. Delinquent accounts may be
            referred to collection agencies. You agree to cover all associated costs, including legal and
            administrative fees.
          </p>

          <h2 className={h2}>10. Refunds and Cancellations</h2>
          <p className={p}>
            Please refer to our{" "}
            <Link href="/refund-policy/" className={link}>
              Refund Policy
            </Link>{" "}
            for detailed information regarding cancellations and eligibility for refunds.
          </p>

          <h2 className={h2}>11. Monitoring of Communications</h2>
          <p className={p}>
            Tech Rig may monitor or record communications for quality assurance, service improvement, or compliance
            without additional notice.
          </p>

          <h2 className={h2}>12. Disclaimer of Warranties</h2>
          <p className={p}>
            YOUR USE OF THE TECH RIG WEBSITE AND ANY ASSOCIATED SERVICES IS ENTIRELY AT YOUR OWN RISK. ALL CONTENT,
            FUNCTIONALITY, AND SERVICES AVAILABLE THROUGH THIS WEBSITE ARE PROVIDED ON AN &ldquo;AS IS,&rdquo;
            &ldquo;AS AVAILABLE,&rdquo; AND &ldquo;WITH ALL FAULTS&rdquo; BASIS WITHOUT WARRANTIES OF ANY KIND,
            WHETHER EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE.
          </p>
          <p className={p}>
            WITHOUT LIMITING THE GENERALITY OF THE FOREGOING, TECH RIG EXPRESSLY DISCLAIMS ANY AND ALL WARRANTIES,
            INCLUDING BUT NOT LIMITED TO:
          </p>
          <ol className={ol}>
            <li>IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE;</li>
            <li>WARRANTIES OF NON-INFRINGEMENT RELATING TO THIRD-PARTY INTELLECTUAL PROPERTY RIGHTS;</li>
            <li>
              WARRANTIES CONCERNING THE SECURITY, RELIABILITY, TIMELINESS, OR PERFORMANCE OF THE WEBSITE OR ITS
              SERVICES;
            </li>
            <li>
              WARRANTIES AS TO THE ACCURACY, COMPLETENESS, OR CURRENCY OF ANY INFORMATION, INCLUDING INFORMATION
              OBTAINED FROM OR ABOUT GOVERNMENT ENTITIES SUCH AS THE FEDERAL MOTOR CARRIER SAFETY ADMINISTRATION
              (FMCSA);
            </li>
            <li>
              WARRANTIES THAT COMMUNICATIONS OR TRANSMISSIONS FROM OR TO THIS WEBSITE WILL BE FREE OF ERRORS,
              INTERRUPTIONS, DEFECTS, OR TECHNICAL FAILURES;
            </li>
            <li>
              WARRANTIES THAT THE WEBSITE OR ANY EMAILS OR FILES SENT FROM TECH RIG WILL BE FREE FROM VIRUSES,
              MALWARE, OR OTHER DESTRUCTIVE CODE OR COMPONENTS;
            </li>
            <li>WARRANTIES ARISING FROM ANY COURSE OF DEALING, COURSE OF PERFORMANCE, OR USAGE IN TRADE; AND</li>
            <li>ANY OTHER WARRANTIES NOT EXPRESSLY SET FORTH IN THESE TERMS.</li>
          </ol>
          <p className={p}>
            Tech Rig does not represent or warrant that the website will meet your specific requirements or that the
            operation of the website or services will be uninterrupted, timely, secure, or error-free. You assume
            full responsibility for the implementation of sufficient procedures and checkpoints to satisfy your
            particular requirements for data accuracy, security, virus protection, and restoration of lost data.
          </p>
          <p className={p}>
            Any information you obtain from this website or from Tech Rig&rsquo;s representatives, whether oral or
            written, shall not create any warranty not expressly stated in this agreement.
          </p>
          <p className={p}>
            To the extent that applicable law does not permit the exclusion of some or all of the above disclaimers,
            those disclaimers shall apply to you to the fullest extent permitted by law in your jurisdiction.
          </p>

          <h2 className={h2}>13. Limitation of Liability</h2>
          <p className={p}>
            UNDER NO CIRCUMSTANCES SHALL TECH RIG, INCLUDING ITS OWNERS, OFFICERS, DIRECTORS, EMPLOYEES,
            REPRESENTATIVES, AGENTS, PARTNERS, SUPPLIERS, CONTRACTORS, LICENSORS, OR ANY PARTY INVOLVED IN THE
            CREATION, HOSTING, MAINTENANCE, OR DELIVERY OF THIS WEBSITE OR ITS SERVICES, BE LIABLE FOR ANY DAMAGES OR
            LOSSES OF ANY KIND. THIS INCLUDES, BUT IS NOT LIMITED TO, DIRECT, INDIRECT, INCIDENTAL, CONSEQUENTIAL,
            SPECIAL, EXEMPLARY, OR PUNITIVE DAMAGES, OR DAMAGES FOR LOSS OF PROFITS, REVENUE, BUSINESS OPPORTUNITY,
            DATA, GOODWILL, OR OTHER INTANGIBLE LOSSES.
          </p>
          <p className={p}>
            THIS LIMITATION APPLIES REGARDLESS OF THE LEGAL THEORY UNDER WHICH SUCH DAMAGES MAY BE
            CLAIMED&mdash;WHETHER BASED IN CONTRACT, TORT (INCLUDING NEGLIGENCE), STRICT LIABILITY, WARRANTY, OR ANY
            OTHER THEORY OF LIABILITY&mdash;EVEN IF TECH RIG HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES OR
            LOSSES.
          </p>
          <p className={p}>
            Tech Rig shall not be liable for any technical failure or malfunction, including but not limited to
            system outages, connectivity issues, delays in data transmission, viruses, malware, distributed
            denial-of-service (DDoS) attacks, or any harmful components transmitted through our website or email
            communications. You are solely responsible for implementing sufficient safeguards (including antivirus
            software, firewall protection, and data backups) to protect your own systems and data.
          </p>
          <p className={p}>Tech Rig assumes no responsibility for:</p>
          <ul className={ul}>
            <li>
              Errors, omissions, or delays in processing caused by customer-provided information that is incomplete,
              inaccurate, or untimely.
            </li>
            <li>Missed regulatory deadlines due to client inaction or late submission of required documents.</li>
            <li>Any third-party links, websites, or services accessible through the website.</li>
            <li>
              The unauthorized use of your data or credentials unless directly resulting from Tech Rig&rsquo;s gross
              negligence or willful misconduct.
            </li>
          </ul>
          <p className={p}>
            IN NO EVENT SHALL TECH RIG&rsquo;S TOTAL CUMULATIVE LIABILITY FOR ANY CLAIMS ARISING OUT OF OR RELATING
            TO THESE TERMS, THE WEBSITE, OR THE SERVICES, WHETHER IN CONTRACT, TORT, WARRANTY, OR OTHERWISE, EXCEED
            ONE HUNDRED U.S. DOLLARS ($100.00).
          </p>
          <p className={p}>
            If any portion of this limitation is found to be invalid or unenforceable by a court of competent
            jurisdiction, the remaining limitations shall remain in full force and effect, and liability shall be
            limited to the fullest extent permitted by law.
          </p>
          <p className={p}>
            Your sole and exclusive remedy for dissatisfaction with the website or any services provided by Tech Rig
            is to stop using the website and services.
          </p>

          <h2 className={h2}>14. Entire Agreement</h2>
          <p className={p}>
            These Terms and Conditions, together with Tech Rig&rsquo;s Privacy Policy, Refund Policy, and any other
            policies or legal notices expressly incorporated herein by reference, represent the full and complete
            agreement between you (the customer or user) and Tech Rig regarding your access to and use of the
            website and related services. This agreement supersedes all prior or contemporaneous understandings,
            communications, negotiations, representations, or agreements, whether written or oral, between you and
            Tech Rig concerning the subject matter herein.
          </p>
          <p className={p}>
            In the event that any provision of these Terms is determined by a court or competent authority to be
            unlawful, invalid, or unenforceable under applicable law, such provision shall be enforced to the maximum
            extent permitted and the remaining provisions shall continue in full force and effect without being
            impaired or invalidated.
          </p>

          <h2 className={h2}>15. Waiver</h2>
          <p className={p}>
            Our failure to enforce any provision of these Terms does not constitute a waiver of that provision or
            any others.
          </p>

          <h2 className={h2}>16. Binding Arbitration Agreement</h2>
          <p className={p}>
            Any dispute, claim, or controversy arising out of or relating to these Terms and Conditions, your
            relationship with Tech Rig, your use of the website, or any services provided, whether based in
            contract, tort, statute, fraud, misrepresentation, or any other legal theory, shall be resolved
            exclusively and finally by binding arbitration.
          </p>
          <p className={p}>
            The arbitration will be conducted by a single neutral arbitrator in accordance with the Commercial
            Arbitration Rules of the American Arbitration Association (&ldquo;AAA&rdquo;), as in effect at the time
            the arbitration is initiated. Unless both parties agree otherwise in writing, the arbitration will be
            held in the State of California, and California law will govern the interpretation and enforcement of
            this arbitration agreement.
          </p>
          <p className={p}>
            Both you and Tech Rig expressly waive the right to a trial by jury or to participate in a class action or
            representative proceeding. The arbitrator shall have exclusive authority to resolve all disputes
            regarding the scope, enforceability, and interpretation of this arbitration agreement, including any
            claim that all or part of this clause is void or voidable.
          </p>
          <p className={p}>
            Notwithstanding the foregoing, either party may seek temporary or preliminary injunctive relief in a
            court of competent jurisdiction to protect intellectual property rights or prevent unauthorized access,
            use, or disclosure of confidential information. In such cases, this arbitration clause shall still apply
            to all other aspects of the dispute.
          </p>
          <p className={p}>
            If any part of this arbitration agreement is found to be unenforceable, the remaining portions shall
            remain in full force and effect.
          </p>

          <h2 className={h2}>17. Right to Opt Out of Arbitration Clause</h2>
          <p className={p}>
            You have the right to opt out of the arbitration agreement described in Section 16. To exercise this
            right, you must submit a written notice of your decision to opt out within thirty (30) days of the date
            you first agree to these Terms and Conditions or first register with Tech Rig, whichever comes first.
            Your written notice must include your full name, address, and email address, and must clearly state your
            intention to opt out of the arbitration agreement. This notice must be sent to{" "}
            <a href={`mailto:${site.email}`} className={link}>
              {site.email}
            </a>{" "}
            with the subject line &ldquo;Opt-Out of Arbitration.&rdquo;
          </p>
          <p className={p}>
            Please note that opting out of arbitration does not affect the enforceability of any other provisions in
            these Terms, including all other dispute resolution terms. Your decision to opt out will apply only to
            the arbitration provision and will not impact your ability to use Tech Rig&rsquo;s services in any other
            capacity.
          </p>
          <p className={p}>
            If you do not provide written notice within the required time frame, you will be deemed to have
            knowingly and intentionally waived your right to opt out and will be bound by the arbitration agreement,
            including the waiver of the right to a jury trial. Continued use of Tech Rig&rsquo;s services following
            the opt-out window constitutes acceptance of the arbitration terms.
          </p>

          <h2 className={h2}>18. Class Action Waiver</h2>
          <p className={p}>
            For any and all disputes, claims, or controversies arising from or related to the use of the Tech Rig
            website, services, or these Terms and Conditions&mdash;including those related to the Privacy Policy or
            the enforceability of any provision herein&mdash;both you and Tech Rig agree to first attempt to resolve
            the matter amicably and in good faith through informal negotiations. Each party commits to making
            reasonable efforts to reach a mutually satisfactory resolution within sixty (60) days of the initial
            written notice of dispute.
          </p>
          <p className={p}>
            If the dispute cannot be resolved through informal means within that timeframe, it shall be exclusively
            and confidentially resolved by binding arbitration, conducted under the Commercial Arbitration Rules of
            the American Arbitration Association (AAA), available at{" "}
            <a href="https://www.adr.org" target="_blank" rel="noopener noreferrer" className={link}>
              www.adr.org
            </a>
            . The arbitration will take place in a mutually agreed-upon location, or by default, in California,
            unless the parties agree otherwise. A single neutral arbitrator shall be selected by mutual agreement of
            the parties and confirmed in accordance with the AAA&rsquo;s rules.
          </p>
          <p className={p}>
            All arbitration-related administrative costs and arbitrator&rsquo;s fees will be shared equally by the
            parties. However, the prevailing party in the arbitration shall be entitled to recover its reasonable
            attorneys&rsquo; fees and costs incurred in connection with the proceedings, as permitted by applicable
            law.
          </p>
          <p className={p}>By agreeing to these Terms, you expressly acknowledge and agree that:</p>
          <ul className={ul}>
            <li>
              You are waiving the right to pursue or participate in any dispute or claim as a plaintiff or class
              member in any purported class action, class arbitration, representative proceeding, or consolidated
              action.
            </li>
            <li>
              All claims must be brought solely in your individual capacity, and not as part of a class, collective,
              or representative action.
            </li>
            <li>
              No arbitration or legal proceeding may be combined or consolidated with any other without the express
              prior written consent of all parties involved in each affected matter.
            </li>
          </ul>
          <p className={p}>
            You also agree that Tech Rig may seek and obtain preliminary injunctive or equitable relief, including
            enforcement of intellectual property rights, to prevent actual or threatened harm while arbitration is
            pending.
          </p>
          <p className={p}>
            To the fullest extent permitted by applicable law, any dispute or claim under these Terms must be filed
            within one (1) year from the date the dispute first arose or when it reasonably should have been
            discovered. Failure to file within this time period will permanently bar the claim, regardless of any
            statute of limitations to the contrary.
          </p>
          <p className={p}>
            If any part of this arbitration and class action waiver section is found to be invalid or unenforceable,
            that specific portion will be severed, and the remainder of the section shall continue in full force and
            effect.
          </p>

          <h2 className={h2}>19. Governing Law</h2>
          <p className={p}>These Terms shall be governed by the laws of the State of California.</p>

          <h2 className={h2}>20. Indemnification</h2>
          <p className={p}>
            You agree to fully indemnify, defend, and hold harmless Tech Rig, including its officers, directors,
            employees, contractors, affiliates, agents, licensors, service providers, and successors, from and
            against any and all claims, demands, legal actions, proceedings, liabilities, damages, losses, costs,
            and expenses (including, but not limited to, reasonable attorneys&rsquo; fees and court costs) that arise
            out of or relate to:
          </p>
          <ul className={ul}>
            <li>Your violation or breach of these Terms and Conditions;</li>
            <li>
              Your use of the Tech Rig website, services, systems, or tools in a manner not expressly authorized by
              these Terms;
            </li>
            <li>
              Any content, data, or materials submitted, posted, or transmitted by you through our website or to our
              representatives, including any claim that such content violates or infringes upon the intellectual
              property, privacy, publicity, or proprietary rights of any third party;
            </li>
            <li>Your failure to comply with applicable federal, state, or local laws or regulations;</li>
            <li>Your negligent, reckless, fraudulent, or intentional misconduct;</li>
            <li>
              Any obligations, liabilities, or consequences arising from services ordered or authorized on your
              behalf using your information or account credentials;
            </li>
            <li>Any act or omission of your employees, representatives, agents, contractors, or affiliates.</li>
          </ul>
          <p className={p}>
            This indemnification obligation survives the termination or expiration of these Terms and your use of
            the Tech Rig website and services. Tech Rig reserves the right, at its own expense, to assume the
            exclusive defense and control of any matter otherwise subject to indemnification by you. In such case,
            you agree to cooperate fully with our defense and settlement of the matter.
          </p>

          <h2 className={h2}>21. Intellectual Property</h2>
          <p className={p}>
            All website content and design are the property of Tech Rig or its licensors. You may not reproduce,
            distribute, or exploit any content without written permission.
          </p>

          <h2 className={h2}>22. Notices</h2>
          <p className={p}>
            All legal or formal notices must be sent to{" "}
            <a href={`mailto:${site.email}`} className={link}>
              {site.email}
            </a>
            .
          </p>

          <h2 className={h2}>23. Assignment</h2>
          <p className={p}>You may not assign or transfer your rights without Tech Rig&rsquo;s prior written consent.</p>

          <h2 className={h2}>24. Headings</h2>
          <p className={p}>Section headings are for reference only and do not affect interpretation.</p>

          <h2 className={h2}>25. Miscellaneous Provisions</h2>
          <p className={p}>
            You acknowledge and agree that these Terms and Conditions, along with any related click-through
            agreements, supplemental terms, Privacy Policy, Refund Policy, and any additional policies or legal
            notices published by Tech Rig, collectively constitute the full and complete agreement between you and
            Tech Rig with respect to your access to and use of the website, products, and services. These documents
            supersede and replace any and all prior or contemporaneous understandings, communications,
            representations, proposals, or agreements&mdash;whether oral, written, or electronic&mdash;between you
            and Tech Rig regarding the same subject matter.
          </p>
          <p className={p}>
            If any provision or part of a provision of these Terms is found to be invalid, illegal, or unenforceable
            by a court or arbitrator of competent jurisdiction, such provision shall be modified to the minimum
            extent necessary to make it valid and enforceable, or severed entirely if modification is not possible.
            In either case, the remainder of these Terms shall remain in full force and effect.
          </p>
          <p className={p}>
            You agree that nothing in these Terms shall be construed as creating a joint venture, partnership,
            employment, fiduciary, or agency relationship between you and Tech Rig. You have no authority to bind
            Tech Rig in any way, and vice versa.
          </p>
          <p className={p}>
            Tech Rig reserves the right to assign or transfer these Terms, including any of its rights and
            obligations under them, in the event of a corporate restructuring, merger, acquisition, sale of assets,
            or by operation of law, without notice or consent. You may not assign or delegate any of your rights or
            obligations under these Terms without prior written authorization from Tech Rig.
          </p>
          <p className={p}>
            Any failure or delay by Tech Rig to enforce any provision or exercise any right under these Terms shall
            not constitute a waiver of such provision or right. A waiver of any breach or default will not constitute
            a waiver of any subsequent breach or default.
          </p>
          <p className={p}>
            Nothing in these Terms limits Tech Rig&rsquo;s ability to comply with applicable laws, legal processes,
            regulatory obligations, or enforceable governmental requests, including court orders, subpoenas, or
            investigations. You acknowledge that Tech Rig may disclose any information necessary to comply with such
            legal or regulatory requirements, including user data, subject to our Privacy Policy and applicable laws.
          </p>
          <p className={p}>
            If you have any questions, please contact Tech Rig at{" "}
            <a href={`mailto:${site.email}`} className={link}>
              {site.email}
            </a>
            .
          </p>
        </Container>
      </Section>
    </>
  );
}
