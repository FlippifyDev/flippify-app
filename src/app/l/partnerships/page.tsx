import React from 'react';
import Layout from '../components/layout/Layout';
import Page from '../components/partnerships/Page';
import Loading from '@/app/components/Loading';
import { Suspense } from 'react';
import ThemeSetter from '../../components/ThemeSetter';
import { Metadata } from 'next';

const root = process.env.ROOT as string;

export const metadata: Metadata = {
    title: 'Partnerships Program - Flippify | Exclusive Discounts & AI-Powered Tools for eBay Resellers',
    description: 'Partner with Flippify to empower your reselling group with exclusive discounts, 40% revenue sharing, and collaborative opportunities. Automate eBay stores with AI-powered tools—open to all partners!',
    openGraph: {
        title: 'Partnerships Program - Flippify | Exclusive Discounts & AI-Powered Tools for eBay Resellers',
        description: 'Partner with Flippify to empower your reselling group with exclusive discounts, 40% revenue sharing, and collaborative opportunities. Automate eBay stores with AI-powered tools—open to all partners!',
        url: root.concat('/l/partnerships'),
        images: [
            {
                url: 'https://i.imgur.com/6piDwFY.png',
                width: 2600,
                height: 1440,
                alt: 'Flippify Partnerships Program for eBay Resellers - AI Tools and Revenue Sharing'
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


export default function PartnershipsPage() {
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