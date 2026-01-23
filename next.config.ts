import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';
const isGitHubPages = process.env.GITHUB_PAGES === 'true';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Настройки для GitHub Pages
  basePath: isGitHubPages ? '/dodge-game' : '',
  assetPrefix: isGitHubPages ? '/dodge-game/' : '',
};

export default nextConfig;
