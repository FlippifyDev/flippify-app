"use client";

// Local Imports
import Modal from '../../dom/ui/Modal';
import { IUser } from '@/models/user';
import DateRangeSelector from '../financial-hub/DateRangeSelector';
import { formatTimeFrom } from '@/utils/format-dates';
import { defaultTimeFrom } from '@/utils/constants';
import { fetchUserStores } from '@/utils/extract-user-data';
import { IListing, IOrder } from '@/models/store-data';
import UpdatePreferencesField from './UpdatePreferencesField';
import { retrieveUserInventory, retrieveUserOrders } from '@/services/firebase/retrieve';

// External Imports
import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react';



const Page = () => {
    const { data: session } = useSession();

    const [inventoryData, setInventoryData] = useState<IListing[]>([]);
    const [salesData, setSalesData] = useState<IOrder[]>([]);

    // Preferences
    const [profitAmountTakeHome, setProfitAmountTakeHome] = useState();
    const [profitPercentTakeHome, setProfitPercentTakeHome] = useState();

    const storeTypes = fetchUserStores(session?.user as IUser);

    // General Filters
    const [selectedFilter, setSelectedFilter] = useState(storeTypes[0]);
    const [selectedTimeRange, setSelectedTimeRange] = useState("Last 30 days");
    const [timeFrom, setTimeFrom] = useState(formatTimeFrom(30));
    const [timeTo, setTimeTo] = useState<string>(new Date().toISOString());

    // Invenstment Modal
    const [investmentModalOpen, setInvestmentModalOpen] = useState(false);

    const handleTimeRangeChange = (label: string, days: string) => {
        setSelectedTimeRange(label);

        // Get today's date for timeTo
        const today = new Date();
        let timeFromDate = new Date(); // Default: today
        let timeToDate = today; // Default: today as timeTo

        // Set start and end of the day for the date range
        const setStartOfDay = (date: Date) => {
            date.setHours(0, 0, 0, 0); // Set to start of the day (00:00:00)
        };

        const setEndOfDay = (date: Date) => {
            date.setHours(23, 59, 59, 999); // Set to end of the day (23:59:59)
        };

        switch (label) {
            case "Today":
                timeFromDate = today;
                setStartOfDay(timeFromDate);
                timeToDate = today;
                setEndOfDay(timeToDate);
                break;
            case "Yesterday":
                timeFromDate.setDate(today.getDate() - 1);
                setStartOfDay(timeFromDate);
                timeToDate = new Date(timeFromDate);
                setEndOfDay(timeToDate);
                break;

            case "Last week":
                // Set timeFrom to the start of the previous week (last Monday)
                const lastWeekStart = new Date(today);
                lastWeekStart.setDate(today.getDate() - today.getDay() - 6);
                setStartOfDay(lastWeekStart);
                timeFromDate = lastWeekStart;

                const lastWeekEnd = new Date(lastWeekStart);
                lastWeekEnd.setDate(lastWeekStart.getDate() + 6);
                setEndOfDay(lastWeekEnd);
                timeToDate = lastWeekEnd;
                break;

            case "Last month":
                // Set timeFrom to the first day of the previous month
                timeFromDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                timeToDate = new Date(today.getFullYear(), today.getMonth(), 0); // Last day of last month
                break;

            case "Last year":
                // Set timeFrom to the first day of the previous year
                timeFromDate = new Date(today.getFullYear() - 1, 0, 1); // Jan 1 of last year
                timeToDate = new Date(today.getFullYear() - 1, 11, 31); // Dec 31 of last year
                break;

            case "Last 24 hours":
                timeFromDate.setDate(today.getDate() - 1);
                setStartOfDay(timeFromDate);
                timeToDate = today;
                setEndOfDay(timeToDate);
                break;
            case "Last 7 days":
                timeFromDate.setDate(today.getDate() - parseInt(days));
                setStartOfDay(timeFromDate);
                timeToDate = today;
                setEndOfDay(timeToDate);
                break;
            case "Last 30 days":
                timeFromDate.setDate(today.getDate() - parseInt(days));
                setStartOfDay(timeFromDate);
                timeToDate = today;
                setEndOfDay(timeToDate);
                break;
            case "Last 90 days":
                timeFromDate.setDate(today.getDate() - parseInt(days));
                setStartOfDay(timeFromDate);
                timeToDate = today;
                setEndOfDay(timeToDate);
                break;

            case "Week to date":
                // Start of the current week (Sunday)
                timeFromDate.setDate(today.getDate() - today.getDay());
                setStartOfDay(timeFromDate);
                timeToDate = today;
                setEndOfDay(timeToDate);
                break;

            case "Month to date":
                // Start of the current month
                timeFromDate.setDate(1);
                setStartOfDay(timeFromDate);
                timeToDate = today;
                setEndOfDay(timeToDate);
                break;

            case "Year to date":
                // Start of the current year
                timeFromDate = new Date(today.getFullYear(), 0, 1);
                setStartOfDay(timeFromDate);
                timeToDate = today;
                setEndOfDay(timeToDate);
                break;

            case "All Time":
                // Set timeFrom to a date far in the past
                timeFromDate = new Date(2020, 0, 1);
                setStartOfDay(timeFromDate);
                timeToDate = today;
                setEndOfDay(timeToDate);
                break;
            default:
                timeFromDate.setDate(today.getDate() - parseInt(days));
                setStartOfDay(timeFromDate);
                timeToDate = today;
                setEndOfDay(timeToDate);
        }

        setTimeFrom(timeFromDate.toISOString());
        setTimeTo(timeToDate.toISOString());
    };


    useEffect(() => {
        const fetchSalesData = async () => {
            if (!session) return;


            const orderResults = await Promise.all(
                storeTypes.map((storeType) => {
                    return retrieveUserOrders({
                        uid: session.user.id as string,
                        timeFrom: defaultTimeFrom,
                        storeType,
                    }).then((order) => [storeType, order] as const);
                })
            );
            const orders = orderResults[orderResults.length - 1]?.[1] ?? [];

            if (orders) {
                setSalesData(orders);
            }
        };

        const fetchInventoryData = async () => {
            if (!session) return;

            const inventoryResults = await Promise.all(
                storeTypes.map((storeType) => {
                    return retrieveUserInventory({
                        uid: session.user.id as string,
                        timeFrom: defaultTimeFrom,
                        storeType,
                    }).then((item) => [storeType, item] as const);
                })
            );
            const inventory = inventoryResults[inventoryResults.length - 1]?.[1] ?? [];

            if (inventory) {
                setInventoryData(inventory);
            }

        };

        if (session?.user.authentication?.subscribed) {
            //fetchSalesData();
            //fetchInventoryData();
        }
    }, [session, storeTypes]);

    useEffect(() => {
        if (!session?.user.preferences?.investment) {
            setInvestmentModalOpen(true);
        }
    }, [session?.user.preferences?.investment])

    
    return (
        <div className="relative w-full flex flex-col">
            <div className="w-full py-2 px-4 bg-white border-t flex items-center">
                <div className="w-full flex items-center justify-end gap-2">
                    <div>
                        <DateRangeSelector value={selectedTimeRange} onChange={handleTimeRangeChange} />
                    </div>
                </div>
            </div>

            {investmentModalOpen && (
                <Modal title="Investment Preferences" className="max-w-[21rem] sm:max-w-xl flex-grow" setDisplayModal={setInvestmentModalOpen}>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <UpdatePreferencesField currentValue={profitAmountTakeHome} title="Monthly Profit to Take Home" placeholder="Enter fixed amount" item={session?.user as IUser} keyType='profitAmountTakeHome' />
                        <UpdatePreferencesField currentValue={profitPercentTakeHome} title="Monthly Profit (%) to Take Home" placeholder="Enter percentage" item={session?.user as IUser} keyType='profitPercentTakeHome' />
                    </div>
                </Modal>
            )}
        </div>
    )
}

export default Page
