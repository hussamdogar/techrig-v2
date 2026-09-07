import type { Metadata } from "next";
import Link from "next/link";
import { Container, Section } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbNode, graph } from "@/lib/schema";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy | Tech Rig",
  description:
    "Tech Rig's privacy policy: what personal information we collect, how we use and share it, your privacy choices, and your rights under California law.",
  alternates: { canonical: "/privacy-policy/" },
};

// Shared styles for the legal copy, matching /terms-of-service/'s established pattern.
const h2 = "mt-12 font-display text-2xl font-bold tracking-[-0.01em] text-ink";
const h3 = "mt-8 font-display text-lg font-bold text-ink";
const p = "mt-4 max-w-[68ch] text-slate";
const ul = "mt-4 max-w-[68ch] list-disc space-y-2 pl-6 text-slate";
const link =
  "font-medium text-steel underline-offset-4 hover:underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel";
const th = "px-4 py-3 text-left font-display text-sm font-semibold text-ink";
const td = "px-4 py-3 text-slate";

const CCPA_CATEGORIES: { category: string; collected: string; source: string }[] = [
  { category: "Identifiers (name, alias, email, mailing address, phone number, SSN, IP address, etc.)", collected: "Yes", source: "You, automatically, third parties" },
  { category: "Sensitive personal information (SSN, financial login, geolocation, religious data, biometric data)", collected: "Yes", source: "You" },
  { category: "Personal information per Cal. Civ. Code §1798.80(e)", collected: "Yes", source: "You, automatically, third parties" },
  { category: "Protected classification characteristics", collected: "No", source: "N/A" },
  { category: "Commercial information (purchase history, transactions, service use)", collected: "Yes", source: "You, automatically" },
  { category: "Biometric information", collected: "No", source: "N/A" },
  { category: "Internet or network activity (browsing behavior, device interaction data)", collected: "Yes", source: "Automatically" },
  { category: "Geolocation data", collected: "Yes", source: "You, automatically, third parties" },
  { category: "Audio, visual, or sensory data", collected: "No", source: "N/A" },
  { category: "Employment or professional information", collected: "Yes", source: "You" },
  { category: "Education information (for applicants)", collected: "Yes", source: "You, third parties" },
  { category: "Inferences drawn (profiles based on preferences, behaviors, etc.)", collected: "Yes", source: "You, automatically, third parties" },
];

