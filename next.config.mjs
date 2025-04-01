/** @type {import('next').NextConfig} */

const nextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/l/home",
        permanent: false,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
        port: "",
        pathname: "**",
      },
    ],
  },
  env: {
    MAX_USER_COUNT: 100,
    ROOT: process.env.ROOT,
    NEXT_PUBLIC_FIREBASE_API_KEY: "AIzaSyALlnrwPeEFtu7dXTAFvG4d9OUL-XiY2ao",
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: "flippify-3ffff.firebaseapp.com",
    NEXT_PUBLIC_FIREBASE_DATABASE_URL: "https://flippify-3ffff-default-rtdb.europe-west1.firebasedatabase.app/",
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: "flippify-3ffff",
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: "flippify-3ffff.appspot.com",
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: "238475908658",
    NEXT_PUBLIC_FIREBASE_APP_ID: "1:238475908658:web:445ef3455401e1e1ecce2b",
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: "G-CP0595TPX9",
  },
};

export default nextConfig;
