/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [], // Add any domains you need for images
  },
  env: {
    SITE_NAME: "DecentraStream",
  },
};

export default nextConfig;
