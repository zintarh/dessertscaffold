import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  trailingSlash: false,
  images: {
    unoptimized: true
  },
  experimental: {
    esmExternals: 'loose'
  }
};

export default nextConfig;
