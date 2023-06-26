/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    esmExternals: "loose",
  },
  swcMinify: true,
  images: {
    unoptimized: true,
  },
  // rewrites: {
  //   source: "/domain/:path*",
  //   destination: "/:path*",
  // },
};

module.exports = nextConfig;
