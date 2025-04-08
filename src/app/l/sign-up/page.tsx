import { Suspense } from "react";
import Layout from "../components/layout/Layout";
import ThemeSetter from "@/app/components/ThemeSetter";
import Loading from "@/app/components/Loading";
import MetadataHead from "@/app/components/MetadataHead";
import SignUpContent from "../components/sign-up/SignUpContent";

const root = process.env.ROOT as string;

export const metadata = {
    title: 'Sign Up - Flippify | Join Our Community & Start Flipping Deals',
    description: 'Create your Flippify account and gain access to exclusive tools for buying, selling, and flipping amazing deals. Join a community of sellers today and unlock features to grow your business!',
    openGraph: {
        title: 'Sign Up - Flippify | Join Our Community & Start Flipping Deals',
        description: 'Sign up for Flippify today to gain access to exclusive features and tools to help you buy, sell, and flip amazing deals. Join our growing community and start your business journey!',
        url: root.concat('/l/sign-up'),
        images: [
            {
                url: "https://i.imgur.com/CguUL1h.png",
                width: 2600,
                height: 1440,
                alt: "Flippify Sign Up Page - Join the Community of Sellers"
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
            'max-snippet': -1,
        },
    },
};


const SignUp = () => {
    return (
        <>
            <MetadataHead {...metadata} />
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