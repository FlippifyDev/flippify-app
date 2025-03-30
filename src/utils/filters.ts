import { IEbayInventoryItem, IEbayOrder } from "@/models/store-data";
import { isAfter, isBefore, isEqual, parseISO } from "date-fns";


// Function to filter orders by the given time range
export const filterOrdersByDateRange = (orders: IEbayOrder[], timeFrom: string, timeTo: string) => {
    const timeFromDate = new Date(timeFrom);
    const timeToDate = new Date(timeTo);

    return orders.filter(order => {
        const listingDate = new Date(order.listingDate);
        const saleDate = new Date(order.sale.date);

        // Check if listingDate or saleDate is within the given time range
        return (listingDate >= timeFromDate && listingDate <= timeToDate) ||
            (saleDate >= timeFromDate && saleDate <= timeToDate);
    });
};

/**
 * Filters orders based on the provided time range.
 * 
 * @param {IEbayOrder[]} orders - The array of orders to be filtered.
 * @param {string} timeFrom - Start date in ISO format (e.g., "2025-02-28").
 * @param {string} [timeTo] - End date in ISO format, or defaults to the current date.
 * @returns {IEbayOrder[]} - Filtered orders matching the date range.
 */
export function filterOrdersByTime(
    orders: IEbayOrder[],
    timeFrom: string,
    timeTo?: string
): IEbayOrder[] {
    // Parse start and end dates and convert them to UTC to avoid timezone mismatch
    const startDate = parseISO(timeFrom);
    const endDate = timeTo ? parseISO(timeTo) : new Date();

    // Force endDate to be in UTC by using Date.UTC()
    const endDateUTC = new Date(Date.UTC(
        endDate.getUTCFullYear(),
        endDate.getUTCMonth(),
        endDate.getUTCDate(),
        endDate.getUTCHours(),
        endDate.getUTCMinutes(),
        endDate.getUTCSeconds()
    ));

    return orders.filter((order) => {
        // Parse order date and force UTC
        const orderDate = parseISO(order.sale.date);

        // Ensure valid date parsing
        if (isNaN(orderDate.getTime())) {
            console.warn(`Invalid order date format for order: ${order.orderId}`);
            return false;
        }

        // Force orderDate to UTC for comparison consistency
        const orderDateUTC = new Date(Date.UTC(
            orderDate.getUTCFullYear(),
            orderDate.getUTCMonth(),
            orderDate.getUTCDate(),
            orderDate.getUTCHours(),
            orderDate.getUTCMinutes(),
            orderDate.getUTCSeconds()
        ));

        return (
            (isEqual(orderDateUTC, startDate) || isAfter(orderDateUTC, startDate)) &&
            (isEqual(orderDateUTC, endDateUTC) || isBefore(orderDateUTC, endDateUTC))
        );
    });
}

export function filterInventoryByTime(
    inventory: IEbayInventoryItem[],
    timeFrom: string,
    timeTo?: string
): IEbayInventoryItem[] {
    const timeFromDate = new Date(timeFrom).getTime();
    const timeToDate = timeTo ? new Date(timeTo).getTime() : Date.now(); // Use current date if no timeTo

    return inventory.filter((item) => {
        const itemTimestamp = new Date(item.dateListed).getTime();
        return itemTimestamp >= timeFromDate && itemTimestamp <= timeToDate;
    });
}