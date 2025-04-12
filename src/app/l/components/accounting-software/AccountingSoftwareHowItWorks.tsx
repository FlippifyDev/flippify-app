import React from 'react';
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const AccountingSoftwareHowItWorks = () => {
    return (
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-6 md:px-8 lg:px-10 xl:px-12">
            <h2 className={`${inter.className} text-3xl sm:text-4xl md:text-4xl font-bold text-left text-lightModeText mb-4 sm:mb-6 md:mb-8`}>
                eBay Sales to Financial Reports in Four Steps
            </h2>
            <p className="w-full md:w-3/5 text-left text-lg text-lightModeText font-semibold mb-8 sm:mb-10 md:mb-12">
                Our streamlined process makes financial management and overview simple and effective for eBay sellers.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-4">
                {/* Step 1 */}
                <div className="group relative">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-houseBlue to-transparent rounded"></div>
                    <div className="pl-4">
                        <h3 className="text-xl font-bold text-lightModeText mb-2">
                            Connect Your eBay Store
                        </h3>
                        <p className="text-lightModeText">
                            Link your eBay account to sync orders and inventory automatically.
                        </p>
                    </div>
                </div>

                {/* Step 2 */}
                <div className="group relative">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-houseBlue to-transparent rounded"></div>
                    <div className="pl-4">
                        <h3 className="text-xl font-bold text-lightModeText mb-2">
                            Fill in the Gaps
                        </h3>
                        <p className="text-lightModeText">
                            Input purchase costs & categorize items in the Inventory Management system, and we will handle the rest.
                        </p>
                    </div>
                </div>

                {/* Step 3 */}
                <div className="group relative">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-houseBlue to-transparent rounded"></div>
                    <div className="pl-4">
                        <h3 className="text-xl font-bold text-lightModeText mb-2">
                            Automate Analysis
                        </h3>
                        <p className="text-lightModeText">
                            Our algorithms process every sale, fee, and expense to generate real-time financial reports.
                        </p>
                    </div>
                </div>

                {/* Step 4 */}
                <div className="group relative">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-houseBlue to-transparent rounded"></div>
                    <div className="pl-4">
                        <h3 className="text-xl font-bold text-lightModeText mb-2">
                            Export and Scale
                        </h3>
                        <p className="text-lightModeText">
                            Download CSVs or view insights to stay compliant and grow your business.
                        </p>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default AccountingSoftwareHowItWorks