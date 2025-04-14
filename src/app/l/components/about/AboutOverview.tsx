import React from 'react';
import Image from 'next/image';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ["latin"] });

const AboutOverview = () => {
    return (
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-6 md:px-8 lg:px-10 xl:px-12">
            <div className="flex flex-col md:flex-row gap-8 md:gap-12 mb-8 sm:mb-10 md:mb-12">
                {/* Left side content */}
                <div className="w-full">
                    <h2 className={`${inter.className} text-3xl sm:text-4xl md:text-4xl font-bold text-left text-lightModeText mb-4 sm:mb-6 md:mb-8`}>
                        From struggles, to solutions
                    </h2>
                    <p className="text-left text-lg text-lightModeText font-semibold pb-6">
                        We’ve faced the challenges of eBay selling—endless manual updates, missed orders, and messy financials on spreadsheets. Those struggles drained our time and led to costly mistakes, holding us back from the true growth and potential of our businesses.
                    </p>
                    <p className="text-left text-lg text-lightModeText font-semibold">
                        That’s why we built Flippify - to simplify everything. Our tools handle the repetitive tasks, automate as much as possible, and put it all in one place, so you can focus on selling & scaling with confidence, clarity and a lot more time on yur hands.
                    </p>
                </div>

                {/* Right side image */}
                <div className="w-full flex items-center justify-center">
                    <div className="relative w-full pb-[100%] sm:pb-[80%]">
                        <Image
                            src="/about/AboutUsSolutions.svg"
                            alt="Store Management Dashboard Preview"
                            fill
                            className="object-contain rounded-lg"
                        />
                    </div>
                </div>
            </div>

            <div className="text-left text-lg text-lightModeText font-semibold pb-6">
                Our goal is to make selling on eBay easier, more efficient, and more profitable. We’re committed to building tools that help you save time, reduce errors, and grow your business with confidence. We’re not just a software company—we’re your partners in success.
            </div>
        </div>
    )
}

export default AboutOverview