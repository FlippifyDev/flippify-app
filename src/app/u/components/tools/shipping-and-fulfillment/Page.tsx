"use client";

// Local Imports
import Card from '../../dom/ui/Card';
import Shipped from './Shipped';
import { IOrder } from '@/models/store-data';
import ReadyToShip from './ReadyToShip';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import { retrieveOrders } from '@/services/bridges/retrieve';
import { defaultTimeFrom } from '@/utils/constants';
import LayoutSubscriptionWrapper from '../../layout/LayoutSubscriptionWrapper';

// External Imports
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react';


const ITEMS_PER_PAGE = 10;

const Page = () => {
    const { data: session } = useSession();
    const uid = session?.user.id as string;

    const [loading, setLoading] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true);
    const [updatedStatus, setUpdatedStatus] = useState(false);

    const [shippedListings, setShippedListings] = useState<IOrder[]>([]);
    const [activeListings, setActiveListings] = useState<IOrder[]>([]);

    const [activePage, setActivePage] = useState(1);
    const [shippedPage, setShippedPage] = useState(1);

    const totalActivePages = Math.ceil(activeListings.length / ITEMS_PER_PAGE);
    const totalShippedPages = Math.ceil(shippedListings.length / ITEMS_PER_PAGE);

    function sortOrderData(items: IOrder[]) {
        const active = items.filter(item => item.status === 'Active');
        const shipped = items.filter(item => item.status === 'InProcess');

        setShippedListings(shipped);
        setActiveListings(active);
    }

    useEffect(() => {
        const fetchOrderData = async () => {
            if (!session) return;

            if (initialLoad) {
                setLoading(true);
            }

            const items = await retrieveOrders({ uid, timeFrom: defaultTimeFrom });
            sortOrderData(items ?? [])

            if (initialLoad) {
                setLoading(false);
                setInitialLoad(false);
            }
        };

        if (session?.user.authentication?.subscribed) {
            fetchOrderData();
        }
    }, [session, updatedStatus, initialLoad, uid]);

    const getPaginatedItems = (list: IOrder[], page: number) => {
        const start = (page - 1) * ITEMS_PER_PAGE;
        return list.slice(start, start + ITEMS_PER_PAGE);
    };


    return (
        <LayoutSubscriptionWrapper anySubscriptions={["admin", "member"]}>
            <div className='flex flex-col md:flex-row gap-4'>
                <Card title="Ready to ship" className='h-full'>
                    {loading ? (
                        <div className='w-full flex justify-center items-center h-full'>
                            <LoadingSpinner />
                        </div>
                    ) : (
                        <div>
                            {activeListings.length > 0 && (
                                <>
                                    <table className='table'>
                                        <thead>
                                            <tr>
                                                <th></th>
                                                <th>ITEM</th>
                                                <th>QUANTITY</th>
                                                <th>STORAGE</th>
                                                <th>SHIP IN</th>
                                                <th className='text-center'>SHIPPED</th>
                                            </tr>
                                        </thead>
                                        {getPaginatedItems(activeListings, activePage).map((item) => (
                                            <ReadyToShip key={item.orderId} item={item} uid={session?.user.id as string} setUpdatedStatus={setUpdatedStatus} />
                                        ))}
                                    </table>
                                    <div className='mt-4 flex justify-end'>
                                        <div className="flex flex-row items-center">
                                            <button className='rounded-l flex items-center justify-center p-2 h-8 w-8 bg-gray-200 hover:bg-gray-300 active:bg-gray-200 transition duration-100' onClick={() => setActivePage(prev => Math.max(prev - 1, 1))} disabled={activePage === 1}>«</button>
                                            <button className="p-2 h-8 flex items-center justify-center bg-gray-200 text-sm font-semibold cursor-default">{activePage} / {totalActivePages}</button>
                                            <button className='rounded-r flex items-center justify-center p-2 h-8 w-8 bg-gray-200 hover:bg-gray-300 active:bg-gray-200 transition duration-100' onClick={() => setActivePage(prev => Math.min(prev + 1, totalActivePages))} disabled={activePage === totalActivePages}>»</button>
                                        </div>
                                    </div>
                                </>
                            )}

                            {activeListings.length === 0 && (
                                <div className='text-center text-sm'>
                                    <p className='text-lightModeText font-semibold'>No items ready to ship</p>
                                </div>
                            )}
                        </div>
                    )}
                </Card>
                <Card title="Shipped" className='h-full'>
                    {loading ? (
                        <div className='w-full flex justify-center items-center h-full'>
                            <LoadingSpinner />
                        </div>
                    ) : (
                        <div>
                            {shippedListings.length > 0 && (
                                <>
                                    <table className='table'>
                                        <thead>
                                            <tr>
                                                <th></th>
                                                <th>ITEM</th>
                                                <th>QUANTITY</th>
                                                <th className='text-center'>NOT SHIPPED</th>
                                                <th className='text-center'>DELIVERED</th>
                                            </tr>
                                        </thead>
                                        {getPaginatedItems(shippedListings, shippedPage).map((item) => (
                                            <Shipped key={item.orderId} item={item} uid={session?.user.id as string} setUpdatedStatus={setUpdatedStatus} />
                                        ))}
                                    </table>
                                    <div className='mt-4 flex justify-end'>
                                        <div className="flex flex-row items-center">
                                            <button className='rounded-l flex items-center justify-center p-2 h-8 w-8 bg-gray-200 hover:bg-gray-300 active:bg-gray-200 transition duration-100' onClick={() => setShippedPage(prev => Math.max(prev - 1, 1))} disabled={shippedPage === 1}>«</button>
                                            <button className='p-2 h-8 flex items-center justify-center bg-gray-200 text-sm font-semibold cursor-default'>{shippedPage} / {totalShippedPages}</button>
                                            <button className='rounded-r flex items-center justify-center p-2 h-8 w-8 bg-gray-200 hover:bg-gray-300 active:bg-gray-200 transition duration-100' onClick={() => setShippedPage(prev => Math.min(prev + 1, totalShippedPages))} disabled={shippedPage === totalShippedPages}>»</button>
                                        </div>
                                    </div>
                                </>
                            )}
                            {shippedListings.length === 0 && (
                                <div className='text-center text-sm'>
                                    <p className='text-lightModeText font-semibold'>No items being shipped</p>
                                </div>
                            )}
                        </div>
                    )}
                </Card>
            </div>
        </LayoutSubscriptionWrapper>
    )
}

export default Page
