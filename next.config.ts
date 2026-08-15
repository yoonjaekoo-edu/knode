import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/knode",
  assetPrefix: "/knode/",
  trailingSlash: true,
};

export default nextConfig;
