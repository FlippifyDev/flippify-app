import HomePage from './l/home/page'
import Loading from './components/Loading';
import { Suspense } from 'react';
import { Metadata } from 'next'


export const metadata: Metadata = {
  title: 'Flippify',
  description: 'Reselling bots and tools. Powered by Stripe and Discord.'
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
