import Layout from "../components/layout/Layout";
import ThemeSetter from "@/app/components/ThemeSetter";
import Loading from "@/app/components/Loading";
import MetadataHead from "@/app/components/MetadataHead";
import LoginContent from "../components/login/LoginContent";
import { Suspense } from "react";

const root = process.env.ROOT as string;

export const metadata = {
    title: 'Login - Flippify',
    description: 'Access your Flippify account to manage your listings, track your sales, and explore exclusive deals. Sign in securely and start flipping today!',
    openGraph: {
        title: 'Login - Flippify',
        description: 'Access your Flippify account to manage your listings, track your sales, and explore exclusive deals. Sign in securely and start flipping today!',
        url: root.concat('/l/login'),
        images: [
            {
                url: "https://i.imgur.com/YpsQrYq.png",
                width: 1908,
                height: 1076,
                alt: "Login Page Image"
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


const Login = () => {
    return (
        <>
            <MetadataHead {...metadata} />
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