import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Ensure Turbopack resolves from project root to avoid creating junctions outside workspace
  turbopack: {
    root: __dirname,
  } as any,
};

export default nextConfig;
