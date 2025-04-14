import Layout from "../components/layout/Layout";
import Loading from "@/app/components/Loading";
import ThemeSetter from "@/app/components/ThemeSetter";
import LoginContent from "../components/login/LoginContent";

import { Suspense } from "react";
import { Metadata } from "next";

const root = process.env.ROOT as string;

export const metadata: Metadata = {
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
        index: false,
        follow: false,
        nocache: false,
        googleBot: {
            index: false,
            follow: false,
            noimageindex: false,
            'max-video-preview': -1,
            'max-image-preview': 'none',
            'max-snippet': -1
        }
    }
};



const Login = () => {
    return (
        <>
            <ThemeSetter theme="dark" />
            <Suspense fallback={<Loading />}>
                <Layout>
                    <LoginContent />
                </Layout>
            </Suspense>
        </>
    );
};

export default Login;