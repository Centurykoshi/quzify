import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  typescript: {
    // Enable the experimental `isolatedModules` flag
    ignoreBuildErrors: true,
  },
  eslint : { 
    ignoreDuringBuilds: true, 
  }, 
};

export default nextConfig;
