import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel handles output automatically - no need for standalone
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  serverExternalPackages: ["bcryptjs"],
};

export default nextConfig;
