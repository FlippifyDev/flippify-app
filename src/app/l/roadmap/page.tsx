import Page from '../components/roadmap/Page';
import Loading from '@/app/components/Loading';
import { Suspense } from 'react';
import MetadataHead from '../../components/MetadataHead';
import ThemeSetter from '../../components/ThemeSetter';
import Layout from '../components/layout/Layout';

const root = process.env.ROOT as string;

export const metadata = {
    title: "Roadmap | Flippify - Upcoming Features for eBay Sellers",
    description:
        "Explore Flippify’s roadmap to see upcoming features for eBay sellers. Discover how we’re enhancing store management, automation, and more to help you sell smarter.",
    openGraph: {
        title: "Roadmap | Flippify - Upcoming Features for eBay Sellers",
        description:
            "Check out Flippify’s roadmap for new features coming soon. Learn how we’re improving automation, store management, and more for eBay sellers to streamline your business.",
        url: root.concat('/l/roadmap'),
        images: [
            {
                url: "https://i.imgur.com/GjZEceX.png",
                width: 2600,
                height: 1440,
                alt: "Flippify Roadmap - Upcoming Features for eBay Seller Tools"
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

export default function RoadmapPage() {
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