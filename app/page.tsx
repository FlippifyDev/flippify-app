import HomePage from './l/home/page'
import Loading from './components/Loading';
import { Suspense } from 'react';
import { Metadata } from 'next'
import Head from 'next/head';


export const metadata: Metadata = {
  title: 'Flippify',
  description: 'Reselling bots and tools. Powered by Stripe and Discord.',
  robots: "index,follow"
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
