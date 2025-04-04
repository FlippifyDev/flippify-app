"use client";

// Local Imports
import Alert from "@/app/components/Alert";
import UpdateFields from "./UpdateFields";
import OrderInfoCard from "./OrderInfoCard";
import { firestore } from "@/lib/firebase/config";
import { IEbayOrder } from "@/models/store-data";
import { shortenText } from "@/utils/format";
import LoadingAnimation from "../../dom/ui/LoadingAnimation";
import { formatTableDate } from "@/utils/format-dates";
import { currencySymbols } from "@/config/currency-config";
import { retrieveUserOrders } from "@/services/firebase/retrieve";
import { getCachedData, setCachedData } from "@/utils/cache-helpers";
import { ebayOrderCacheKey, MAX_INPUT_LENGTH } from "@/utils/constants";
import { validatePriceInput, validateTextInput } from "@/utils/input-validation";

// External Imports
import { collection, doc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const OrderDetails = () => {
    const { data: session } = useSession();
    const searchParams = useSearchParams();
    const itemName = searchParams?.get("itemName") as string;
    const [orders, setOrders] = useState<IEbayOrder[]>([]);
    const [salesData, setSalesData] = useState<IEbayOrder[]>([]);
    const username = session?.user.username as string;
    const currency = session?.user.preferences.currency || "USD";
    const currencySymbol = currencySymbols[currency];
    const [customTag, setCustomTag] = useState<string>("");
    const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
    const [purchaseDate, setPurchaseDate] = useState<string>("");
    const [purchasePrice, setPurchasePrice] = useState<string>("");
    const [purchasePlatform, setPurchasePlatform] = useState<string>("");
    const router = useRouter();
    const [fadeIn, setFadeIn] = useState(false);

    // Handle alert messages
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [isAlertVisible, setIsAlertVisible] = useState<boolean>(false);

    const [editedPlatform, setEditedPlatform] = useState<string | null>("");
    const [editedCustomTag, setEditedCustomTag] = useState<string | null>("");
    const [editedPurchasePrice, setEditedPurchasePrice] = useState<string | null>("");
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editingType, setEditingType] = useState<string | null>(null);
    const [ordersUpdated, setOrdersUpdated] = useState<boolean>(false);
    const [orderIdtoIndex, setOrderIdtoIndex] = useState<{ [key: string]: number }>({});

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
        if (salesData && itemName && !ordersUpdated) {
            const matchingOrders = salesData.filter((o, index) => {
                const isMatch = o.itemName === itemName;
                if (isMatch) {
                    setOrderIdtoIndex((prev) => ({ ...prev, [o.orderId]: index }));
                }
                return isMatch;
            });
            setOrders(matchingOrders);
            setOrdersUpdated(false);
        }
    }, [salesData, itemName, ordersUpdated]);

    if (orders.length === 0) {
        return <LoadingAnimation text="Loading items" type="stack-loader"/>;
    }

    // Handle orders click
    const handleOrdersClick = () => {
        router.push(`/u/${username}/tools/inventory-orders#orders`);
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
        let purchaseCount = 0; 
        let totalDaysToSell = 0;  
        let validSaleCount = 0;

        // Loop through each order to accumulate totals
        orders.forEach((order) => {
            const { sale, additionalFees, purchase, shipping } = order;

            totalQuantitySold += sale.quantity;
            totalShippingFees += shipping.fees;
            totalSalePrice += sale.price + shipping.fees;
            totalAdditionalFees += additionalFees;

            if (purchase.price === null) {
                purchase.price = 0;
            }

            totalPurchasePrice += purchase.price;
            purchaseCount += 1;

            // Calculate profit for each order and accumulate
            const profit = sale.price - (purchase.price || 0) - shipping.fees - additionalFees;
            totalProfit += profit;

            // Calculate ROI for each order if purchase price exists and accumulate
            if (purchase.price > 0) {
                totalROI += (profit / purchase.price) * 100;
            }

            // Calculate time to sell (in days) if both purchaseDate and saleDate exist
            if (purchase.date && sale.date) {
                const purchaseDateObj = new Date(purchase.date);
                const saleDateObj = new Date(sale.date);
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

    const image = orders[0].image[0];
    const totals = calculateTotals();

    const updateSelectedOrders = async () => {
        if (selectedOrders.length === 0) {
            setAlertMessage("No orders selected for update.");
            setIsAlertVisible(true);
            return;
        }

        const cacheKey = `${ebayOrderCacheKey}-${session?.user.id}`; // Define cache key

        let updatedOrders: IEbayOrder[] = [...orders];

        // Optimistically update the UI by directly modifying the orders state
        updatedOrders = updatedOrders.map((order) => {
            if (selectedOrders.includes(order.orderId)) {
                return {
                    ...order,
                    purchase: {
                        ...order.purchase,
                        date: purchaseDate || order.purchase.date,
                        price: purchasePrice ? +purchasePrice : order.purchase.price,
                        platform: purchasePlatform || order.purchase.platform,
                    },
                    customTag: customTag || order.customTag || null,
                };
            }
            return order;
        });


        try {
            // Check if there are any updates
            if (updatedOrders.length > 0) {
                const ordersCollectionRef = collection(firestore, 'orders', session?.user.id as string, 'ebay');

                // Loop through selected orders and update each document individually
                const updatePromises = selectedOrders.map(async (orderId) => {
                    const orderToUpdate = updatedOrders.find((order) => order.orderId === orderId);
                    if (orderToUpdate) {
                        const orderDocRef = doc(ordersCollectionRef, orderToUpdate.orderId); // Reference to individual order
                        const updateData = {
                            "purchase.date": orderToUpdate.purchase.date,
                            "purchase.price": orderToUpdate.purchase.price,
                            "purchase.platform": orderToUpdate.purchase.platform,
                            customTag: orderToUpdate.customTag,
                        };
                        await updateDoc(orderDocRef, updateData);
                    }
                });

                // Wait for all updates to complete
                await Promise.all(updatePromises);

                // Retrieve the current cache data
                const currentCacheDict = getCachedData(cacheKey) as IEbayOrder[];
                const currentCache = currentCacheDict.values();

                // Merge updated orders with the current cache, preserving the existing ones
                const mergedOrdersDict = {
                    ...Object.fromEntries(currentCache.map(order => [order.orderId, order])),
                    ...Object.fromEntries(updatedOrders.map(order => [order.orderId, order]))
                };

                // After successful Firestore update, update the cache with the merged data
                setCachedData(cacheKey, mergedOrdersDict);

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

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, index: number, type: string) => {
        if (e.key === "Enter") {
            saveChange(index, type);
        } else if (e.key === "Escape") {
            if (type === "platform") {
                setEditedPlatform(orders[index].purchase?.platform ?? "");
            } else if (type === "customTag") {
                setEditedCustomTag(orders[index].customTag ?? "");
            } else if (type === "purchasePrice") {
                setEditedPurchasePrice(`${currencySymbols[currency]}${orders[index].purchase?.price ?? ""}`);
            }
            setEditingType(null);
        }
    };

    const saveChange = async (index: number, type: string) => {
        const updatedOrders = [...orders];
        const cacheKey = `${ebayOrderCacheKey}-${session?.user.id}`;

        if (type === "platform") {
            if (editedPlatform === orders[index].purchase.platform) {
                return;
            }
            updatedOrders[index].purchase.platform = editedPlatform;
        } else if (type === "customTag") {
            if (editedCustomTag === orders[index].customTag) {
                return;
            }
            updatedOrders[index].customTag = editedCustomTag;
        } else if (type === "purchasePrice") {
            if (!editedPurchasePrice) {
                return;
            }
            if (Number(editedPurchasePrice.replace(currencySymbols[currency], "")) === orders[index].purchase.price) {
                return;
            }
            updatedOrders[index].purchase.price = Number(editedPurchasePrice.replace(currencySymbols[currency], ""));
        }

        try {
            // Determine the field to update based on the type
            const updateFields: { [key: string]: any } = {};

            if (type === "platform") {
                updateFields["purchase.platform"] = editedPlatform;
            } else if (type === "customTag") {
                updateFields["customTag"] = editedCustomTag;
            } else if (type === "purchasePrice") {
                updateFields["purchase.price"] = updatedOrders[index].purchase.price;
            }

            const orderDocRef = doc(
                firestore,
                'orders',
                session?.user.id as string,
                'ebay',
                updatedOrders[index].orderId
            );

            // Perform the update
            await updateDoc(orderDocRef, updateFields);
            // Update the salesData with the modified order
            salesData[orderIdtoIndex[updatedOrders[index].orderId]] = updatedOrders[index];

            // Convert salesData to a dictionary where orderId is the key
            const salesDataDict = {
                ...Object.fromEntries(salesData.map(order => [order.orderId, order]))
            };

            setCachedData(cacheKey, salesDataDict); 

            setEditingType(null);
            setEditingIndex(null);
            setOrders(updatedOrders);
        } catch (error) {
            console.error("Error updating platform:", error);
            setAlertMessage("Failed to update platform.");
            setIsAlertVisible(true);
        }
    };

    function handlePlatformInput(index: number, order: IEbayOrder) {
        setEditingIndex(index);
        setEditedPlatform(order.purchase.platform)
        setEditingType("platform");
    }

    function handlePurchasePriceInput(index: number, purchasePrice: string) {
        setEditingIndex(index);
        setEditedPurchasePrice(purchasePrice);
        setEditingType("purchasePrice");
    }

    function handleCustomTagInput(index: number, order: IEbayOrder) {
        setEditingIndex(index);
        setEditedCustomTag(order.customTag);
        setEditingType("customTag");
    }

    function handleInput(value: string, type: string) {
        if (value.length > MAX_INPUT_LENGTH) return;

        if (type === "purchaseDate") {
            setPurchaseDate(value);
        } else if (type === "purchasePrice") {
            validatePriceInput(value, setEditedPurchasePrice);
        } else if (type === "platform") {
            validateTextInput(value, setEditedPlatform);
        } else if (type === "customTag") {
            validateTextInput(value, setEditedCustomTag);
        }
    }

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
                        <li>{shortenText(itemName, 20)}</li>
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
                <div className="overflow-x-auto">
                    <table className="table bg-white">
                        <thead>
                            <tr className="text-left bg-tableHeaderBackground shadow-sm">
                                <th>Select</th>
                                <th>Order ID</th>
                                <th>Purchase Date</th>
                                <th>Sale Date</th>
                                <th>Quantity Sold</th>
                                <th>Additional Fees ({currencySymbols[currency]})</th>
                                <th>Shipping Fees ({currencySymbols[currency]})</th>
                                <th>Purchased For ({currencySymbols[currency]})</th>
                                <th>Sold For ({currencySymbols[currency]})</th>
                                <th>Profit ({currencySymbols[currency]})</th>
                                <th>ROI (%)</th>
                                <th>Purchased At</th>
                                <th>Purchased By</th>
                                <th>Tag</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order, index) => {
                                const { orderId, sale, purchase, shipping, additionalFees } = order;
                                const profit = (sale.price + shipping.fees) - (purchase.price || 0) - shipping.fees - additionalFees;
                                const roi = purchase.price && purchase.price > 0 ? ((profit / purchase.price) * 100).toFixed(2) : "0";
                                
                                const purchasePrice = purchase.price !== null ? purchase.price.toFixed(2) : "0";
                                return (
                                    <tr key={index} className="hover:bg-gray-100">
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
                                        <td>{shortenText(orderId, 10)}</td>
                                        <td className="min-w-32">{formatTableDate(order.purchase.date)}</td>
                                        <td className="min-w-32">{formatTableDate(order.sale.date)}</td>
                                        <td>{sale.quantity}</td>
                                        <td>{additionalFees.toFixed(2)}</td>
                                        <td>{shipping.fees.toFixed(2)}</td>
                                        <td
                                            className="cursor-pointer transition duration-200"
                                        >
                                            <input
                                                onFocus={() => handlePurchasePriceInput(index, purchasePrice)}
                                                onClick={() => handlePurchasePriceInput(index, purchasePrice)}
                                                type="text"
                                                value={(editingIndex === index && editingType === "purchasePrice") ? editedPurchasePrice ?? '0' : purchasePrice}
                                                onChange={(e) => handleInput(e.target.value, "purchasePrice")}
                                                onBlur={() => saveChange(index, "purchasePrice")}
                                                onKeyDown={(e) => handleKeyPress(e, index, "purchasePrice")}
                                                className="min-w-24 focus:border text-black hover:cursor-pointer hover:select-none w-full focus:outline-none focus:ring-2 focus:ring-gray-500 rounded border-none text-sm"
                                            />
                                        </td>
                                        <td>{(sale.price + shipping.fees).toFixed(2)}</td>
                                        <td>{profit.toFixed(2)}</td>
                                        <td>{roi}%</td>
                                        <td
                                            className="cursor-pointer transition duration-200"
                                        >
                                            <input
                                                onFocus={() => handlePlatformInput(index, order)}
                                                onClick={() => handlePlatformInput(index, order)}
                                                type="text"
                                                value={(editingIndex === index && editingType === "platform") ? editedPlatform ?? "" : order.purchase.platform ?? ""}
                                                onChange={(e) => handleInput(e.target.value, "platform")}
                                                onBlur={() => saveChange(index, "platform")}
                                                onKeyDown={(e) => handleKeyPress(e, index, "platform")}
                                                className="min-w-32 focus:border text-black hover:cursor-pointer hover:select-none w-full focus:outline-none focus:ring-2 focus:ring-gray-500 rounded border-none text-sm"
                                            />
                                        </td>
                                        <td>{order.sale.buyerUsername}</td>
                                        <td
                                            className="cursor-pointer transition duration-200"
                                        >
                                            <input
                                                onFocus={() => handleCustomTagInput(index, order)}
                                                onClick={() => handleCustomTagInput(index, order)}
                                                type="text"
                                                value={(editingIndex === index && editingType === "customTag") ? editedCustomTag ?? "" : order.customTag ?? ""}
                                                onChange={(e) => handleInput(e.target.value, "customTag")}
                                                onBlur={() => saveChange(index, "customTag")}
                                                onKeyDown={(e) => handleKeyPress(e, index, "customTag")}
                                                className="min-w-32 focus:border text-black hover:cursor-pointer hover:select-none w-full focus:outline-none focus:ring-2 focus:ring-gray-500 rounded border-none text-sm"
                                            />
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
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
