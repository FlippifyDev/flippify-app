import { Suspense } from "react";
import Layout from "../components/layout/Layout";
import ThemeSetter from "@/app/components/ThemeSetter";
import Loading from "@/app/components/Loading";
import SignUpContent from "../components/sign-up/SignUpContent";
import { Metadata } from "next";

const root = process.env.ROOT as string;

export const metadata: Metadata = {
    title: 'Sign Up - Flippify | Join Our Community & Start Flipping Deals',
    description: 'Create your Flippify account and gain access to exclusive tools for buying, selling, and flipping amazing deals. Join a community of sellers today and unlock features to grow your business!',
    openGraph: {
        title: 'Sign Up - Flippify | Join Our Community & Start Flipping Deals',
        description: 'Sign up for Flippify today to gain access to exclusive features and tools to help you buy, sell, and flip amazing deals. Join our growing community and start your business journey!',
        url: root.concat('/l/sign-up'),
        images: [
            {
                url: "https://i.imgur.com/ycu0VT6.png",
                width: 2600,
                height: 1440,
                alt: "Flippify Sign Up Page - Join the Community of Sellers"
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
            'max-snippet': -1,
        },
    },
};


const SignUp = () => {
    return (
        <>
            <ThemeSetter theme="dark" />
            <Suspense fallback={<Loading />}>
                <Layout>
                    <SignUpContent />
                </Layout>
            </Suspense>
        </>
    );
};

export default SignUp;