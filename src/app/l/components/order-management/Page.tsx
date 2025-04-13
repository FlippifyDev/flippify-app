import React from 'react';
import { Inter } from 'next/font/google';
import Hero from '../dom/Hero';
import HomeGetAccess from '../home/HomeGetAccess';
import OrderManagementOverview from './OrderManagementOverview';
import OrderManagementFeatures from './OrderManagementFeatures';
import OrderManagementCTA from './OrderManagementCTA';

const OrderManagementContent = () => {
    return (
        <div className='order-management-container'>
            <div>
                <Hero
                    text={[{ text: "Order management done" }, { text: "the", }, { text: "right", isGradient: true }, { text: "way" }]}
                    description="Manage your eBay orders stress-free with Flippify’s automated services—integrated with our Inventory Management system for seamless tracking."
                    button={<HomeGetAccess />}
                    image="/hero/orderManagement.svg"
                    imageAlt="Flippify Order Management"
                    titleClassName="lg:w-3/5"
                />
            </div>

            <div className="flex flex-col mt-16 sm:mt-20 md:mt-24 lg:mt-[200px] xl:mt-[280px]">
                {/* Summary Section */}
                <div className="py-20">
                    <OrderManagementOverview />
                </div>
                <div className="w-full border-b-2 border-gray-300 border-dashed"></div>

                {/* Key Points Section */}
                <div className="py-20">
                    <OrderManagementFeatures />
                </div>
                <div className="w-full border-b-2 border-gray-300 border-dashed"></div>

                {/* Call to Action Section */}
                <div className="pt-20">
                    <OrderManagementCTA />
                </div>
            </div>
        </div>
    );
};

export default OrderManagementContent;