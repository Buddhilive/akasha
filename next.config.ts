import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prevent bundling of native modules
  serverExternalPackages: ["swisseph"],
};

export default nextConfig;
