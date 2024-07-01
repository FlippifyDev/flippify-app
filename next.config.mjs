/** @type {import('next').NextConfig} */


const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/l/home',
        permanent: false,
      }
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
        port: '',
        pathname: '/wgp29vn/phone-mockup-image.jpg',
      },
    ],
  },
  env: {
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  }
};


export default nextConfig;
