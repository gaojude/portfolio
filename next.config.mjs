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
  async redirects() {
    return [
      {
        source: '/meet',
        destination: 'https://cal.com/jude-gao-ymrglb/30min',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
