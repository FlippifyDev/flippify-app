"use client";

// Local Imports
import { IEbayOrder } from "@/models/store-data";
import { formatTimeFrom } from "@/utils/format-dates";
import CardListingsAmount from "./CardListingsAndOrdersAmount";
import CardPlatformPieChart from "./CardPlatformDonutChart";
import { retrieveUserOrders } from "@/services/firebase/retrieve";

// External Imports
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import CardSellRate from "./CardSellRate";


const FinancialHubContent = () => {
    const [timeFrom, setTimeFrom] = useState(formatTimeFrom(365));
    const { data: session } = useSession();
    const [orders, setOrders] = useState<IEbayOrder[]>([]);

    // Using useEffect to initialize the chart only once when the component is mounted
    useEffect(() => {
        async function fetchData() {
            if (!session || !session.user.id || !session.user.connectedAccounts.ebay?.ebayAccessToken) {
                return;
            }

            const orders = await retrieveUserOrders(session.user.id, timeFrom, session.user.connectedAccounts.ebay.ebayAccessToken);
            setOrders(orders);  // Set the orders to state
        }

        fetchData();
    }, [session, timeFrom]);

    return (
        <div className="w-full mb-4 grid grid-cols-12 gap-4">
            <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                <CardListingsAmount />
            </div>
            <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                <CardPlatformPieChart orders={orders} />
            </div>
            <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                <CardSellRate orders={orders} />
            </div>
        </div>
    );
};

export default FinancialHubContent;
