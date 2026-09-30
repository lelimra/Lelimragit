import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        pathname: "/images/**",
      },
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lelimra.com",
      },
    ],
    qualities: [25, 50, 75], // Allow default Next.js fallback qualities
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);