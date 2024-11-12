import "@/src/styles/globals.css"
import { Inter } from 'next/font/google';
import Providers from './providers';
import ServiceWorkerRegister from '@/src/components/ServiceWorkerRegister'; // Import the client-side component
import { Metadata } from 'next';

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
