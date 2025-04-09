import "@/styles/globals.css";
import { Inter } from "next/font/google";
import Providers from "./providers";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

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
                url: "https://i.imgur.com/rivBjM6.png",
                width: 1908,
                height: 1076,
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


export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className="!scroll-smooth">
            <head>
                <meta
                    name="google-site-verification"
                    content="qTJ7i7h8-QZNpcGtA9piO5KO4Q-1xdjHsqjLpIslIxo"
                />
            </head>
            <body className={`${inter.className} scrollbar-hide`}>
                <Providers>
                    <ServiceWorkerRegister />
                    {children}
                </Providers>
            </body>
        </html>
    );
}