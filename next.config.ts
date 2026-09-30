import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        pathname: "/images/**",
      },
    ],
    qualities: [75],
  },
};
const withNextIntl = createNextIntlPlugin();



export default withNextIntl(nextConfig);