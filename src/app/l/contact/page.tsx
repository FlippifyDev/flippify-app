import Page from '../components/contact/Page';
import Loading from '@/app/components/Loading';
import { Suspense } from 'react';
import MetadataHead from '../../components/MetadataHead';
import ThemeSetter from '../../components/ThemeSetter';
import Layout from '../components/layout/Layout';

const root = process.env.ROOT as string;

export const metadata = {
    title: "Contact Us | Flippify - Get in Touch with Our Team",
    description:
        "Have questions? Reach out to the Flippify team! Whether you're looking for support, partnership opportunities, or just want to chat, we're here to help.",
    openGraph: {
        title: "Contact Us | Flippify - Get in Touch with Our Team",
        description:
            "Contact Flippify for any inquiries, support requests, or partnership opportunities. Our team is ready to assist you with any questions you have about our inventory and accounting solutions.",
        url: root.concat('/l/contact'),
        images: [
            {
                url: "https://i.imgur.com/tJHuMck.png",
                width: 2600,
                height: 1440,
                alt: "Contact Us - Flippify"
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

export default function ContactPage() {
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
