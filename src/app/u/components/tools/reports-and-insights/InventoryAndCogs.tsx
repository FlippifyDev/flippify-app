import React from "react";
import { IOrder } from "@/models/store-data";

interface InventoryAndCogsProps {
    inventoryBought: IOrder[];
    sales: IOrder[];
    formatter: Intl.NumberFormat;
    periodStart: Date;
    periodEnd: Date;
}

const InventoryAndCogs: React.FC<InventoryAndCogsProps> = ({
    inventoryBought,
    sales,
    formatter,
    periodStart,
    periodEnd,
}) => {
    const parseDate = (iso: string) => new Date(iso);

    // 1) Starting Inventory: purchases before the period
    const startingItems = inventoryBought.filter(
        (item) => parseDate(item.purchase?.date ?? "") < periodStart
    );
    const startingValue = startingItems.reduce(
        (sum, item) => sum + (item.purchase?.price ?? 0) * (item.purchase?.quantity ?? 1),
        0
    );

    // 2) Spent on New Inventory: purchases during the period
    const newPurchases = inventoryBought.filter((item) => {
        const d = parseDate(item.purchase?.date ?? "");
        return d >= periodStart && d <= periodEnd;
    });
    const spentOnNew = newPurchases.reduce(
        (sum, item) => sum + (item.purchase?.price ?? 0) * (item.purchase?.quantity ?? 1),
        0
    );

    // 3) Ending Inventory: of those newPurchases, which weren’t sold by periodEnd
    const endingItems = newPurchases.filter(
        (item) => !sales.some((o) => o.itemId === item.itemId)
    );
    const endingValue = endingItems.reduce(
        (sum, item) => sum + (item.purchase?.price ?? 0) * (item.purchase?.quantity ?? 1),
        0
    );

    // 4) COGS
    const cogs = startingValue + spentOnNew - endingValue;

    return (
        <div className="space-y-1">
            <div className='flex flex-row justify-between text-red-500 mb-2'>
                <h3 className="text-2xl font-bold">Inventory and COGS</h3>
                <p className="text-lg font-semibold">{formatter.format(cogs)}</p>
            </div>
            <div className='flex flex-row justify-between font-semibold text-[17px]'>
                <h4>Starting Inventory</h4>
                <p>{formatter.format(startingValue)}</p>
            </div>
            <div className='flex flex-row justify-between font-semibold text-[17px]'>
                <h4>Spent on New Inventory</h4>
                <p>{formatter.format(spentOnNew)}</p>
            </div>
            <div className='flex flex-row justify-between font-semibold text-[17px]'>
                <h4>Ending Inventory</h4>
                <p>{formatter.format(endingValue)}</p>
            </div>
        </div>
    );
};

export default InventoryAndCogs;
