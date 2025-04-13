import Page from '../components/about/Page';
import Loading from '@/app/components/Loading';
import { Suspense } from 'react';
import MetadataHead from '../../components/MetadataHead';
import ThemeSetter from '../../components/ThemeSetter';
import Layout from '../components/layout/Layout';

const root = process.env.ROOT as string;

export const metadata = {
    title: "About Flippify | Inventory & Warehouse Management for eBay Sellers",
    description:
        "Discover Flippify—a cutting-edge warehouse and inventory management system designed for eBay sellers, Shopify dropshipping, and online business success. Optimize your eBay seller account, control stock, and streamline your eBay store operations with our powerful tools.",
    openGraph: {
        title: "About Flippify | Inventory & Warehouse Management for eBay Sellers",
        description:
            "Learn how Flippify transforms your online business with advanced inventory management and warehouse control. Perfect for eBay business accounts, eBay selling, stock control, and Shopify dropshipping.",
        url: root.concat("/about"),
        images: [
            {
                url: "https://i.imgur.com/u7MUdXu.png",
                width: 2600,
                height: 1440,
                alt: "About Flippify – eBay Inventory, Warehouse, and Stock Control System"
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
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1
        }
    }
};

export default function AboutPage() {
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
