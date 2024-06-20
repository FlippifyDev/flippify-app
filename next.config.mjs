/** @type {import('next').NextConfig} */


const nextConfig = {
    async redirects() {
        return [
          {
            source: '/',
            destination: '/landing/home',
            permanent: true,
          }
        ];
    },
};


export default nextConfig;
