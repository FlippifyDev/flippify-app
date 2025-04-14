import Page from '../components/inventory-management/Page';
import Loading from '@/app/components/Loading';
import { Suspense } from 'react';
import ThemeSetter from '../../components/ThemeSetter';
import Layout from '../components/layout/Layout';

/* eslint-disable react/no-unescaped-entities */

const root = process.env.ROOT as string;

export const metadata = {
    title: "Inventory Management System for eBay Sellers | Flippify - Track & Control Stock",
    description:
        "Flippify’s inventory management system helps eBay sellers manage stock levels, avoid overselling, and sync products across platforms. Track inventory in real-time and streamline your eBay store operations with ease.",
    openGraph: {
        title: "Inventory Management System for eBay Sellers | Flippify - Track & Control Stock",
        description:
            "Manage your eBay store’s stock, track inventory levels in real-time, and automate processes with Flippify’s inventory management system. Perfect for eBay sellers and online businesses looking to optimize stock control.",
        url: root.concat('/l/inventory-management'),
        images: [
            {
                url: "https://i.imgur.com/IvpTsu7.png",
                width: 2600,
                height: 1440,
                alt: "Flippify Inventory Management for eBay Sellers - Track & Control Stock"
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
            'max-snippet': -1
        }
    }
};

export default function InventoryManagementPage() {
    return (
        <>
            <ThemeSetter theme="dark" />
            <Suspense fallback={<Loading />}>
                <Layout>
                    <Page />
                </Layout>
            </Suspense>
        </>
    );
}
