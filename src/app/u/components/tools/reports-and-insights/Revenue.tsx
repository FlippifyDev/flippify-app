import { IOrder } from '@/models/store-data'
import React from 'react'

const Revenue = ({ sales, formatter }: { sales: IOrder[], formatter: Intl.NumberFormat }) => {
    // 1) gross revenue = sum of (sale price + shipping charged)
    const totalRevenue = sales.reduce((sum, order) => {
        const saleAmount = order.sale?.price ?? 0;
        const shippingAmount = order.shipping?.fees ?? 0;
        return sum + saleAmount + shippingAmount;
    }, 0);

    return (
        <div className="space-y-1">
            <div className='flex flex-row justify-between mb-2 text-[#0D3B66]'>
                <h3 className="text-2xl font-bold">Income</h3>
                <p className="text-lg font-semibold">{formatter.format(totalRevenue)}</p>
            </div>

            <div className='flex flex-row justify-between text-[17px] font-semibold'>
                <h4>Gross sales revenue</h4>
                <p>{formatter.format(totalRevenue)}</p>
            </div>

            <div className='flex flex-row justify-between text-base'>
                <h4>Gross eBay sales</h4>
                <p>{formatter.format(totalRevenue)}</p>
            </div>
        </div>
    );
}

export default Revenue