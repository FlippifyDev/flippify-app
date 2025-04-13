import React from 'react';
import Layout from '../components/layout/Layout';
import Page from '../components/home/Page';
import Loading from '@/app/components/Loading';
import { Suspense } from 'react';
import MetadataHead from '../../components/MetadataHead';
import ThemeSetter from '../../components/ThemeSetter';

/* eslint-disable react/no-unescaped-entities */


const root = process.env.ROOT as string;

export const metadata = {
	title: 'Flippify - Inventory & Warehouse Management for eBay Sellers and Dropshippers',
	description: 'Flippify is the ultimate inventory management system for eBay sellers and Shopify dropshipping. Manage your eBay store, automate listings, control stock, and scale your eBay business account with powerful warehouse management tools. Whether you’re running an eBay shop or exploring websites like eBay, Flippify helps you sell on eBay smarter and faster.',
	openGraph: {
		title: 'Flippify - Inventory & Warehouse Management for eBay Sellers and Dropshippers',
		description: 'Flippify is the ultimate inventory management system for eBay sellers and Shopify dropshipping. Manage your eBay store, automate listings, control stock, and scale your eBay business account with powerful warehouse management tools. Whether you’re running an eBay shop or exploring websites like eBay, Flippify helps you sell on eBay smarter and faster.Flippify is the ultimate inventory management system for eBay sellers and Shopify dropshipping. Manage your eBay store, automate listings, control stock, and scale your eBay business account with powerful warehouse management tools. Whether you’re running an eBay shop or exploring websites like eBay, Flippify helps you sell on eBay smarter and faster.',
		url: root.concat('/l/home'),
		images: [
			{
				url: "https://i.imgur.com/E4uUyeB.png",
				width: 2600,
				height: 1440,
				alt: "Flippify mobile app showing eBay inventory management, stock control, and automated order tracking for sellers"
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
					<Page />
				</Layout>
			</Suspense>
		</>
	);
}
