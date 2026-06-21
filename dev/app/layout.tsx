import type { Metadata } from "next";
import { Archivo, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
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
        {/* Canonical Organization + WebSite nodes, site-wide, so every page's
            JSON-LD can reference #org by @id. */}
        <JsonLd data={graph(organizationNode(), websiteNode())} />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
