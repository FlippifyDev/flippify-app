"use client"


// Local Imports
import Card from './Card'
import { fetchUserSubscription, fetchSubscriptionMaxListings } from '@/utils/fetch-user-sub';

// External Imports
import { useSession } from 'next-auth/react'
import React from 'react'


const CardListingsAmount = () => {
    const { data: session } = useSession();
    const automaticListings = session?.user.numListings?.automatic ?? 0;
    const manualListings = session?.user.numListings?.manual ?? 0;

    const userSubscription = fetchUserSubscription(session?.user.subscriptions ?? []);
    if (!userSubscription) return null;

    const { manual: maxManualListings, automatic: maxAutomaticListings } = fetchSubscriptionMaxListings(userSubscription);

    return (
        <Card>
            <div>
                <span>Automatic Listings</span>
                <div className='grid grid-cols-12 items-center'>
                    <div className="col-span-11 w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700 flex flex-row items-center">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${((automaticListings * 100) / maxAutomaticListings).toFixed(0)}%` }}></div>
                        <span className={`ml-1 ${(automaticListings === maxAutomaticListings) || (automaticListings === 0) ? 'hidden': 'block'}`}>{automaticListings}</span>
                    </div>
                    <span className='col-span-1 ml-1'>{maxAutomaticListings}</span>
                </div>
            </div>
            <div>
                <span>Manual Listings</span>
                <div className='grid grid-cols-12 items-center'>
                    <div className="col-span-11 w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700 flex flex-row items-center">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${((manualListings * 100) / maxManualListings).toFixed(0)}%` }}></div>
                        <span className={`ml-1 ${(manualListings === maxManualListings) || (manualListings === 0) ? 'hidden' : 'block'}`}>{manualListings}</span>
                    </div>
                    <span className='col-span-1 ml-1'>{maxManualListings}</span>
                </div>
            </div>
        </Card>
    )
}

export default CardListingsAmount
