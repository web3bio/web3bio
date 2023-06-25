/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    esmExternals: "loose",
  },
  swcMinify: true,
  images: {
    unoptimized: true,
  }
};

module.exports = nextConfig;
