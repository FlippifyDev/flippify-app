import { IEbayOrder } from '@/models/store-data'
import React from 'react'


// Helper function to calculate averages
const calculateAverages = (orders: IEbayOrder[]) => {
    if (orders.length === 0) {
        return {
            avgGrossPerSale: 0,
            avgProfitPerSale: 0,
            netProfitMargin: 0,
            avgNpmPerSale: 0,
        };
    }

    let totalGross = 0;
    let totalProfit = 0;
    let totalNpm = 0;

    orders.forEach((order) => {
        const salePrice = order.sale.price;
        const purchasePrice = order.purchase.price;
        const shippingFees = order.shipping.fees;
        const additionalFees = order.additionalFees;

        // Calculate gross
        const gross = salePrice;
        totalGross += gross;

        // Calculate profit
        const profit = salePrice - (purchasePrice ?? 0) - shippingFees - additionalFees;
        totalProfit += profit;

        // Calculate net profit margin for this order
        const npm = gross !== 0 ? (profit / gross) * 100 : 0;
        totalNpm += npm;
    });

    const avgGrossPerSale = totalGross / orders.length;
    const avgProfitPerSale = totalProfit / orders.length;
    const netProfitMargin = totalGross !== 0 ? (totalProfit / totalGross) * 100 : 0;
    const avgNpmPerSale = totalNpm / orders.length;

    return {
        avgGrossPerSale,
        avgProfitPerSale,
        netProfitMargin,
        avgNpmPerSale,
    };
};

interface ICardSaleAverages {
    orders: IEbayOrder[];
    loading: boolean;
    currencySymbol: string;
}

const CardSaleAverages: React.FC<ICardSaleAverages> = ({ orders, loading, currencySymbol }) => {
    const { avgGrossPerSale, avgProfitPerSale, netProfitMargin, avgNpmPerSale } = calculateAverages(orders);

    return (
        <>
            <div className="col-span-12 lg:col-span-6 flex flex-col md:flex-row bg-white rounded-lg shadow-small p-4">
                <div className="w-full text-center">
                    <h1 className="text-2xl font-semibold">
                        {loading ? '...' : `${currencySymbol}${avgGrossPerSale.toFixed(2)}`}
                    </h1>
                    <h3 className="text-sm text-gray-500">Avg gross per sale</h3>
                </div>
                <div className="w-full text-center">
                    <h1 className="text-2xl font-semibold">
                        {loading ? '...' : `${currencySymbol}${avgProfitPerSale.toFixed(2)}`}
                    </h1>
                    <h3 className="text-sm text-gray-500">Avg profit per sale</h3>
                </div>
            </div>
            <div className="col-span-12 lg:col-span-6 flex flex-col md:flex-row bg-white rounded-lg shadow-small p-4">
                <div className="w-full text-center">
                    <h1 className="text-2xl font-semibold">
                        {loading ? '...' : `${netProfitMargin.toFixed(2)}%`}
                    </h1>
                    <h3 className="text-sm text-gray-500">Net profit margin</h3>
                </div>
                <div className="w-full text-center">
                    <h1 className="text-2xl font-semibold">
                        {loading ? '...' : `${avgNpmPerSale.toFixed(2)}%`}
                    </h1>
                    <h3 className="text-sm text-gray-500">Avg NPM per sale</h3>
                </div>
            </div>
        </>
    );
};

export default CardSaleAverages
