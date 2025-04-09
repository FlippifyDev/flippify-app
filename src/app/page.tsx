import HomePage from './l/home/page';
import Loading from './components/Loading';

import { Suspense } from 'react';

const root = process.env.ROOT as string;

export const metadata = {
    title: 'Flippify - Inventory & Warehouse Management for eBay Sellers and Dropshippers',
    description: 'Flippify is the ultimate inventory management system for eBay sellers and Shopify dropshipping. Manage your eBay store, automate listings, control stock, and scale your eBay business account with powerful warehouse management tools. Whether you’re running an eBay shop or exploring websites like eBay, Flippify helps you sell on eBay smarter and faster.',
    openGraph: {
        title: 'Flippify - Inventory & Warehouse Management for eBay Sellers and Dropshippers',
        description: 'Flippify is the ultimate inventory management system for eBay sellers and Shopify dropshipping. Manage your eBay store, automate listings, control stock, and scale your eBay business account with powerful warehouse management tools. Whether you’re running an eBay shop or exploring websites like eBay, Flippify helps you sell on eBay smarter and faster.Flippify is the ultimate inventory management system for eBay sellers and Shopify dropshipping. Manage your eBay store, automate listings, control stock, and scale your eBay business account with powerful warehouse management tools. Whether you’re running an eBay shop or exploring websites like eBay, Flippify helps you sell on eBay smarter and faster.',
        url: root,
        images: [
            {
                url: "https://i.imgur.com/i0EUERY.png",
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


export default function Home() {
    return (
        <Suspense fallback={<Loading />}>
            <HomePage />
        </Suspense>
    );
}
