import { ogImage, ogSize, ogContentType } from "@/lib/og";

// Unique branded OG image for the home page (design/home.md).
export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Tech Rig: Truck Dispatch and Compliance Services";

export default function Image() {
  return ogImage({
    title: "Trucking compliance and dispatch",
    category: "Compliance + Dispatch",
  });
}
