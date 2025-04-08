import React from 'react';
import Layout from '../components/layout/Layout';
import ServicesPage from '../components/services/ServicesPage';
import Loading from '@/app/components/Loading';
import { Suspense } from 'react';
import MetadataHead from '../../components/MetadataHead';
import ThemeSetter from '../../components/ThemeSetter';

const root = process.env.ROOT as string;

export const metadata = {
    title: 'Flippify Products - eBay Business Automation & Inventory Management Tools',
    description: 'Flippify offers AI-powered tools to automate your eBay reselling business. From inventory management systems and order fulfillment to pricing optimization and financial tracking, streamline your workflow and increase profits with Flippify’s all-in-one solution.',
    openGraph: {
        title: 'Flippify Products - eBay Business Automation & Inventory Management Tools',
        description: 'Flippify offers AI-powered tools to automate your eBay reselling business. From inventory management systems and order fulfillment to pricing optimization and financial tracking, streamline your workflow and increase profits with Flippify’s all-in-one solution.',
        url: root.concat('/l/products'),
        images: [
            {
                url: 'https://i.imgur.com/iIlqxEj.png',
                width: 2600,
                height: 1440,
                alt: 'Flippify Services Page - Inventory and eBay Automation Tools'
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
