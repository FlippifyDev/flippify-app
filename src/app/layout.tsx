import "@/src/styles/globals.css"
import { Inter } from 'next/font/google';
import Providers from './providers';
import ServiceWorkerRegister from '@/src/components/ServiceWorkerRegister';
import { Metadata } from 'next';
import Script from "next/script";

const inter = Inter({ subsets: ['latin'] });

const metadata: Metadata = {
	title: 'Flippify',
	description: 'Your ultimate platform for flipping, buying, and selling unique items.',
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

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className="!scroll-smooth">
			<head>
				{/* Google Site Verification Meta Tag */}
				<meta name="google-adsense-account" content="ca-pub-6066589868368367" />

				{/* Google AdSense Script */}
				<Script
					async
					src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6066589868368367"
					crossOrigin="anonymous"
					strategy="lazyOnload"
				/>
			</head>
			<body className={inter.className}>
				{/* Providers component */}
				<Providers>
					{/* Include Service Worker registration */}
					<ServiceWorkerRegister />
					{children}
				</Providers>
			</body>
		</html>
	);
}
