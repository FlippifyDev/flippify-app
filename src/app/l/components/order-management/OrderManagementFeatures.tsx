import React from 'react';
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const OrderManagementFeatures = () => {
    return (
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-6 md:px-8 lg:px-10 xl:px-12">
            <h2 className={`${inter.className} text-3xl sm:text-4xl md:text-4xl font-bold text-left text-lightModeText mb-4 sm:mb-6 md:mb-8`}>
                Operate Hands-Free from A-Z
            </h2>
            <p className="w-full md:w-3/5 text-left text-lg text-lightModeText font-semibold mb-8 sm:mb-10 md:mb-12">
                Flippify’s Order Management system syncs with your eBay store and Inventory Management system to streamline order processing in real-time—no manual updates needed.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Feature 1 - Real-Time Order Tracking */}
                <div className="relative min-h-64 px-2 py-8 md:py-10 md:px-10">
                    <div className="absolute top-0 right-0 h-full w-0 sm:w-px md:w-0.5 border-r-2 border-dashed border-gray-300 hidden md:block"></div>
                    <div className="absolute bottom-0 left-0 w-full h-0 sm:h-px md:h-0.5 border-b-2 border-dashed border-gray-300"></div>

                    <div className="flex items-start mb-4">
                        <div className="mr-4 bg-blue-100 p-3 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-houseBlue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className={`${inter.className} text-2xl text-left text-lightModeText font-bold mb-3`}>
                                Real-Time Order Tracking
                            </h3>
                            <p className="text-left text-lightModeText text-lg mb-4">
                                Orders update in real-time as they’re placed on eBay. Flippify tracks every detail—status, payments, and cancellations—so you always know where each order stands.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Feature 2 - Inventory Syncing */}
                <div className="relative min-h-64 px-2 py-8 md:py-10 md:px-10">
                    <div className="absolute top-0 left-0 h-full w-0 sm:w-px md:w-0.5 border-l-2 border-dashed border-gray-300 hidden md:block"></div>
                    <div className="absolute bottom-0 left-0 w-full h-0 sm:h-px md:h-0.5 border-b-2 border-dashed border-gray-300 hidden md:block"></div>

                    <div className="flex items-start mb-4">
                        <div className="mr-4 bg-blue-100 p-3 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-houseBlue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                            </svg>
                        </div>
                        <div>
                            <h3 className={`${inter.className} text-2xl text-left text-lightModeText font-bold mb-3`}>
                                Seamless Inventory Syncing
                            </h3>
                            <p className="text-left text-lightModeText text-lg mb-4">
                                Every order automatically updates your inventory in Flippify’s system, ensuring your stock levels are always accurate without manual adjustments.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Feature 3 - Shipment Tracking */}
                <div className="relative min-h-64 px-2 py-8 md:py-10 md:px-10">
                    <div className="absolute top-0 right-0 h-full w-0 sm:w-px md:w-0.5 border-r-2 border-dashed border-gray-300 hidden md:block"></div>
                    <div className="absolute top-0 right-0 w-full h-0 sm:h-px md:h-0.5 border-t-2 border-dashed border-gray-300"></div>

                    <div className="flex items-start mb-4">
                        <div className="mr-4 bg-blue-100 p-3 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-houseBlue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className={`${inter.className} text-2xl text-left text-lightModeText font-bold mb-3`}>
                                Label Purchasing & Tracking (Coming Soon)
                            </h3>
                            <p className="text-left text-lightModeText text-lg mb-4">
                                Purchase pre-selected labels in-house using AI for maximum profit & Keep tabs on your shipments with our upcoming features. Monitor delivery statuses directly in Flippify to ensure every order reaches its destination.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Feature 4 - Centralized Dashboard */}
                <div className="relative min-h-64 px-2 py-8 md:py-10 md:px-10">
                    <div className="absolute top-0 left-0 h-full w-0 sm:w-px md:w-0.5 border-l-2 border-dashed border-gray-300 hidden md:block"></div>
                    <div className="absolute top-0 left-0 w-full h-0 sm:h-px md:h-0.5 border-t-2 border-dashed border-gray-300"></div>

                    <div className="flex items-start mb-4">
                        <div className="mr-4 bg-blue-100 p-3 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-houseBlue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className={`${inter.className} text-2xl text-left text-lightModeText font-bold mb-3`}>
                                Shipping & Fulfillment Hub
                            </h3>
                            <p className="text-left text-lightModeText text-lg mb-4">
                                Flippify organizes your eBay fulfillment process, providing all shipping details, sorting items ready to ship, and scheduling timelines—all you need to do is check them off.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderManagementFeatures;