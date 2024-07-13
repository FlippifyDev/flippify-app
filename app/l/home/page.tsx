import LandingLayout from '../components/LandingLayout';
import HomeContentWrapper from '../components/HomeContentWrapper';
import { Metadata } from 'next';
import Head from 'next/head';

export const metadata: Metadata = {
  title: 'Transform Your Reselling Game - Flippify Home',
  description: 'Welcome to Flippify, your ultimate reselling platform for flipping, buying, and selling unique items. Boost your profits with our fast deal bots, covering everything from Lego to sneakers. Learn how Flippify makes reselling easy and lucrative.'
};

export default function HomePage() {
  return (
    <div>
      <Head>
        <meta name="google-site-verification" content="Hho6-HQ44X7tDo2PgIXmXtPOFHsg069qvKUSqF3JfkE" />
        <meta name="robots" content="index, follow" />
      </Head>
      <LandingLayout>
        <HomeContentWrapper />
      </LandingLayout>
    </div>
  );
}
