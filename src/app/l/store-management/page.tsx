import Page from '../components/store-management/Page';
import Loading from '@/app/components/Loading';
import { Suspense } from 'react';
import MetadataHead from '../../components/MetadataHead';
import ThemeSetter from '../../components/ThemeSetter';
import Layout from '../components/layout/Layout';

const root = process.env.ROOT as string;


export const metadata = {
    title: 'Store Management - Flippify | Effortless eBay Inventory & Order Control',
    description:
        'Flippify’s store management tools help eBay sellers streamline inventory management, track orders, and automate store operations. Manage your eBay store effortlessly and boost sales with ease.',
    openGraph: {
        title: 'Store Management - Flippify | Effortless eBay Inventory & Order Control',
        description:
            'Flippify offers powerful store management features to automate your eBay store. Keep track of inventory, orders, and customer data in real-time to enhance your sales performance and efficiency.',
        url: root.concat('/l/store-management'),
        images: [
            {
                url: 'https://i.imgur.com/2yAlsRL.png', 
                width: 2600,
                height: 1440,
                alt: 'Flippify Store Management - Automate eBay Store Operations'
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
