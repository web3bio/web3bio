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
  headers: async () => [
    {
      source: "/:path*",
      headers: [
        { key: "Cache-Control", value: "public, s-maxage=86400, stale-while-revalidate=3600" },
      ],
    },
  ],
  swcMinify: true,
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
