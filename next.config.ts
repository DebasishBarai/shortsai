import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['debb-bucket.s3.amazonaws.com'],
    // Or if using the newer format:
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'debb-bucket.s3.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],
  }
};

export default nextConfig;
