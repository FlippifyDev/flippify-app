import React from 'react';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import Image from 'next/image';

const inter = Inter({ subsets: ['latin'] });

const StoreManagementFeatures = () => {
    return (
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-6 md:px-8 lg:px-10 xl:px-12">
            {/* Top section - Text on left, image on right */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-12">
                {/* Features Description - Left Side */}
                <div className="md:w-1/2 mb-6 md:mb-0">
                    <h2 className={`${inter.className} text-3xl sm:text-4xl md:text-4xl font-bold text-left text-lightModeText mb-4 sm:mb-6 md:mb-8`}>
                        Your Store, Simplified
                    </h2>
                    <p className={`${inter.className} text-left text-lg text-lightModeText font-semibold mb-4`}>
                        Flippify brings everything you need to manage your eBay store into one accessible place. With a simple, easy-to-use dashboard, you get a clear overview of your financials, inventory, and orders—all in real time. No complicated setups or scattered tools—just everything you need, right where you need it, so you can run your store effortlessly and watch it grow on autopilot.
                    </p>
                </div>

                {/* Image - Right Side */}
                <div className="md:w-1/2 md:pl-8">
                    <Image
                        src="/store-management/Simple.svg"
                        alt="Dashboard overview"
                        className="w-full"
                        width={1000}
                        height={1000}
                    />
                </div>
            </div>

            {/* Bottom section - Image on left, text on right */}
            <div className="flex flex-col md:flex-row-reverse justify-between items-center">
                {/* Roadmap Teaser - Right Side (in normal view), Left on mobile */}
                <div className="md:w-1/2 mb-6 md:mb-0 text-left md:text-right">
                    <h3 className={`${inter.className} text-3xl sm:text-4xl md:text-4xl font-bold text-lightModeText mb-4 sm:mb-6 md:mb-8`}>
                        What's Next?
                    </h3>
                    <p className={`${inter.className} text-lg text-lightModeText font-semibold mb-6`}>
                        We're always adding new ways to make your store management even better. Take a peek at our roadmap for upcoming features!
                    </p>
                    <Link href="/l/roadmap">
                        <button className="btn-disabled bg-houseHoverBlue hover:bg-houseBlue text-white px-6 py-3 rounded-lg font-semibold transition duration-200">
                            Coming Soon
                        </button>
                    </Link>
                </div>

                {/* Image - Left Side */}
                <div className="md:w-1/2 md:pr-8">
                    <Image
                        src="/store-management/Plans.svg"
                        alt="Roadmap preview"
                        className="w-full"
                        width={1000}
                        height={1000}
                    />
                </div>
            </div>
        </div>
    );
};

export default StoreManagementFeatures;