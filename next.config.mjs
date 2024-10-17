/** @type {import('next').NextConfig} */

const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/l/home',
        permanent: false,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  env: {
    MONGO_URL: process.env.MONGO_URL,
    LIVE_STRIPE_SECRET_KEY: process.env.LIVE_STRIPE_SECRET_KEY,
  }
};


export default nextConfig;
