import { IListing, IOrder } from "@/models/store-data";
import { IOneTimeExpense, ISubscriptionExpense } from "@/models/expenses";

export type HardcodedStoreType = typeof STORES[number];
export const STORES = ["ebay"];

export type ItemType = ISubscriptionExpense | IOneTimeExpense | IOrder | IListing;
export type SubColType = "oneTime" | "subscriptions" | HardcodedStoreType | string;
export type RootColType = "inventory" | "orders" | "expenses";

export type DateFilterKeyType = "createdAt" | "sale.date" | "dateListed";
export type SubColFilter = "inventory" | "orders" | "oneTime" | "subscriptions";