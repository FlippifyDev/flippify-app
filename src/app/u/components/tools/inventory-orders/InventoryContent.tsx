"use client";

// Local Imports
import Alert from "@/app/components/Alert";
import { firestore } from "@/lib/firebase/config";
import { shortenText } from "@/utils/format";
import { formatTableDate } from "@/utils/format-dates";
import { currencySymbols } from "@/config/currency-config";
import { updateCacheData } from "@/utils/cache-helpers";
import { IEbayInventoryItem } from "@/models/store-data";
import { retrieveUserInventory } from "@/services/firebase/retrieve";
import { validatePriceInput, validateTextInput } from "@/utils/input-validation";
import { ebayInventoryCacheKey, MAX_INPUT_LENGTH } from "@/utils/constants";

// External Imports
import { useEffect, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { useSession } from "next-auth/react";
import Image from "next/image";
import NewEbayOrderForm from "../navbar-tools/NewEbayOrder";
import LoadingSpinner from "@/app/components/LoadingSpinner";


const InventoryContent = () => {
    const { data: session } = useSession();
    const defaultTimeFrom = "2023-01-01T00:00:00Z";
    const currency = session?.user.preferences.currency || "GBP";
    const [addNewOrderModalOpen, setAddNewOrderModalOpen] = useState(false);

    const [fillItem, setFillItem] = useState<IEbayInventoryItem>();

    const [listedData, setListedData] = useState<IEbayInventoryItem[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

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
    const totalPages = Math.ceil(listedData.length / itemsPerPage);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchInventoryData = async () => {
            setLoading(true);
            const inventory = await retrieveUserInventory(
                session?.user.id as string,
                defaultTimeFrom,
                session?.user.connectedAccounts.ebay?.ebayAccessToken as string,
            );
            if (inventory) {
                setListedData(inventory);
            }
            setLoading(false);
        };

        if (session?.user.authentication.subscribed) {
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

            updateCacheData(cacheKey, updatedListings[index]);

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
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
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

    function handleChange(value: string, type: string) {
        if (value.length > MAX_INPUT_LENGTH) return

        if (type === "platform") {
            validateTextInput(value, setEditedPlatform);
        } else if (type === "customTag") {
            validateTextInput(value, setEditedCustomTag);
        } else if (type === "purchasePrice") {
            validatePriceInput(value, setEditedPurchasePrice);
        }
    }


    function handleDisplayModal(item: IEbayInventoryItem) {
        setFillItem(item);
        setAddNewOrderModalOpen(true);
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
                                    className="cursor-pointer hover:bg-gray-100 transition duration-100"
                                >
                                    <td
                                        onClick={() => handleDisplayModal(item)}
                                        className="min-w-20">
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
                                    <td onClick={() => handleDisplayModal(item)}>{shortenText(item.itemName)}</td>
                                    <td onClick={() => handleDisplayModal(item)}>{item.quantity}</td>
                                    <td
                                        className="cursor-pointer transition duration-200"
                                    >
                                        <input
                                            onFocus={() => handlePlatformInput(index, item)}
                                            onClick={() => handlePlatformInput(index, item)}
                                            type="text"
                                            value={(editingIndex === index && editingType === "platform") ? editedPlatform ?? "" : item.purchase?.platform ?? ""}
                                            onChange={(e) => handleChange(e.target.value, "platform")}
                                            onBlur={() => saveChange(index, "platform")}
                                            onKeyDown={(e) => handleKeyPress(e, index, "platform")}
                                            className="min-w-24 focus:border text-black hover:cursor-pointer hover:select-none w-full focus:outline-none focus:ring-2 focus:ring-gray-500 rounded border-none text-sm"
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
                                            onChange={(e) => handleChange(e.target.value, "purchasePrice")}
                                            onBlur={() => saveChange(index, "purchasePrice")}
                                            onKeyDown={(e) => handleKeyPress(e, index, "purchasePrice")}
                                            className="min-w-24 focus:border text-black hover:cursor-pointer hover:select-none w-full focus:outline-none focus:ring-2 focus:ring-gray-500 rounded border-none text-sm"
                                        />
                                    </td>
                                    <td onClick={() => handleDisplayModal(item)}>
                                        {item.price.toFixed(2)}
                                    </td>
                                    <td className="min-w-32" onClick={() => handleDisplayModal(item)}>{formatTableDate(item.dateListed)}</td>
                                    <td
                                        className="cursor-pointer transition duration-200"
                                    >
                                        <input
                                            onFocus={() => handleCustomTagInput(index, item)}
                                            onClick={() => handleCustomTagInput(index, item)}
                                            type="text"
                                            value={(editingIndex === index && editingType === "customTag") ? editedCustomTag ?? "" : item.customTag ?? ""}
                                            onChange={(e) => handleChange(e.target.value, "customTag")}
                                            onBlur={() => saveChange(index, "customTag")}
                                            onKeyDown={(e) => handleKeyPress(e, index, "customTag")}
                                            className="min-w-32 focus:border text-black hover:cursor-pointer hover:select-none w-full focus:outline-none focus:ring-2 focus:ring-gray-500 rounded border-none text-sm"
                                        />
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan={12}>
                                <div className="w-full flex justify-center items-center">
                                    {loading ? <LoadingSpinner /> : "No inventory available."}
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="fixed bottom-0 right-0 p-2">
                    <div className="flex flex-col items-center">
                        {/* Pagination Buttons */}
                        <div className="inline-flex mt-2 xs:mt-0">
                            {/* Prev Button */}
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`flex items-center justify-center px-5 h-12 text-sm font-medium text-white bg-gray-800 hover:bg-gray-900 rounded-s`}
                            >
                                Prev
                            </button>
                            {/* Show entries info dynamically */}
                            <div className="flex items-center bg-gray-900 justify-center px-4 h-12 text-sm text-white space-x-1">
                                <span className="font-semibold text-white">
                                    {Math.min((currentPage - 1) * itemsPerPage + 1, listedData.length)}
                                </span>
                                <span>-</span>
                                <span className="font-semibold text-white">
                                    {Math.min(currentPage * itemsPerPage, paginatedData.length)}
                                </span>
                                <span>of</span>
                                <span className="font-semibold text-white">{paginatedData.length}</span>
                            </div>
                            {/* Next Button */}
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={`flex items-center justify-center px-5 h-12 text-sm font-medium text-white bg-gray-800 hover:bg-gray-900 rounded-e`}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {addNewOrderModalOpen && (
                <NewEbayOrderForm fillItem={fillItem} setDisplayModal={setAddNewOrderModalOpen} />
            )}
        </div>
    );
};

export default InventoryContent;
