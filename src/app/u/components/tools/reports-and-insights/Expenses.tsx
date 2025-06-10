import React from "react";
import { IOrder } from "@/models/store-data";
import { IOneTimeExpense } from "@/models/expenses";

interface ExpensesProps {
    sales: IOrder[];
    expenses: IOneTimeExpense[];
    formatter: Intl.NumberFormat
}

const Expenses: React.FC<ExpensesProps> = ({ sales, expenses, formatter }) => {
    // Sum of all additional fees
    const totalAdditionalFees = sales.reduce(
        (sum, order) => sum + (order.additionalFees ?? 0),
        0
    );

    // Sum of all shipping expenses you paid
    const totalShippingExpenses = sales.reduce(
        (sum, order) => sum + (order.shipping?.sellerFees ?? 0),
        0
    );

    // Grand total of these "extra" expenses
    const totalSalesExpenses = totalAdditionalFees + totalShippingExpenses;

    // Sum of one-time expenses
    const totalOneTimeExpenses = expenses.reduce(
        (sum, exp) => sum + (exp.amount ?? 0),
        0
    );

    // Overall business expenses (sales extras + one-time)
    const grandTotalExpenses = totalSalesExpenses + totalOneTimeExpenses;

    return (
        <div className="space-y-4">
            {/* Summary Header */}
            <div className="flex justify-between items-end mb-2 text-[#89C2D9]">
                <h3 className="text-2xl font-bold">Business Expenses</h3>
                <p className="text-lg font-semibold">{formatter.format(grandTotalExpenses)}</p>
            </div>

            {/* Breakdown of Sales-Related Expenses */}
            <div className="space-y-1">
                <div className="flex justify-between text-base font-semibold">
                    <span>Total Additional Fees</span>
                    <span>{formatter.format(totalAdditionalFees)}</span>
                </div>
                <div className="flex justify-between text-base font-semibold">
                    <span>Total Shipping Expenses</span>
                    <span>{formatter.format(totalShippingExpenses)}</span>
                </div>
                <div className="flex justify-between text-base font-semibold">
                    <span>Subtotal (Sales-Related)</span>
                    <span>{formatter.format(totalSalesExpenses)}</span>
                </div>
                <div className="flex justify-between text-base font-semibold">
                    <span>Total One-Time Expenses</span>
                    <span>{formatter.format(totalOneTimeExpenses)}</span>
                </div>
            </div>
        </div>
    );
};

export default Expenses;
