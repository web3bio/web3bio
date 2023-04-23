/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,
  },
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  compiler: {
    removeConsole: true,
  },
};

module.exports = nextConfig;
