import { ogImage, ogSize, ogContentType } from "@/lib/og";

// Unique branded OG image for the About page (design/about-us.md). Per the spec,
// the OG never includes founder likenesses or real names: it is the brand
// template only (mono wordmark, title, category tag, Signal rule).
export const size = ogSize;
export const contentType = ogContentType;
export const alt = "About Tech Rig | Tech Rig";

export default function Image() {
  return ogImage({ title: "About Tech Rig", category: "Company" });
}
