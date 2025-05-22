"use client"

import LoadingSpinner from '@/app/components/LoadingSpinner';
import { currencySymbols } from '@/config/currency-config';
import { IOneTimeExpense } from '@/models/expenses';
import { deleteItem } from '@/services/firebase/delete';
import { retrieveUserOneTimeExpenses } from '@/services/firebase/retrieve';
import { removeCacheData } from '@/utils/cache-helpers';
// Local Imports
import { defaultTimeFrom, oneTimeExpensesCacheKey } from '@/utils/constants';
import { fetchUserExpensesCount } from '@/utils/extract-user-data';
import { formatTableDate } from '@/utils/format-dates';

// External Imports
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react'
import EditOneTimeExpense from '../navbar-tools/EditOneTimeExpense';

const OneTime = () => {
    const { data: session } = useSession();
    const cacheKey = `${oneTimeExpensesCacheKey}-${session?.user.id}`;

    const [fillItem, setFillItem] = useState<IOneTimeExpense>();
    const [editModelOpen, setEditModalOpen] = useState(false);

    const [data, setData] = useState<IOneTimeExpense[]>([]);

    // Page Config
    const itemsPerPage = 12;
    const [currentPage, setCurrentPage] = useState(1);
    const { oneTime: total } = fetchUserExpensesCount(session?.user)
    const totalPages = Math.ceil(total / itemsPerPage);

    const paginatedData = data.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const [triggerUpdate, setTriggerUpdate] = useState(true);
    const [loading, setLoading] = useState(false);

    const [contextMenu, setContextMenu] = useState<{ mouseX: number; mouseY: number; item: any } | null>(null);

    useEffect(() => {
        async function fetchExpenses() {
            setLoading(true);

            const items = await retrieveUserOneTimeExpenses({
                uid: session?.user.id as string,
                timeFrom: defaultTimeFrom,
            })

            setData(items);
            setLoading(false);
        }

        if (session?.user.authentication?.subscribed && triggerUpdate) {
            fetchExpenses();
            setTriggerUpdate(false)
        }
    }, [session, triggerUpdate])

    useEffect(() => {
        const handleClick = () => {
            handleCloseContextMenu();
        };
        window.addEventListener("click", handleClick);
        return () => window.removeEventListener("click", handleClick);
    }, []);

    const handlePageChange = (newPage: number) => {
        setTriggerUpdate(true);
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleContextMenu = (event: React.MouseEvent, item: IOneTimeExpense) => {
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

    function handleDisplayEditModal(item: IOneTimeExpense) {
        setFillItem(item);
        setEditModalOpen(true);
    }


    async function handleDeleteItem(item: IOneTimeExpense) {
        if (session?.user.id && item.id) {
            await deleteItem({ uid: session.user.id, itemType: "expenses", storeType: "oneTime", docId: item.id, createdAt: item.createdAt });
            removeCacheData(cacheKey, item.id);
            setTriggerUpdate(true);
        }
    }

    return (
        <div className="w-full h-full overflow-x-auto">
            <table className="table w-full">
                <thead>
                    <tr className="bg-tableHeaderBackground">
                        <th>PROVIDER</th>
                        <th>NAME</th>
                        <th>PRICE</th>
                        <th>DATE</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedData.length > 0 ? (
                        paginatedData.map((item, index) => {
                            return (
                                <tr
                                    key={`${index}-${item.id}`}
                                    onContextMenu={(e) => handleContextMenu(e, item)}
                                    className="cursor-pointer hover:bg-gray-50 font-semibold"
                                >
                                    <td className={index + 1 === paginatedData.length ? "rounded-bl-xl" : ""}>{item.provider}</td>
                                    <td>{item.name}</td>
                                    <td>{currencySymbols[item.currency ?? "USD"]}{item.amount?.toFixed(2)}</td>
                                    <td className={index + 1 === paginatedData.length ? "rounded-br-xl" : ""}>{formatTableDate(item.createdAt)}</td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan={12}>
                                <div className="w-full flex justify-center items-center">
                                    {loading ? <LoadingSpinner /> : "No results found."}
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
                        className="px-2 py-1 rounded-sm hover:bg-muted/10 text-white cursor-pointer"
                        onClick={() => {
                            handleDeleteItem(contextMenu.item);
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
                                <span>{(currentPage - 1) * itemsPerPage + 1}</span>
                                <span>-</span>
                                <span>{Math.min(currentPage * itemsPerPage, data.length)}</span>
                                <span>of</span>
                                <span>{total}</span>
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

            {(editModelOpen && fillItem) && (
                <EditOneTimeExpense fillItem={fillItem} setDisplayModal={setEditModalOpen} setTriggerUpdate={setTriggerUpdate}/>
            )}
        </div>
    )
}

export default OneTime
