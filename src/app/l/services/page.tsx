import React from 'react';
import Layout from '../components/layout/Layout';
import ServicesPage from '../components/services/ServicesPage';
import Loading from '@/app/components/Loading';
import { Suspense } from 'react';
import MetadataHead from '../../components/MetadataHead';
import ThemeSetter from '../../components/ThemeSetter';

const root = process.env.ROOT as string;

export const metadata = {
    title: 'Services - Flippify',
    description: 'Streamline your eBay reselling business with AI-powered automation tools. From listing creation and pricing optimization to inventory tracking, order fulfillment, and financial management, Flippify helps you save time and boost profitability.',
    openGraph: {
        title: 'Services - Flippify',
        description: 'Streamline your eBay reselling business with AI-powered automation tools. From listing creation and pricing optimization to inventory tracking, order fulfillment, and financial management, Flippify helps you save time and boost profitability.',
        url: root.concat('/l/services'),
        images: [
            {
                url: 'https://i.imgur.com/iIlqxEj.png',
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
