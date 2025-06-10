import React from 'react';
import { IOrder } from '@/models/store-data';

interface ICardCostAverages {
    orders: IOrder[];
    loading: boolean;
    currencySymbol: string;
}

// Helper function to calculate cost averages
const calculateCostAverages = (orders: IOrder[]) => {
    if (orders.length === 0) {
        return {
            avgPurchasePrice: 0,
            avgShippingCost: 0,
            avgAdditionalFees: 0,
            avgTotalCost: 0,
        };
    }

    let totalPurchasePrice = 0;
    let totalShippingCost = 0;
    let totalAdditionalFees = 0;

    orders.forEach((order) => {
        totalPurchasePrice += order.purchase?.price ?? 0;
        totalShippingCost += (order.shipping?.fees ?? 0) + (order.shipping?.sellerFees ?? 0);
        totalAdditionalFees += order.additionalFees ?? 0;
    });

    const avgPurchasePrice = totalPurchasePrice / orders.length;
    const avgShippingCost = totalShippingCost / orders.length;
    const avgAdditionalFees = totalAdditionalFees / orders.length;
    const avgTotalCost = avgPurchasePrice + avgShippingCost + avgAdditionalFees;

    return {
        avgPurchasePrice,
        avgShippingCost,
        avgAdditionalFees,
        avgTotalCost,
    };
};

const CardCostAverages: React.FC<ICardCostAverages> = ({ orders, loading, currencySymbol }) => {
    const { avgPurchasePrice, avgShippingCost, avgAdditionalFees, avgTotalCost } = calculateCostAverages(orders);

    return (
        <>
            <div className="col-span-12 lg:col-span-6 flex flex-row bg-white rounded-lg shadow p-4 gap-4">
                <div className="w-full text-center">
                    <h1 className="text-2xl font-semibold">
                        {loading ? '...' : `${currencySymbol}${avgPurchasePrice.toFixed(2)}`}
                    </h1>
                    <h3 className="text-sm text-gray-500">Avg purchase price</h3>
                </div>
                <div className="w-full text-center">
                    <h1 className="text-2xl font-semibold">
                        {loading ? '...' : `${currencySymbol}${avgShippingCost.toFixed(2)}`}
                    </h1>
                    <h3 className="text-sm text-gray-500">Avg shipping cost</h3>
                </div>
            </div>
            <div className="col-span-12 lg:col-span-6 flex flex-row bg-white rounded-lg shadow p-4 gap-4">
                <div className="w-full text-center">
                    <h1 className="text-2xl font-semibold">
                        {loading ? '...' : `${currencySymbol}${avgAdditionalFees.toFixed(2)}`}
                    </h1>
                    <h3 className="text-sm text-gray-500">Avg additional fees</h3>
                </div>
                <div className="w-full text-center">
                    <h1 className="text-2xl font-semibold">
                        {loading ? '...' : `${currencySymbol}${avgTotalCost.toFixed(2)}`}
                    </h1>
                    <h3 className="text-sm text-gray-500">Avg total cost</h3>
                </div>
            </div>
        </>
    );
};

export default CardCostAverages;
