import HomePage from './l/home/page';
import Loading from './components/Loading';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

import { Suspense } from 'react';
import { Metadata } from 'next';

const root = process.env.ROOT as string;

export const metadata: Metadata = {
	title: 'Flippify',
	description: 'Reselling bots and tools. Monitoring the best releases and restocks on the market from sneakers to PS5s',
	openGraph: {
		title: 'Transform Your Reselling Game - Flippify Home',
		description: 'Welcome to Flippify, your ultimate reselling platform for flipping, buying, and selling unique items. Boost your profits with our fast deal bots, covering everything from Lego to sneakers. Learn how Flippify makes reselling easy and lucrative.',
		url: root,
		images: [
			{
				url: "https://i.imgur.com/JzWi4ye.png",
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
	const router = useRouter();
	const { data: session, status } = useSession();

	useEffect(() => {
			if (status === 'loading') return; // Do nothing while loading
			if (!session) {
					// Not logged in, stay on the home page
					return;
			}
			// Logged in, redirect to the dashboard
			router.push(`/u/${session.user.id}/dashboard`);
	}, [router, session, status]);
	
	return (
		<Suspense fallback={<Loading />}>
			<HomePage />
		</Suspense>
	);
}
