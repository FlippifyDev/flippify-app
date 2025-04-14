import Page from '../components/privacy-policy/Page';
import Loading from '@/app/components/Loading';
import { Suspense } from 'react';
import ThemeSetter from '../../components/ThemeSetter';
import Layout from '../components/layout/Layout';
import { Metadata } from 'next';

const root = process.env.ROOT as string;


export const metadata: Metadata = {
    title: 'Privacy Policy - Flippify | Protecting Your Data and Privacy',
    description:
        'Flippify values your privacy. Learn how we collect, use, and protect your personal data when using our platform. Our privacy policy outlines your rights and how we ensure the security of your information.',
    openGraph: {
        title: 'Privacy Policy - Flippify | Protecting Your Data and Privacy',
        description:
            'At Flippify, we are committed to safeguarding your personal information. Read our privacy policy to understand how we collect, store, and secure your data while you use our platform.',
        url: root.concat('/l/privacy-policy'),
        images: [
            {
                url: 'https://i.imgur.com/zoVdFqX.png',
                width: 1200,
                height: 630,
                alt: 'Flippify Privacy Policy - Protecting Your Data and Information'
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



export default function PrivacyPolicyPage() {
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
