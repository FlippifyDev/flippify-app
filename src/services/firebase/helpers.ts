import { formatDateToISO } from "@/utils/format-dates";
import { IHistory, OrderStatus } from "@/models/store-data";
import { checkAndUpdateResetDates } from "./update-admin";

interface CreateHistoryItemsProps {
    status: OrderStatus,
    salePrice: number,
    dbHistory?: IHistory[] | null,
    saleDate?: string,
    shippedTime?: string,
}

export function createHistoryItems({
    status,
    salePrice,
    dbHistory,
    saleDate,
    shippedTime,
}: CreateHistoryItemsProps): IHistory[] {
    const newItems: IHistory[] = [];
    // Get the current timestamp as an ISO string
    const currentTime = formatDateToISO(new Date());

    // Helper to check whether a history event with the given title exists (exact match)
    const eventExists = (title: string): boolean => {
        if (!dbHistory) return false;
        return dbHistory.some(event => event.title === title);
    };

    // Common: add "Order Placed" event if it does not exist.
    if ((status === "Active" || status === "InProcess" || status === "Completed") && !eventExists("Sold")) {
        newItems.push({
            title: "Sold",
            description: `Order placed on eBay for ${salePrice}`,
            status: ["InProcess", "Active"].includes(status) ? status : "Active",
            timestamp: saleDate ? saleDate : currentTime
        });
    }

    // For both InProcess and Completed orders, add a "Shipped" event if not already present.
    if ((status === "InProcess" || status === "Completed") && !eventExists("Shipped")) {
        newItems.push({
            title: "Shipped",
            description: "Shipped to eBay buyer.",
            status: ["InProcess", "Active"].includes(status) ? status : "InProcess",
            timestamp: shippedTime ? shippedTime : currentTime
        });
    }

    // For Completed orders, add a "Completed" event if not already present.
    if (status === "Completed" && !eventExists("Completed")) {
        newItems.push({
            title: "Completed",
            description: "Order Completed",
            status: status,
            timestamp: currentTime
        });
    }

    // Merge new items with the existing history if provided.
    const mergedHistory = dbHistory ? [...dbHistory, ...newItems] : newItems;

    // Sort by timestamp (oldest first). This assumes timestamps are ISO strings.
    mergedHistory.sort((a, b) => {
        const timestampA = a.timestamp ?? ""; // Fallback to an empty string if null or undefined
        const timestampB = b.timestamp ?? ""; // Fallback to an empty string if null or undefined

        return timestampA.localeCompare(timestampB);
    });

    return mergedHistory;
}


export async function handleLogin(uid: string): Promise<{ success?: boolean, error?: any }> {
    try {
        const { error: resetDateError } = await checkAndUpdateResetDates(uid);
        if (resetDateError) throw resetDateError;

        return { success: true }
    } catch (error) {
        console.error("An error occured whilst processing login");
        return { error };
    }
}