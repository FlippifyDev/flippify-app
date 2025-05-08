"use client";

// Local Imports
import NewOrder from "../navbar-tools/NewOrder";
import EditListing from "../navbar-tools/EditListing";
import { IListing, StoreType } from "@/models/store-data";
import { deleteItem } from "@/services/firebase/delete";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import { shortenText } from "@/utils/format";
import UpdateTableField from "./UpdateTableField";
import { formatTableDate } from "@/utils/format-dates";
import { removeCacheData } from "@/utils/cache-helpers";
import { currencySymbols } from "@/config/currency-config";
import { retrieveUserInventory } from "@/services/firebase/retrieve";
import { defaultTimeFrom, inventoryCacheKey } from "@/utils/constants";

// External Imports
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { fetchUserListingsCount, fetchUserStores } from "@/utils/extract-user-data";


const Inventory = () => {
    const { data: session } = useSession();
    const cacheKey = `${inventoryCacheKey}-${session?.user.id}`;

    const currency = session?.user.preferences?.currency || "USD";
    const [addNewOrderModalOpen, setAddNewOrderModalOpen] = useState(false);
    const [editListingModalOpen, setEditListingModalOpen] = useState(false);

    const [fillItem, setFillItem] = useState<IListing>();

    const [listedData, setListedData] = useState<IListing[]>([]);

    // Page Config
    const itemsPerPage = 12;
    const [currentPage, setCurrentPage] = useState(1);
    const totalListings = fetchUserListingsCount(session?.user)
    const totalPages = Math.ceil(totalListings / itemsPerPage);

    const paginatedData = listedData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const [triggerUpdate, setTriggerUpdate] = useState(true);
    const [loading, setLoading] = useState(false);

    const [contextMenu, setContextMenu] = useState<{ mouseX: number; mouseY: number; item: any } | null>(null);

    useEffect(() => {
        const fetchAllInventories = async () => {
            if (!session?.user.authentication?.subscribed || listedData.length >= currentPage * itemsPerPage) return;

            setLoading(true);

            // grab the storeType keys they actually have
            const storeTypes = fetchUserStores(session.user);


            // for each storeType, fetch their inventory in parallel
            const results = await Promise.all(
                storeTypes.map((storeType) => {
                    return retrieveUserInventory({
                        uid: session.user.id as string,
                        timeFrom: defaultTimeFrom,
                        ebayAccessToken: session.user.connectedAccounts?.ebay?.ebayAccessToken ?? "",
                        storeType,
                    }).then((inventory) => [storeType, inventory] as const);
                })
            );
            const lastInventory = results[results.length - 1]?.[1] ?? [];
            setListedData(lastInventory);

            setLoading(false);
            setTriggerUpdate(false);
        };


        if (session?.user.authentication?.subscribed && triggerUpdate) {
            fetchAllInventories();
            setTriggerUpdate(false)
        }
    }, [session?.user, currentPage, listedData, triggerUpdate]);

    // Handle page change
    const handlePageChange = (newPage: number) => {
        setTriggerUpdate(true);
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    function handleDisplayOrderModal(item: IListing) {
        setFillItem(item);
        setAddNewOrderModalOpen(true);
    }


    function handleDisplayEditModal(item: IListing) {
        setFillItem(item);
        setEditListingModalOpen(true);
    }

    useEffect(() => {
        const handleClick = () => {
            handleCloseContextMenu();
        };
        window.addEventListener("click", handleClick);
        return () => window.removeEventListener("click", handleClick);
    }, []);

    const handleContextMenu = (event: React.MouseEvent, item: IListing) => {
        let x = 50;
        let y = 50;
        // Suppress the browser’s own menu on right‐click
        if (event.type === "contextmenu") {
            event.preventDefault();
        } else {
            // Stop this click from reaching the window 'click' listener
            event.stopPropagation()

            x = - 20
        }

        setContextMenu({
            mouseX: event.clientX - x,
            mouseY: event.clientY - y,
            item,
        });
    };

    const handleCloseContextMenu = () => {
        setContextMenu(null);
    };

    async function handleDeleteListing(itemId: string, storeType: StoreType, isAuto: boolean) {
        if (session?.user.id && itemId) {
            await deleteItem({ uid: session.user.id, itemType: "inventory", storeType: storeType, docId: itemId, isAuto: isAuto });
            removeCacheData(cacheKey, itemId);
            setTriggerUpdate(true);
        }
    }

    return (
        <div className="w-full h-full overflow-x-auto">
            <table className="table w-full">
                <thead>
                    <tr className="bg-tableHeaderBackground">
                        <th></th>
                        <th>Product</th>
                        <th>Marketplace</th>
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
                            const { purchase, customTag } = item;
                            let purchasePrice = purchase?.price !== undefined ? purchase.price?.toFixed(2) : "0";
                            if (purchasePrice === undefined) {
                                purchasePrice = "0";
                            }
                            return (
                                <tr
                                    key={`${index}-${item.itemId}`}
                                    onContextMenu={(e) => handleContextMenu(e, item)}
                                    className="cursor-pointer hover:bg-gray-50"
                                >
                                    <td className="min-w-20">
                                        <div
                                            onContextMenu={(e) => handleContextMenu(e, item)}
                                            onClick={(e) => handleContextMenu(e, item)}
                                            className="inline-block"
                                            style={{ cursor: "context-menu" }}
                                        >
                                            <Image
                                                src={item.image ? item.image[0]: ""}
                                                width={100}
                                                height={100}
                                                alt="item image"
                                                loading="lazy"
                                                className="rounded-full w-12 h-12"
                                                style={{ objectFit: "cover" }}
                                            />
                                        </div>
                                    </td>
                                    <td onClick={() => handleDisplayOrderModal(item)}>{shortenText(item.name ?? "N/A")}</td>
                                    <UpdateTableField currentValue={item?.storeType} docId={item.itemId} item={item} docType='inventory' storeType={item.storeType} keyType="storeType" cacheKey={cacheKey} triggerUpdate={() => setTriggerUpdate(true)} />

                                    <td onClick={() => handleDisplayOrderModal(item)}>{item.quantity}</td>
                                    <UpdateTableField currentValue={purchase?.platform} docId={item.itemId} item={item} docType='inventory' storeType={item.storeType} keyType="purchase.platform" cacheKey={cacheKey} triggerUpdate={() => setTriggerUpdate(true)} />
                                    <UpdateTableField currentValue={purchase?.price?.toFixed(2)} docId={item.itemId} item={item} docType='inventory' storeType={item.storeType} keyType="purchase.price" cacheKey={cacheKey} triggerUpdate={() => setTriggerUpdate(true)} />
                                    <td onClick={() => handleDisplayOrderModal(item)}>
                                        {item.price?.toFixed(2)}
                                    </td>
                                    <td className="min-w-32" onClick={() => handleDisplayOrderModal(item)}>{formatTableDate(item.dateListed)}</td>
                                    <UpdateTableField currentValue={customTag} docId={item.itemId} item={item} docType='inventory' storeType={item.storeType} keyType="customTag" cacheKey={cacheKey} triggerUpdate={() => setTriggerUpdate(true)} />
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

            {contextMenu && (
                <ul
                    className="menu menu-sm absolute z-50 bg-deepBlue text-white rounded-lg shadow-md text-sm w-48"
                    style={{ top: contextMenu.mouseY, left: contextMenu.mouseX }}
                >
                    <li
                        className="px-2 py-1 rounded-sm hover:bg-gray-700 cursor-pointer"
                        onClick={() => {
                            handleDisplayEditModal(contextMenu.item);
                            handleCloseContextMenu();
                        }}
                    >
                        Edit
                    </li>
                    <li
                        className="px-2 py-1 rounded-sm hover:bg-gray-700 cursor-pointer"
                        onClick={() => {
                            handleDisplayOrderModal(contextMenu.item);
                            handleCloseContextMenu();
                        }}
                    >
                        Create Order
                    </li>
                    <li
                        className="px-2 py-1 rounded-sm hover:bg-red-700 text-white cursor-pointer"
                        onClick={() => {
                            handleDeleteListing(contextMenu.item.itemId, contextMenu.item.storeType, contextMenu.item.recordType === "automatic");
                            handleCloseContextMenu();
                        }}
                    >
                        Delete Item
                    </li>
                </ul>
            )}

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
                                    {(currentPage - 1) * itemsPerPage + 1}
                                </span>
                                <span>-</span>
                                <span className="font-semibold text-white">
                                    {Math.min(currentPage * itemsPerPage, listedData.length)}
                                </span>
                                <span>of</span>
                                <span className="font-semibold text-white">{listedData.length}</span>
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
                <NewOrder fillItem={fillItem} setDisplayModal={setAddNewOrderModalOpen} />
            )}

            {(editListingModalOpen && fillItem) && (
                <EditListing fillItem={fillItem} setDisplayModal={setEditListingModalOpen} />
            )}
        </div>
    );
};

export default Inventory;