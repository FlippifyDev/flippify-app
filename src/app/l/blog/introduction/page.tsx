import Page from '../../components/blog/introduction/Page';
import Loading from '@/app/components/Loading';
import { Suspense } from 'react'
import ThemeSetter from '../../../components/ThemeSetter';
import Layout from '../../components/layout/Layout';
import { Metadata } from 'next';

const root = process.env.ROOT as string;

export const metadata: Metadata = {
    title: "Getting Started with Flippify | Flippify - Platform Features & Seller Guide",
    description:
        "New to Flippify? Learn how to navigate the platform, manage inventory, upload sales, and streamline your reselling workflow. Get started with our step-by-step introduction.",
    openGraph: {
        title: "Getting Started with Flippify | Flippify - Platform Features & Seller Guide",
        description:
            "Discover how to get the most out of Flippify. This guide walks new users through every essential feature—from uploading sales to managing listings. Simplify your reselling journey today.",
        url: root.concat('/blog'),
        images: [
            {
                url: "https://i.imgur.com/1momgPu.png",
                width: 2600,
                height: 1440,
                alt: "Flippify Getting Started Overview"
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

export default function BlogPage() {
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