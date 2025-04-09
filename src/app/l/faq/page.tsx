import Page from '../components/faqs/Page';
import Loading from '@/app/components/Loading';
import { Suspense } from 'react';
import MetadataHead from '../../components/MetadataHead';
import ThemeSetter from '../../components/ThemeSetter';
import Layout from '../components/layout/Layout';

const root = process.env.ROOT as string;

export const metadata = {
    title: "Frequently Asked Questions | Flippify - eBay Seller Tools & Inventory Management",
    description:
        "Have questions about Flippify's inventory management, accounting software, or eBay seller tools? Find answers to common queries about our platform, eBay store management, stock control, and more.",
    openGraph: {
        title: "Frequently Asked Questions | Flippify - eBay Seller Tools & Inventory Management",
        description:
            "Visit the Flippify FAQs page to find answers to your questions on inventory management systems, eBay business accounts, tax automation, and more. Learn how our tools help eBay sellers streamline their processes.",
        url: root.concat('/l/faqs'),
        images: [
            {
                url: `${root}/static/og-faqs.png`,
                width: 2600,
                height: 1440,
                alt: "Flippify FAQs - eBay Seller Tools, Inventory Management & Accounting Software"
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



export default function FAQPage() {
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
