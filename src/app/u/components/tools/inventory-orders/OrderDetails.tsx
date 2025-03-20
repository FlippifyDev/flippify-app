"use client";

// Local Imports
import Alert from "@/app/components/Alert";
import UpdateFields from "./UpdateFields";
import OrderInfoCard from "./OrderInfoCard";
import { firestore } from "@/lib/firebase/config";
import { IEbayOrder } from "@/models/store-data";
import { getCachedData, setCachedData } from "@/utils/cache-helpers";
import { formatTableDate } from "@/utils/format-dates";
import { currencySymbols } from "@/config/currency-config";
import { retrieveUserOrders } from "@/services/firebase/retrieve";

// External Imports
import { collection, doc, updateDoc } from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";

const OrderDetails = () => {
    const { data: session } = useSession();
    const params = useParams();
    const orderId = params?.["order-id"];
    const [orders, setOrders] = useState<IEbayOrder[]>([]);
    const [salesData, setSalesData] = useState<IEbayOrder[]>([]);
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
        router.push(`/u/${username}/inventory-orders#orders`);
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
            totalShippingFees += shippingFees;
            totalSalePrice += salePrice + shippingFees;
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

        const cacheKey = `salesData-${session?.user.id}`; // Define cache key
        const cacheExpirationTime = 1000 * 60 * 5; // 5 minutes cache expiration

        let updatedOrders: IEbayOrder[] = [...orders]; // Copy the current orders to modify them

        // Optimistically update the UI by directly modifying the orders state
        updatedOrders = updatedOrders.map((order) => {
            if (selectedOrders.includes(order.orderId)) {
                return {
                    ...order,
                    purchaseDate: purchaseDate || order.purchaseDate,
                    purchasePrice: purchasePrice !== null ? +purchasePrice : order.purchasePrice, // Ensure purchasePrice is a number
                    purchasePlatform: purchasePlatform || order.purchasePlatform,
                    customTag: customTag || order.customTag || null,
                };
            }
            return order;
        });


        try {
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
                        customTag: orderToUpdate.customTag ?? null,
                    };
                }
            });

            // Check if there are any updates
            if (Object.keys(updates).length > 0) {
                const ordersCollectionRef = collection(firestore, 'orders', session?.user.id as string, 'ebay');

                // Loop through selected orders and update each document individually
                const updatePromises = selectedOrders.map(async (orderId) => {
                    const orderToUpdate = updatedOrders.find((order) => order.orderId === orderId);
                    if (orderToUpdate) {
                        const orderDocRef = doc(ordersCollectionRef, orderToUpdate.orderId); // Reference to individual order
                        await updateDoc(orderDocRef, {
                            purchaseDate: new Date(orderToUpdate.purchaseDate ?? "").toISOString(),
                            purchasePrice: orderToUpdate.purchasePrice,
                            purchasePlatform: orderToUpdate.purchasePlatform,
                            customTag: orderToUpdate.customTag,
                        });
                    }
                });

                // Wait for all updates to complete
                await Promise.all(updatePromises);

                // Retrieve the current cache data
                const currentCache = getCachedData(cacheKey, cacheExpirationTime);

                // Merge updated orders with the current cache, preserving the existing ones
                const mergedOrders = currentCache.map((cachedOrder: any) => {
                    const updatedOrder = updatedOrders.find((order) => order.orderId === cachedOrder.orderId);
                    if (updatedOrder) {
                        // If the order exists in the updated orders, merge the updated data with the cached order
                        return { ...cachedOrder, ...updatedOrder };
                    }
                    return cachedOrder; // Keep unchanged orders intact
                });

                // Add any new updated orders that aren't in the cache yet
                updatedOrders.forEach((updatedOrder) => {
                    const isOrderInCache = currentCache.some((cachedOrder: any) => cachedOrder.orderId === updatedOrder.orderId);
                    if (!isOrderInCache) {
                        // If the updated order is not in the cache, add it to the mergedOrders
                        mergedOrders.push(updatedOrder);
                    }
                });

                // After successful Firestore update, update the cache with the merged data
                setCachedData(cacheKey, mergedOrders, cacheExpirationTime);

                setAlertMessage("Orders successfully updated.");
                setIsAlertVisible(true);

                // Clear the selected orders to uncheck all checkboxes
                setSelectedOrders([]);
                setOrders(updatedOrders); // Update the UI with the merged orders
            } else {
                throw new Error("No updates to be made.");
            }
        } catch (error) {
            console.error("Error updating orders:", error);
            setAlertMessage("Error updating orders.");
            setIsAlertVisible(true);
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
                            const profit = (salePrice + shippingFees) - (purchasePrice || 0) - shippingFees - additionalFees;
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
                                    <td>{currencySymbols[currency]}{(salePrice + shippingFees).toFixed(2)}</td>
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