export default function Page() {
  return (
    <>
      <JsonLd data={graph(breadcrumbNode([{ name: "Home", slug: "/" }, { name: "Privacy Policy" }]))} />
      <Section surface="paper" className="pt-8 md:pt-12">
        <Container className="max-w-3xl">
          <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Privacy Policy" }]} />
          <h1 className="mt-6 font-display text-[clamp(2.25rem,4.5vw,3.5rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-ink">
            Privacy Policy
          </h1>
          <p className="mt-4 text-sm italic text-slate">Updated: September 7, 2026</p>

          <h2 className={h2}>Introduction</h2>
          <p className={p}>
            Welcome to Tech Rig, and thank you for visiting our website. At Tech Rig, operated by DGR Tech Rig, LLC,
            we are deeply committed to protecting your personal information and ensuring transparency about how your
            data is used. This Privacy Policy applies to all online and offline services we provide, including but
            not limited to our website located at{" "}
            <a href={site.url} className={link}>
              {site.url.replace(/^https?:\/\//, "")}
            </a>
            , any associated subdomains, and any applications, digital tools, portals, customer support channels,
            events, or interactive content that are managed or operated by Tech Rig (collectively referred to as the
            &ldquo;Site&rdquo; or &ldquo;Website&rdquo;, and our &ldquo;Services&rdquo;).
          </p>
          <p className={p}>
            By interacting with our Site, submitting information, or using any of our Services, you are agreeing to
            the terms outlined in this Privacy Policy. This Privacy Policy, together with our{" "}
            <Link href="/terms-of-service/" className={link}>
              Terms and Conditions
            </Link>
            , which incorporate it by reference, governs how we collect, use, disclose, and protect the personal
            information you provide to us&mdash;whether through the Website, by phone, email, live chat, forms, or
            any other means of communication. If you have any concerns, questions, or would like to exercise your
            privacy rights, you may reach us anytime at{" "}
            <a href={`mailto:${site.email}`} className={link}>
              {site.email}
            </a>
            .
          </p>

          <h2 className={h2}>Important Notice</h2>
          <p className={p}>
            We treat all information you share with us with the highest level of confidentiality and integrity.
            However, to facilitate certain services, we may share your information with trusted external partners
            who perform tasks or deliver services on our behalf, as explained later in this Policy. By continuing to
            use our Services or accessing the Site, you acknowledge and consent to the practices described in this
            Privacy Policy.
          </p>
          <p className={p}>
            Please note: this Privacy Policy applies exclusively to Tech Rig and its managed platforms. It does not
            apply to external websites, applications, or services that may be linked from our Site or Services. These
            third-party services have their own privacy policies, and we encourage you to review them before
            providing any personal data.
          </p>

          <h2 className={h2}>1. Information We Collect</h2>
          <p className={p}>
            When you use our Services or engage with our Site, we may collect various types of information from or
            about you. This data collection may occur through direct input, automated tracking technologies, or
            third-party sources.
          </p>

          <h3 className={h3}>a. Information You Voluntarily Provide</h3>
          <p className={p}>
            The primary type of data we collect is Personal Information, which is defined as information that can
            identify, relate to, describe, or reasonably be linked&mdash;either directly or indirectly&mdash;to a
            specific individual or household. When you voluntarily submit information to us, whether through our
            online forms, customer support, chat features, phone conversations, or in connection with the purchase of
            services, we may collect:
          </p>
          <ul className={ul}>
            <li>
              <strong className="text-ink">Basic contact details</strong>, such as your full name (first and last),
              email address, mailing address, shipping address, phone numbers (landline and/or mobile), and any
              usernames or account credentials you create.
            </li>
            <li>
              <strong className="text-ink">Payment and billing information</strong>, including your credit card or
              debit card number, billing address, and other relevant financial details used to process transactions
              or track payment history.
            </li>
            <li>
              <strong className="text-ink">Government-issued identifiers</strong>, such as a Social Security Number
              (SSN), Employer Identification Number (EIN), or any other official ID number, if required for
              regulatory filings or service fulfillment (e.g., obtaining a USDOT number or filing FMCSA forms).
            </li>
            <li>
              <strong className="text-ink">Professional or corporate information</strong>, such as your business
              name, job title, role within a company, or other employment-related data that may be needed to provide
              you with business services or verify credentials.
            </li>
            <li>
              <strong className="text-ink">Communications</strong>, including the contents of emails, online chat
              conversations, phone call summaries, messages sent through contact forms, and any documents, images, or
              files uploaded or shared with us.
            </li>
            <li>
              <strong className="text-ink">Other personally identifiable information (PII)</strong>: any other data
              that could reasonably be used to identify you or your household, such as preferences, service usage,
              feedback, or form inputs.
            </li>
          </ul>
          <p className={p}>
            Note: Tech Rig does not collect or store any information you do not voluntarily provide. Our live chat or
            &ldquo;Contact Us&rdquo; features do not automatically collect identifiable information unless you choose
            to enter it.
          </p>

          <h3 className={h3}>b. Information Collected Automatically Through Technology</h3>
          <p className={p}>
            In addition to the information you provide directly, Tech Rig&mdash;along with our third-party partners
            and service providers&mdash;may automatically collect certain data about your interactions with our
            Website and Services. This category of information, referred to as &ldquo;Usage Data&rdquo; or
            &ldquo;Usage Information,&rdquo; is gathered when you access or engage with our Site through a desktop
            computer, laptop, smartphone, tablet, or any other device capable of connecting to the internet
            (collectively, a &ldquo;Device&rdquo;). This automatic data collection is a common industry practice that
            helps us analyze trends, monitor the functionality and performance of the Site, enhance user experience,
            detect security incidents, and personalize your interactions with our Services.
          </p>
          <p className={`${p} font-medium text-ink`}>Types of Usage Information collected</p>
          <p className={p}>Depending on how you interact with the Site, we and our partners may collect and store:</p>
          <ul className={ul}>
            <li>
              <strong className="text-ink">Unique device identifiers</strong>, such as your IP address, Identifier
              for Advertisers (IDFA) on Apple devices, Google Advertising ID (AAID) on Android devices, International
              Mobile Equipment Identity (IMEI), or any other unique device or browser identifier.
            </li>
            <li>
              <strong className="text-ink">Device and browser specifications</strong>, including device type and
              model, operating system and version, browser type and version, mobile network information, and device
              hardware capabilities and settings.
            </li>
            <li>
              <strong className="text-ink">Referring and exit pages</strong>: the URL that referred you to our Site,
              and the URLs of the pages you visit after leaving our Site.
            </li>
            <li>
              <strong className="text-ink">Site navigation and interaction data</strong>: pages and features you
              browse or click on, time spent on different pages, actions taken (form submissions, button clicks), and
              behavioral patterns that help us recognize returning users.
            </li>
            <li>
              <strong className="text-ink">Geolocation data</strong>, depending on your device and browser settings,
              which may include country, region, city, or postal code, GPS-based coordinates, or network-based
              location.
            </li>
            <li>
              <strong className="text-ink">Temporal data</strong>: timestamps such as when you accessed our Services,
              session duration, and frequency of visits.
            </li>
            <li>
              <strong className="text-ink">Other device and interaction metrics</strong>, such as battery level and
              connection type, app crash or error logs, and performance diagnostics.
            </li>
          </ul>
          <p className={`${p} font-medium text-ink`}>How we use automatically collected information</p>
          <p className={p}>Usage Information enables us to:</p>
          <ul className={ul}>
            <li>Improve the design, functionality, and performance of our Website and Services;</li>
            <li>Personalize your experience by remembering your preferences and settings;</li>
            <li>Deliver more relevant content, promotions, and features based on your usage patterns or location;</li>
            <li>Monitor website traffic and gather analytical insights to optimize our offerings;</li>
            <li>Detect and prevent fraudulent behavior, security breaches, and other misuse;</li>
            <li>Comply with applicable legal obligations and maintain internal records.</li>
          </ul>
          <p className={`${p} font-medium text-ink`}>Your control over location services</p>
          <p className={p}>
            If you have permitted location access on your Device or browser, we may use that information to tailor
            the Services, content, offers, or features we show you. If you no longer wish to share your location, you
            may disable location tracking through your Device settings (for example, iOS: Settings &gt; Privacy &gt;
            Location Services; Android: Settings &gt; Location, then adjust app permissions). Turning off location
            services may impact your ability to access certain features, offers, or content that rely on
            location-based customization.
          </p>

          <h3 className={h3}>c. Information Received from Third-Party Sources</h3>
          <p className={p}>
            Our Site may include features or integrations that enable communication or data-sharing between the Tech
            Rig platform and third-party websites, applications, or external service providers, for example social
            media &ldquo;Share&rdquo;/&ldquo;Like&rdquo; buttons, email or messaging tools that let you send content
            or referrals from our Site, and embedded content or plugins (such as video, comments, or map widgets)
            that enable interactive experiences through third-party APIs. Depending on the feature and the
            permissions you&rsquo;ve granted, these interactions may send data to the third party, or the third party
            may transmit data back to us, such as public profile information or activity analytics.
          </p>
          <p className={p}>
            When you interact with any of these third-party tools or services on or through our Site: those third
            parties may collect, store, or process data involved in your interaction, including personal information
            or usage metrics; that data is governed by their own privacy policies and terms of service, not ours; and
            Tech Rig does not own, operate, or control those platforms, nor how they collect, use, or retain your
            data. Any data you choose to share while interacting with third-party tools or services is done at your
            own discretion and risk.
          </p>
          <p className={p}>
            For example, if you choose to share a page from our Site via a social media account, that platform may
            collect data about your activity according to its own data handling policies; Tech Rig would not have
            access to your full account details or control over how that data is used afterward.
          </p>
          <p className={p}>
            Before using third-party tools embedded in or linked from our Site, we encourage you to review the
            privacy policy and terms of service of the respective third-party provider, adjust your account settings
            on those platforms if needed, and be mindful of what personal data you choose to share during such
            interactions. For additional information, please refer to our{" "}
            <Link href="/terms-of-service/" className={link}>
              Terms and Conditions
            </Link>
            .
          </p>

          <h2 className={h2}>2. How We Use the Information We Collect</h2>
          <p className={p}>
            At Tech Rig, we use the information we collect from and about you for a wide range of operational,
            administrative, legal, and marketing purposes. These uses are designed to support your interaction with
            our Site and Services, improve your experience, fulfill legal obligations, and enhance the overall
            quality of what we provide.
          </p>

          <h3 className={h3}>A. Service Fulfillment and Customer Support</h3>
          <ul className={ul}>
            <li>
              Respond to inquiries, service requests, or customer support tickets you initiate through any of our
              communication channels.
            </li>
            <li>Deliver the products or services you have purchased, subscribed to, or requested.</li>
            <li>Provide status updates or confirmations about the progress of your orders or service activities.</li>
            <li>Verify your identity when necessary to ensure you are the rightful account holder or service recipient.</li>
            <li>Prevent, detect, and investigate fraudulent activities or unauthorized access to our systems.</li>
          </ul>

          <h3 className={h3}>B. Payment Processing and Transaction Management</h3>
          <p className={p}>
            To process payments securely, we may pass your transaction data to trusted third-party payment
            processors. Tech Rig does not store your full payment card information on its servers. We may retain
            non-sensitive transaction data (such as confirmation IDs, billing status, and payment method types)
            solely for reference, refund processing, and accounting purposes.
          </p>

          <h3 className={h3}>C. Communications and Notifications</h3>
          <p className={p}>We use your contact information to:</p>
          <ul className={ul}>
            <li>Send transactional messages such as payment receipts, order summaries, or account alerts.</li>
            <li>Deliver updates and service-related notices, including maintenance announcements or policy changes.</li>
            <li>Share informational and promotional emails about new services, updates, or upcoming features.</li>
            <li>Distribute newsletters, service-related insights, event announcements, and general marketing content.</li>
          </ul>
          <p className={p}>
            You may opt out of promotional communications at any time by following the unsubscribe instructions in
            the email or contacting us directly.
          </p>

          <h3 className={h3}>D. Marketing, Personalization, and Targeting</h3>
          <ul className={ul}>
            <li>Deliver marketing communications specific to Tech Rig or related offerings that align with your preferences.</li>
            <li>Customize and personalize your experience on the Site by offering content, products, and services that are more relevant to you.</li>
            <li>Provide interest-based advertisements and recommendations based on your activity, interactions, and indicated interests.</li>
            <li>Identify and analyze your preferences and behavior on the Site to improve how we present options, offers, and content.</li>
          </ul>

          <h3 className={h3}>E. Analytics, Improvement, and Optimization</h3>
          <ul className={ul}>
            <li>Perform user behavior analytics to identify patterns and trends on the Site.</li>
            <li>Test and refine new features, tools, or layouts.</li>
            <li>Evaluate the performance and effectiveness of our marketing campaigns, website structure, and product offerings.</li>
            <li>Use feedback and behavior insights to enhance usability, accessibility, and responsiveness of our Services.</li>
          </ul>

          <h3 className={h3}>F. Product Development and Innovation</h3>
          <ul className={ul}>
            <li>Identify pain points, opportunities, and ideas for new services or enhancements.</li>
            <li>Conduct quality assurance testing and internal research aimed at improving our offerings.</li>
            <li>Innovate and launch features that are more aligned with customer needs.</li>
          </ul>

          <h3 className={h3}>G. Safety, Security, and Legal Compliance</h3>
          <ul className={ul}>
            <li>Maintain and strengthen the security, integrity, and performance of our systems and infrastructure.</li>
            <li>Detect, investigate, and resolve technical issues, system errors, or security vulnerabilities.</li>
            <li>Respond to legal requests, enforce our Terms and Conditions, and comply with applicable laws or regulations.</li>
            <li>Protect the rights, safety, and property of Tech Rig, its users, service partners, and the general public.</li>
          </ul>

          <h3 className={h3}>H. Other Legitimate Business Purposes</h3>
          <ul className={ul}>
            <li>Communicate order-related reminders and necessary follow-ups.</li>
            <li>Engage in customer satisfaction surveys, market research studies, or feedback collection efforts.</li>
            <li>Perform audits, monitoring, and recordkeeping for compliance, risk management, and internal operations.</li>
            <li>
              Fulfill any purpose explicitly disclosed to you at the time of data collection, as well as any use that
              is consistent with this Privacy Policy and permitted by applicable law.
            </li>
          </ul>

          <h2 className={h2}>3. Sharing and Disclosure of Your Information</h2>
          <p className={p}>
            In the course of operating our business, providing services, and complying with legal obligations, we may
            share your personal data with authorized third parties under the conditions described below.
          </p>

          <h3 className={h3}>A. Categories of Third Parties We May Share Your Information With</h3>
          <p className={p}>Your information, including Personal Information, may be disclosed to:</p>
          <ul className={ul}>
            <li>Government entities and regulatory agencies as required for legal compliance or filings.</li>
            <li>Affiliated companies and subsidiaries under common ownership with Tech Rig, solely for purposes aligned with this Privacy Policy.</li>
            <li>
              Trusted service providers who perform functions on our behalf, such as payment processors, cloud
              storage providers, email marketing vendors, customer support partners, data security services, IT and
              infrastructure providers, and web analytics companies.
            </li>
            <li>Business partners and vendors involved in providing, improving, or supporting our Services.</li>
          </ul>
          <p className={p}>These third parties are only given access to the specific information they need to perform their tasks.</p>

          <h3 className={h3}>B. Limits on Use and Sale of Personal Information</h3>
          <p className={p}>
            We do not sell, lease, or rent your personal information to any unaffiliated third parties for their
            marketing purposes. If you are a California resident, you may have additional rights under applicable
            state privacy laws regarding the limited sharing of your data &mdash; see &ldquo;Your California Privacy
            Rights&rdquo; below.
          </p>

          <h3 className={h3}>C. Aggregated or Anonymized Data</h3>
          <p className={p}>
            We may aggregate, de-identify, or anonymize any information collected through the Site or Services so
            that it no longer identifies you personally. Once de-identified, this data is no longer considered
            Personal Information under applicable laws, and we may use or share it freely for internal business
            analytics, research and development, service improvement, marketing insights, and reporting or
            publishing industry trends. This anonymized data may also be shared with third parties, including
            advertisers and research partners.
          </p>

          <h3 className={h3}>D. Situations Where Disclosure Is Required or Permitted</h3>
          <ul className={ul}>
            <li>In response to legal processes, such as a valid subpoena, court order, or other enforceable legal request.</li>
            <li>To comply with obligations from federal or state regulatory authorities, particularly where the inquiry involves your interaction with our Services.</li>
            <li>
              As part of a business transaction, including a merger, acquisition, sale, or restructuring of our
              business, provided that proper data protection measures are in place.
            </li>
            <li>
              In connection with legal disputes, including arbitration or court proceedings, where disclosure of
              relevant information is necessary to file or defend a claim.
            </li>
          </ul>

          <h2 className={h2}>4. Cookies and Other Tracking Technologies</h2>
          <p className={p}>
            Tech Rig may use a range of tracking technologies to collect certain information automatically as you
            browse and interact with our Site. These help us improve the performance, usability, and personalization
            of our Services and allow us to analyze usage patterns.
          </p>

          <h3 className={h3}>A. What Are Tracking Technologies?</h3>
          <ul className={ul}>
            <li><strong className="text-ink">Cookies</strong>: small text files that help us identify returning users, remember your preferences, and understand site usage.</li>
            <li><strong className="text-ink">Web beacons</strong>: invisible graphic images embedded in webpages or emails that help track whether a message or page has been viewed.</li>
            <li><strong className="text-ink">Tracking pixels</strong>: small images or code snippets used to determine whether you opened an email or visited a specific page.</li>
            <li><strong className="text-ink">Embedded scripts</strong>: short snippets of code that monitor actions such as link clicks or form submissions.</li>
            <li><strong className="text-ink">ETags (entity tags)</strong>: identifiers assigned by web servers to recognize returning users based on cached data.</li>
            <li><strong className="text-ink">Browser fingerprinting</strong>: analysis of device characteristics to uniquely identify a session.</li>
            <li><strong className="text-ink">Recognition technologies</strong>: tools that identify patterns in behavior across devices or sessions.</li>
          </ul>

          <h3 className={h3}>B. Why We Use These Technologies</h3>
          <ul className={ul}>
            <li><strong className="text-ink">Security &amp; fraud prevention</strong>: identify and block suspicious activity, protect user accounts, and maintain secure access.</li>
            <li><strong className="text-ink">Site functionality</strong>: enable page navigation, user sessions, form completion, and account logins.</li>
            <li><strong className="text-ink">Personalization</strong>: remember user settings, language preferences, or content viewed previously.</li>
            <li><strong className="text-ink">Analytics &amp; performance monitoring</strong>: assess how users interact with the Site and how content performs.</li>
            <li><strong className="text-ink">Marketing &amp; advertising</strong>: display more relevant ads and measure the effectiveness of our marketing efforts.</li>
          </ul>

          <h3 className={h3}>C. Your Options and Control Over Cookies</h3>
          <p className={p}>You can adjust your browser settings to be notified when a cookie is set, block all cookies, accept or reject individual cookies, delete existing cookies at any time, or use private browsing to limit tracking. If you disable or block cookies, certain features on our Site may not function as intended, including services that rely on recognizing your login status or storing your preferences.</p>

          <h3 className={h3}>D. Resources for Managing Cookies</h3>
          <p className={p}>
            To manage cookies, refer to your browser&rsquo;s official support documentation (Chrome, Firefox, Safari,
            or Edge). You can also learn more about cookies and how to control them at{" "}
            <a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer" className={link}>
              allaboutcookies.org
            </a>{" "}
            and{" "}
            <a href="https://www.networkadvertising.org" target="_blank" rel="noopener noreferrer" className={link}>
              networkadvertising.org
            </a>
            .
          </p>

          <h3 className={h3}>E. Email Cookies and Pixels</h3>
          <p className={p}>
            Marketing emails from Tech Rig may contain embedded tracking pixels that help us understand how you
            engage with the content. If you do not wish to be tracked this way, avoid clicking on email links or
            downloading images, set your email client to block external images, or disable HTML rendering in emails.
          </p>

          <h3 className={h3}>F. Error Monitoring</h3>
          <p className={p}>
            We use Sentry, an error-monitoring service, to detect and diagnose technical problems on our Site. Sentry
            helps us see when something breaks (a page error, a failed request) so we can fix it; it is not used to
            track your browsing behavior, build an advertising profile, or serve ads. Personal identifiers and
            request details (cookies, headers, form data) are stripped from error reports before they reach Sentry.
            We do not currently use Google Analytics or a similar behavioral analytics service on this Site; if that
            changes, we will update this section.
          </p>

          <h2 className={h2}>5. Do Not Track (DNT) Signals</h2>
          <p className={p}>
            Some web browsers offer a &ldquo;Do Not Track&rdquo; feature that signals a preference not to be tracked
            across websites. There is currently no consistent industry standard governing how websites should respond
            to a DNT signal, and Tech Rig does not currently respond to DNT browser signals or similar mechanisms. You
            can learn more about Do Not Track at{" "}
            <a href="https://allaboutdnt.com" target="_blank" rel="noopener noreferrer" className={link}>
              allaboutdnt.com
            </a>
            .
          </p>

          <h2 className={h2}>6. Your Privacy Choices and Controls</h2>
          <h3 className={h3}>A. Marketing Communications</h3>
          <p className={p}>
            If you no longer wish to receive marketing-related emails from us, click the &ldquo;unsubscribe&rdquo;
            link at the bottom of any marketing email, or email us at{" "}
            <a href={`mailto:${site.email}`} className={link}>
              {site.email}
            </a>
            . Even if you opt out of marketing emails, we may still send you transactional or service-related
            communications, such as order confirmations, account notices, or security alerts.
          </p>
          <h3 className={h3}>B. Information Sharing with Third Parties</h3>
          <p className={p}>
            If you prefer that we do not share your name and mailing address with non-affiliated third parties for
            marketing purposes (excluding our trusted service providers and affiliates), you can opt out by
            contacting us at{" "}
            <a href={`mailto:${site.email}`} className={link}>
              {site.email}
            </a>
            . This opt-out will not affect our ability to disclose your information in other ways described in this
            Privacy Policy, including where necessary for business operations or legal compliance.
          </p>

          <h2 className={h2}>7. Children&rsquo;s Privacy</h2>
          <p className={p}>
            Our Services are intended for use only by individuals who are 18 years of age or older. We do not
            knowingly collect personal data from children under the age of 18. If you are a parent or legal guardian
            and believe that your child under 18 has provided personal information to us without your consent,
            please contact us at{" "}
            <a href={`mailto:${site.email}`} className={link}>
              {site.email}
            </a>
            . Upon verification, we will promptly delete the child&rsquo;s information from our systems.
          </p>

          <h2 className={h2}>8. Information Security</h2>
          <p className={p}>
            We implement reasonable administrative, technical, and physical safeguards to protect your Personal
            Information against unauthorized access, misuse, loss, disclosure, alteration, or destruction, including
            encrypted connections, secure data storage, access controls and authentication measures, and regular
            vulnerability scanning.
          </p>
          <p className={p}>
            Despite our efforts, no system can be guaranteed to be completely secure. If you believe your interaction
            with Tech Rig has been compromised or you suspect unauthorized use of your account, please contact us
            immediately at{" "}
            <a href={`mailto:${site.email}`} className={link}>
              {site.email}
            </a>
            .
          </p>

          <h2 className={h2}>9. External Websites and Third-Party Links</h2>
          <p className={p}>
            Our Site may include links to external websites or services operated by other organizations. We do not
            control or endorse the privacy practices, security measures, or content of third-party sites. We
            encourage you to review the privacy policies and terms of any linked websites before submitting personal
            data to them. The inclusion of such links does not imply affiliation or endorsement by Tech Rig. For more
            details on third-party interactions, please review our{" "}
            <Link href="/terms-of-service/" className={link}>
              Terms and Conditions
            </Link>
            .
          </p>

          <h2 className={h2}>10. Updating or Correcting Your Personal Information</h2>
          <p className={p}>
            To help us maintain accurate and up-to-date records, we encourage you to notify us of any changes to your
            personal information. If you need to update your name, contact details, or other personal data, you can
            reach us at{" "}
            <a href={`mailto:${site.email}`} className={link}>
              {site.email}
            </a>
            . We will use reasonable efforts to make requested updates in our active databases as soon as
            practicable. However, we may retain prior information in backup systems or for legal, audit, or
            operational reasons.
          </p>

          <h2 className={h2}>11. International Transfers of Personal Information</h2>
          <p className={p}>
            Although Tech Rig primarily operates within the United States, we may engage with partners, vendors, or
            service providers that operate globally. As a result, your Personal Information may be transferred,
            stored, or processed outside your home country, including in jurisdictions where data protection laws may
            differ or provide less protection than those in your region. Whenever we transfer data across borders, we
            take steps to ensure safeguards are in place (such as contractual obligations or data protection
            agreements), comply with applicable data privacy regulations, and use reasonable efforts to protect your
            information in accordance with the principles outlined in this Privacy Policy.
          </p>

          <h2 className={h2}>12. Your California Privacy Rights</h2>
          <p className={p}>
            This section is specifically intended for individuals residing in the state of California, in accordance
            with the California Consumer Privacy Act (CCPA) and the California Privacy Rights Act (CPRA). If you are
            a California resident, you are entitled to certain rights regarding your personal information, including
            the right to:
          </p>
          <ul className={ul}>
            <li>Know what categories of personal information we collect about you;</li>
            <li>Know whether and how we share or disclose your personal information, and to whom;</li>
            <li>Access specific pieces of personal information we have collected about you;</li>
            <li>Delete personal information you&rsquo;ve provided, subject to certain exceptions;</li>
            <li>Correct inaccurate personal information;</li>
            <li>Limit the use and disclosure of sensitive personal information;</li>
            <li>Opt out of automated decision-making or profiling, if applicable;</li>
            <li>Request information about how automated decision-making technologies are used;</li>
            <li>Opt out of the sale or sharing of your personal information; and</li>
            <li>Not be discriminated against for exercising any of these rights.</li>
          </ul>

          <h3 className={h3}>Categories of Personal Information We Collect</h3>
          <p className={p}>
            The table below outlines the types of personal information Tech Rig may collect, whether we collect each
            category, and its source.
          </p>
          <div className="mt-4 overflow-x-auto rounded-card border border-slate/15">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate/15 bg-cloud">
                  <th className={th}>Category of personal information</th>
                  <th className={th}>Collected</th>
                  <th className={th}>Source(s)</th>
                </tr>
              </thead>
              <tbody>
                {CCPA_CATEGORIES.map((row) => (
                  <tr key={row.category} className="border-b border-slate/10">
                    <td className={td}>{row.category}</td>
                    <td className={`${td} text-ink`}>{row.collected}</td>
                    <td className={td}>{row.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className={h3}>a. Submitting Requests to Access or Delete Information</h3>
          <p className={p}>As a California consumer, you may request the following information we&rsquo;ve collected about you during the prior 12-month period:</p>
          <ul className={ul}>
            <li>Categories of personal information collected;</li>
            <li>Categories of sources of that information;</li>
            <li>Our purposes for collecting, sharing, or disclosing the data;</li>
            <li>Categories of third parties with whom we shared the information;</li>
            <li>Specific items of personal information we have collected about you.</li>
          </ul>
          <p className={p}>
            You may also request that we delete personal information we have collected from you, subject to
            exceptions &mdash; for example, if it is needed to complete a transaction, required for detecting or
            protecting against fraud, needed to comply with a legal obligation, or if retention is permitted by
            another applicable regulation. If data has been de-identified, anonymized, or was collected as part of a
            single transaction and not retained, we are not required to re-identify or maintain that data for your
            access request.
          </p>

          <h3 className={h3}>b. Opting Out of the Sale of Personal Information</h3>
          <p className={p}>
            You have the right to instruct us not to sell your personal information. As of the effective date of this
            policy, Tech Rig does not sell personal information to third parties. If this changes, we will update
            this Privacy Policy and offer an easy mechanism for you to opt out. You may always opt out of any
            marketing communications by emailing{" "}
            <a href={`mailto:${site.email}`} className={link}>
              {site.email}
            </a>
            .
          </p>

          <h3 className={h3}>c. Limiting Use of Sensitive Personal Information</h3>
          <p className={p}>
            California law grants consumers the right to limit the use of sensitive personal information to only what
            is necessary to perform requested services or provide goods. Tech Rig only uses sensitive data as
            strictly necessary to fulfill the purpose for which it was provided (e.g., identity verification or order
            fulfillment). We do not sell or share this data with third parties and retain it only for the duration
            necessary to complete the relevant transaction. You may revoke your consent to use sensitive information
            at any time by contacting us.
          </p>

          <h3 className={h3}>d. Non-Discrimination</h3>
          <p className={p}>
            Tech Rig will never discriminate against you for exercising your rights under the CCPA or CPRA. This
            means we will not deny you goods or services, charge you different prices or rates, impose penalties,
            provide a different level or quality of service, or suggest that you will receive a different level of
            service or price if you exercise your rights. We may, as permitted under California law, offer financial
            incentives (such as discounts or loyalty rewards) in exchange for voluntarily provided personal
            information; participation in these programs is always opt-in, and you can revoke consent at any time.
          </p>

          <h3 className={h3}>e. Direct Marketing Disclosures</h3>
          <p className={p}>
            Under California Civil Code &sect;1798.83, California residents may request information regarding the
            categories of personal information shared with third parties for their own direct marketing use during
            the previous calendar year. Tech Rig does not share personal information for direct marketing purposes
            with any non-affiliated third parties.
          </p>

          <h3 className={h3}>f. Exercising Your Rights Under California Law</h3>
          <p className={p}>
            If you are a California resident and would like to make a request to access, delete, correct, or limit
            the use of your information, or to opt out of the sale of personal information, you or an authorized
            agent may contact us at{" "}
            <a href={`mailto:${site.email}`} className={link}>
              {site.email}
            </a>{" "}
            with the subject line &ldquo;California Privacy Rights.&rdquo; Please include your full name, email
            address, and a statement verifying your California residency; if you use an authorized agent, we may
            require proof of written authorization.
          </p>
          <p className={p}>
            We will confirm receipt of your request within 10 business days and respond within 45 calendar days,
            unless an extension is required, in which case we will notify you of the delay and provide an expected
            response timeline. Requests may be made no more than twice within a 12-month period.
          </p>

          <h2 className={h2}>13. Changes to This Privacy Policy</h2>
          <p className={p}>
            Tech Rig may revise or update this Privacy Policy from time to time. When we do, we will post the updated
            version on our website at{" "}
            <a href={site.url} className={link}>
              {site.url.replace(/^https?:\/\//, "")}
            </a>{" "}
            and indicate the date of the most recent revision. We encourage users to review this Privacy Policy
            periodically to stay informed about how we collect, use, and safeguard your personal information.
          </p>

          <h2 className={h2}>14. Contact Us</h2>
          <p className={p}>
            If you have any questions, requests, or concerns regarding this Privacy Policy or your data rights, you
            may contact us at{" "}
            <a href={`mailto:${site.email}`} className={link}>
              {site.email}
            </a>{" "}
            or visit{" "}
            <a href={site.url} className={link}>
              {site.url.replace(/^https?:\/\//, "")}
            </a>
            .
          </p>
        </Container>
      </Section>
    </>
  );
}
