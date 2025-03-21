"use client";

import OrderRow from "./OrderRow";
import { IEbayOrder } from "@/models/store-data";
import { retrieveUserOrders } from "@/services/firebase/retrieve";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface CombinedOrder {
	image: string;
	itemName: string;
	quantitySold: number;
	totalSalePrice: number;
	totalPurchasePrice: number | null;
	totalShippingFees: number;
	totalOtherFees: number;
    orders: Array<IEbayOrder>;
}

const OrdersContent: React.FC = () => {
	const [combinedOrderData, setCombinedOrderData] = useState<{ [key: string]: CombinedOrder }>({});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const { data: session } = useSession();
	const username = session?.user.username as string;
	const currency = session?.user.preferences.currency || "GBP";

	// Use the custom hook to get sales data
	const [salesData, setSalesData] = useState<IEbayOrder[]>([]);

    useEffect(() => {
        const fetchOrderData = async () => {
            const orders = await retrieveUserOrders(session?.user.id as string, "2023-01-01T00:00:00Z", session?.user.connectedAccounts.ebay?.ebayAccessToken as string);
            if (orders) {
                setSalesData(orders);
            }
        };

        if (session?.user) {
            fetchOrderData();
        }
    }, [session?.user]);

    useEffect(() => {
        if (salesData.length > 0) {
            formatOrderData(salesData);
        }
    }, [salesData]);

    const formatOrderData = (unformattedOrderData: IEbayOrder[]) => {
		const combinedOrders: { [key: string]: CombinedOrder } = {};

		unformattedOrderData.forEach(order => {
			const { legacyItemId } = order;

			if (!combinedOrders[legacyItemId]) {
				combinedOrders[legacyItemId] = {
					image: order.image[0],
					itemName: order.itemName,
					quantitySold: order.sale.quantity,
                    totalSalePrice: order.sale.price,
					totalPurchasePrice: order.purchase.price,
					totalShippingFees: order.shipping.fees,
					totalOtherFees: order.additionalFees,
					orders: [order],
				};
			} else {
                combinedOrders[legacyItemId].quantitySold += order.sale.quantity;
                combinedOrders[legacyItemId].totalSalePrice += order.sale.price;
				combinedOrders[legacyItemId].totalShippingFees += order.shipping.fees;
				combinedOrders[legacyItemId].totalOtherFees += order.additionalFees;

                if (order.purchase.price !== null) {
					combinedOrders[legacyItemId].totalPurchasePrice =
                        (combinedOrders[legacyItemId].totalPurchasePrice || 0) + (order.purchase.price || 0);
				}

				combinedOrders[legacyItemId].orders.push(order);
			}
		});

        setCombinedOrderData((prevData) => {
            if (JSON.stringify(prevData) !== JSON.stringify(combinedOrders)) {
                setLoading(false);
                return combinedOrders;
            }
            return prevData;
        });
		setLoading(false);
	};

	const orderDataArray = Object.entries(combinedOrderData).map(([itemId, order]) => ({
		itemId,
		...order
	}));


	return (
		<div className="w-full">
			{error ? (
				<div className="text-red-500">
					<p>Error: {error}</p>
					<p>Unable to load inventory or orders. Please try again later.</p>
				</div>
			) : (
				<div className="overflow-x-auto">
					<div className="max-h-[800px]">
						<table className="table max-h-[500px] w-full overflow-y-auto">
							<thead>
								<tr className="bg-tableHeaderBackground">
									<th></th>
									<th>Product</th>
									<th>Quantity</th>
									<th>Cost</th>
									<th>Sold For</th>
									<th>Profit</th>
									<th>ROI (%)</th>
								</tr>
							</thead>
							<tbody>
								{orderDataArray.length > 0 ? (
									orderDataArray.map((order, index) => {
										const salePrice = order.totalSalePrice;
										const quantity = order.quantitySold;
										const totalPurchasePrice = order.totalPurchasePrice || null;

										return (
											<OrderRow
												key={index}
												itemId={order.itemId}
												itemName={order.itemName}
												quantitySold={quantity}
												totalSalePrice={salePrice}
												totalPurchasePrice={totalPurchasePrice}
												totalShippingFees={order.totalShippingFees}
												totalOtherFees={order.totalOtherFees}
												currency={currency}
												username={username}
												image={order.image}
											/>
										);
									})
								) : (
									<tr>
										<td colSpan={8} className="text-center border">No orders available.</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</div>
			)}
		</div>
	);
};

export default OrdersContent;
