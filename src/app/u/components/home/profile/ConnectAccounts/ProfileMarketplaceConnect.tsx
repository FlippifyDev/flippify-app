

import React from 'react';
import ConnectAccount from "./ConnectAccount";

// Component to handle eBay and Amazon account connections
const ProfileMarketplaceConnect = () => {
    return (
        <div className="w-full h-full card bg-white rounded-xl">
            <div className='w-full border-b py-4 px-6 text-lg font-semibold'>
                Connect Accounts
            </div>
            <div className="flex flex-col gap-2">
                {/* eBay Connect Account Card */}
                <ConnectAccount
                    name="eBay"
                    image="/ebayLogo.png"
                />

                <ConnectAccount
                    name="Depop"
                    image="/DepopLogo.svg"
                />


                {/* Amazon Connect Account Card */}
                <ConnectAccount
                    name="Amazon"
                    image="/AmazonLogo.png"
                />

                {/* Shopify Connect Account Card */}
                <ConnectAccount
                    name="Shopify"
                    image="/ShopifyLogo.png"
                />

                {/* Discord Connect Account Card */}
                <ConnectAccount
                    name="Discord"
                    image="/DiscordLogo.png"
                />
            </div>
        </div>
    );
};

export default ProfileMarketplaceConnect;
