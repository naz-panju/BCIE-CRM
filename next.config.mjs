/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  transpilePackages: ['@mui/x-charts'],
  images: {
    domains: ['bcie.spider.ws'], // Add your external image domains here
  },
};

export default nextConfig;
