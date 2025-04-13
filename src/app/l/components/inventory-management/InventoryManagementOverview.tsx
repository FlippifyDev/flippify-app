import React from 'react';
import { Inter } from "next/font/google";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

const InventoryManagementOverview = () => {
    return (
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-6 md:px-8 lg:px-10 xl:px-12">
            <h2 className={`${inter.className} text-3xl sm:text-4xl md:text-4xl font-bold text-left text-lightModeText mb-4 sm:mb-6 md:mb-8`}>
                Automate your eBay stores inventory management
            </h2>
            <div className="flex flex-col md:flex-row gap-8 md:gap-12 mb-8 sm:mb-10 md:mb-12">
                {/* Left side content */}
                <div className="w-full md:w-3/5">
                    <p className="text-left text-lg text-lightModeText font-semibold pb-6">
                        Flippify’s Inventory Management system takes the hassle out of stock control. By syncing with your eBay store, it automatically tracks every sale, return, and new listing in real-time. Integrated with our Order Management system, it keeps your inventory accurate so you can focus on selling.
                    </p>
                    <p className="text-left text-lg text-lightModeText font-semibold pb-6">
                        Our automated systems allow you to have full understanding of where your inventory is 24/7. Don't want to list an item yet, or want to do so elsewhere? Manually add stock with a couple clicks and it will be tracked in your inventory just like normal, giving you a seamless overview of your entire operation.
                    </p>
                </div>
                {/* Right side image */}
                <div className="w-full flex items-center justify-center">
                    <div className="relative w-full" style={{ paddingBottom: '66.65%' }}>
                        <Image
                            src="/inventory-management/AutomatedInventory.png"
                            alt="Inventory Dashboard Preview"
                            fill
                            className="object-contain rounded-lg"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InventoryManagementOverview;