import { IOrder } from "@/models/store-data";

export function calculateOrderProfit({ item }: { item: IOrder }) {
    return (item.sale?.price || 0) - (item.purchase?.price || 0) - (item.additionalFees ?? 0) - (item.shipping?.sellerFees ?? 0)
}