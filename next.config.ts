import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hide the dev-mode "N" badge (bottom-left) so client demos stay clean.
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "1337",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
