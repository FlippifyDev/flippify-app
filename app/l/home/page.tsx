import LandingLayout from '../components/LandingLayout';
import HomeContentWrapper from '../components/HomeContentWrapper';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Transform Your Reselling Game - Flippify Home',
  description: 'Welcome to Flippify, your ultimate reselling platform for flipping, buying, and selling unique items. Boost your profits with our fast deal bots, covering everything from Lego to sneakers. Learn how Flippify makes reselling easy and lucrative.',
  openGraph: {
    title: 'Transform Your Reselling Game - Flippify Home',
    description: 'Welcome to Flippify, your ultimate reselling platform for flipping, buying, and selling unique items. Boost your profits with our fast deal bots, covering everything from Lego to sneakers. Learn how Flippify makes reselling easy and lucrative.',
    url: 'https://flippify.co.uk/l/home',
    images: [
      {
        url: "https://i.imgur.com/iofmtlb.png",
        width: 1908,
        height: 1076,
        alt: "Home Page Image"
      }
    ]
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: false,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function HomePage() {
  return (
    <LandingLayout>
      <HomeContentWrapper />
    </LandingLayout>
  );
}
