/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "ipfs.io",
      "storage.googleapis.com",
      "guardianpenguins.xyz",
      "metadata.ens.domains",
    ],
  },
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = nextConfig;
