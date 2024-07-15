import ServerPriceList from "../components/ServerPriceList";
import LandingLayout from '../components/LandingLayout';
import { Metadata } from 'next';


export const metadata: Metadata = {
  title: 'Affordable Pricing Plans for Server Resellers - Flippify',
  description: 'Discover Flippify’s pricing plans designed to suit all your servers reselling needs. From monitoring soon-to-retire Lego sets to exclusive deals, our affordable plans help you maximize profits and stay ahead in the flipping game.',
  openGraph: {
    title: 'Affordable Pricing Plans for Server Resellers - Flippify',
    description: 'Discover Flippify’s pricing plans designed to suit all your servers reselling needs. From monitoring soon-to-retire Lego sets to exclusive deals, our affordable plans help you maximize profits and stay ahead in the flipping game.',
    url: 'https://flippify.co.uk/l/server-pricing',
    images: [
      {
        url: "https://i.imgur.com/u1wNw7N.png",
        width: 1918,
        height: 1078,
        alt: "Server Pricing Page Image"
      }
    ]
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}



export default function ServerPricing() {
  return (
    <div>
      <LandingLayout>
        <ServerPriceList />
      </LandingLayout>
    </div>
  );
}