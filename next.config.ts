import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  basePath: isProd ? "/atlantic-optical" : undefined,
  assetPrefix: isProd ? "/atlantic-optical/" : undefined,
  trailingSlash: true,
  turbopack: {},
};

export default nextConfig;
