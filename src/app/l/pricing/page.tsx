import React from 'react';
import Layout from '../components/layout/Layout';
import PlansContent from '../components/pricing/PlansContent';
import Loading from '@/app/components/Loading';
import { Suspense } from 'react';
import ThemeSetter from '../../components/ThemeSetter';
import { Metadata } from 'next';

/* eslint-disable react/no-unescaped-entities */

const root = process.env.ROOT as string;

export const metadata: Metadata = {
    title: 'Flippify Pricing - Affordable Plans for eBay Sellers & Resellers',
    description: 'Explore Flippify’s pricing plans tailored for eBay sellers and resellers. From inventory tracking and automated listings to exclusive deals, our flexible and affordable plans help you maximize profits and stay ahead of the competition.',
    openGraph: {
        title: 'Flippify Pricing - Affordable Plans for eBay Sellers & Resellers',
        description: 'Explore Flippify’s pricing plans tailored for eBay sellers and resellers. From inventory tracking and automated listings to exclusive deals, our flexible and affordable plans help you maximize profits and stay ahead of the competition.',
        url: root.concat('/l/pricing'),
        images: [
            {
                url: 'https://i.imgur.com/8PFiNhm.png',
                width: 2600,
                height: 1440,
                alt: 'Flippify Pricing Page - Affordable Plans for eBay Sellers & Resellers'
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

export default function PricingPage() {
    return (
        <>
            <ThemeSetter theme="dark" />
            <Suspense fallback={<Loading />}>
                <Layout>
                    <PlansContent />
                </Layout>
            </Suspense>
        </>
    );
}
