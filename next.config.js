/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.externals.push({
      "utf-8-validate": "commonjs utf-8-validate",
      bufferutil: "commonjs bufferutil",
    });
    return config;
  },
  experimental: {
    esmExternals: "loose",
  },
  swcMinify: true,
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
