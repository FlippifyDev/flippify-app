import Page from '../components/terms-and-conditions/Page';
import Loading from '@/app/components/Loading';
import { Suspense } from 'react';
import MetadataHead from '../../components/MetadataHead';
import ThemeSetter from '../../components/ThemeSetter';
import Layout from '../components/layout/Layout';

const root = process.env.ROOT as string;


export const metadata = {
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
                url: 'https://example.com/terms-conditions-image.png',
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
