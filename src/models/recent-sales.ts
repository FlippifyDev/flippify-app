import { OrderStatus } from "./store-data";

interface IHistoryGrid {
	itemName: string;
	purchaseDate: string;
	saleDate: string;
	quantitySold: number;
	purchasePricePerUnit: number;
	salePrice: number;
	shippingCost: number;
	otherCosts: number;
	estimatedProfit: number;
	salePlatform: string;
	purchasePlatform: string;
	totalCosts: number;
    status: OrderStatus;
}


export type { IHistoryGrid }