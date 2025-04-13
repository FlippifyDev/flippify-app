import Page from '../components/attributions/Page';
import Loading from '@/app/components/Loading';
import { Suspense } from 'react';
import MetadataHead from '../../components/MetadataHead';
import ThemeSetter from '../../components/ThemeSetter';
import Layout from '../components/layout/Layout';

const root = process.env.ROOT as string;

export const metadata = {
    title: "Attributions | Flippify - Acknowledging Our Partners & Resources",
    description:
        "Explore the attributions page of Flippify to learn about our valuable partners, tools, and resources that help power our inventory and accounting solutions for eBay sellers, dropshipping businesses, and more.",
    openGraph: {
        title: "Attributions | Flippify - Acknowledging Our Partners & Resources",
        description:
            "Visit Flippify's attributions page to discover our trusted partners and resources that contribute to the success of our inventory management, accounting software, and eBay seller solutions.",
        url: root.concat('/l/attributions'),
        images: [
            {
                url: "https://i.imgur.com/yNAiFZa.png",
                width: 2600,
                height: 1440,
                alt: "Flippify Attributions - Partners and Resources for eBay Sellers"
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


export default function AttributionsPage() {
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
