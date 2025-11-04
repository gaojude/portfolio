/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheComponents: true,
  experimental: {
    inlineCss: true,
    clientSegmentCache: true,
  },
  reactCompiler: true,
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
