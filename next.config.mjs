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
    domains: ['img.daisyui.com', 'i.imgur.com', 'i.ibb.co', 'cdn.leonardo.ai', 'cdn.discordapp.com', 'i.pinimg.com', 'images-na.ssl-images-amazon.com'],
  },
  env: {
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  }
};


export default nextConfig;
