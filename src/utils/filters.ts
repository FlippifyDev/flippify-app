import { IEbayInventoryItem, IEbayOrder } from "@/models/store-data";
import { isAfter, parseISO } from "date-fns";

export function filterOrdersByTime(orders: IEbayOrder[], timeFrom: string): IEbayOrder[] {
    const startDate = parseISO(timeFrom);

    return orders.filter(order => {
        const orderDate = parseISO(order.sale.date); // Assuming `order.date` is in ISO format
        return isAfter(orderDate, startDate) || orderDate.getTime() === startDate.getTime();
    });
}


export function filterInventoryByTime(inventory: IEbayInventoryItem[], timeFrom: string): IEbayInventoryItem[] {
    const timeFromDate = new Date(timeFrom).getTime();
    return inventory.filter(item => {
        const itemTimestamp = new Date(item.dateListed).getTime();
        return itemTimestamp >= timeFromDate;
    });
}