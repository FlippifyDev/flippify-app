import Page from '../components/about/Page';
import Loading from '@/app/components/Loading';
import { Suspense } from 'react';
import MetadataHead from '../../components/MetadataHead';
import ThemeSetter from '../../components/ThemeSetter';
import Layout from '../components/layout/Layout';

const root = process.env.ROOT as string;

export const metadata = {
    title: 'About - Flippify',
    description: 'Partner with Flippify to empower your reselling group with exclusive discounts, 50% revenue sharing, and collaborative opportunities. Automate eBay stores with AI-powered tools—open to all partners!',
    openGraph: {
        title: 'Partnerships - Flippify',
        description: 'Partner with Flippify to empower your reselling group with exclusive discounts, 50% revenue sharing, and collaborative opportunities. Automate eBay stores with AI-powered tools—open to all partners!',
        url: root.concat('/l/partnerships'),
        images: [
            {
                url: 'https://i.imgur.com/partnerships-preview.png',
                width: 1200,
                height: 630,
                alt: 'Flippify Partnerships Program'
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
