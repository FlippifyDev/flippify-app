import React from 'react';
import { Lato, Inter } from 'next/font/google';

const lato = Lato({ weight: "900", style: "italic", subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"] });

const PartnershipsClientDetails = () => {
    return (
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-6 md:px-8 lg:px-10 xl:px-12">
            <h2 className={`${inter.className} text-3xl sm:text-4xl md:text-4xl font-bold text-left text-lightModeText mb-4 sm:mb-6 md:mb-8`}>
                Equip Your Clients with Advanced Tools
            </h2>
            <p className="w-full md:w-3/5 text-left text-lg text-lightModeText font-semibold mb-8 sm:mb-10 md:mb-12">
                Your clients—whether reselling group members or individual users—gain access to Flippify&apos;s revolutionary automation software, transforming their operations with unmatched efficiency, time savings, and profit growth, all at a discount through your group&apos;s code.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2">
                {/* First Section - Top Left */}
                <div className="relative min-h-64 px-2 py-8 md:py-10 md:px-10">
                    <div className="absolute top-0 right-0 h-full w-0 sm:w-px md:w-0.5 border-r-2 border-dashed border-gray-300 hidden md:block"></div>
                    <div className="absolute bottom-0 left-0 w-full h-0 sm:h-px md:h-0.5 border-b-2 border-dashed border-gray-300"></div>

                    <h3 className={`${inter.className} text-2xl text-left text-lightModeText font-bold mb-3`}>
                        Exclusive Group Discount
                    </h3>
                    <p className="text-left text-lightModeText text-lg mb-4">
                        Save money while providing premium tools to your community
                    </p>
                    <ul className="space-y-2">
                        <li className="flex items-start">
                            <span className="text-houseBlue mr-2">✓</span>
                            <span className="text-lightModeText">Save 10% on Flippify services using your group&apos;s unique code.</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-houseBlue mr-2">✓</span>
                            <span className="text-lightModeText">Lower costs make premium automation accessible and affordable.</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-houseBlue mr-2">✓</span>
                            <span className="text-lightModeText">Increase value and loyalty within your reselling community.</span>
                        </li>
                    </ul>
                </div>

                {/* Second Section - Top Right */}
                <div className="relative min-h-64 px-2 py-8 md:py-10 md:px-10">
                    <div className="absolute top-0 left-0 h-full w-0 sm:w-px md:w-0.5 border-l-2 border-dashed border-gray-300 hidden md:block"></div>
                    <div className="absolute bottom-0 left-0 w-full h-0 sm:h-px md:h-0.5 border-b-2 border-dashed border-gray-300 hidden md:block"></div>

                    <h3 className={`${inter.className} text-2xl text-left text-lightModeText font-bold mb-3`}>
                        Game-Changing Software Access
                    </h3>
                    <p className="text-left text-lightModeText text-lg mb-4">
                        Provide cutting-edge automation tools to your members
                    </p>
                    <ul className="space-y-2">
                        <li className="flex items-start">
                            <span className="text-houseBlue mr-2">✓</span>
                            <span className="text-lightModeText">Harness AI-powered tools for listings, pricing, and inventory management.</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-houseBlue mr-2">✓</span>
                            <span className="text-lightModeText">Slash time spent on manual tasks while boosting accuracy and profits.</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-houseBlue mr-2">✓</span>
                            <span className="text-lightModeText">Revolutionize operations with automation tailored to reselling success.</span>
                        </li>
                    </ul>
                </div>

                {/* Third Section - Bottom Left */}
                <div className="relative min-h-64 px-2 py-8 md:py-10 md:px-10">
                    <div className="absolute top-0 right-0 h-full w-0 sm:w-px md:w-0.5 border-r-2 border-dashed border-gray-300 hidden md:block"></div>
                    <div className="absolute top-0 right-0 w-full h-0 sm:h-px md:h-0.5 border-t-2 border-dashed border-gray-300"></div>

                    <h3 className={`${inter.className} text-2xl text-left text-lightModeText font-bold mb-3`}>
                        Enhanced Operational Efficiency
                    </h3>
                    <p className="text-left text-lightModeText text-lg mb-4">
                        Complement your services with powerful automation
                    </p>
                    <ul className="space-y-2">
                        <li className="flex items-start">
                            <span className="text-houseBlue mr-2">✓</span>
                            <span className="text-lightModeText">Seamlessly complement your group&apos;s intel (e.g., what to buy) with our tools.</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-houseBlue mr-2">✓</span>
                            <span className="text-lightModeText">Automate the rest—listing, pricing, selling—for faster results.</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-houseBlue mr-2">✓</span>
                            <span className="text-lightModeText">Free up time to focus on scaling and sourcing new opportunities.</span>
                        </li>
                    </ul>
                </div>

                {/* Fourth Section - Bottom Right */}
                <div className="relative min-h-64 px-2 py-8 md:py-10 md:px-10">
                    <div className="absolute top-0 left-0 h-full w-0 sm:w-px md:w-0.5 border-l-2 border-dashed border-gray-300 hidden md:block"></div>
                    <div className="absolute top-0 left-0 w-full h-0 sm:h-px md:h-0.5 border-t-2 border-dashed border-gray-300"></div>

                    <h3 className={`${inter.className} text-2xl text-left text-lightModeText font-bold mb-3`}>
                        Data-Driven Profit Growth
                    </h3>
                    <p className="text-left text-lightModeText text-lg mb-4">
                        Help your members make smarter decisions with analytics
                    </p>
                    <ul className="space-y-2">
                        <li className="flex items-start">
                            <span className="text-houseBlue mr-2">✓</span>
                            <span className="text-lightModeText">Access real-time analytics to track performance and trends.</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-houseBlue mr-2">✓</span>
                            <span className="text-lightModeText">Optimize strategies with insights that maximize earnings.</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-houseBlue mr-2">✓</span>
                            <span className="text-lightModeText">Stay ahead in reselling with actionable, profit-boosting data.</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default PartnershipsClientDetails;