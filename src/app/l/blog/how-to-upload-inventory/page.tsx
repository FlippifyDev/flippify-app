import Page from '../../components/blog/how-to-upload-inventory/Page';
import Loading from '@/app/components/Loading';
import { Suspense } from 'react'
import ThemeSetter from '../../../components/ThemeSetter';
import Layout from '../../components/layout/Layout';
import { Metadata } from 'next';

const root = process.env.ROOT as string;

export const metadata: Metadata = {
    title: "How To Upload Inventory | Flippify - Tips, Updates & Insights for Sellers",
    description:
        "Explore the Flippify Blog for the latest tips, product updates, seller insights, and success stories. Stay informed and grow your reselling business.",
    openGraph: {
        title: "How To Upload Inventory | Flippify - Tips, Updates & Insights for Sellers",
        description:
            "Dive into expert tips, feature announcements, and inspiring stories on the Flippify Blog. Learn how top resellers use Flippify to streamline inventory and maximize profits.",
        url: root.concat('/blog/how-to-upload-inventory'),
        images: [
            {
                url: "https://i.imgur.com/qvntJ6D.png",
                width: 2600,
                height: 1440,
                alt: "Flippify How To Upload Inventory Overview"
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