import Page from '../components/accounting-software/Page';
import Loading from '@/app/components/Loading';
import { Suspense } from 'react';
import MetadataHead from '../../components/MetadataHead';
import ThemeSetter from '../../components/ThemeSetter';
import Layout from '../components/layout/Layout';

const root = process.env.ROOT as string;


export const metadata = {
    title: "Flippify Accounting Software for eBay Sellers | Automate Taxes & Manage Expenses",
    description:
        "Flippify's accounting software for eBay sellers helps automate taxes, track expenses, and manage your finances with ease. Effortlessly export CSVs, stay tax compliant, and focus on growing your business with the best eBay accounting solution.",
    openGraph: {
        title: "Flippify Accounting Software for eBay Sellers | Automate Taxes & Manage Expenses",
        description:
            "Flippify's eBay accounting software automates tax calculations, tracks expenses, and simplifies financial management for online sellers. Perfect for eBay business accounts and growing eBay stores.",
        url: root.concat('/l/accounting-software'),
        images: [
            {
                url: `https://i.imgur.com/ZNqXm19.png`,
                width: 2600,
                height: 1440,
                alt: "Flippify Accounting Software for eBay Sellers - Automate Taxes & Manage Finances"
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



export default function AccountingSoftwarePage() {
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
