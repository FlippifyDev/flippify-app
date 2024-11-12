import { database, ref, update, get } from "@/src/lib/firebase/client";
import { IOrder } from "@/src/models/firebase";
import { formatTableDate } from "@/src/utils/format-table-date";

import React, { useState, useEffect } from "react";
import Image from "next/image";

interface OrderRowSchema {
	itemId: string;
	itemName: string;
	quantitySold: number;
	totalSalePrice: number;
	totalPurchasePrice: number | null;
	totalShippingFees: number;
	totalOtherFees: number;
	orders: IOrder[];
	currency: string;
	currencySymbols: { [key: string]: string };
	customerId: string | undefined;
	image: string
}



const OrderRow: React.FC<OrderRowSchema> = ({
	itemId,
	itemName,
	quantitySold,
	totalSalePrice,
	totalPurchasePrice,
	totalShippingFees,
	totalOtherFees,
	orders,
	currency,
	currencySymbols,
	customerId,
	image
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
	const [purchaseDate, setPurchaseDate] = useState<string>("");
	const [purchasePrice, setPurchasePrice] = useState<number | null>(null);
	const [purchasePlatform, setPurchasePlatform] = useState<string>("");
	const [customTag, setCustomTag] = useState<string>("");



	const saveSalesDataToLocalStorage = (updatedOrders: IOrder[]) => {
		if (customerId) {
			localStorage.setItem(`salesData-${customerId}`, JSON.stringify(updatedOrders));
		}
	};

	useEffect(() => {
		// Use localStorage hook to load and save data
		const loadSalesDataFromLocalStorage = () => {
			const salesData = localStorage.getItem(`salesData-${customerId}`);
			if (salesData) {
				return JSON.parse(salesData);
			}
			return [];
		};
		
		// Load existing sales data from localStorage when the component mounts
		const salesData = loadSalesDataFromLocalStorage();
		if (salesData && salesData.length > 0) {
			// Ensure the selected orders are consistent with what's stored
			setSelectedOrders(salesData.map((order: IOrder) => order.orderId));
		}
	}, [customerId]);

	const toggleOrderDetails = () => {
		// Toggle the visibility of the smaller table
		setIsOpen((prev) => !prev);
	};

	// Sort orders by sale date
	const sortedOrders = [...orders].sort((a, b) => {
		const dateA = new Date(a.saleDate).getTime();
		const dateB = new Date(b.saleDate).getTime();

		// Descending order
		return dateB - dateA;
	});

	const calculateProfit = (
		argSalePrice: number,
		argQuantity: number,
		argPurchasePrice: number | null,
		argTotalFees: number
	) => {
		if (!argPurchasePrice) {
			return null;
		}
		const cost = (argPurchasePrice * argQuantity) + argTotalFees;

		return (argSalePrice * argQuantity) - cost;
	};

	const calculateROI = (
		argSalePrice: number,
		argQuantity: number,
		argPurchasePrice: number | null,
		argTotalFees: number
	) => {
		if (!argPurchasePrice) {
			return null;
		}
		const cost = (argPurchasePrice * argQuantity) + argTotalFees;
		const profit = calculateProfit(argSalePrice, argQuantity, argPurchasePrice, argTotalFees);

		if (!profit) {
			return null;
		}

		return (profit * 100 / cost).toFixed(2);
	};

	// Handle checkbox selection
	const handleCheckboxChange = (orderId: string) => {
		setSelectedOrders((prev) => {
			if (prev.includes(orderId)) {
				return prev.filter((id) => id !== orderId); // Deselect
			} else {
				return [...prev, orderId]; // Select
			}
		});
	};

	// Update selected orders in Firebase
	const updateSelectedOrders = async () => {
		if (selectedOrders.length === 0) {
			alert("No orders selected for update.");
			return;
		}

		const updates: { [key: string]: any } = {};
		const updatedOrders: IOrder[] = [];

		for (const orderId of selectedOrders) {
			const orderRef = ref(database, `/orders/${customerId}/${orderId}`);

			try {
				// Get the current data for the order
				const snapshot = await get(orderRef);
				if (snapshot.exists()) {
					const currentOrderData = snapshot.val();

					// Create an updates object with only defined fields
					const updatedOrderData: { [key: string]: any } = {};

					// Only update if new data is provided
					if (purchaseDate) {
						updatedOrderData.purchaseDate = purchaseDate; // Update purchaseDate if provided
					}

					if (purchasePrice !== null) {
						updatedOrderData.purchasePrice = purchasePrice; // Update purchasePrice if provided
					}

					if (purchasePlatform) {
						updatedOrderData.purchasePlatform = purchasePlatform; // Update purchasePlatform if provided
					}

					if (customTag) {
						updatedOrderData.customTag = customTag; // Update customTag if provided
					}

					// If there's anything to update, merge with existing data
					if (Object.keys(updatedOrderData).length > 0) {
						updates[`/orders/${customerId}/${orderId}`] = {
							...currentOrderData, // Keep existing data
							...updatedOrderData, // Add only the new updates
						};
					}
				} else {
					console.error(`No data found for order ID ${orderId}`);
				}
			} catch (error) {
				console.error("Error fetching order data from Firebase:", error);
				alert("Error fetching order data. Please try again later.");
				return;
			}
		}

		// Apply updates to Firebase
		try {
			if (Object.keys(updates).length > 0) {
				// Ensure we have updates to apply
				await update(ref(database), updates);
				// Update local storage after Firebase update
				saveSalesDataToLocalStorage(updatedOrders);
				// Reset the state after update
				setSelectedOrders([]);
				setPurchaseDate("");
				setPurchasePrice(null);
				setPurchasePlatform("");
			} else {
				alert("No updates made, please check your inputs.");
			}
		} catch (error) {
			console.error("Error updating orders in Firebase:", error);
			alert("Error updating orders. Please try again later.");
		}
	};

	return (
		<>
			{/* Main Row */}
			<tr
				onClick={toggleOrderDetails}
				className="cursor-pointer hover:bg-gray-100"
			>
				<td><Image src={image} width={100} height={100} alt={"image"} className="rounded-full w-16 h-16" style={{ objectFit: 'cover' }} /></td>
				<td>{itemName}</td>
				<td>{quantitySold}</td>
				<td>
					{totalPurchasePrice !== null
						? `${currencySymbols[currency]}${(totalPurchasePrice + totalShippingFees + totalOtherFees).toFixed(2)}`
						: "N/A"}
				</td>
				<td>
					{currencySymbols[currency]}
					{totalSalePrice.toFixed(2)}
				</td>
				<td>
					{
						(() => {
							const profit = calculateProfit(totalSalePrice, 1, totalPurchasePrice, totalShippingFees + totalOtherFees);
							return profit !== null
								? `${currencySymbols[currency]}${profit.toFixed(2)}`
								: "N/A";
						})()
					}
				</td>
				<td>
					{
						(() => {
							const roi = calculateROI(totalSalePrice, 1, totalPurchasePrice, totalShippingFees + totalOtherFees);
							return roi !== null
								? `${roi}%`
								: "N/A";
						})()
					}
				</td>
			</tr>

			{/* Conditional Rendering of Order Details */}
			{isOpen && (
				<tr>
					<td colSpan={7} className="ml-4">
						<div>
							<table className="table w-full">
								<thead>
									<tr>
										<th>Select</th>
										<th>Order ID</th>
										<th>Quantity</th>
										<th>Sale Date</th>
										<th>Shipping Fees</th>
										<th>Other Fees</th>
										<th>Purchase Price</th>
										<th>Sale Price</th>
										<th>Profit</th>
										<th>ROI (%)</th>
										<th>Purchase Date</th>
										<th>Purchase Platform</th>
										<th>Tag</th>
										<th>Buyer</th>
									</tr>
								</thead>
								<tbody>
									{sortedOrders.map((order, index) => (
										<tr key={index}>
											<td>
												<input
													type="checkbox"
													checked={selectedOrders.includes(order.orderId)}
													onChange={() => handleCheckboxChange(order.orderId)}
												/>
											</td>
											<td>{order.orderId}</td>
											<td>{order.quantitySold}</td>
											<td>{formatTableDate(order.saleDate)}</td>
											<td>
												{currencySymbols[currency]}
												{order.shippingFees.toFixed(2)}
											</td>
											<td>
												{currencySymbols[currency]}
												{order.additionalFees.toFixed(2)}
											</td>
											<td>
												{currencySymbols[currency]}
												{(order.purchasePrice || 0).toFixed(2)}
											</td>
											<td>
												{currencySymbols[currency]}
												{order.salePrice.toFixed(2)}
											</td>
											<td>
												{
													(() => {
														const profit = calculateProfit(
															order.salePrice,
															order.quantitySold,
															order.purchasePrice,
															order.shippingFees + order.additionalFees
														);
														return profit !== null
															? `${currencySymbols[currency]}${profit.toFixed(2)}`
															: "N/A";
													})()
												}
											</td>
											<td>
												{
													(() => {
														const roi = calculateROI(
															order.salePrice,
															order.quantitySold,
															order.purchasePrice,
															order.shippingFees + order.additionalFees
														);
														return roi !== null
															? `${roi}%`
															: "N/A";
													})()
												}
											</td>
											<td>{formatTableDate(order.purchaseDate)}</td>
											<td>{order.purchasePlatform || "N/A"}</td>
											<td>{order.customTag || "N/A"}</td>
											<td>{order.buyerUsername}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>

						{/* Input fields for updating selected orders */}
						{selectedOrders.length > 0 && (
							<div className="mt-4">
								<h3 className="text-lg font-semibold">
									Update Selected Orders
								</h3>
								<div>
									<label>Purchase Date:</label>
									<input
										type="date"
										value={purchaseDate}
										onChange={(e) => setPurchaseDate(e.target.value)}
										className="border p-1 rounded"
									/>
								</div>
								<div>
									<label>Purchase Price:</label>
									<input
										type="number"
										value={purchasePrice || ""}
										onChange={(e) => setPurchasePrice(Number(e.target.value))}
										className="border p-1 rounded"
									/>
								</div>
								<div>
									<label>Purchase Platform:</label>
									<input
										type="text"
										value={purchasePlatform}
										onChange={(e) => setPurchasePlatform(e.target.value)}
										className="border p-1 rounded"
									/>
								</div>
								<div>
									<label>Custom Tag:</label>
									<input
										type="text"
										value={customTag}
										onChange={(e) => setCustomTag(e.target.value)}
										className="border p-1 rounded"
									/>
								</div>
								<button
									onClick={updateSelectedOrders}
									className="bg-blue-500 text-white py-1 px-4 rounded mt-2"
								>
									Update Orders
								</button>
							</div>
						)}
					</td>
				</tr>
			)}
		</>
	);
};

export default OrderRow;
