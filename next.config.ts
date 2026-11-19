import type { NextConfig } from "next";
import redirects from "./content/redirects.json";

// Covers for products she adds in WooCommerce are served from her store, wherever it lives.
const wooHost = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_WOO_URL ?? "").hostname;
  } catch {
    return null;
  }
})();

// Checkout, cart and account pages only exist on her store. Once the store has its own address, old order emails,
// bookmarks and download links that still point at this site are passed on to it.
const store = process.env.NEXT_PUBLIC_WOO_URL?.replace(/\/+$/, "");
const siteHost = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.accordingtomodishyeblog.com").hostname;
  } catch {
    return null;
  }
})();
const storeRedirects =
  store && wooHost && wooHost !== siteHost
    ? [
        ...["download_file", "wc-api"].map((key) => ({
          source: "/",
          has: [{ type: "query" as const, key }],
          destination: `${store}/`,
          permanent: false,
        })),
        ...["/checkout", "/cart", "/my-account"].flatMap((page) => [
          { source: page, destination: `${store}${page}/`, permanent: false },
          { source: `${page}/:path*`, destination: `${store}${page}/:path*`, permanent: false },
        ]),
      ]
    : [];

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
      { protocol: "https", hostname: "**.accordingtomodishyeblog.com", pathname: "/wp-content/uploads/**" },
      ...(wooHost ? [{ protocol: "https" as const, hostname: wooHost, pathname: "/wp-content/uploads/**" }] : []),
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
    return [...storeRedirects, ...portal, ...legacy];
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
