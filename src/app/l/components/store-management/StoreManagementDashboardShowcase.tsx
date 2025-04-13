import React from 'react';
import Image from 'next/image';

const StoreManagementDashboardShowcase = () => {
    return (
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-6 md:px-8 lg:px-10 xl:px-12 md:order-2 ml-0">
            <figure className='border-2 border-white bg-gray-100/80 p-2 rounded-4xl shadow-lg'>
                <Image
                    src="https://i.imgur.com/LyseZ4f.png"
                    alt="Flippify desktop dashboard showing eBay store automation, inventory management system, and order fulfillment tools"
                    width={1500}
                    height={750}
                    loading="lazy"
                    className="rounded-3xl"
                />
            </figure>
        </div>
    )
}

export default StoreManagementDashboardShowcase