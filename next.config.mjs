/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    cacheComponents: true,
    inlineCss: true,
    reactCompiler: true,
    viewTransition: true,
    clientSegmentCache: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
