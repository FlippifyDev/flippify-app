export type RecordType = "automatic" | "manual";
export type OrderStatus = "Active" | "Completed" | "Cencelled" | "Inactive" | "Shipped" | "InProcess" | "Invalid";

interface IEbayInventoryItem {
    initialQuantity: number;
    itemId: string;
    itemName: string;
    price: number;
    quantity: number;
    dateListed: string;
    image: string[];
    recordType: RecordType;
}

interface IShipping {
    fees: number;
    paymentToShippied: number;
    service: string;
    timeDays: number;
    trackingNumber: string;
}

interface IPurchase {
    date: string;
    platform: string;
    price: number;
    quantity: number;
}

interface ISale {
    buyerUsername: string;
    date: string;
    platform: string;
    price: number;
    quantity: number;
}

interface IEbayOrder {
    additionalFees: number;
    customTag: string | null;
    image: string[];
    itemName: string;
    legacyItemId: string;
    listingDate: string;
    orderId: string;
    purchase: IPurchase;
    recordType: RecordType;
    sale: ISale;
    shipping: IShipping;
    status: OrderStatus;
}


interface IInventory {
    ebay: Record<string, IEbayInventoryItem>
}

interface IOrders {
    ebay: Record<string, IEbayOrder>
}

export type { IEbayInventoryItem, IEbayOrder, IInventory, IOrders };