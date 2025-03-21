// Local Imports
import Card from "./Card"
import { IEbayOrder } from "@/models/store-data"

// External Imports
import { parseISO, differenceInDays, isValid } from "date-fns";
import { useEffect, useState } from "react";


interface ICardAvgTimeToSellProps {
    orders: IEbayOrder[];
}

const CardAvgTimeToSell: React.FC<ICardAvgTimeToSellProps> = ({ orders }) => {
    const [avgDaysToSell, setAvgDaysToSell] = useState<number>(0);

    useEffect(() => {
        if (orders.length === 0) {
            setAvgDaysToSell(0);
            return;
        }

        let totalDaysToSell = 0;
        let soldItemsCount = 0;

        for (const order of orders) {
            const listingDate = parseISO(order.listingDate);
            const saleDate = order.sale.date ? parseISO(order.sale.date) : null;

            // Check if both dates are valid before calculating
            if (isValid(listingDate) && saleDate && isValid(saleDate)) {
                const daysToSell = differenceInDays(saleDate, listingDate);

                // Only consider positive days to avoid issues with incorrect data
                if (daysToSell >= 0) {
                    totalDaysToSell += daysToSell;
                    soldItemsCount++;
                }
            }
        }

        // Calculate average days to sell
        const averageDays =
            soldItemsCount === 0 ? 0 : totalDaysToSell / soldItemsCount;

        setAvgDaysToSell(averageDays);
    }, [orders]);

    return (
        <Card title="Avg Time to Sell">
            <div className="w-full flex flex-col items-center justify-center p-4">
                <p className="text-2xl font-bold text-houseBlue text-center">
                    {avgDaysToSell.toFixed(0)} days
                </p>
            </div>
        </Card>
    );
};

export default CardAvgTimeToSell;