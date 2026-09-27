import type { NextConfig } from "next";

type RemotePattern = NonNullable<NonNullable<NextConfig["images"]>["remotePatterns"]>[number];

// Allow next/image to load Strapi uploads from whatever backend the build points at.
function strapiUploadsPattern(): RemotePattern[] {
  const raw = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  if (!raw) return [];
  try {
    const url = new URL(raw);
    return [
      {
        protocol: url.protocol.replace(":", "") as "http" | "https",
        hostname: url.hostname,
        port: url.port,
        pathname: "/uploads/**",
      },
    ];
  } catch {
    return [];
  }
}

const nextConfig: NextConfig = {
  // Hide the dev-mode "N" badge (bottom-left) so client demos stay clean.
  devIndicators: false,
  images: {
    remotePatterns: [
      ...strapiUploadsPattern(),
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
