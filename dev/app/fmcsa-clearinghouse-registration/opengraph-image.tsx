import { ogImage, ogSize, ogContentType } from "@/lib/og";

// Unique branded OG image for the FMCSA Clearinghouse page
// (design/fmcsa-clearinghouse-registration.md).
export const size = ogSize;
export const contentType = ogContentType;
export const alt = "FMCSA Clearinghouse | Tech Rig";

export default function Image() {
  return ogImage({ title: "FMCSA Clearinghouse", category: "Compliance" });
}
