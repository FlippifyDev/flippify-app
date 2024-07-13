import LandingLayout from '../components/LandingLayout';
import HomeContentWrapper from '../components/HomeContentWrapper';
import { Metadata } from 'next';
import Head from 'next/head';

export const metadata: Metadata = {
  title: 'Home - Flippify',
  description: 'Welcome to Flippify, your ultimate platform for flipping, buying, and selling unique items. Fast-track your profits with our lightning-quick deal bots, from Lego to sneakers. Discover how Flippify makes flipping easy and profitable.'
};

export default function HomePage() {
  return (
    <div>
      <Head>
        <meta name="google-site-verification" content="Hho6-HQ44X7tDo2PgIXmXtPOFHsg069qvKUSqF3JfkE" />
        <meta name="robots" content="index,follow" />
      </Head>
      <LandingLayout>
        <HomeContentWrapper />
      </LandingLayout>
    </div>
  );
}
