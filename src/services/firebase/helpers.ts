import { CurrencyType } from "@/models/user";
import { formatDateToISO } from "@/utils/format-dates";
import { currencySymbols } from "@/config/currency-config";
import { IHistory, OrderStatus } from "@/models/store-data";

export function createHistoryItem(status: OrderStatus, sale_price: number, currency: CurrencyType): IHistory | void {
    let historyTitle;
    let historyDescription;
    let historyTimestamp;

    switch (status) {
        case "Active":
            historyTitle = "Order Placed"
            historyDescription = (
                `Order placed on eBay for ${currencySymbols[currency]}${sale_price}`
            )
            historyTimestamp = formatDateToISO(new Date())
            break;
        
        case "InProcess":
            historyTitle = "Shipped"
            historyDescription = "Shipped to eBay buyer."
            historyTimestamp = formatDateToISO(new Date())
            break;

        case "Completed":
            historyTitle = "Completed"
            historyDescription = "Order Completed"
            historyTimestamp = formatDateToISO(new Date())
            break;
    }

    if (!historyTitle || !historyDescription || !historyTimestamp) {
        return 
    }

    return {
        title: historyTitle,
        description: historyDescription,
        timestamp: historyTimestamp
    }
}