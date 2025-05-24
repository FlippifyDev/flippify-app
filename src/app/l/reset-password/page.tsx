import Loading from "@/app/components/Loading";
import ThemeSetter from "@/app/components/ThemeSetter";
import { Suspense } from "react";
import Layout from "../components/layout/Layout";
import Page from "../components/reset-password/Page";

export const metadata = {
    title: "Reset Password | Flippify",
    description:
        "",
    robots: {
        index: false,
        follow: false,
        nocache: false,
        googleBot: {
            index: false,
            follow: false,
            noimageindex: false,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1
        }
    }
};


export default function ResetPasswordPage() {
    return (
        <>
            <ThemeSetter theme="dark" />
            <Suspense fallback={<Loading />}>
                <Layout>
                    <Page />
                </Layout>
            </Suspense>
        </>
    );
}