export type RecordType = "automatic" | "manual";

interface IEbayInventoryItem {
    itemId: string;
    itemName: string;
    price: number;
    quantity: number;
    dateListed: string;
    image: string[];
    recordType: RecordType;
}

interface IEbayOrder {
    additionalFees: number;
    buyerUsername: string;
    customTag: string;
    image: string[];
    itemName: string;
    legacyItemId: string;
    listingDate: string;
    orderId: string;
    purchaseDate: string;
    purchasePlatform: string;
    purchasePrice: number;
    quantitySold: number;
    recordType: RecordType;
    saleDate: string;
    salePlatform: string;
    salePrice: number;
    shippingFees: number;
}


interface IInventory {
    ebay: Record<string, IEbayInventoryItem>
}

interface IOrders {
    ebay: Record<string, IEbayOrder>
}

export type { IEbayInventoryItem, IEbayOrder, IInventory, IOrders };