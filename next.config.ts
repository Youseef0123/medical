import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hide the dev-mode "N" badge (bottom-left) so client demos stay clean.
  // It only ever existed in `next dev`; production builds never include it.
  devIndicators: false,
};

export default nextConfig;
