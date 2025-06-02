import { OrderStatus } from "./store-data";

interface IHistoryGrid {
	itemName?: string | null;
	purchaseDate?: string | null;
	saleDate?: string | null;
	quantitySold?: number | null;
	purchasePricePerUnit?: number | null;
	salePrice?: number | null;
	shippingCost?: number | null;
	otherCosts?: number | null;
	estimatedProfit?: number | null;
	salePlatform?: string | null;
	storageLocation?: string | null;
	totalCosts?: number | null;
    status?: OrderStatus | null;
}


export type { IHistoryGrid }