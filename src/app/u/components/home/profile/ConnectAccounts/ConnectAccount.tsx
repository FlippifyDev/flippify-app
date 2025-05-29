import React from 'react';
import Image from 'next/image';

import AmazonConnectButton from "./AmazonConnectButton";
import EbayConnectButton from "./EbayConnectButton";
import ShopifyConnectButton from "./ShopifyConnectButton";
import ConnectButton from './ConnectButton';

interface ConnectAccountProps {
    name: string;
    description?: string;
    image: string;
}

const ConnectAccount: React.FC<ConnectAccountProps> = ({ name, description, image }) => {
    return (
        <div className="col-span-1 flex flex-row items-center p-4 gap-4">
            {/* Account logo */}
            <div>
                <div className="border-[3px] rounded-full p-2 w-12 h-12 flex justify-center items-center">
                    <Image alt={`${name} logo`} src={image} width={30} height={30} loading="lazy" className="rounded-full object-cover" />
                </div>
            </div>

            {/* Account name */}
            <div className='w-full'>
                <p className="text-md font-semibold text-gray-800">{name}</p>
                <p className='text-xs font-[530] text-gray-600'>{description}</p>
            </div>

            <div className='flex justify-end'>
                {/* Connect/Disconnect Button */}
                {name === "eBay" && <EbayConnectButton />}
                {name === "StockX" && <ConnectButton unavailable={true} />}
                {name === "Depop" && <ConnectButton unavailable={true} />}
                {name === "Amazon" && <AmazonConnectButton />}
                {name === "Shopify" && <ShopifyConnectButton />}
            </div>
        </div>
    );
};

export default ConnectAccount;
