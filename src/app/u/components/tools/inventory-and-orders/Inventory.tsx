"use client";

// Local Imports
import NewOrder from "../navbar-tools/NewOrder";
import EditListing from "../navbar-tools/EditListing";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import { shortenText } from "@/utils/format";
import UpdateTableField from "./UpdateTableField";
import { formatTableDate } from "@/utils/format-dates";
import { currencySymbols } from "@/config/currency-config";
import { retrieveInventory } from "@/services/bridges/retrieve";
import { IListing, StoreType } from "@/models/store-data";
import { fetchUserListingsCount } from "@/utils/extract-user-data";
import { defaultTimeFrom, inventoryCacheKey } from "@/utils/constants";

// External Imports
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { deleteItem } from "@/services/firebase/delete";
import { retrieveIdToken } from "@/services/firebase/retrieve";
import { inventoryCol } from "@/services/firebase/constants";
import { removeCacheData } from "@/utils/cache-helpers";
import NoResultsFound from "../../dom/ui/NoResultsFound";


const Inventory = ({ searchText }: { searchText?: string }) => {
    const { data: session } = useSession();
    const uid = session?.user.id as string;
    const cacheKey = `${inventoryCacheKey}-${uid}`

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
    const [nextPage, setNextPage] = useState(false);

    const [triggerUpdate, setTriggerUpdate] = useState(true);
    const [loading, setLoading] = useState(false);
    const [slowLoading, setSlowLoading] = useState(false);

    const [contextMenu, setContextMenu] = useState<{ mouseX: number; mouseY: number; item: any } | null>(null);

    useEffect(() => {
        setTriggerUpdate(true);
    }, [searchText])

    useEffect(() => {
        const fetchInventory = async () => {
            if (!searchText && (!session?.user.authentication?.subscribed || listedData.length >= currentPage * itemsPerPage)) return;

            setLoading(true);

            const items = await retrieveInventory({ uid, timeFrom: defaultTimeFrom, searchText, searchFields: ["customTag", "itemId", "storeType", "name", "purchase.platform", "storageLocation", "sku"], pagenate: true, nextPage });
            setListedData(items ?? [])

            setLoading(false);
            setTriggerUpdate(false);
        };


        if ((session?.user.authentication?.subscribed && triggerUpdate) || nextPage) {
            fetchInventory();
            setTriggerUpdate(false);
            setNextPage(false);
        }
    }, [session?.user, currentPage, listedData, triggerUpdate, uid, nextPage, searchText]);

    // Handle page change
    const handlePageChange = (newPage: number) => {
        setTriggerUpdate(true);
        if (newPage > currentPage) {
            setNextPage(true);
        }
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

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (loading) {
            // As soon as “loading” becomes true, start a 10s timer
            timer = setTimeout(() => {
                setSlowLoading(true);
            }, 10_000);
        } else {
            // If loading is false (i.e. data arrived / spinner is removed), clear and reset
            setSlowLoading(false);
        }
        return () => {
            clearTimeout(timer);
        };
    }, [loading]);

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

    async function handleDeleteListing(item: IListing, storeType: StoreType, isAuto: boolean, createdAt?: string | null) {
        const idToken = await retrieveIdToken();
        if (!idToken) return;

        await deleteItem({ idToken, rootCol: inventoryCol, subCol: storeType, item })

        removeCacheData(cacheKey, item.itemId as string);
        setTriggerUpdate(true);
    }

    return (
        <div className="w-full h-full overflow-x-auto">
            <table className="table w-full">
                <thead>
                    <tr className="bg-tableHeaderBackground">
                        <th></th>
                        <th>PRODUCT</th>
                        <th>MARKETPLACE</th>
                        <th>QUANTITY</th>
                        <th>PURCHASE PLATFORM</th>
                        <th>COST ({currencySymbols[currency]})</th>
                        <th>LISTED PRICE ({currencySymbols[currency]})</th>
                        <th>DATE LISTED</th>
                        <th>STORAGE</th>
                        <th>SKU</th>
                        <th>TAG</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedData.length > 0 ? (
                        paginatedData.map((item, index) => {
                            const { purchase, customTag, storageLocation, sku } = item;
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
                                    <td className={`min-w-20 ${index + 1 === paginatedData.length ? "rounded-bl-xl" : ""}`}>
                                        <div
                                            onContextMenu={(e) => handleContextMenu(e, item)}
                                            onClick={(e) => handleContextMenu(e, item)}
                                            className="inline-block"
                                            style={{ cursor: "context-menu" }}
                                        >
                                            <Image
                                                src={item.image ? item.image[0] : ""}
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
                                    <UpdateTableField currentValue={item?.storeType} docId={item.itemId} item={item} docType={inventoryCol} storeType={item.storeType} keyType="storeType" cacheKey={cacheKey} tooltip='Warning! Editing this may count towards your monthly inventory.' triggerUpdate={() => setTriggerUpdate(true)} />

                                    <td onClick={() => handleDisplayOrderModal(item)}>{item.quantity}</td>
                                    <UpdateTableField currentValue={purchase?.platform} docId={item.itemId} item={item} docType={inventoryCol} storeType={item.storeType} keyType="purchase.platform" cacheKey={cacheKey} triggerUpdate={() => setTriggerUpdate(true)} />
                                    <UpdateTableField currentValue={purchase?.price?.toFixed(2)} docId={item.itemId} item={item} docType={inventoryCol} storeType={item.storeType} keyType="purchase.price" cacheKey={cacheKey} triggerUpdate={() => setTriggerUpdate(true)} />
                                    <td onClick={() => handleDisplayOrderModal(item)}>
                                        {item.price?.toFixed(2)}
                                    </td>
                                    <td className="min-w-32" onClick={() => handleDisplayOrderModal(item)}>{formatTableDate(item.dateListed)}</td>
                                    <UpdateTableField currentValue={storageLocation} docId={item.itemId} item={item} docType={inventoryCol} storeType={item.storeType} keyType="storageLocation" cacheKey={cacheKey} triggerUpdate={() => setTriggerUpdate(true)} />
                                    <UpdateTableField currentValue={sku} docId={item.itemId} item={item} docType={inventoryCol} storeType={item.storeType} keyType="sku" cacheKey={cacheKey} triggerUpdate={() => setTriggerUpdate(true)} />
                                    <UpdateTableField tdClassName={index + 1 === paginatedData.length ? "rounded-br-xl" : ""} currentValue={customTag} docId={item.itemId} item={item} docType={inventoryCol} storeType={item.storeType} keyType="customTag" cacheKey={cacheKey} triggerUpdate={() => setTriggerUpdate(true)} />
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan={12}>
                                <div className="w-full flex justify-center items-center">
                                    {loading ? (
                                        <div className="flex flex-col justify-center items-center">
                                            <LoadingSpinner />
                                            {slowLoading && (
                                                <p className="mt-2 text-sm text-gray-500 text-center">
                                                    This is taking longer than normal. If you have just
                                                    connected an account, please allow some time for us to
                                                    collect your store data.
                                                </p>
                                            )}
                                        </div>)
                                        : <div className="py-6"><NoResultsFound /></div>}
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {contextMenu && (
                <ul
                    className="menu menu-sm absolute z-50 bg-black text-white rounded-lg shadow-md text-sm w-48"
                    style={{ top: contextMenu.mouseY, left: contextMenu.mouseX }}
                >
                    <li
                        className="px-2 py-1 rounded-sm hover:bg-muted/10 cursor-pointer"
                        onClick={() => {
                            handleDisplayEditModal(contextMenu.item);
                            handleCloseContextMenu();
                        }}
                    >
                        Edit
                    </li>
                    <li
                        className="px-2 py-1 rounded-sm hover:bg-muted/10 cursor-pointer"
                        onClick={() => {
                            handleDisplayOrderModal(contextMenu.item);
                            handleCloseContextMenu();
                        }}
                    >
                        Create Order
                    </li>
                    <li
                        className="px-2 py-1 rounded-sm hover:bg-muted/10 text-white cursor-pointer"
                        onClick={() => {
                            handleDeleteListing(contextMenu.item, contextMenu.item.storeType, contextMenu.item.recordType === "automatic", contextMenu.item.createdAt);
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
                                <span className="font-semibold text-white">{totalListings}</span>
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
                <NewOrder fillItem={fillItem} setDisplayModal={setAddNewOrderModalOpen} setTriggerUpdate={setTriggerUpdate} />
            )}

            {(editListingModalOpen && fillItem) && (
                <EditListing fillItem={fillItem} setDisplayModal={setEditListingModalOpen} setTriggerUpdate={setTriggerUpdate} />
            )}
        </div>
    );
};

export default Inventory;