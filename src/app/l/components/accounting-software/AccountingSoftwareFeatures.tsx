import React from 'react';
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const AccountingSoftwareFeatures = () => {
    return (
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-6 md:px-8 lg:px-10 xl:px-12">
            <h2 className={`${inter.className} text-3xl sm:text-4xl md:text-4xl font-bold text-left text-lightModeText mb-4 sm:mb-6 md:mb-8`}>
                Powerful Financial Tools for eBay Sellers
            </h2>
            <p className="w-full md:w-3/5 text-left text-lg text-lightModeText font-semibold mb-8 sm:mb-10 md:mb-12">
                Our comprehensive Financial Hub seamlessly connects with your eBay sales and inventory data to deliver powerful insights without manual data entry.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Feature 1 - Automated Financial Tracking */}
                <div className="relative min-h-64 px-2 py-8 md:py-10 md:px-10">
                    <div className="absolute top-0 right-0 h-full w-0 sm:w-px md:w-0.5 border-r-2 border-dashed border-gray-300 hidden md:block"></div>
                    <div className="absolute bottom-0 left-0 w-full h-0 sm:h-px md:h-0.5 border-b-2 border-dashed border-gray-300"></div>

                    <div className="flex items-start mb-4">
                        <div className="mr-4 bg-blue-100 p-3 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-houseBlue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className={`${inter.className} text-2xl text-left text-lightModeText font-bold mb-3`}>
                                Zero-Effort Financial Tracking
                            </h3>
                            <p className="text-left text-lightModeText text-lg mb-4">
                                Say goodbye to manual bookkeeping. The Financial Hub automatically logs every transaction from your eBay account and our inventory system, calculating fees, revenue, costs, ROI, profit margins, and more with precision—all without manual data entry.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Feature 2 - Comprehensive Reporting */}
                <div className="relative min-h-64 px-2 py-8 md:py-10 md:px-10">
                    <div className="absolute top-0 left-0 h-full w-0 sm:w-px md:w-0.5 border-l-2 border-dashed border-gray-300 hidden md:block"></div>
                    <div className="absolute bottom-0 left-0 w-full h-0 sm:h-px md:h-0.5 border-b-2 border-dashed border-gray-300 hidden md:block"></div>

                    <div className="flex items-start mb-4">
                        <div className="mr-4 bg-blue-100 p-3 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-houseBlue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className={`${inter.className} text-2xl text-left text-lightModeText font-bold mb-3`}>
                                Insightful Financial Reports
                            </h3>
                            <p className="text-left text-lightModeText text-lg mb-4">
                                Generate detailed financial reports instantly—track revenue, margins, and monthly sales comparisons across custom categories you define. Gain insights into your eBay business with beautifully laid-out data visualizations that tell the story of your business.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Feature 3 - Inventory Integration */}
                <div className="relative min-h-64 px-2 py-8 md:py-10 md:px-10">
                    <div className="absolute top-0 right-0 h-full w-0 sm:w-px md:w-0.5 border-r-2 border-dashed border-gray-300 hidden md:block"></div>
                    <div className="absolute top-0 right-0 w-full h-0 sm:h-px md:h-0.5 border-t-2 border-dashed border-gray-300"></div>

                    <div className="flex items-start mb-4">
                        <div className="mr-4 bg-blue-100 p-3 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-houseBlue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                        <div>
                            <h3 className={`${inter.className} text-2xl text-left text-lightModeText font-bold mb-3`}>
                                Seamless Inventory Integration
                            </h3>
                            <p className="text-left text-lightModeText text-lg mb-4">
                                Our Financial Hub connects directly with Flippify's Inventory Management system, automatically pulling cost data, tracking active and sold inventory, and creating a complete financial picture from acquisition to sale—with no manual reconciliation needed.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Feature 4 - Customizable Categories */}
                <div className="relative min-h-64 px-2 py-8 md:py-10 md:px-10">
                    <div className="absolute top-0 left-0 h-full w-0 sm:w-px md:w-0.5 border-l-2 border-dashed border-gray-300 hidden md:block"></div>
                    <div className="absolute top-0 left-0 w-full h-0 sm:h-px md:h-0.5 border-t-2 border-dashed border-gray-300"></div>

                    <div className="flex items-start mb-4">
                        <div className="mr-4 bg-blue-100 p-3 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-houseBlue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className={`${inter.className} text-2xl text-left text-lightModeText font-bold mb-3`}>
                                Customizable Product Categories
                            </h3>
                            <p className="text-left text-lightModeText text-lg mb-4">
                                Organize your sales into custom categories (e.g., 'Apparel,' 'Tech') for more detailed analysis. Track performance by category, identify your most profitable product lines, and make informed decisions about your eBay business strategy.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AccountingSoftwareFeatures