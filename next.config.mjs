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
        protocol: 'https',
        hostname: 'img.daisyui.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'cdn.leonardo.ai',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'cdn.discordapp.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'i.pinimg.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'images-na.ssl-images-amazon.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'uxwing.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'images.ctfassets.net',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'media.4rgos.it',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'johnlewis.scene7.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'static.thcdn.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'www.hamleys.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'media.steelseriescdn.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'rog.asus.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'i.dell.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'media.currys.biz', 
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'static2-ecemea.acer.com', 
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'dlcdnwebimgs.asus.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'images.hotukdeals.com',
        port: '',
      },
    ],
  },
  env: {
    MONGO_URL: process.env.MONGO_URL,
    LIVE_STRIPE_SECRET_KEY: process.env.LIVE_STRIPE_SECRET_KEY,
  }
};


export default nextConfig;
