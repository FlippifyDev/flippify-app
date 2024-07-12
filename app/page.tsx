import HomePage from './l/home/page'
import Loading from './components/Loading';
import { Suspense } from 'react';
import { Metadata } from 'next'
import Head from 'next/head';


export const metadata: Metadata = {
  title: 'Flippify',
  description: 'Reselling bots and tools. Powered by Stripe and Discord.'
}

export default function Home() {
  return (
    <div>
      <Head>
        <meta name="google-site-verification" content="Hho6-HQ44X7tDo2PgIXmXtPOFHsg069qvKUSqF3JfkE" />
      </Head>
      <Suspense fallback={<Loading />}>
        <HomePage />
      </Suspense>
    </div>
  );
}
