import type { NextConfig } from "next";
import path from "node:path";

// Only use custom loader in local development (not in CI/CD or Vercel builds)
const isLocalDev = process.env.NODE_ENV === 'development' && !process.env.VERCEL && !process.env.CI;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  outputFileTracingRoot: path.resolve(__dirname, '../../'),
  typescript: {
    ignoreBuildErrors: true,
  },
  // Only apply Turbopack rules in local development
  ...(isLocalDev && {
    turbopack: {
      rules: {
        "*.{jsx,tsx}": {
          loaders: [path.resolve(__dirname, 'src/visual-edits/component-tagger-loader.js')]
        }
      }
    }
  })
};

export default nextConfig;
// Orchids restart: 1764233683165