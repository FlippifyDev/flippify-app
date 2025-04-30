import React from "react";
import { IOrder } from "@/models/store-data";

interface ExpensesProps {
    sales: IOrder[];
    formatter: Intl.NumberFormat
}

const Expenses: React.FC<ExpensesProps> = ({ sales, formatter }) => {
    // Sum of all additional fees
    const totalAdditionalFees = sales.reduce(
        (sum, order) => sum + (order.additionalFees ?? 0),
        0
    );

    // Sum of all shipping expenses you paid
    const totalShippingExpenses = sales.reduce(
        (sum, order) => sum + (order.shipping?.fees ?? 0),
        0
    );

    // Grand total of these “extra” expenses
    const totalExpenses = totalAdditionalFees + totalShippingExpenses;

    return (
        <div className="space-y-1">
            <div className='flex flex-row justify-between mb-2 text-red-500'>
                <h3 className="text-2xl font-bold">Business Expenses</h3>
                <p className="text-lg font-semibold">{formatter.format(totalExpenses)}</p>

            </div>

            <div className='flex flex-row justify-between text-[17px] font-semibold'>
                <h4>Total Additional Fees</h4>
                <p>{formatter.format(totalAdditionalFees)}</p>
            </div>

            <div className='flex flex-row justify-between text-base font-semibold'>
                <h4>Total Shipping Expenses</h4>
                <p>{formatter.format(totalShippingExpenses)}</p>
            </div>
        </div>
    );
};

export default Expenses;
