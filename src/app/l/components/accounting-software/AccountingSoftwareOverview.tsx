import React from 'react';
import { Inter } from "next/font/google";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

const AccountingSoftwareOverview = () => {
    return (
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-6 md:px-8 lg:px-10 xl:px-12">
            <h2 className={`${inter.className} text-3xl sm:text-4xl md:text-4xl font-bold text-left text-lightModeText mb-4 sm:mb-6 md:mb-8`}>
                Monitor Your eBay Success, Automatically
            </h2>
            <div className="flex flex-col md:flex-row gap-8 md:gap-12 mb-8 sm:mb-10 md:mb-12">
                {/* Left side content */}
                <div className="w-full md:w-3/5">
                    <p className="text-left text-lg text-lightModeText font-semibold pb-6">
                        Flippify's Financial Hub is designed specifically for eBay sellers, integrating seamlessly with our Inventory & Order Management systems. Every item logged—whether synced automatically from your sales or entered manually—flows through advanced algorithms to deliver real-time financial insights. From tiny fees to total revenue, everything is covered in a clean, intuitive dashboard.
                    </p>

                    <div className="relative p-6">
                        <h3 className={`${inter.className} text-2xl text-left text-lightModeText font-bold mb-3`}>
                            Why eBay Sellers Choose Us
                        </h3>
                        <ul className="space-y-2 text-lg">
                            <li className="flex items-start">
                                <span className="text-houseBlue mr-2">✓</span>
                                <span className="text-lightModeText">Seamless integration with their inventory and orders</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-houseBlue mr-2">✓</span>
                                <span className="text-lightModeText">Automation saves time, reduces errors and presents data with perfection.</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-houseBlue mr-2">✓</span>
                                <span className="text-lightModeText">Tailored for eBay-specific financial needs</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Right side image placeholder */}
                <div className="w-full md:w-2/5 flex items-center justify-center">
                    <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden">
                        <Image
                            src="/accounting-software/Software.png"
                            alt="Financial Dashboard Preview"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AccountingSoftwareOverview