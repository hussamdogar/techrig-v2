import { ogImage, ogSize, ogContentType } from "@/lib/og";

// Unique branded OG image for the Drug & Alcohol Consortium page
// (design/drug-and-alcohol-consortium.md).
export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Drug & Alcohol Consortium | Tech Rig";

export default function Image() {
  return ogImage({ title: "Drug & Alcohol Consortium", category: "Compliance" });
}
