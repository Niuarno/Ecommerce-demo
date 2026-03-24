import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  serverExternalPackages: ["bcryptjs"],
  allowedDevOrigins: [
    "preview-chat-cf6af9aa-aecf-4b2c-9fab-a4b496fe6a3e.space.z.ai",
  ],
};

export default nextConfig;
