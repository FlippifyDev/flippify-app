"use client";

// Local Imports
import Card from '../../dom/ui/Card';
import Shipped from './Shipped';
import { IOrder } from '@/models/store-data';
import IconButton from '../../dom/ui/IconButton';
import ReadyToShip from './ReadyToShip';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import { defaultTimeFrom } from '@/utils/constants';
import { retrieveUserOrders } from '@/services/firebase/retrieve';
import LayoutSubscriptionWrapper from '../../layout/LayoutSubscriptionWrapper';

// External Imports
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react';
import { fetchUserStores } from '@/utils/extract-user-data';


const ITEMS_PER_PAGE = 5;

const Page = () => {
    const { data: session } = useSession();

    const [loading, setLoading] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true);
    const [updatedStatus, setUpdatedStatus] = useState(false);

    const [shippedListings, setShippedListings] = useState<IOrder[]>([]);
    const [activeListings, setActiveListings] = useState<IOrder[]>([]);

    const [activePage, setActivePage] = useState(1);
    const [shippedPage, setShippedPage] = useState(1);

    const totalActivePages = Math.ceil(activeListings.length / ITEMS_PER_PAGE);
    const totalShippedPages = Math.ceil(shippedListings.length / ITEMS_PER_PAGE);

    function sortOrderData(inventoryData: IOrder[]) {
        const active = inventoryData.filter(item => item.status === 'Active');
        const shipped = inventoryData.filter(item => item.status === 'InProcess');

        setShippedListings(shipped);
        setActiveListings(active);
    }

    useEffect(() => {
        const fetchOrderData = async () => {
            if (!session) return;

            if (initialLoad) {
                setLoading(true);
            }

            const storeTypes = fetchUserStores(session.user);

            const salesResult = await Promise.all(
                storeTypes.map((storeType) => {
                    return retrieveUserOrders({
                        uid: session.user.id as string,
                        timeFrom: defaultTimeFrom,
                        ebayAccessToken: session.user.connectedAccounts?.ebay?.ebayAccessToken ?? "",
                        storeType,
                    }).then((order) => [storeType, order] as const);
                })
            );
            const sales = salesResult[salesResult.length - 1]?.[1] ?? [];

            if (sales) {
                sortOrderData(sales);
            }
            if (initialLoad) {
                setLoading(false);
                setInitialLoad(false);
            }
        };

        if (session?.user.authentication?.subscribed) {
            fetchOrderData();
        }
    }, [session, updatedStatus, initialLoad]);

    const getPaginatedItems = (list: IOrder[], page: number) => {
        const start = (page - 1) * ITEMS_PER_PAGE;
        return list.slice(start, start + ITEMS_PER_PAGE);
    };

    return (
        <LayoutSubscriptionWrapper anySubscriptions={["admin", "member"]}>
            {session?.user.authentication?.subscribed ? (
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
                                                    <th>Item</th>
                                                    <th>Quantity</th>
                                                    <th>Sale Date</th>
                                                    <th>Ship In</th>
                                                    <th className='text-center'>Mark Shipped</th>
                                                </tr>
                                            </thead>
                                            {getPaginatedItems(activeListings, activePage).map((item) => (
                                                <ReadyToShip key={item.orderId} item={item} uid={session?.user.id as string} setUpdatedStatus={setUpdatedStatus} />
                                            ))}
                                        </table>
                                        <div className='mt-4 flex justify-end'>
                                            <div className="join h-10">
                                                <button className='join-item btn' onClick={() => setActivePage(prev => Math.max(prev - 1, 1))} disabled={activePage === 1}>«</button>
                                                <button className="join-item btn">{activePage} / {totalActivePages}</button>
                                                <button className='join-item btn' onClick={() => setActivePage(prev => Math.min(prev + 1, totalActivePages))} disabled={activePage === totalActivePages}>»</button>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {activeListings.length === 0 && (
                                    <div className='text-center'>
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
                                                    <th>Item</th>
                                                    <th>Quantity</th>
                                                    <th className='text-center'>Mark Not Shipped</th>
                                                    <th className='text-center'>Mark Delivered</th>
                                                </tr>
                                            </thead>
                                            {getPaginatedItems(shippedListings, shippedPage).map((item) => (
                                                <Shipped key={item.orderId} item={item} uid={session?.user.id as string} setUpdatedStatus={setUpdatedStatus} />
                                            ))}
                                        </table>
                                        <div className='mt-4 flex justify-end'>
                                            <div className="join h-10">
                                                <button className='join-item btn' onClick={() => setShippedPage(prev => Math.max(prev - 1, 1))} disabled={shippedPage === 1}>«</button>
                                                <button className="join-item btn">{shippedPage} / {totalShippedPages}</button>
                                                <button className='join-item btn' onClick={() => setShippedPage(prev => Math.min(prev + 1, totalShippedPages))} disabled={shippedPage === totalShippedPages}>»</button>
                                            </div>
                                        </div>
                                    </>
                                )}
                                {shippedListings.length === 0 && (
                                    <div className='text-center'>
                                        <p className='text-lightModeText font-semibold'>No items being shipped</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </Card>
                </div>
            ) : (
                <div className="relative flex flex-col w-full min-h-full">
                    <IconButton heading="No account connected" animationType="hover-box" subtitle="Go to your profile to connect your eBay account" buttonText="Go to profile" redirect="profile" />
                </div>
            )}

        </LayoutSubscriptionWrapper>
    )
}

export default Page
