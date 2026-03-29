import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['@repo/ui', '@repo/theme', '@repo/tailwind-config'],
};

export default nextConfig;
