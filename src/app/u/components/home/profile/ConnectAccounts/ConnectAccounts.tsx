

import React from 'react';
import ConnectAccount from "./ConnectAccount";

// Component to handle eBay and Amazon account connections
const ProfileMarketplaceConnect = () => {
    return (
        <div className="w-full h-full card bg-white rounded-xl shadow">
            <div className='w-full border-b py-4 px-6 text-lg font-semibold'>
                Connect Accounts
            </div>
            <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto">
                {/* eBay Connect Account Card */}
                <ConnectAccount
                    name="eBay"
                    description="Automatically tracks inventory & order changes"
                    image="/connect-accounts/ebayLogo.png"
                />

                <ConnectAccount
                    name="StockX"
                    description="Automatically tracks inventory & order changes"
                    image="/connect-accounts/StockXLogo.png"
                />

                {/* Shopify Connect Account Card */}
                <ConnectAccount
                    name="Shopify"
                    image="/connect-accounts/ShopifyLogo.png"
                />


                <ConnectAccount
                    name="Depop"
                    image="/connect-accounts/DepopLogo.svg"
                />


                {/* Amazon Connect Account Card */}
                <ConnectAccount
                    name="Amazon"
                    image="/connect-accounts/AmazonLogo.png"
                />
            </div>
        </div>
    );
};

export default ProfileMarketplaceConnect;
