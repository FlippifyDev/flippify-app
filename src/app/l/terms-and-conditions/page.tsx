import Page from '../components/terms-and-conditions/Page';
import Loading from '@/app/components/Loading';
import { Suspense } from 'react';
import ThemeSetter from '../../components/ThemeSetter';
import Layout from '../components/layout/Layout';
import { Metadata } from 'next';

/* eslint-disable react/no-unescaped-entities */

const root = process.env.ROOT as string;


export const metadata: Metadata = {
    title: 'Terms and Conditions - Flippify | User Agreement & Policies',
    description:
        'Read the Terms and Conditions for using Flippify’s platform. This user agreement outlines your rights, obligations, and the terms for using our inventory and eBay management tools.',
    openGraph: {
        title: 'Terms and Conditions - Flippify | User Agreement & Policies',
        description:
            'Flippify’s Terms and Conditions outline the legal agreement between users and Flippify. Understand your rights, responsibilities, and the terms of using our platform for inventory and eBay management.',
        url: root.concat('/l/terms-and-conditions'),
        images: [
            {
                url: 'https://i.imgur.com/RrJWAiF.png',
                width: 2600,
                height: 1440,
                alt: 'Flippify Terms and Conditions - User Agreement'
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



export default function TermsAndConditionsPage() {
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
