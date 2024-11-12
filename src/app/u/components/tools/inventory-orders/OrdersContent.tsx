"use client";

import OrderRow from "./OrderRow";
import { useSalesData } from '@/src/hooks/useSalesData';
import { IOrder } from "@/src/models/firebase";
import LayoutSubscriptionWrapper from "../../layout/LayoutSubscriptionWrapper";
import { currencySymbols } from "@/src/config/currency-config";

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
	orders: Array<IOrder>;
}

const OrdersContent: React.FC = () => {
	const [combinedOrderData, setCombinedOrderData] = useState<{ [key: string]: CombinedOrder }>({});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const { data: session } = useSession();
	const customerId = session?.user.customerId as string;
	const ebayAccessToken = session?.user.ebay?.ebayAccessToken;
	const currency = session?.user.currency || "GBP";

	// Use the custom hook to get sales data
	const { salesData } = useSalesData(ebayAccessToken, customerId);

	useEffect(() => {
		if (salesData) {
			formatOrderData(salesData);
		}
	}, [salesData]);

	const formatOrderData = (unformattedOrderData: IOrder[]) => {
		const combinedOrders: { [key: string]: CombinedOrder } = {};

		unformattedOrderData.forEach(order => {
			const { legacyItemId } = order;

			if (!combinedOrders[legacyItemId]) {
				combinedOrders[legacyItemId] = {
					image: order.image,
					itemName: order.itemName,
					quantitySold: order.quantitySold,
					totalSalePrice: order.salePrice,
					totalPurchasePrice: order.purchasePrice,
					totalShippingFees: order.shippingFees,
					totalOtherFees: order.additionalFees,
					orders: [order],
				};
			} else {
				combinedOrders[legacyItemId].quantitySold += order.quantitySold;
				combinedOrders[legacyItemId].totalSalePrice += order.salePrice;
				combinedOrders[legacyItemId].totalShippingFees += order.shippingFees;
				combinedOrders[legacyItemId].totalOtherFees += order.additionalFees;

				if (order.purchasePrice !== null) {
					combinedOrders[legacyItemId].totalPurchasePrice =
						(combinedOrders[legacyItemId].totalPurchasePrice || 0) + (order.purchasePrice || 0);
				}

				combinedOrders[legacyItemId].orders.push(order);
			}
		});

		setCombinedOrderData(combinedOrders);
		setLoading(false);
	};

	const orderDataArray = Object.entries(combinedOrderData).map(([itemId, order]) => ({
		itemId,
		...order
	}));

	return (
		
		<div className="w-full mb-4 py-4 h-full">
			{error ? (
				<div className="text-red-500">
					<p>Error: {error}</p>
					<p>Unable to load inventory or orders. Please try again later.</p>
				</div>
			) : (
				<div className="mx-6 overflow-x-auto">
					<table className="table w-full">
						<thead>
							<tr>
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
											orders={order.orders}
											currency={currency}
											currencySymbols={currencySymbols}
											customerId={customerId}
											image={order.image}
										/>
									);
								})
							) : (
								<tr>
									<td colSpan={12} className="text-center border">No orders available.</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			)}
		</div>

	);
};

export default OrdersContent;
