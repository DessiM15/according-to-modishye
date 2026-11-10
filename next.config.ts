import type { NextConfig } from "next";
import redirects from "./content/redirects.json";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  turbopack: {
    rules: {
      "*.css": { loaders: ["@tailwindcss/turbopack"], as: "*.css" },
    },
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "cdn.sanity.io" },
    ],
  },
  async redirects() {
    // Every old WordPress URL keeps its search equity by redirecting permanently.
    const legacy = (redirects as { source: string; destination: string }[]).map((r) => ({
      source: r.source,
      destination: r.destination,
      permanent: true,
    }));
    // Her portal. /wp-admin is muscle memory, so it goes to the same place.
    const studio = process.env.NEXT_PUBLIC_SANITY_STUDIO_URL;
    const portal = studio ? ["/studio", "/wp-admin", "/wp-admin/:path*", "/wp-login.php"].map((source) => ({ source, destination: studio, permanent: false })) : [];
    return [...portal, ...legacy];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
