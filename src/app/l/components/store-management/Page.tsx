import React from 'react';
import { Inter } from 'next/font/google';
import Hero from '../dom/Hero';
import HomeGetAccess from '../home/HomeGetAccess';
import StoreManagementOverview from './StoreManagementOverview';
import StoreManagementFeatures from './StoreManagementFeatures';
import StoreManagementCTA from './StoreManagementCTA';
import StoreManagementDashboardShowcase from './StoreManagementDashboardShowcase';

const StoreManagementContent = () => {
    return (
        <div className="min-h-screen flex flex-col items-center">
            <Hero
                text={[
                    { text: "The all-in-one store" },
                    { text: "automation", isGradient: true },
                    { text: "solution" }
                ]}
                description="Flippify’s collection of automation tools lets you manage your eBay store, inventory, listings, and sales effortlessly—all in one place for seamless control."
                image="/hero/storeManagement.svg"
                imageAlt="Store Management"
                imageContainerClassName="pb-20 scale-125"
                button={<HomeGetAccess />}
            />

            <div className="flex flex-col mt-16 sm:mt-20 md:mt-24 lg:mt-[200px] xl:mt-[280px]">
                {/* Overview Section */}
                <div className="pt-20">
                    <StoreManagementOverview />
                </div>
                <div className="pb-20">
                    <StoreManagementDashboardShowcase />
                </div>
                <div className="w-full border-b-2 border-gray-300 border-dashed"></div>

                {/* Combined Features and Roadmap Section */}
                <div className="py-20">
                    <StoreManagementFeatures />
                </div>
                <div className="w-full border-b-2 border-gray-300 border-dashed"></div>

                {/* Call to Action Section */}
                <div className="pt-20">
                    <StoreManagementCTA />
                </div>
            </div>
        </div>
    );
};

export default StoreManagementContent;