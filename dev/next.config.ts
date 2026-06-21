import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The planned URL set (shared/sitemap-plan.md) and the live site use trailing
  // slashes. Match that so canonical URLs and internal links carry the slash and
  // existing ranking URLs are preserved through the revamp.
  trailingSlash: true,
};

export default nextConfig;
