import { ogImage, ogSize, ogContentType } from "@/lib/og";

// Unique branded OG image for the dispatch hub (design/services-dispatch-hub.md).
export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Truck Dispatch | Tech Rig";

export default function Image() {
  return ogImage({ title: "Truck Dispatch", category: "Dispatch" });
}
