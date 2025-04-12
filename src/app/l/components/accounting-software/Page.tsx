import React from 'react';
import { Inter } from 'next/font/google';
import Image from 'next/image';
import HomeGetAccess from '../home/HomeGetAccess';
import Hero from '../dom/Hero';
import AccountingSoftwareOverview from './AccountingSoftwareOverview';
import { FaEbay } from "react-icons/fa";
import { BiSolidCategory } from "react-icons/bi";
import { TbPresentationAnalyticsFilled } from "react-icons/tb";
import { PiExportFill } from "react-icons/pi";
import AccountingSoftwareFeatures from './AccountingSoftwareFeatures';
import AccountingSoftwareHowItWorks from './AccountingSoftwareHowItWorks';
import AccountingSoftwareVideoShowcase from './AccountingSoftwareVideoShowcase';
import AccountingSoftwareCTA from './AccountingSoftwareCTA';

const inter = Inter({ subsets: ["latin"] });

const FinancialHubContent = () => {
    return (
        <div className='financial-hub-container'>
            <div>
                <Hero
                    text={[{ text: "Automate your finances" }, { text: "with", }, { text: "Flippify", isGradient: true }]}
                    description="Automatically track finances with Flippify’s accounting software—built for eBay sellers, integrated with our Inventory & Order Management for clear insights."
                    button={<HomeGetAccess />}
                    image="/hero/accountingSoftware.svg"
                    imageAlt="Flippify Financial Hub"
                    titleClassName="lg:w-3/5"
                />
            </div>

            <div className="flex flex-col mt-16 sm:mt-20 md:mt-24 lg:mt-[200px] xl:mt-[280px]">
                {/* Bit more of a description */}
                <div className="py-20">
                    <AccountingSoftwareOverview />
                </div>
                <div className="w-full border-b-2 border-gray-300 border-dashed"></div>

                {/* Key Features Section */}
                <div className="py-20">
                    <AccountingSoftwareFeatures />
                </div>
                <div className="w-full border-b-2 border-gray-300 border-dashed"></div>

                {/* How It Works Section */}
                <div className="py-20">
                    <AccountingSoftwareHowItWorks />
                </div>
                <div className="w-full"></div>

                {/* Video Showcase Section */}
                <div className="pb-20">
                    <AccountingSoftwareVideoShowcase />
                </div>
                <div className="w-full border-b-2 border-gray-300 border-dashed"></div>

                {/* Call to Action Section */}
                <div className="pt-20">
                    <AccountingSoftwareCTA />
                </div>
            </div>
        </div>
    );
};

export default FinancialHubContent;