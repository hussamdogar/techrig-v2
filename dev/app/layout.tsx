import type { Metadata } from "next";
import Script from "next/script";
import { Archivo, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CookieNotice } from "@/components/cookie-notice";
import { JsonLd } from "@/components/json-ld";
import { graph, organizationNode, websiteNode } from "@/lib/schema";
import "./globals.css";

// Design system type stack (design-system.md §4). next/font self-hosts each face
// from the app origin (no Google CDN request), subsets to Latin, and uses
// display: swap so fonts never block render, satisfying the performance budget.

// Display: headlines, hero, section titles. Variable, so weights 700/800 are free.
const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

// Body: all running copy, FAQ, nav, buttons. Weights used across the system.
const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-sans",
  display: "swap",
});

// Utility: the "official record" cue, for prices, filing statuses, reference numbers.
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});

// Google Tag Manager. Site-wide (every page fires a GTM page view/history-
// change event automatically), but the custom dataLayer events pushed via
// lib/gtm.ts are only wired up on /boc-3-filing/demo/ and the /buy/ purchase
// funnel, per the client's instructions. Add more instrumentation elsewhere
// only if asked.
const GTM_ID = "GTM-W7BD5J6W";

export const metadata: Metadata = {
  metadataBase: new URL("https://techrig.org"),
  // Home inherits `default`; other pages set their own title and get the template.
  title: {
    default: "Tech Rig: Truck Dispatch and Compliance Services",
    template: "%s | Tech Rig",
  },
  description:
    "Tech Rig gets new carriers road-legal and keeps trucks loaded: trucking compliance and authority setup, plus truck dispatch for owner-operators and fleets.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${plexSans.variable} ${plexMono.variable}`}
    >
      {/* Paper background + Ink body text + body face is the system default surface.
          Flex column so the footer settles at the bottom and main grows. */}
      <body className="flex min-h-dvh flex-col bg-paper font-body text-ink antialiased">
        {/* Google Tag Manager (noscript). Google's install instructions ask for
            this immediately after the opening <body> tag; kept there exactly. */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        {/* Canonical Organization + WebSite nodes, site-wide, so every page's
            JSON-LD can reference #org by @id. */}
        <JsonLd data={graph(organizationNode(), websiteNode())} />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <CookieNotice />
        {/* SpeedInsights removed 2026-09-09: @vercel/speed-insights 2.0.0 throws an
            unhandled promise rejection ("reading 'M_ID'") on every page under
            Next 16 + Turbopack production builds. Re-add once the package supports
            it. Vercel's server-side performance metrics are unaffected. */}
        <Analytics />

        {/* Google Tag Manager. next/script + afterInteractive is Next's own
            recommended pattern for GTM (loads after the page is interactive,
            non-render-blocking) rather than a raw <script> tag in <head>. */}
        <Script id="gtm-base" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
      </body>
    </html>
  );
}
