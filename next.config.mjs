/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    dynamicIO: true,
    ppr: true,
    inlineCss: true,
    reactCompiler: true,
    viewTransition: true
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: false
};

export default nextConfig;
