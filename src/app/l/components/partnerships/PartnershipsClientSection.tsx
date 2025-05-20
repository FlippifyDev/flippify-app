"use client";

import Hero from "../dom/Hero";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import { Lato, Inter } from 'next/font/google';

const lato = Lato({ weight: "900", style: "italic", subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"] });

const OurPartnersContent = () => {
    return (
        <div className="our-partners-container">
            <div className="w-full max-w-7xl mx-auto px-6 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-16 sm:py-20 md:py-24">
                <h2 className={`${inter.className} text-3xl sm:text-4xl md:text-4xl font-bold text-left text-lightModeText mb-4 sm:mb-6 md:mb-8`}>
                    Partner Showcase Coming Soon
                </h2>
                <p className="w-full md:w-3/5 text-left text-lg text-lightModeText font-semibold mb-8 sm:mb-10 md:mb-12">
                    We're currently working with our partners to build this page into a comprehensive hub where you can connect with trusted experts who can help you get started reselling or level up your existing reselling operation.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2">
                    {/* First Section - Top Left */}
                    <div className="relative min-h-64 px-2 py-8 md:py-10 md:px-10">
                        <div className="absolute top-0 right-0 h-full w-0 sm:w-px md:w-0.5 border-r-2 border-dashed border-gray-300 hidden md:block"></div>
                        <div className="absolute bottom-0 left-0 w-full h-0 sm:h-px md:h-0.5 border-b-2 border-dashed border-gray-300"></div>

                        <h3 className={`${inter.className} text-2xl text-left text-lightModeText font-bold mb-3`}>
                            Find Trusted Reselling Experts
                        </h3>
                        <p className="text-left text-lightModeText text-lg mb-4">
                            Connect with professionals to guide your eBay journey
                        </p>
                        <ul className="space-y-2">
                            <li className="flex items-start">
                                <span className="text-houseBlue mr-2">✓</span>
                                <span className="text-lightModeText">Discover mentors with proven track records in eBay reselling.</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-houseBlue mr-2">✓</span>
                                <span className="text-lightModeText">Learn from experts who understand the unique challenges of the platform.</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-houseBlue mr-2">✓</span>
                                <span className="text-lightModeText">Build relationships with leaders in the reselling community.</span>
                            </li>
                        </ul>
                    </div>

                    {/* Second Section - Top Right */}
                    <div className="relative min-h-64 px-2 py-8 md:py-10 md:px-10">
                        <div className="absolute top-0 left-0 h-full w-0 sm:w-px md:w-0.5 border-l-2 border-dashed border-gray-300 hidden md:block"></div>
                        <div className="absolute bottom-0 left-0 w-full h-0 sm:h-px md:h-0.5 border-b-2 border-dashed border-gray-300 hidden md:block"></div>

                        <h3 className={`${inter.className} text-2xl text-left text-lightModeText font-bold mb-3`}>
                            Access Exclusive Resources
                        </h3>
                        <p className="text-left text-lightModeText text-lg mb-4">
                            Get special tools and content from our partner network
                        </p>
                        <ul className="space-y-2">
                            <li className="flex items-start">
                                <span className="text-houseBlue mr-2">✓</span>
                                <span className="text-lightModeText">Gain access to proprietary research and sourcing strategies.</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-houseBlue mr-2">✓</span>
                                <span className="text-lightModeText">Receive discounted training materials and courses from industry leaders.</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-houseBlue mr-2">✓</span>
                                <span className="text-lightModeText">Unlock partner-exclusive features and tools within Flippify.</span>
                            </li>
                        </ul>
                    </div>

                    {/* Third Section - Bottom Left */}
                    <div className="relative min-h-64 px-2 py-8 md:py-10 md:px-10">
                        <div className="absolute top-0 right-0 h-full w-0 sm:w-px md:w-0.5 border-r-2 border-dashed border-gray-300 hidden md:block"></div>
                        <div className="absolute top-0 right-0 w-full h-0 sm:h-px md:h-0.5 border-t-2 border-dashed border-gray-300"></div>

                        <h3 className={`${inter.className} text-2xl text-left text-lightModeText font-bold mb-3`}>
                            Join Reselling Communities
                        </h3>
                        <p className="text-left text-lightModeText text-lg mb-4">
                            Connect with like-minded sellers for support and growth
                        </p>
                        <ul className="space-y-2">
                            <li className="flex items-start">
                                <span className="text-houseBlue mr-2">✓</span>
                                <span className="text-lightModeText">Find communities focused on your niche or selling strategy.</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-houseBlue mr-2">✓</span>
                                <span className="text-lightModeText">Share insights and learn from fellow resellers' experiences.</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-houseBlue mr-2">✓</span>
                                <span className="text-lightModeText">Collaborate on sourcing opportunities and market research.</span>
                            </li>
                        </ul>
                    </div>

                    {/* Fourth Section - Bottom Right */}
                    <div className="relative min-h-64 px-2 py-8 md:py-10 md:px-10">
                        <div className="absolute top-0 left-0 h-full w-0 sm:w-px md:w-0.5 border-l-2 border-dashed border-gray-300 hidden md:block"></div>
                        <div className="absolute top-0 left-0 w-full h-0 sm:h-px md:h-0.5 border-t-2 border-dashed border-gray-300"></div>

                        <h3 className={`${inter.className} text-2xl text-left text-lightModeText font-bold mb-3`}>
                            Leverage Combined Technology
                        </h3>
                        <p className="text-left text-lightModeText text-lg mb-4">
                            Utilize integrated tools from Flippify and partners
                        </p>
                        <ul className="space-y-2">
                            <li className="flex items-start">
                                <span className="text-houseBlue mr-2">✓</span>
                                <span className="text-lightModeText">Experience seamless integration between partner services and Flippify.</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-houseBlue mr-2">✓</span>
                                <span className="text-lightModeText">Streamline your workflow with compatible, complementary tools.</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-houseBlue mr-2">✓</span>
                                <span className="text-lightModeText">Stay at the cutting edge with collaborative technology innovations.</span>
                            </li>
                        </ul>
                    </div>
                </div>
                
                <div className="mt-12 text-center">
                    <Link 
                        href="/l/partnerships/become-a-partner" 
                        className="inline-flex items-center gap-2 bg-houseBlue hover:bg-houseHoverBlue text-white font-semibold py-3 px-6 rounded-full transition duration-300"
                    >
                        Join our partner network
                        <FaArrowRight className="text-sm" />
                    </Link>
                </div>
            </div>

            <div className="pt-16 sm:pt-20 md:pt-24 lg:pt-[150px] xl:pt-[180px]" />
        </div>
    );
};

export default OurPartnersContent;