"use client";

import { retrieveUserInventory } from "@/services/firebase/retrieve";
import { formatTableDate } from "@/utils/format-dates";
import { currencySymbols } from "@/config/currency-config";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";

const InventoryContent = () => {
    const { data: session } = useSession();
    const currency = session?.user.preferences.currency || "GBP";

    const [listedData, setListedData] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 12;

    // Total number of pages
    const totalPages = Math.ceil(listedData.length / ordersPerPage);

    useEffect(() => {
        const fetchInventoryData = async () => {
            const inventory = await retrieveUserInventory(
                session?.user.id as string,
                "2023-01-01T00:00:00Z",
                session?.user.connectedAccounts.ebay?.ebayAccessToken as string
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

    // Paginate data for current page
    const paginatedData = listedData.slice(
        (currentPage - 1) * ordersPerPage,
        currentPage * ordersPerPage
    );

    return (
        <div className="w-full h-full overflow-x-auto">
            <table className="table w-full">
                <thead>
                    <tr className="bg-tableHeaderBackground">
                        <th></th>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Date Listed</th>
                        <th>Item ID</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedData.length > 0 ? (
                        paginatedData.map((item, index) => {
                            return (
                                <tr
                                    key={index}
                                    className="hover:bg-gray-100 cursor-pointer transition duration-100"
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
                                    <td>
                                        {currencySymbols[currency]}
                                        {item.price.toFixed(2)}
                                    </td>
                                    <td>{formatTableDate(item.dateListed)}</td>
                                    <td>{item.itemId}</td>
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
