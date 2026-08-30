import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/dashboard",
        destination: "/business/dashboard",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
