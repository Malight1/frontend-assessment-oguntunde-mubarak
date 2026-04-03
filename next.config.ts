/**
 * next.config.ts
 *
 * - Adds `image.tmdb.org` as a trusted Next.js Image domain so `next/image`
 *   can optimise TMDB poster and backdrop URLs at the edge.
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
};

export default nextConfig;
