import Image from "next/image";
import Layout from "./l/components/layout/Layout";
import MetadataHead from "./components/MetadataHead";

export const metadata = {
    title: "Page Not Found",
    description: "Oops! The page you're looking for doesn't exist.",
    robots: {
        index: false,
        follow: false,
        nocache: false,
        googleBot: {
            index: false,
            follow: false,
            noimageindex: false,
            "max-video-preview": -1,
            "max-image-preview": "none",
            "max-snippet": -1
        }
    }
};

export default function NotFound() {
    return (
        <Layout>
            <div className="min-h-screen w-full max-w-7xl flex justify-center items-start mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 scale-125">
                <Image
                    src="/404NotFound.svg"
                    alt="404 Not Found"
                    width={1000}
                    height={1000}
                    className="w-96 h-96 mt-8 sm:mt-10 md:mt-12 lg:mt-[120px] xl:mt-[140px] animate-fadeInSecondary"
                />
            </div>
        </Layout>
    );
}
