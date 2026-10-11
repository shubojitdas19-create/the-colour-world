import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  // Allows testing on your mobile device over local Wi-Fi
  allowedDevOrigins: ['192.168.29.207'],
  
  experimental: {
    agentFeedback: true,
  },
  reactCompiler: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;