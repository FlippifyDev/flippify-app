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
        <Card title="Listings Remaining">
            <div>
                <span>Automatic Listings</span>
                <div className='grid grid-cols-12 items-center'>
                    <div className="col-span-11 w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700 flex flex-row items-center">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${((automaticListings * 100) / maxAutomatic).toFixed(0)}%` }}></div>
                        <span className={`ml-1 ${(automaticListings === maxAutomatic) || (automaticListings === 0) ? 'hidden': 'block'}`}>{automaticListings}</span>
                    </div>
                    <span className='col-span-1 ml-1'>{maxAutomatic}</span>
                </div>
            </div>
            <div>
                <span>Manual Listings</span>
                <div className='grid grid-cols-12 items-center'>
                    <div className="col-span-11 w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700 flex flex-row items-center">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${((manualListings * 100) / maxManual).toFixed(0)}%` }}></div>
                        <span className={`ml-1 ${(manualListings === maxManual) || (manualListings === 0) ? 'hidden' : 'block'}`}>{manualListings}</span>
                    </div>
                    <span className='col-span-1 ml-1'>{maxManual}</span>
                </div>
            </div>
            <div>
                <span>Automatic Orders</span>
                <div className='grid grid-cols-12 items-center'>
                    <div className="col-span-11 w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700 flex flex-row items-center">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${((automaticOrders * 100) / maxAutomatic).toFixed(0)}%` }}></div>
                        <span className={`ml-1 ${(automaticOrders === maxAutomatic) || (automaticOrders === 0) ? 'hidden' : 'block'}`}>{automaticOrders}</span>
                    </div>
                    <span className='col-span-1 ml-1'>{maxAutomatic}</span>
                </div>
            </div>
            <div>
                <span>Manual Orders</span>
                <div className='grid grid-cols-12 items-center'>
                    <div className="col-span-11 w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700 flex flex-row items-center">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${((manualOrders * 100) / maxManual).toFixed(0)}%` }}></div>
                        <span className={`ml-1 ${(manualOrders === maxManual) || (manualOrders === 0) ? 'hidden' : 'block'}`}>{manualOrders}</span>
                    </div>
                    <span className='col-span-1 ml-1'>{maxManual}</span>
                </div>
            </div>
        </Card>
    )
}

export default CardListingsAmount
