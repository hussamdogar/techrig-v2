import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Power of Attorney",
  description:
    "Tech Rig power of attorney information. The full document is being migrated from our existing site.",
  alternates: { canonical: "/power-of-attorney/" },
};

export default function Page() {
  return <LegalPage title="Power of Attorney" />;
}
