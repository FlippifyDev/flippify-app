import { IEbayInventoryItem, IEbayOrder } from "@/models/store-data";
import { isAfter, isBefore, isEqual, parseISO } from "date-fns";


export function filterOrdersByTime(
    orders: IEbayOrder[],
    timeFrom: string,
    timeTo?: string
): IEbayOrder[] {
    const startDate = parseISO(timeFrom);
    const endDate = timeTo ? parseISO(timeTo) : new Date(); // If no timeTo, use current date

    return orders.filter((order) => {
        const orderDate = parseISO(order.sale.date); // Ensure order date is parsed correctly
        return (
            (isAfter(orderDate, startDate) || isEqual(orderDate, startDate)) && // Order after or on start date
            (isBefore(orderDate, endDate) || isEqual(orderDate, endDate)) // Order before or on end date
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