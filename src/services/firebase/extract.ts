import { DateFilterKeyType, ItemType } from "./models";

export function extractItemId({ item }: { item: ItemType }) {
    if ("id" in item) {
        return item.id;
    } else if ("transactionId" in item) {
        return item.transactionId;
    } else if ("itemId" in item) {
        return item.itemId;
    }
}

export function extractItemDateByFilter({ item, filterKey }: { item: ItemType, filterKey: DateFilterKeyType }): string {
    switch (filterKey) {
        case "createdAt":
            return (item as any).createdAt;
        case "dateListed":
            return (item as any).dateListed;
        case "sale.date":
            return (item as any).sale?.date;
        default:
            return "";
    }
}


export function extractItemDate({ item }: { item: ItemType }): string | void {
    if ("id" in item) {
        return (item as any).createdAt;
    } else if ("transactionId" in item) {
        return (item as any).sale?.date;
    } else if ("itemId" in item) {
        return (item as any).dateListed;
    }
}