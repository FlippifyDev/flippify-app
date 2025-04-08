import Image from "next/image";
import Layout from "./l/components/layout/Layout";

export default function NotFound() {
    return (
        <Layout>
            <div className="w-full max-w-7xl flex justify-center items-center mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
                <Image 
                    src="/404NotFound.png"
                    alt="404 Not Found"
                    width={1000}
                    height={1000}
                    className="w-96 h-96 mt-8 sm:mt-10 md:mt-12 lg:mt-[120px] xl:mt-[140px] animate-fadeInSecondary"
                />
            </div>
        </Layout>
    );
}
