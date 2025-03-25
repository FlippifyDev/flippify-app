"use client"


// Local Imports
import Card from './Card'
import { fetchUserSubscription, fetchSubscriptionMaxListings } from '@/utils/fetch-user-sub';

// External Imports
import { useSession } from 'next-auth/react'
import React from 'react'


const CardListingsAmount = () => {
    const { data: session } = useSession();
    const store = session?.user.store;
    if (!store) return null;

    const automaticListings = store.ebay.numListings?.automatic ?? 0;
    const manualListings = store.ebay.numListings?.manual ?? 0;

    const automaticOrders = store.ebay.numOrders?.automatic ?? 0;
    const manualOrders = store.ebay.numOrders?.manual ?? 0;

    const userSubscription = fetchUserSubscription(session?.user.subscriptions ?? []);
    if (!userSubscription) return null;

    const { manual: maxManual, automatic: maxAutomatic } = fetchSubscriptionMaxListings(userSubscription);

    return (
        <Card title="Listings Remaining" className='max-h-[30rem]'>
            {/* Automatic Listings */}
            <div>
                <span>Automatic Listings</span>
                <div className="grid grid-cols-12 items-center mt-5">
                    <div className="col-span-11">
                        <ProgressBar value={automaticListings} maxValue={maxAutomatic} />
                    </div>
                    <span className="col-span-1 ml-1">{maxAutomatic}</span>
                </div>
            </div>

            {/* Manual Listings */}
            <div>
                <span>Manual Listings</span>
                <div className="grid grid-cols-12 items-center mt-5">
                    <div className="col-span-11">
                        <ProgressBar value={manualListings} maxValue={maxManual} />
                    </div>
                    <span className="col-span-1 ml-1">{maxManual}</span>
                </div>
            </div>

            {/* Automatic Orders */}
            <div>
                <span>Automatic Orders</span>
                <div className="grid grid-cols-12 items-center mt-5">
                    <div className="col-span-11">
                        <ProgressBar value={automaticOrders} maxValue={maxAutomatic} />
                    </div>
                    <span className="col-span-1 ml-1">{maxAutomatic}</span>
                </div>
            </div>

            {/* Manual Orders */}
            <div>
                <span className=''>Manual Orders</span>
                <div className="grid grid-cols-12 items-center mt-5">
                    <div className="col-span-11">
                        <ProgressBar value={manualOrders} maxValue={maxManual} />
                    </div>
                    <span className="col-span-1 ml-1">{maxManual}</span>
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
                className="absolute left-0 -top-[26px] py-0.5 px-1.5 bg-blue-50 border border-blue-200 text-xs font-medium text-blue-600 rounded-lg dark:bg-blue-800/30 dark:border-blue-800 dark:text-blue-500"
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
                    className="flex flex-col justify-center rounded-full overflow-hidden bg-blue-600 text-xs text-white text-center whitespace-nowrap transition duration-500 dark:bg-blue-500"
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    )
}

export default CardListingsAmount