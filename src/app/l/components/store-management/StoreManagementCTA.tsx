import React from 'react';
import HomeGetAccess from '../home/HomeGetAccess';
import Image from 'next/image';

const StoreManagementCTA = () => {
    return (
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-6 md:px-8 lg:px-10 xl:px-12">
            <div className="flex flex-col md:flex-row items-center">
                <div className="w-full md:w-3/5 pr-0 md:pr-8 mb-8 md:mb-0">
                    <h2 className="text-3xl sm:text-4xl font-bold text-lightModeText mb-4">
                        Tired of the chaos with managing everything from A-Z?
                    </h2>
                    <p className="text-lg text-lightModeText mb-6">
                        Say goodbye to scattered tools and data chaos. Flippify’s all-in-one Store Management system simplifies & automates your eBay operations, so you can focus on growing your business.
                    </p>
                    <div className="mt-6">
                        <HomeGetAccess />
                    </div>
                </div>
                <div className={`w-full lg:w-1/3 pt-10 md:pt-0 lg:scale-125 select-none`}>
                    <Image
                        src={"/StoreManagementChoas.png"}
                        alt={"Simplify your eBay store management with Flippify’s all-in-one solution."}
                        className={`w-full h-auto animate-fadeInSecondary scale-125`}
                        width={500}
                        height={500}
                    />
                </div>
            </div>
        </div>
    );
};

export default StoreManagementCTA;