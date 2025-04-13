import React from 'react';
import { Inter } from "next/font/google";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

const OrderManagementOverview = () => {
    return (
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-6 md:px-8 lg:px-10 xl:px-12">
            <h2 className={`${inter.className} text-3xl sm:text-4xl md:text-4xl font-bold text-left text-lightModeText mb-4 sm:mb-6 md:mb-8`}>
                Automate your eBay order management
            </h2>
            <div className="flex flex-col md:flex-row gap-8 md:gap-12 mb-8 sm:mb-10 md:mb-12">
                {/* Left side content */}
                <div className="w-full md:w-3/5">
                    <p className="text-left text-lg text-lightModeText font-semibold pb-6">
                        Flippify’s Order Management system eliminates the chaos of handling eBay orders. It syncs with your eBay store to automatically track every order, update statuses, and manage returns in real-time, while integrating with our Inventory Management system to keep stock aligned.
                    </p>
                    <p className="text-left text-lg text-lightModeText font-semibold pb-6">
                        Stay on top of your orders with a clear, centralized dashboard. Whether you’re processing sales, handling cancellations, or tracking shipments, Flippify gives you a seamless overview of your eBay orders, so you can focus on growing your business.
                    </p>
                </div>
                {/* Right side image */}
                <div className="w-full flex items-center justify-center">
                    <div className="relative w-full" style={{ paddingBottom: '66.65%' }}>
                        <Image
                            src="/order-management/Management.png"
                            alt="Order Management Dashboard Preview"
                            fill
                            className="object-contain rounded-lg"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderManagementOverview;