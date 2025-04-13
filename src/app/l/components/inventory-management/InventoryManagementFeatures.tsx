import React from 'react';
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const InventoryManagementFeatures = () => {
    return (
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-6 md:px-8 lg:px-10 xl:px-12">
            <h2 className={`${inter.className} text-3xl sm:text-4xl md:text-4xl font-bold text-left text-lightModeText mb-4 sm:mb-6 md:mb-8`}>
                Effortless Inventory Tools for eBay Sellers
            </h2>
            <p className="w-full md:w-3/5 text-left text-lg text-lightModeText font-semibold mb-8 sm:mb-10 md:mb-12">
                Flippify’s Inventory Management system syncs with your eBay store and Order Management system to keep your stock accurate in real-time—no manual updates needed.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Feature 1 - Real-Time Stock Updates */}
                <div className="relative min-h-64 px-2 py-8 md:py-10 md:px-10">
                    <div className="absolute top-0 right-0 h-full w-0 sm:w-px md:w-0.5 border-r-2 border-dashed border-gray-300 hidden md:block"></div>
                    <div className="absolute bottom-0 left-0 w-full h-0 sm:h-px md:h-0.5 border-b-2 border-dashed border-gray-300"></div>

                    <div className="flex items-start mb-4">
                        <div className="mr-4 bg-blue-100 p-3 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-houseBlue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                            </svg>
                        </div>
                        <div>
                            <h3 className={`${inter.className} text-2xl text-left text-lightModeText font-bold mb-3`}>
                                Real-Time Stock Updates
                            </h3>
                            <p className="text-left text-lightModeText text-lg mb-4">
                                Stock levels adjust in real-time with every eBay sale, return, or listing. Flippify syncs seamlessly with your store, so you always have an accurate inventory count without manual effort.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Feature 2 - Manual Stock Addition */}
                <div className="relative min-h-64 px-2 py-8 md:py-10 md:px-10">
                    <div className="absolute top-0 left-0 h-full w-0 sm:w-px md:w-0.5 border-l-2 border-dashed border-gray-300 hidden md:block"></div>
                    <div className="absolute bottom-0 left-0 w-full h-0 sm:h-px md:h-0.5 border-b-2 border-dashed border-gray-300 hidden md:block"></div>

                    <div className="flex items-start mb-4">
                        <div className="mr-4 bg-blue-100 p-3 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-houseBlue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </div>
                        <div>
                            <h3 className={`${inter.className} text-2xl text-left text-lightModeText font-bold mb-3`}>
                                Flexible Manual Stock Addition
                            </h3>
                            <p className="text-left text-lightModeText text-lg mb-4">
                                Not ready to list an item on eBay? Add stock manually with a few clicks, and Flippify will track it alongside your synced inventory, giving you a complete view of your stock.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Feature 3 - Order Management Integration */}
                <div className="relative min-h-64 px-2 py-8 md:py-10 md:px-10">
                    <div className="absolute top-0 right-0 h-full w-0 sm:w-px md:w-0.5 border-r-2 border-dashed border-gray-300 hidden md:block"></div>
                    <div className="absolute top-0 right-0 w-full h-0 sm:h-px md:h-0.5 border-t-2 border-dashed border-gray-300"></div>

                    <div className="flex items-start mb-4">
                        <div className="mr-4 bg-blue-100 p-3 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-houseBlue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                        </div>
                        <div>
                            <h3 className={`${inter.className} text-2xl text-left text-lightModeText font-bold mb-3`}>
                                Order Management Integration
                            </h3>
                            <p className="text-left text-lightModeText text-lg mb-4">
                                Flippify’s Inventory Management system integrates directly with our Order Management tools, ensuring every order updates your stock in real-time—no discrepancies, just accuracy.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Feature 4 - Low-Stock Alerts (Coming Soon) */}
                <div className="relative min-h-64 px-2 py-8 md:py-10 md:px-10">
                    <div className="absolute top-0 left-0 h-full w-0 sm:w-px md:w-0.5 border-l-2 border-dashed border-gray-300 hidden md:block"></div>
                    <div className="absolute top-0 left-0 w-full h-0 sm:h-px md:h-0.5 border-t-2 border-dashed border-gray-300"></div>

                    <div className="flex items-start mb-4">
                        <div className="mr-4 bg-blue-100 p-3 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-houseBlue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-6-6V3a2 2 0 10-4 0v2a6 6 0 00-6 6v3.159c0 .538-.214 1.055-.595 1.436L0 17h5m5 0v1a3 3 0 006 0v-1m-6 0h6" />
                            </svg>
                        </div>
                        <div>
                            <h3 className={`${inter.className} text-2xl text-left text-lightModeText font-bold mb-3`}>
                                Low-Stock Alerts (Coming Soon)
                            </h3>
                            <p className="text-left text-lightModeText text-lg mb-4">
                                Stay ahead with upcoming low-stock alerts. Get notified when inventory runs low, so you can restock in time and never miss a sale opportunity.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InventoryManagementFeatures;