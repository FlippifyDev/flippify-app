import Layout from "../components/layout/Layout";
import ThemeSetter from "@/app/components/ThemeSetter";
import Loading from "@/app/components/Loading";
import MetadataHead from "@/app/components/MetadataHead";
import LoginContent from "../components/login/LoginContent";
import { Suspense } from "react";
import UnderMaintenance from "../components/development/UnderMaintenance";

const root = process.env.ROOT as string;


export const metadata = {
    title: "Login to Flippify | Manage Your eBay Store & Inventory",
    description:
        "Login to your Flippify account to manage your eBay store, track inventory, automate accounting, and streamline your business operations. Secure and easy access to your dashboard for eBay sellers and online businesses.",
    openGraph: {
        title: "Login to Flippify | Manage Your eBay Store & Inventory",
        description:
            "Access your Flippify account to manage inventory, sales, and finances for your eBay store. Log in securely to optimize your business operations and automate key tasks for better results.",
        url: root.concat('/l/login'),
        images: [
            {
                url: `https://i.imgur.com/IsUhFBb.png`,
                width: 2600,
                height: 1440,
                alt: "Flippify Login - Manage eBay Store and Inventory"
            }
        ]
    },
    robots: {
        index: true,
        follow: true,
        nocache: true,
        googleBot: {
            index: false,
            follow: true,
            noimageindex: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1
        }
    }
};



const Login = () => {
    return (
        <>
            <MetadataHead {...metadata} />
            <ThemeSetter theme="dark" />
            <Suspense fallback={<Loading />}>
                <Layout>
                    <UnderMaintenance />
                </Layout>
            </Suspense>
        </>
    );
};

export default Login;