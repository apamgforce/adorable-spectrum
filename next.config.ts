import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [{ source: "/partnerships", destination: "/partner", permanent: true }];
  },
};

export default nextConfig;
