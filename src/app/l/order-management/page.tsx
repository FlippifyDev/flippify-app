import Page from '../components/order-management/Page';
import Loading from '@/app/components/Loading';
import { Suspense } from 'react';
import ThemeSetter from '../../components/ThemeSetter';
import Layout from '../components/layout/Layout';
import { Metadata } from 'next';

const root = process.env.ROOT as string;

/* eslint-disable react/no-unescaped-entities */


export const metadata: Metadata = {
    title: "Order Management for eBay Sellers | Flippify - Streamline Your Sales",
    description:
        "Flippify's order management system helps eBay sellers efficiently track and process orders, manage shipments, and maintain accurate sales records. Streamline your eBay business with our intuitive tools for order fulfillment and tracking.",
    openGraph: {
        title: "Order Management for eBay Sellers | Flippify - Streamline Your Sales",
        description:
            "Take control of your eBay sales with Flippify’s order management system. Manage and track orders, process shipments, and stay organized. Perfect for eBay sellers who want to optimize their order fulfillment processes.",
        url: root.concat('/l/order-management'),
        images: [
            {
                url: `https://i.imgur.com/ZNfDzFq.png`,
                width: 2600,
                height: 1440,
                alt: "Flippify Order Management for eBay Sellers - Track and Process Orders"
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



export default function OrderManagementPage() {
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
