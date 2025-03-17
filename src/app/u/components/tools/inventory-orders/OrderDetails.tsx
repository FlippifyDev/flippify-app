"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IEbayOrder } from "@/models/user";
import { currencySymbols } from "@/config/currency-config";
import { useSession } from "next-auth/react";
import Image from "next/image";
import OrderInfoCard from "./OrderInfoCard";
import { formatTableDate } from "@/utils/format-dates";
import { get, ref, update } from "firebase/database"
import UpdateFields from "./UpdateFields";
import { setCachedData } from "@/utils/cache-helpers";
import Alert from "@/app/components/Alert";
import { firestore } from "@/lib/firebase/config";
import { retrieveUserRefById } from "@/services/firebase/retrieve";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const OrderDetails = () => {
    const { data: session } = useSession();
    const params = useParams();
    const orderId = params?.["order-id"];
    const [orders, setOrders] = useState<IEbayOrder[]>([]);
    const salesData = Object.values(session?.user.orders.ebay ?? {}).filter((o) => o.legacyItemId === orderId);
    const username = session?.user.username as string;
    const currency = session?.user.preferences.currency || "GBP";
    const currencySymbol = currencySymbols[currency];
    const [customTag, setCustomTag] = useState<string>("");
    const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
    const [purchaseDate, setPurchaseDate] = useState<string>("");
    const [purchasePrice, setPurchasePrice] = useState<number | string>("");
    const [purchasePlatform, setPurchasePlatform] = useState<string>("");
    const router = useRouter();
    const [fadeIn, setFadeIn] = useState(false);

    // Handle alert messages
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [isAlertVisible, setIsAlertVisible] = useState<boolean>(false);

    // This effect runs when selectedOrders length changes
    useEffect(() => {
        if (selectedOrders.length > 0) {
            setFadeIn(true); // Trigger fade-in effect when selectedOrders has items
        } else {
            setFadeIn(false); // Trigger fade-out effect when selectedOrders is empty
        }
    }, [selectedOrders.length]);

    useEffect(() => {
        if (salesData && orderId && orders.length === 0) {
            const matchingOrders = salesData.filter((o) => o.legacyItemId === orderId);
            setOrders(matchingOrders);
        }
    }, [salesData, orderId, orders]);

    if (orders.length === 0) {
        return <p>Loading order details...</p>;
    }

    // Handle orders click
    const handleOrdersClick = () => {
        router.push(`/u/${username}/inventory-orders?display=orders`);
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


    const calculateTotals = () => {
        // Initialize totals
        let totalQuantitySold = 0;
        let totalSalePrice = 0;
        let totalPurchasePrice = 0;
        let totalShippingFees = 0;
        let totalAdditionalFees = 0;
        let totalProfit = 0;
        let totalROI = 0;
        let purchaseCount = 0;  // Track number of purchases for accurate ROI calculation
        let totalDaysToSell = 0;  // Variable to track the total number of days to sell
        let validSaleCount = 0;  // Track number of valid sales for time to sell calculation

        // Loop through each order to accumulate totals
        orders.forEach((order) => {
            const { quantitySold, salePrice, purchasePrice, shippingFees, additionalFees, purchaseDate, saleDate } = order;

            totalQuantitySold += quantitySold;
            totalSalePrice += salePrice;
            totalShippingFees += shippingFees;
            totalAdditionalFees += additionalFees;

            // Check if purchase price is valid before adding it to total
            if (purchasePrice) {
                totalPurchasePrice += purchasePrice;
                purchaseCount += 1;
            }

            // Calculate profit for each order and accumulate
            const profit = salePrice - (purchasePrice || 0) - shippingFees - additionalFees;
            totalProfit += profit;

            // Calculate ROI for each order if purchase price exists and accumulate
            if (purchasePrice && purchasePrice > 0) {
                totalROI += (profit / purchasePrice) * 100;
            }

            // Calculate time to sell (in days) if both purchaseDate and saleDate exist
            if (purchaseDate && saleDate) {
                const purchaseDateObj = new Date(purchaseDate);
                const saleDateObj = new Date(saleDate);
                const timeToSell = (saleDateObj.getTime() - purchaseDateObj.getTime()) / (1000 * 3600 * 24); // Difference in days

                if (!isNaN(timeToSell)) {
                    totalDaysToSell += timeToSell;
                    validSaleCount += 1;
                }
            }
        });

        // Average ROI by dividing by the number of orders with a valid purchase price
        const averageROI = purchaseCount > 0 ? (totalROI / purchaseCount).toFixed(2) : "0";

        // Average time to sell, if there are valid sales
        const averageTimeToSell = validSaleCount > 0 ? (totalDaysToSell / validSaleCount).toFixed(0) : "N/A";

        return {
            totalQuantitySold: totalQuantitySold.toFixed(0),
            totalSalePrice: totalSalePrice.toFixed(2),
            totalPurchasePrice: totalPurchasePrice.toFixed(2),
            totalShippingFees: totalShippingFees.toFixed(2),
            totalAdditionalFees: totalAdditionalFees.toFixed(2),
            totalProfit: totalProfit.toFixed(2),
            averageROI,  // Rounded ROI as a string to 2 decimal places
            averageTimeToSell,  // Average time to sell in days or "N/A" if no valid sales
        };
    };


    const itemName = orders[0].itemName;
    const image = orders[0].image[0];
    const totals = calculateTotals();

    const updateSelectedOrders = async () => {
        if (selectedOrders.length === 0) {
            setAlertMessage("No orders selected for update.");
            setIsAlertVisible(true);
            return;
        }

        let updatedOrders: IEbayOrder[] = [...orders]; // Copy the current orders to modify them
        const previousOrdersState: IEbayOrder[] = [...orders]; // Store previous state for rollback in case of failure

        // Optimistically update the UI by directly modifying the orders state
        updatedOrders = updatedOrders.map((order) => {
            if (selectedOrders.includes(order.orderId)) {
                return {
                    ...order,
                    purchaseDate: purchaseDate || order.purchaseDate,
                    purchasePrice: purchasePrice !== null ? +purchasePrice : order.purchasePrice, // Ensure purchasePrice is a number
                    purchasePlatform: purchasePlatform || order.purchasePlatform,
                    customTag: customTag || order.customTag,
                };
            }
            return order;
        });

        const userDocRef = doc(firestore, 'users', session?.user.id ?? "");

        try {
            // Get the user's current orders
            const currentOrders = session?.user.orders.ebay ?? {};

            // Prepare the update object for Firestore
            const updates: { [key: string]: any } = {};

            // Loop through selected orders to prepare the updates
            selectedOrders.forEach((orderId) => {
                const orderToUpdate = updatedOrders.find((order) => order.orderId === orderId);
                if (orderToUpdate) {
                    updates[`orders.ebay.${orderToUpdate.orderId}`] = {
                        ...orderToUpdate,
                        purchaseDate: orderToUpdate.purchaseDate,
                        purchasePrice: orderToUpdate.purchasePrice,
                        purchasePlatform: orderToUpdate.purchasePlatform,
                        customTag: orderToUpdate.customTag,
                    };
                }
            });

            // Check if there are any updates
            if (Object.keys(updates).length > 0) {
                // Update the Firestore document with the new orders data
                await updateDoc(userDocRef, updates);

                // After successful Firestore update, update the cache
                setCachedData(`salesData-${session?.user.id}`, updatedOrders);

                setAlertMessage("Orders successfully updated.");
                setIsAlertVisible(true);

                // Clear the selected orders to uncheck all checkboxes
                setSelectedOrders([]);
                setOrders(updatedOrders); // Update the UI with the modified orders
            } else {
                throw new Error("No updates to be made.");
            }
        } catch (error) {
            console.error("Error updating orders in Firestore:", error);
            setAlertMessage("Error updating orders. Please try again later.");
            setIsAlertVisible(true);

            // Revert the UI to the previous state in case of failure
            setOrders(previousOrdersState);
        }
    };


    return (
        <div className="rounded-lg text-orderPageText space-y-2">
            <Alert
                message={alertMessage || ""}
                visible={isAlertVisible}
                onClose={() => setIsAlertVisible(false)}
            />
            <div className="bg-white rounded-lg">
                <div className="breadcrumbs text-sm p-2">
                    <ul>
                        <li onClick={handleOrdersClick}><a>Orders</a></li>
                        <li>{orderId}</li>
                    </ul>
                </div>
                <div className="flex items-center gap-2 h-full p-4">
                    <Image src={image} width={200} height={200} alt={"image"} className="rounded-full w-20 h-20" loading="lazy" style={{ objectFit: 'cover' }} />
                    <h1 className="text-xl font-bold leading-tight">{itemName}</h1>
                </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 2xl:grid-cols-8 gap-2 w-full">
                <OrderInfoCard title="Costs" value={`${currencySymbol}${totals.totalPurchasePrice}`} />
                <OrderInfoCard title="ROI" value={`${totals.averageROI}%`} />
                <OrderInfoCard title="Additional Fees" value={`${currencySymbol}${totals.totalAdditionalFees}`} />
                <OrderInfoCard title="Shipping Fees" value={`${currencySymbol}${totals.totalShippingFees}`} />
                <OrderInfoCard title="Quantity" value={totals.totalQuantitySold} />
                <OrderInfoCard title="Revenue" value={`${currencySymbol}${totals.totalSalePrice}`} />
                <OrderInfoCard title="Profit" value={`${currencySymbol}${totals.totalProfit}`} />
                <OrderInfoCard title="Avg Sell Time" value={`${totals.averageTimeToSell} days`} />
            </div>
            <div className="bg-white rounded-lg">
                <h1 className="p-4 font-semibold">Product Data</h1>
                <table className="table bg-white">
                    <thead>
                        <tr className="text-left bg-tableHeaderBackground shadow-sm">
                            <th>Select</th>
                            <th>Order ID</th>
                            <th>Purchase Date</th>
                            <th>Sale Date</th>
                            <th>Quantity Sold</th>
                            <th>Additional Fees</th>
                            <th>Shipping Fees</th>
                            <th>Cost</th>
                            <th>Sold For</th>
                            <th>Profit</th>
                            <th>ROI (%)</th>
                            <th>Purchased At</th>
                            <th>Purchased By</th>
                            <th>Tag</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order, index) => {
                            const { orderId, quantitySold, salePrice, purchasePrice, shippingFees, additionalFees } = order;
                            const profit = salePrice - (purchasePrice || 0) - shippingFees - additionalFees;
                            const roi = purchasePrice && purchasePrice > 0 ? ((profit / purchasePrice) * 100).toFixed(2) : "0";
                            return (
                                <tr key={index} className="cursor-pointer hover:bg-gray-100">
                                    <td>
                                        <label className="flex items-center cursor-pointer relative">
                                            <input
                                                onChange={() => handleCheckboxChange(order.orderId)}
                                                type="checkbox"
                                                className="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-slate-800 checked:border-slate-800 focus:ring-0"
                                                id="check"
                                                checked={selectedOrders.includes(order.orderId)}
                                            />
                                        </label>
                                    </td>
                                    <td>{orderId}</td>
                                    <td>{formatTableDate(order.purchaseDate)}</td>
                                    <td>{formatTableDate(order.saleDate)}</td>
                                    <td>{quantitySold}</td>
                                    <td>{currencySymbols[currency]}{additionalFees.toFixed(2)}</td>
                                    <td>{currencySymbols[currency]}{shippingFees.toFixed(2)}</td>
                                    <td>{currencySymbols[currency]}{purchasePrice?.toFixed(2) || "N/A"}</td>
                                    <td>{currencySymbols[currency]}{salePrice.toFixed(2)}</td>
                                    <td>{currencySymbols[currency]}{profit.toFixed(2)}</td>
                                    <td>{roi}%</td>
                                    <td>{order.purchasePlatform}</td>
                                    <td>{order.buyerUsername}</td>
                                    <td>{order.customTag}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {selectedOrders.length > 0 && (
                <UpdateFields
                    fadeIn={fadeIn}
                    purchaseDate={purchaseDate}
                    setPurchaseDate={setPurchaseDate}
                    purchasePrice={purchasePrice}
                    setPurchasePrice={setPurchasePrice}
                    purchasePlatform={purchasePlatform}
                    setPurchasePlatform={setPurchasePlatform}
                    customTag={customTag}
                    setCustomTag={setCustomTag}
                    updateSelectedOrders={updateSelectedOrders}
                />
            )}
        </div>

    );
};

export default OrderDetails;
