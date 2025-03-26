import React from 'react';
import Layout from '../components/layout/Layout';
import HomeContentWrapperPage from '../components/home/HomeContentWrapperPage';
import Loading from '@/app/components/Loading';
import { Suspense } from 'react';
import MetadataHead from '../../components/MetadataHead';
import ThemeSetter from '../../components/ThemeSetter';


const root = process.env.ROOT as string;

export const metadata = {
    title: 'Flippify - Automate Your eBay Business and Boost Profits',
    description: 'Flippify is the ultimate platform for eBay resellers. Use advanced tools to automate inventory management, listings, and order fulfillment, accelerating your profits and scaling your business effortlessly.',
	openGraph: {
        title: 'Flippify - Automate Your eBay Business and Boost Profits',
        description: 'Flippify is the ultimate platform for eBay resellers. Use advanced tools to automate inventory management, listings, and order fulfillment, accelerating your profits and scaling your business effortlessly.',
		url: root.concat('/l/home'),
		images: [
			{
                url: "https://i.imgur.com/rivBjM6.png",
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
};

export default function HomePage() {
	return (
		<>
			<MetadataHead {...metadata} />
			<ThemeSetter theme="dark" />
			<Suspense fallback={<Loading />}>
				<Layout>
					<HomeContentWrapperPage />
				</Layout>
			</Suspense>
		</>
	);
}
