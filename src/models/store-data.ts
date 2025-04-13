export type RecordType = "automatic" | "manual";


export type OrderStatus =
    | "Active"        // Order is in progress and not yet finalized. Payment may not be completed.
    | "Cancelled"     // Order has been cancelled and will not be fulfilled.
    | "CancelPending" // A cancellation request has been initiated but not yet finalized.
    | "Completed"     // Order has been fully paid, processed, and finalized.
    | "CustomCode"    // Reserved for internal or future use; not typically used in practice.
    | "Inactive"      // Order is not currently active; may be archived or cancelled.
    | "InProcess";    // Order is being processed (e.g., payment or shipping underway), not yet complete.


export type StorePlatform = "ebay" | "amazon" | "shopify";

interface IEbayInventoryItem {
    currency: string;
    customTag?: string | null;
    dateListed: string;
    image: string[];
    initialQuantity: number;
    itemId: string;
    lastModified: string;
    name: string;
    price: number;
    purchase?: {
        date: string | null;
        platform: string | null;
        price: number | null;
    };
    quantity: number;
    recordType: RecordType;
}

interface IShipping {
    fees: number;
    paymentToShipped?: number;
    service?: string;
    timeDays?: number;
    trackingNumber?: string;
}

interface IPurchase {
    currency: string;
    date: string;
    platform: string | null;
    price: number | null;
    quantity: number | null;
}

interface ISale {
    buyerUsername?: string;
    currency: string;
    date: string;
    platform: string;
    price: number;
    quantity: number;
}

interface IHistory {
    description: string;
    timestamp: string;
    title: string;
}

interface IRefund {
    amaount: number;
    currency: string;
    referencedId: string;
    refundedAt: string;
    refundedTo: string;
    status: string;
    type: string;
}

interface IEbayOrder {
    additionalFees: number;
    customTag: string | null;
    history: IHistory[];
    image: string[];
    itemId?: string;
    lastModified: string;
    listingDate: string;
    name: string;
    orderId: string;
    purchase: IPurchase;
    recordType: RecordType;
    refund: IRefund | null;
    sale: ISale;
    shipping: IShipping;
    status: OrderStatus;
    transactionId: string;
}


interface IInventory {
    ebay: Record<string, IEbayInventoryItem>
}

interface IOrders {
    ebay: Record<string, IEbayOrder>
}

export type { IEbayInventoryItem, IEbayOrder, IInventory, IOrders, IHistory };