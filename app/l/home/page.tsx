import LandingLayout from '../components/LandingLayout';
import HomeContentWrapper from '../components/HomeContentWrapper';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home - Flippify',
  description: 'Welcome to Flippify, your ultimate platform for flipping, buying, and selling unique items. Fast-track your profits with our lightning-quick deal bots, from Lego to sneakers. Discover how Flippify makes flipping easy and profitable.'
};

export default function HomePage() {
  return (
    <LandingLayout>
      <HomeContentWrapper />
    </LandingLayout>
  );
}
