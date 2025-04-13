import React from 'react';
import { Inter } from "next/font/google";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

const StoreManagementOverview = () => {
    return (
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-6 md:px-8 lg:px-10 xl:px-12">
            <h2 className={`${inter.className} text-3xl sm:text-4xl md:text-4xl font-bold text-left text-lightModeText mb-4 sm:mb-6 md:mb-8`}>
                Everything you need, in one place
            </h2>
            <div className="flex flex-col md:flex-row gap-8 md:gap-12 mb-8 sm:mb-10 md:mb-12">
                {/* Left side content */}
                <div className="w-full md:w-3/5">
                    <p className="text-left text-lg text-lightModeText font-semibold pb-6">
                        Flippify’s Store Management system simplifies running your eBay store by bringing everything into one place. Access financials, inventory, and order management tools seamlessly, with a unified dashboard that gives you a clear overview of your operations in real-time.
                    </p>
                    <p className="text-left text-lg text-lightModeText font-semibold pb-6">
                        Whether you’re tweaking listings, monitoring sales, or managing stock, Flippify makes it effortless. Focus on scaling your business while we handle the complexity of store management for you.
                    </p>
                </div>
                {/* Right side image */}
                <div className="w-full flex items-center justify-center">
                    <div className="relative w-full" style={{ paddingBottom: '66.65%' }}>
                        <Image
                            src="/StoreManagement.png"
                            alt="Store Management Dashboard Preview"
                            fill
                            className="object-contain rounded-lg"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StoreManagementOverview;