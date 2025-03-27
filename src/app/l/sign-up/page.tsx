import { Suspense } from "react";
import Layout from "../components/layout/Layout";
import ThemeSetter from "@/app/components/ThemeSetter";
import Loading from "@/app/components/Loading";
import MetadataHead from "@/app/components/MetadataHead";
import SignUpContent from "../components/sign-up/SignUpContent";
import { Lato, Inter } from 'next/font/google';

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


const lato = Lato({ weight: '900', style: 'italic', subsets: ['latin'] });
const inter = Inter({ subsets: ['latin'] });

const SignUp = () => {
    return (
        <>
            <MetadataHead {...metadata} />
            <ThemeSetter theme="dark" />
            <Suspense fallback={<Loading />}>
                <Layout>
                    <>
                        <SignUpContent />
                        <div className="flex flex-col items-center pt-20">
                            <div className="w-full animate-fadeInPrimary">
                                <p className={`${lato.className} text-6xl text-white text-center`}>
                                    Coming <span className="bg-gradient-to-tr pb-1 pl-1 from-textGradStart to-textGradEnd bg-clip-text text-transparent">Soon</span>
                                </p>
                            </div>
                            <p className={`w-full mt-3 mb-8 pb-1 pt-2 text-gray-300 text-lg text-center animate-fadeInSecondary font-medium ${inter.className}`}>
                                Currently Under Development - Stay Tuned!
                            </p>
                        </div>
                    </>
                </Layout>
            </Suspense>
        </>
    );
};

export default SignUp;