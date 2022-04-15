/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  reactStrictMode: true,
  assetPrefix: isProd ? "/step-cric-records/" : "",
  typescript: { ignoreBuildErrors: true },
};

module.exports = nextConfig;
