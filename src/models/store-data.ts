export type RecordType = "automatic" | "manual";

export type OrderStatus =
    | "Active"        // Order is in progress and not yet finalized. Payment may not be completed.
    | "Cancelled"     // Order has been cancelled and will not be fulfilled.
    | "CancelPending" // A cancellation request has been initiated but not yet finalized.
    | "Completed"     // Order has been fully paid, processed, and finalized.
    | "CustomCode"    // Reserved for internal or future use; not typically used in practice.
    | "Inactive"      // Order is not currently active; may be archived or cancelled.
    | "InProcess";    // Order is being processed (e.g., payment or shipping underway), not yet complete.


export type Condition = "new" | "used" | "opened" | "unopened" | "refurbished" | string;
export type SubscriptionName = "Free - member" | "Standard - member" | "Pro - member" | "Enterprise 1 - member" | "Enterprise 2 - member" | "Enterprise 3 - member" | "Enterprise 4 - member";


export const STORES = ["ebay", "stockx"];
export type HardcodedStoreType = typeof STORES[number];

export type StoreType = HardcodedStoreType | string;

interface IListing {
    condition?: Condition | null;
    createdAt?: string | null;
    customTag?: string | null;
    currency?: string | null;
    dateListed?: string | null;
    extra?: Record<string, string>;
    image?: string[] | null;
    initialQuantity?: number | null;
    itemId?: string | null;
    lastModified?: string | null;
    name?: string | null;
    price?: number | null;
    purchase?: {
        date?: string | null;
        platform?: string | null;
        price?: number | null;
    } | null;
    quantity?: number | null;
    recordType?: RecordType | null;
    sku?: string | null;
    storageLocation?: string | null;
    storeType?: StoreType | null;
}


interface IShipping {
    fees?: number | null;
    sellerFees?: number | null;
    date?: string | null;
    paymentToShipped?: number | null;
    service?: string | null;
    timeDays?: number | null;
    trackingNumber?: string | null;
}

interface ITaxes {
    amount?: number | null;
    currency?: string | null;
    type?: string | null;
    description?: string | null;
}

interface IPurchase {
    currency?: string | null;
    date?: string | null;
    platform?: string | null;
    price?: number | null;
    quantity?: number | null;
}

interface ISale {
    buyerUsername?: string | null;
    currency?: string | null;
    date?: string | null;
    platform?: string | null;
    price?: number | null;
    quantity?: number | null;
}

interface IHistory {
    title?: string | null;
    description?: string | null;
    status?: OrderStatus | null;
    timestamp?: string | null;
}

interface IRefund {
    amount?: number | null;
    currency?: string | null;
    referencedId?: string | null;
    refundedAt?: string | null;
    refundedTo?: string | null;
    status?: string | null;
    type?: string | null;
}

interface IOrder {
    buyerAdditionalFees?: number | null;
    additionalFees?: number | null;
    createdAt?: string | null;
    customTag?: string | null;
    condition?: Condition | null;
    extra?: Record<string, string>;
    storageLocation?: string | null;
    history?: IHistory[] | null;
    image?: string[] | null;
    itemId?: string | null;
    lastModified?: string | null;
    listingDate?: string | null;
    name?: string | null;
    orderId?: string | null;
    purchase?: IPurchase | null;
    recordType?: RecordType | null;
    refund?: IRefund | null;
    sku?: string | null;
    sale?: ISale | null;
    shipping?: IShipping | null;
    status?: OrderStatus | null;
    storeType?: StoreType | null;
    tax?: ITaxes | null;
    transactionId?: string | null;
}


interface IInventory {
    ebay?: Record<string, IListing> | null;
}

interface IOrders {
    ebay?: Record<string, IOrder> | null;
    depop?: Record<string, IOrder> | null;
}

export type { IListing, IOrder, IInventory, IOrders, IHistory, IShipping, IPurchase, ISale, ITaxes };