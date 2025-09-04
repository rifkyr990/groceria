import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  images: {
    domains: ["picsum.photos", "placehold.co"],
  },
};

export default nextConfig;
