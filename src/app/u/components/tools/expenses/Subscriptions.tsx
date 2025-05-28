"use client"

// Local Imports
import { ISubscriptionExpense } from "@/models/expenses";
import { defaultTimeFrom, subscriptionsExpensesCacheKey } from "@/utils/constants";
import { fetchUserExpensesCount } from "@/utils/extract-user-data";
import { shortenText } from "@/utils/format";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import { currencySymbols } from "@/config/currency-config";
import { formatTableDate } from "@/utils/format-dates";
import EditSubscription from "../navbar-tools/EditSubscription";
import { removeCacheData } from "@/utils/cache-helpers";
import { retrieveIdToken } from "@/services/firebase/retrieve";
import { deleteItem } from "@/services/firebase/delete";
import { expensesCol, subscriptionsExpenseCol } from "@/services/firebase/constants";
import { retrieveSubscriptionExpenses } from "@/services/bridges/retrieve";


// External Imports
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import NoResultsFound from "../../dom/ui/NoResultsFound";

const Subscriptions = () => {
    const { data: session } = useSession();
    const uid = session?.user.id as string;
    const cacheKey = `${subscriptionsExpensesCacheKey}-${uid}`;

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
    const [nextPage, setNextPage] = useState(false);

    const [triggerUpdate, setTriggerUpdate] = useState(true);
    const [loading, setLoading] = useState(false);

    const [contextMenu, setContextMenu] = useState<{ mouseX: number; mouseY: number; item: any } | null>(null);

    useEffect(() => {
        async function fetchExpenses() {
            setLoading(true);

            const items = await retrieveSubscriptionExpenses({
                uid,
                timeFrom: defaultTimeFrom,
                pagenate: true,
                nextPage
            })

            setData(items ?? []);
            setLoading(false);
        }

        if ((session?.user.authentication?.subscribed && triggerUpdate) || nextPage) {
            fetchExpenses();
            setTriggerUpdate(false);
            setNextPage(false);
        }
    }, [session, triggerUpdate, nextPage, uid])

    useEffect(() => {
        const handleClick = () => {
            handleCloseContextMenu();
        };
        window.addEventListener("click", handleClick);
        return () => window.removeEventListener("click", handleClick);
    }, []);

    const handlePageChange = (newPage: number) => {
        setTriggerUpdate(true);
        if (newPage > currentPage) {
            setNextPage(true);
        }
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


    async function handleDeleteItem(item: ISubscriptionExpense) {
        if (!item.id) return;
        const idToken = await retrieveIdToken();
        if (!idToken) return;

        await deleteItem({ idToken, rootCol: expensesCol, subCol: subscriptionsExpenseCol, item })

        removeCacheData(cacheKey, item.id);
        setTriggerUpdate(true);
    }

    return (
        <div className="w-full h-full overflow-x-auto">
            <table className="table w-full">
                <thead>
                    <tr className="bg-tableHeaderBackground">
                        <th>PROVIDER</th>
                        <th>NAME</th>
                        <th>Renews</th>
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
                                    className="cursor-pointer hover:bg-gray-50 font-semibold"
                                >
                                    <td className={index + 1 === paginatedData.length ? "rounded-bl-xl" : ""}>{item.provider}</td>
                                    <td>{shortenText(item.name ?? "N/A")}</td>
                                    <td>{item.billingCycle && item.billingCycle.charAt(0).toUpperCase() + item.billingCycle.slice(1)}</td>
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
                                    {loading ? <LoadingSpinner /> : <div className="py-6"><NoResultsFound /></div>}
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
                <EditSubscription fillItem={fillItem} setDisplayModal={setEditModalOpen} setTriggerUpdate={setTriggerUpdate} />
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
            return now.toLocaleDateString("en-CA");

        case "weekly":
            if (typeof item.renewalDate === "string") {
                const next = getNextWeekday(item.renewalDate);
                return formatTableDate(next.toLocaleDateString("en-CA"));
            }
            break;

        case "monthly":
            if (typeof item.renewalDate === "string") {
                const day = Number(item.renewalDate)
                return formatTableDate(getNextMonthlyDate(day).toLocaleDateString("en-CA"));
            }
            break;

        case "yearly":
            if (typeof item.renewalDate === "string") {
                return formatTableDate(getNextYearlyDate(item.renewalDate).toLocaleDateString("en-CA"));
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

    if (targetIdx === -1) return today;

    const diff = (targetIdx - todayIdx + 7) % 7 || 7;
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + diff);
    return nextDate;
}

function getNextMonthlyDate(day: number): Date {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    // Attempt for this month
    const thisMonth = new Date(currentYear, currentMonth, day);

    if (thisMonth > today && thisMonth.getDate() === day) {
        return thisMonth;
    }

    // Attempt next month
    const nextMonth = new Date(currentYear, currentMonth + 1, day);

    // If day is invalid (e.g., Feb 30), clamp it to the last valid day of next month
    if (nextMonth.getDate() !== day) {
        // Clamp to last day of next month
        return new Date(currentYear, currentMonth + 2, 0); // 0th day of month = last day of prev month
    }

    return nextMonth;
}


function getNextYearlyDate(mmdd: string): Date {
    const [monthStr, dayStr] = mmdd.split("-");
    const month = parseInt(monthStr, 10) - 1;
    let day = parseInt(dayStr, 10);
    const today = new Date();
    let targetYear = today.getFullYear();

    let date = new Date(targetYear, month, day);
    if (isNaN(date.getTime()) || date <= today) {
        targetYear += 1;
        date = new Date(targetYear, month, day);
    }

    // Adjust for invalid dates like Feb 30
    while (isNaN(date.getTime())) {
        day--;
        date = new Date(targetYear, month, day);
    }

    return date;
}

export default Subscriptions
