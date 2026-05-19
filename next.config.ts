import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === 'true'
const repo = 'huquoc-travel-guide'

const nextConfig: NextConfig = {
  ...(isGithubPages && {
    output: 'export',
    basePath: `/${repo}`,
    assetPrefix: `/${repo}/`,
    images: { unoptimized: true },
    env: {
      NEXT_PUBLIC_BASE_PATH: `/${repo}`,
    },
  }),
};

export default nextConfig;
