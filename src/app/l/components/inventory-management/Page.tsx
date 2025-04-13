import React from 'react';
import { Inter } from 'next/font/google';
import Hero from '../dom/Hero';
import HomeGetAccess from '../home/HomeGetAccess';
import InventoryManagementOverview from './InventoryManagementOverview';
import InventoryManagementFeatures from './InventoryManagementFeatures';
import InventoryManagementCTA from './InventoryManagementCTA';

const inter = Inter({ subsets: ["latin"] });

const InventoryManagementContent = () => {
    return (
        <div className='inventory-management-container'>
            <div>
                <Hero
                    text={[{ text: "Stop counting boxes," }, { text: "It’s on" }, { text: "autopilot", isGradient: true }, { text: " now." }]}
                    description="Effortlessly track your inventory with Flippify’s automated tools—integrated with eBay and our Order Management system for seamless updates."
                    button={<HomeGetAccess />}
                    image="/hero/inventoryManagement.svg"
                    imageAlt="Flippify Inventory Management"
                    titleClassName="lg:w-3/5"
                />
            </div>

            <div className="flex flex-col mt-16 sm:mt-20 md:mt-24 lg:mt-[200px] xl:mt-[280px]">
                {/* Summary Section */}
                <div className="py-20">
                    <InventoryManagementOverview />
                </div>
                <div className="w-full border-b-2 border-gray-300 border-dashed"></div>

                {/* Key Points Section */}
                <div className="py-20">
                    <InventoryManagementFeatures />
                </div>
                <div className="w-full border-b-2 border-gray-300 border-dashed"></div>

                {/* Call to Action Section */}
                <div className="pt-20">
                    <InventoryManagementCTA />
                </div>
            </div>
        </div>
    );
};

export default InventoryManagementContent;