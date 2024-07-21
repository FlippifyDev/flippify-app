import PriceList from "../components/PriceList";
import LandingLayout from '../components/LandingLayout';
import Loading from "@/app/components/Loading";

import { Metadata } from 'next';
import { Suspense } from "react";

export const metadata: Metadata = {
  title: 'Affordable Pricing Plans for Resellers - Flippify',
  description: 'Discover Flippify’s pricing plans designed to suit all your reselling needs. From monitoring soon-to-retire Lego sets to exclusive deals, our affordable plans help you maximize profits and stay ahead in the flipping game.',
  openGraph: {
    title: 'Affordable Pricing Plans for Resellers - Flippify',
    description: 'Discover Flippify’s pricing plans designed to suit all your reselling needs. From monitoring soon-to-retire Lego sets to exclusive deals, our affordable plans help you maximize profits and stay ahead in the flipping game.',
    url: 'https://flippify.co.uk/l/pricing',
    images: [
      {
        url: "https://i.imgur.com/D1UhTq3.png",
        width: 1918,
        height: 1078,
        alt: "Pricing Page Image"
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



export default function Pricing() {
  return (
    <Suspense fallback={<Loading />}>
      <LandingLayout>
        <PriceList />
      </LandingLayout>
    </Suspense>
  );
}