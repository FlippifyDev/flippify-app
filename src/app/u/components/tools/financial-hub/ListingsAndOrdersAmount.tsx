"use client"


// Local Imports
import Card from '../../dom/ui/Card';
import { fetchUserSubscription, fetchSubscriptionMaxListings, fetchUserInventoryAndOrdersCount } from '@/utils/extract-user-data';

// External Imports
import { useSession } from 'next-auth/react'
import React from 'react'


const CardListingsAmount = () => {
    const { data: session } = useSession();

    const { automaticListings, automaticOrders, manualListings, manualOrders } = fetchUserInventoryAndOrdersCount(session?.user);

    const userSubscription = fetchUserSubscription(session?.user.subscriptions ?? []);
    if (!userSubscription) return null;

    const { manual: maxManual, automatic: maxAutomatic } = fetchSubscriptionMaxListings(userSubscription);

    return (
        <Card title="Listings Remaining" className='h-full'>
            {/* Automatic Listings */}
            <div className='mt-2'>
                <span>Automatic Listings</span>
                <div className="grid grid-cols-12 items-center mt-7">
                    <div className="col-span-11">
                        <ProgressBar value={automaticListings} maxValue={maxAutomatic} />
                    </div>
                    <span className="col-span-1 ml-1">{maxAutomatic}</span>
                </div>
            </div>

            {/* Automatic Orders */}
            <div className='mt-2'>
                <span>Automatic Orders</span>
                <div className="grid grid-cols-12 items-center mt-7">
                    <div className="col-span-11">
                        <ProgressBar value={automaticOrders} maxValue={maxAutomatic} />
                    </div>
                    <span className="col-span-1 ml-1">{maxAutomatic}</span>
                </div>
            </div>
        </Card>
    )
}


const ProgressBar = ({ value, maxValue }: { value: number, maxValue: number }) => {
    const percentage = ((value * 100) / maxValue).toFixed(0)

    return (
        <div className="relative w-full">
            {/* Value label */}
            <div
                className="absolute left-0 -top-[26px] py-0.5 px-1.5 bg-blue-100 border border-blue-200 text-xs font-medium text-houseFinancialHub rounded-lg dark:bg-blue-800/30"
                style={{ left: `calc(${percentage}% - 12px)` }}
            >
                {value}
            </div>

            {/* Progress bar container */}
            <div
                className="flex w-full h-2 bg-gray-200 rounded-full overflow-hidden dark:bg-neutral-700"
                role="progressbar"
                aria-valuenow={Number(percentage)}
                aria-valuemin={0}
                aria-valuemax={100}
            >
                {/* Progress bar fill */}
                <div
                    className="flex flex-col justify-center rounded-full overflow-hidden bg-houseFinancialHub text-xs text-white text-center whitespace-nowrap transition duration-500"
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    )
}

export default CardListingsAmount