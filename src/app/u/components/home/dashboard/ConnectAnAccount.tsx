import React from 'react'
import ConnectAccount from '../profile/ConnectAccounts/ConnectAccount'

const ConnectAnAccount = () => {
    return (
        <div className='bg-white rounded-lg shadow-sm max-w-xl'>
            <div className='p-4 border-b'>
                <h1 className='text-lg text-center'>Connect an account to get started</h1>
            </div>
            <div className="flex flex-col gap-2 p-4">
                {/* eBay Connect Account Card */}
                <ConnectAccount
                    name="eBay"
                    image="/ebayLogo.png"
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
            </div>
        </div>
    )
}

export default ConnectAnAccount
