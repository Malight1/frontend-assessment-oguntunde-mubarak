/**
 * next.config.ts
 *
 * - Adds `image.tmdb.org` as a trusted Next.js Image domain so `next/image`
 *   can optimise TMDB poster and backdrop URLs at the edge.
 * - Sets Cloudflare-friendly Cache-Control headers for static assets:
 *     `public, max-age=31536000, immutable`
 *   This tells Cloudflare CDN to cache these forever; content-hashed
 *   filenames guarantee freshness without revalidation.
 */
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        pathname: "/t/p/**",
      },
    ],
  },

  async headers() {
    return [
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
