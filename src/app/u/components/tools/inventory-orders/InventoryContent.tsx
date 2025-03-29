"use client";

// Local Imports
import Alert from "@/app/components/Alert";
import { firestore } from "@/lib/firebase/config";
import { formatTableDate } from "@/utils/format-dates";
import { currencySymbols } from "@/config/currency-config";
import { IEbayInventoryItem } from "@/models/store-data";
import { ebayInventoryCacheKey } from "@/utils/constants";
import { retrieveUserInventory } from "@/services/firebase/retrieve";
import { getCachedTimes, setCachedData } from "@/utils/cache-helpers";

// External Imports
import { useEffect, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { useSession } from "next-auth/react";
import Image from "next/image";


const InventoryContent = () => {
    const { data: session } = useSession();
    const defaultTimeFrom = "2023-01-01T00:00:00Z";
    const currency = session?.user.preferences.currency || "GBP";

    const [listedData, setListedData] = useState<IEbayInventoryItem[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 12;

    // Edit state
    const [editedPlatform, setEditedPlatform] = useState<string | null>("");
    const [editedCustomTag, setEditedCustomTag] = useState<string | null>("");
    const [editedPurchasePrice, setEditedPurchasePrice] = useState<string | null>("");
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editingType, setEditingType] = useState<string | null>(null);

    // Handle alert messages
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [isAlertVisible, setIsAlertVisible] = useState<boolean>(false);

    // Total number of pages
    const totalPages = Math.ceil(listedData.length / ordersPerPage);

    useEffect(() => {
        const fetchInventoryData = async () => {
            const inventory = await retrieveUserInventory(
                session?.user.id as string,
                defaultTimeFrom,
                session?.user.connectedAccounts.ebay?.ebayAccessToken as string,
            );
            if (inventory) {
                setListedData(inventory);
            }
        };

        if (session?.user) {
            fetchInventoryData();
        }
    }, [session?.user]);

    // Handle page change
    const handlePageChange = (newPage: number) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, index: number, type: string) => {
        if (e.key === "Enter") {
            saveChange(index, type);
        } else if (e.key === "Escape") {
            if (type === "platform") {
                setEditedPlatform(listedData[index].purchase?.platform ?? "");
            } else if (type === "customTag") {
                setEditedCustomTag(listedData[index].customTag ?? "");
            } else if (type === "purchasePrice") {
                setEditedPurchasePrice(`${listedData[index].purchase?.price ?? ""}`);
            }
            setEditingType(null);
        }
    };


    const saveChange = async (index: number, type: string) => {
        const updatedListings = [...listedData];
        const cacheKey = `${ebayInventoryCacheKey}-${session?.user.id}`;
        const cachedTimes = getCachedTimes(cacheKey);

        if (updatedListings[index].purchase === undefined) {
            updatedListings[index].purchase = {
                platform: null,
                price: null,
                quantity: null,
                date: null
            };
        }

        if (type === "platform") {
            if (editedPlatform === listedData[index].purchase?.platform) {
                return;
            }
            updatedListings[index].purchase.platform = editedPlatform;
        } else if (type === "customTag") {
            if (editedCustomTag === listedData[index].customTag) {
                return;
            }
            updatedListings[index].customTag = editedCustomTag;
        } else if (type === "purchasePrice") {
            if (!editedPurchasePrice) {
                updatedListings[index].purchase.price = 0
            } else if (Number(editedPurchasePrice) === listedData[index].purchase?.price) {
                return;
            } else if (!isNaN(parseFloat(editedPurchasePrice)) && isFinite(Number(editedPurchasePrice))) {
                updatedListings[index].purchase.price = Number(editedPurchasePrice);
            } 
        }

        try {
            // Determine the field to update based on the type
            const updateFields: { [key: string]: any } = {};

            if (type === "platform") {
                updateFields["purchase.platform"] = editedPlatform;
            } else if (type === "customTag") {
                updateFields["customTag"] = editedCustomTag;
            } else if (type === "purchasePrice") {
                updateFields["purchase.price"] = updatedListings[index].purchase?.price;
            }

            const orderDocRef = doc(
                firestore,
                'inventory',
                session?.user.id as string,
                'ebay',
                updatedListings[index].itemId
            );

            // Perform the update
            await updateDoc(orderDocRef, updateFields);
            setCachedData(
                cacheKey, 
                updatedListings,
                cachedTimes?.cacheTimeFrom,
                cachedTimes?.cacheTimeTo 
            );
            
            setEditingType(null);
            setEditingIndex(null);
            setEditedPlatform(null);
            setEditedCustomTag(null);
            setEditedPurchasePrice(null);
            setListedData(updatedListings);
        } catch (error) {
            console.error("Error updating platform:", error);
            setAlertMessage("Failed to update platform.");
            setIsAlertVisible(true);
        }
    };

    // Paginate data for current page
    const paginatedData = listedData.slice(
        (currentPage - 1) * ordersPerPage,
        currentPage * ordersPerPage
    );


    function handlePlatformInput(index: number, item: IEbayInventoryItem) {
        setTimeout(() => {
            setEditingIndex(index);
            setEditedPlatform(item.purchase?.platform ?? "");
            setEditingType("platform");
        }, 0);
    }

    function handlePurchasePriceInput(index: number, purchasePrice: string) {
        setTimeout(() => {
            setEditingIndex(index);
            setEditedPurchasePrice(purchasePrice);
            setEditingType("purchasePrice");
        }, 0);
    }

    function handleCustomTagInput(index: number, item: IEbayInventoryItem) {
        setTimeout(() => {
            setEditingIndex(index);
            setEditedCustomTag(item.customTag ?? "");
            setEditingType("customTag");
        }, 0);
    }

    return (
        <div className="w-full h-full overflow-x-auto">
            <Alert
                message={alertMessage || ""}
                visible={isAlertVisible}
                onClose={() => setIsAlertVisible(false)}
            />
            <table className="table w-full">
                <thead>
                    <tr className="bg-tableHeaderBackground">
                        <th></th>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Purchase Platform</th>
                        <th>Cost ({currencySymbols[currency]})</th>
                        <th>Listed Price ({currencySymbols[currency]})</th>
                        <th>Date Listed</th>
                        <th>Custom Tag</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedData.length > 0 ? (
                        paginatedData.map((item, index) => {
                            let purchasePrice = item.purchase?.price !== undefined ? item.purchase.price?.toFixed(2) : "0";
                            if (purchasePrice === undefined) {
                                purchasePrice = "0";
                            }
                            return (
                                <tr
                                    key={index}
                                    className=""
                                >
                                    <td>
                                        <Image
                                            src={item.image[0]}
                                            width={100}
                                            height={100}
                                            alt={"image"}
                                            loading="lazy"
                                            className="rounded-full w-12 h-12"
                                            style={{ objectFit: "cover" }}
                                        />
                                    </td>
                                    <td>{item.itemName}</td>
                                    <td>{item.quantity}</td>
                                    <td
                                        className="cursor-pointer transition duration-200"
                                    >
                                        <input
                                            onFocus={() => handlePlatformInput(index, item)}
                                            onClick={() => handlePlatformInput(index, item)}
                                            type="text"
                                            value={(editingIndex === index && editingType === "platform") ? editedPlatform ?? "" : item.purchase?.platform ?? ""}
                                            onChange={(e) => setEditedPlatform(e.target.value)}
                                            onBlur={() => saveChange(index, "platform")}
                                            onKeyDown={(e) => handleKeyPress(e, index, "platform")}
                                            className="focus:border hover:bg-gray-100 text-black hover:cursor-pointer hover:select-none w-full focus:outline-none focus:ring-2 focus:ring-gray-500 rounded border-none text-sm"
                                        />
                                    </td>
                                    <td
                                        className="cursor-pointer transition duration-200"
                                    >
                                        <input
                                            onFocus={() => handlePurchasePriceInput(index, purchasePrice)}
                                            onClick={() => handlePurchasePriceInput(index, purchasePrice)}
                                            type="text"
                                            value={(editingIndex === index && editingType === "purchasePrice") ? editedPurchasePrice ?? "" : purchasePrice ?? ""}
                                            onChange={(e) => setEditedPurchasePrice(e.target.value)}
                                            onBlur={() => saveChange(index, "purchasePrice")}
                                            onKeyDown={(e) => handleKeyPress(e, index, "purchasePrice")}
                                            className="focus:border hover:bg-gray-100 text-black hover:cursor-pointer hover:select-none w-full focus:outline-none focus:ring-2 focus:ring-gray-500 rounded border-none text-sm"
                                        />
                                    </td>
                                    <td>
                                        {item.price.toFixed(2)}
                                    </td>
                                    <td>{formatTableDate(item.dateListed)}</td>
                                    <td
                                        className="cursor-pointer transition duration-200"
                                    >
                                        <input
                                            onFocus={() => handleCustomTagInput(index, item)}
                                            onClick={() => handleCustomTagInput(index, item)}
                                            type="text"
                                            value={(editingIndex === index && editingType === "customTag") ? editedCustomTag ?? "" : item.customTag ?? ""}
                                            onChange={(e) => setEditedCustomTag(e.target.value)}
                                            onBlur={() => saveChange(index, "customTag")}
                                            onKeyDown={(e) => handleKeyPress(e, index, "customTag")}
                                            className="focus:border hover:bg-gray-100 text-black hover:cursor-pointer hover:select-none w-full focus:outline-none focus:ring-2 focus:ring-gray-500 rounded border-none text-sm"
                                        />
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan={12} className="text-center border">
                                No inventory available.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-end mt-4">
                    <div className="flex items-center space-x-2">
                        {/* Prev Button */}
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`px-5 h-10 text-sm font-medium text-white bg-gray-800 hover:bg-gray-900 rounded-s ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                                }`}
                        >
                            Prev
                        </button>

                        {/* Show entries info dynamically */}
                        <div className="flex items-center justify-center bg-gray-900 px-4 h-10 text-sm text-white space-x-1">
                            <span className="font-semibold text-white">
                                {Math.min(
                                    (currentPage - 1) * ordersPerPage + 1,
                                    listedData.length
                                )}
                            </span>
                            <span>-</span>
                            <span className="font-semibold text-white">
                                {Math.min(currentPage * ordersPerPage, listedData.length)}
                            </span>
                            <span>of</span>
                            <span className="font-semibold text-white">{listedData.length}</span>
                        </div>

                        {/* Next Button */}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`px-5 h-10 text-sm font-medium text-white bg-gray-800 hover:bg-gray-900 rounded-e ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
                                }`}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InventoryContent;
