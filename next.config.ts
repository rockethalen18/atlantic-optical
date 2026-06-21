import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  basePath: "/atlantic-optical",
  assetPrefix: "/atlantic-optical/",
  trailingSlash: true,
  turbopack: {},
};

export default nextConfig;
