"use client";

// Local Imports
import { IEbayOrder } from '@/models/store-data';

// External Imports
import { parseISO, differenceInDays, isValid } from "date-fns"
import { useState, useEffect } from 'react';
import Card from './Card';


interface ICardAvgTimeToListProps {
    orders: IEbayOrder[];
}

const CardAvgTimeToList:React.FC<ICardAvgTimeToListProps> = ({ orders }) => {
    const [avgDaysToList, setAvgDaysToList] = useState<number>(0);

    useEffect(() => {
        if (orders.length === 0) {
            setAvgDaysToList(0);
            return;
        }

        let totalDaysToSell = 0;
        let soldItemsCount = 0;

        for (const order of orders) {
            const purchaseDate = order.purchase.date ? parseISO(order.purchase.date) : null;
            const listingDate = parseISO(order.listingDate);

            // Check if both dates are valid before calculating
            if (isValid(listingDate) && purchaseDate && isValid(purchaseDate)) {
                const daysToList = differenceInDays(purchaseDate, listingDate);

                // Only consider positive days to avoid issues with incorrect data
                if (daysToList >= 0) {
                    totalDaysToSell += daysToList;
                    soldItemsCount++;
                }
            }
        }

        // Calculate average days to sell
        const averageDays =
            soldItemsCount === 0 ? 0 : totalDaysToSell / soldItemsCount;

        setAvgDaysToList(averageDays);
    }, [orders]);

    return (
        <Card title="Avg Time to List">
            <div className="w-full flex flex-col items-center justify-center p-4">
                <p className="text-2xl font-bold text-houseBlue text-center">
                    {avgDaysToList < 1 ? "< 1 day" : `${avgDaysToList.toFixed(0)} days`}
                </p>
            </div>
        </Card>
    )
}

export default CardAvgTimeToList
