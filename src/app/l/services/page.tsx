import React from 'react';
import Layout from '../components/layout/Layout';
import ServicesPage from '../components/services/ServicesPage';
import Loading from '@/src/app/components/Loading';
import { Suspense } from 'react';
import MetadataHead from '../../components/MetadataHead';
import ThemeSetter from '../../components/ThemeSetter';

const root = process.env.ROOT as string;

export const metadata = {
	title: 'Exclusive Flipping Products - Flippify Deals',
	description: 'Explore Flippify’s product offerings, including Advanced Lego retirement deals, Discounted Electronics, Sneakers and other upcoming releases. Our platform tracks soon-to-retire Lego sets across multiple websites along with many other categories like electronics and sneakers, ensuring you never miss a valuable deal. Stay updated for more exclusive products and offers.',
	openGraph: {
		title: 'Exclusive Flipping Products - Flippify Deals',
		description: 'Explore Flippify’s product offerings, including Advanced Lego retirement deals, Discounted Electronics, Sneakers and other upcoming releases. Our platform tracks soon-to-retire Lego sets across multiple websites along with many other categories like electronics and sneakers, ensuring you never miss a valuable deal. Stay updated for more exclusive products and offers.',
		url: root.concat('/l/products'),
		images: [
			{
				url: 'https://i.imgur.com/RfR639r.png',
				width: 1908,
				height: 1076,
				alt: 'Products Page Image'
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

export default function ProductsPage() {
	return (
		<>
			<MetadataHead {...metadata} />
			<ThemeSetter theme="dark" />
			<Suspense fallback={<Loading />}>
				<Layout>
					<ServicesPage />
				</Layout>
			</Suspense>
		</>
	);
}
