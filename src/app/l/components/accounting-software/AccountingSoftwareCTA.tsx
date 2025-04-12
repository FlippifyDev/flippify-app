import React from 'react';
import HomeGetAccess from '../home/HomeGetAccess';
import Image from 'next/image';

const AccountingSoftwareCTA = () => {
    return (
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-12 md:py-16">
            <div className="flex flex-col md:flex-row items-center">
                <div className="w-full md:w-3/5 pr-0 md:pr-8 mb-8 md:mb-0">
                    <h2 className="text-3xl sm:text-4xl font-bold text-lightModeText mb-4">
                        Ready to stop wasting time manually bookkeeping?
                    </h2>
                    <p className="text-lg text-lightModeText mb-6">
                        Say goodbye to confusion and wasted hours. Our automated system handles your eBay finances,
                        giving you clear insights and more time to grow your business.
                    </p>
                    <div className="mt-6">
                        <HomeGetAccess />
                    </div>
                </div>
                <div className={`w-full lg:w-1/3 hidden lg:block pb-10 scale-125 select-none`}>
                    <Image
                        src={"/AccountingConfused.png"}
                        alt={"Stop Manually bookkeeping, use flippify automated financial hub instead."}
                        className={`w-full h-auto animate-fadeInSecondary scale-125`}
                        width={500}
                        height={500}
                    />
                </div>
            </div>
        </div>
    );
};

export default AccountingSoftwareCTA;