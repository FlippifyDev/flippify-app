import HomePage from './l/home/page'
import Loading from './components/Loading';
import { Suspense } from 'react';
import { Metadata } from 'next'


export const metadata: Metadata = {
  title: 'Flippify',
  description: 'Reselling bots and tools. Powered by Stripe and Discord.',
  openGraph: {
    title: 'Transform Your Reselling Game - Flippify Home',
    description: 'Welcome to Flippify, your ultimate reselling platform for flipping, buying, and selling unique items. Boost your profits with our fast deal bots, covering everything from Lego to sneakers. Learn how Flippify makes reselling easy and lucrative.',
    url: 'https://flippify.co.uk/',
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
      follow: true,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function Home() {
  return (
    <div>
      <Suspense fallback={<Loading />}>
        <HomePage />
      </Suspense>
    </div>
  );
}
