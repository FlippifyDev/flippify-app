interface ISale {
    itemName: string;
    saleDate: string;
    purchaseDate: string;
    salePlatform: string;
    purchasePlatform: string;
    salePrice: number;
    quantitySold: number;
    platformFees: number;
    shippingCost: number;
    purchasePricePerUnit: number;  
}

interface IHistoryGrid {
    itemName: string;
    purchaseDate: string;
    saleDate: string;
    quantitySold: number;
    purchasePricePerUnit: number;
    salePrice: number;
    platformFees: number;
    shippingCost: number;
    estimatedProfit: number;
    salePlatform: string;
    purchasePlatform: string;
    totalCosts: number;
}


interface IPurchase {
    id?: string;
    itemName: string;
    purchaseDate: string;
    purchasedQuantity: number;
    purchasePricePerUnit: number;
    soldQuantity?: number;
    websiteName: string;
    availability: number;
}


export type { ISale, IPurchase, IHistoryGrid }