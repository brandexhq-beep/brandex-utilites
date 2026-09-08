import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@brandex/core", "@brandex/database", "@brandex/queue", "@brandex/storage"],
};

export default nextConfig;
