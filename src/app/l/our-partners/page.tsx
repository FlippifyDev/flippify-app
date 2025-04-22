import React from 'react';
import Layout from '../components/layout/Layout';
import OurPartnersContent from '../components/our-partners/Page';
import Loading from '@/app/components/Loading';
import { Suspense } from 'react';
import ThemeSetter from '../../components/ThemeSetter';
import { Metadata } from 'next';

const root = process.env.ROOT as string;

export const metadata: Metadata = {
    title: 'Our Partners - Flippify | eBay Reseller Collaborations & Success Stories',
    description: "Meet the businesses and individuals we're proud to work with at Flippify.Discover how our partners leverage AI- powered eBay tools and our revenue sharing program to grow their reselling communities.",
    openGraph: {
        title: "Our Partners - Flippify | eBay Reseller Collaborations & Success Stories",
        description: "Meet the businesses and individuals we're proud to work with at Flippify.Discover how our partners leverage AI - powered eBay tools and our revenue sharing program to grow their reselling communities.",
        url: root.concat('/l/partnerships/our-partners'),
        images: [
            {
                url: 'https://i.imgur.com/6piDwFY.png',
                width: 2600,
                height: 1440,
                alt: 'Flippify Partner Showcase - Successful eBay Reseller Collaborations'
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
    keywords: 'flippify partners, ebay reseller partners, reselling communities, ai tools for resellers, ebay automation partners',
    alternates: {
        canonical: root.concat('/l/partnerships/our-partners')
    }
};

export default function OurPartnersPage() {
    return (
        <>
            <ThemeSetter theme="dark" />
            <Suspense fallback={<Loading />}>
                <Layout>
                    <OurPartnersContent />
                </Layout>
            </Suspense>
        </>
    );
}