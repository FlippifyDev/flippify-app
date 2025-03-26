import { Suspense } from "react";
import Layout from "../components/layout/Layout";
import ThemeSetter from "@/app/components/ThemeSetter";
import Loading from "@/app/components/Loading";
import MetadataHead from "@/app/components/MetadataHead";
import SignUpContent from "../components/sign-up/SignUpContent";

const root = process.env.ROOT as string;

export const metadata = {
    title: 'Sign Up - Flippify',
    description: 'Create your Flippify account to start buying, selling, and flipping amazing deals. Join our community and unlock exclusive features today!',
    openGraph: {
        title: 'Sign Up - Flippify',
        description: 'Create your Flippify account to start buying, selling, and flipping amazing deals. Join our community and unlock exclusive features today!',
        url: root.concat('/l/sign-up'),
        images: [
            {
                url: "https://i.imgur.com/CguUL1h.png",
                width: 1908,
                height: 1076,
                alt: "Sign Up Page Image"
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
