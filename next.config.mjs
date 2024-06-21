/** @type {import('next').NextConfig} */


const nextConfig = {
    async redirects() {
        return [
          {
            source: '/',
            destination: '/l/home',
            permanent: true,
          }
        ];
    },
};


export default nextConfig;
