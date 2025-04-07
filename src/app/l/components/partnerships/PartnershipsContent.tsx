"use client";

import { Lato, Inter } from "next/font/google";
import PartnershipsContactForm from "./PartnershipsContactForm";

const lato = Lato({ weight: "900", style: "italic", subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"] });

const PartnershipsContent = () => {
    return (
        <div className="partnerships-details-container">
            <div className="flex flex-col items-center">
                {/* Hero Section */}
                <div className="w-full mt-3 lg:mt-10 animate-fadeInPrimary">
                    <p className={`${lato.className} text-5xl text-white text-center`}>
                        Grow your business as a {" "}
                    </p>
                    <p className={`${lato.className} text-5xl text-white text-center`}>
                        <span className={`bg-gradient-to-tr pb-1 pl-1 from-textGradStart to-textGradEnd bg-clip-text text-transparent`}>
                            flippify{" "}
                        </span>
                        partner
                    </p>
                </div>
                <p className="w-11/12 sm:w-full mt-3 mb-8 pb-1 pt-2 text-gray-300 text-lg text-center animate-fadeInSecondary">
                    Collaborate with Flippify to bring your reselling group exclusive discounts, 50% revenue sharing, and AI-powered tools to automate their eBay stores—open to all potential partners!
                </p>

                {/* Benefits Section */}
                <div className="w-full max-w-4xl mx-auto mt-12">
                    <h2 className={`${inter.className} text-3xl font-bold text-center text-white mb-8`}>
                        Why Partner with Us?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h3 className="text-xl font-semibold mb-4">50% Revenue Sharing</h3>
                            <p className="text-gray-700">
                                Earn half of every sale made with your group’s unique coupon code—passive income for your community.
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h3 className="text-xl font-semibold mb-4">Exclusive Discounts</h3>
                            <p className="text-gray-700">
                                Offer your members special pricing on Flippify’s AI automation tools to boost their eBay success.
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h3 className="text-xl font-semibold mb-4">Collaborative Events</h3>
                            <p className="text-gray-700">
                                Team up with us for challenges, workshops, and events to engage and grow your community.
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h3 className="text-xl font-semibold mb-4">AI-Powered Tools</h3>
                            <p className="text-gray-700">
                                Provide your members with cutting-edge automation for listings, inventory, and financial tracking.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Call to Action */}
                <div className="mt-16">
                    <p className={`${inter.className} text-center text-white text-xl mb-4`}>
                        Ready to Partner with Flippify?
                    </p>
                    <PartnershipsContactForm />
                </div>

                {/* Beta Status Note */}
                <div className="mt-8 text-center text-gray-400 max-w-2xl">
                    <p>
                        *Note: Partnerships are currently unavailable during our beta phase. We encourage you to reach out now to express interest and be among the first notified when partnerships launch!
                    </p>
                </div>

                <div className="pt-[90px] lg:pt-[150px]" />
            </div>
        </div >
    );
};

export default PartnershipsContent;