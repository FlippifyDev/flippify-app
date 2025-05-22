"use client"

import { IOneTimeExpense, ISubscriptionExpense } from "@/models/expenses";
import { retrieveUserSubscriptionExpenses } from "@/services/firebase/retrieve";
import { defaultTimeFrom, oneTimeExpensesCacheKey, subscriptionsExpensesCacheKey } from "@/utils/constants";
import { fetchUserExpensesCount } from "@/utils/extract-user-data";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import UpdateTableField from "../inventory-and-orders/UpdateTableField";
import { shortenText } from "@/utils/format";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import { currencySymbols } from "@/config/currency-config";
import { formatTableDate } from "@/utils/format-dates";
import EditSubscription from "../navbar-tools/EditSubscription";

// Local Imports

// External Imports


const Subscriptions = () => {
    const { data: session } = useSession();
    const cacheKey = `${subscriptionsExpensesCacheKey}-${session?.user.id}`;

    const currency = session?.user.preferences?.currency || "USD";

    const [fillItem, setFillItem] = useState<ISubscriptionExpense>();
    const [editModelOpen, setEditModalOpen] = useState(false);

    const [data, setData] = useState<ISubscriptionExpense[]>([]);

    // Page Config
    const itemsPerPage = 12;
    const [currentPage, setCurrentPage] = useState(1);
    const { subscriptions: total } = fetchUserExpensesCount(session?.user)
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

            const items = await retrieveUserSubscriptionExpenses({
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

    const handleContextMenu = (event: React.MouseEvent, item: ISubscriptionExpense) => {
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

    function handleDisplayEditModal(item: ISubscriptionExpense) {
        setFillItem(item);
        setEditModalOpen(true);
    }
    

    function handleDeleteItem(item: ISubscriptionExpense) {

    }

    return (
        <div className="w-full h-full overflow-x-auto">
            <table className="table w-full">
                <thead>
                    <tr className="bg-tableHeaderBackground">
                        <th>PROVIDER</th>
                        <th>NAME</th>
                        <th>NEXT PAYMENT</th>
                        <th>STATUS</th>
                        <th>PRICE</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedData.length > 0 ? (
                        paginatedData.map((item, index) => {
                            return (
                                <tr
                                    key={`${index}-${item.id}`}
                                    onContextMenu={(e) => handleContextMenu(e, item)}
                                    className="cursor-pointer hover:bg-gray-50"
                                >
                                    <td className={index + 1 === paginatedData.length ? "rounded-bl-xl" : ""}>{item.provider}</td>
                                    <td>{shortenText(item.name ?? "N/A")}</td>
                                    <td>{calculateNextPayment(item) ?? "N/A"}</td>
                                    <td className={`font-semibold ${item.active === true ? "text-houseBlue" : ""}`}>{item.active === true ? "Active" : "InActive"}</td>
                                    <td className={index + 1 === paginatedData.length ? "rounded-br-xl" : ""}>{currencySymbols[item.currency ?? "USD"]}{item.amount?.toFixed(2)}</td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan={12}>
                                <div className="w-full flex justify-center items-center">
                                    {loading ? <LoadingSpinner /> : "No subscriptions found."}
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

            {(editModelOpen && fillItem) && (
                <EditSubscription fillItem={fillItem} setDisplayModal={setEditModalOpen} />
            )}

        </div>
    )
}


function calculateNextPayment(item: ISubscriptionExpense): string | null {
    if (!item.startDate || !item.billingCycle || item.active === false) return null;

    const now = new Date();
    const end = item.endDate && item.endDate !== "indefinite" ? new Date(item.endDate) : null;

    if (end && now > end) return null;

    switch (item.billingCycle) {
        case "daily":
            return now.toISOString().split("T")[0];

        case "weekly":
            if (typeof item.renewalDate === "string") {
                const next = getNextWeekday(item.renewalDate);
                return formatTableDate(next.toISOString().split("T")[0]);
            }
            break;

        case "monthly":
            if (typeof item.renewalDate === "string") {
                const day = parseInt(item.renewalDate, 10);
                return formatTableDate(getNextMonthlyDate(day).toISOString().split("T")[0]);
            }
            break;

        case "yearly":
            if (typeof item.renewalDate === "string") {
                return formatTableDate(getNextYearlyDate(item.renewalDate).toISOString().split("T")[0]);
            }
            break;
    }

    return null;
}


function getNextWeekday(day: string): Date {
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const today = new Date();
    const todayIdx = today.getDay();
    const targetIdx = days.indexOf(day.toLowerCase());

    const diff = (targetIdx - todayIdx + 7) % 7 || 7;
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + diff);
    return nextDate;
}

function getNextMonthlyDate(day: number): Date {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    const thisMonth = new Date(year, month, day);
    if (thisMonth > today) return thisMonth;

    return new Date(year, month + 1, day);
}

function getNextYearlyDate(mmdd: string): Date {
    const [monthStr, dayStr] = mmdd.split("-");
    const month = parseInt(monthStr, 10) - 1;
    const day = parseInt(dayStr, 10);

    const today = new Date();
    const year = today.getFullYear();

    const thisYear = new Date(year, month, day);
    if (thisYear > today) return thisYear;

    return new Date(year + 1, month, day);
}

export default Subscriptions
