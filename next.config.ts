import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '12mb',
    },
  },
  // Fix for Prisma + Turbopack on Windows
  serverExternalPackages: ['@prisma/client'],
};

export default nextConfig;
