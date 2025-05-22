"use client";

import { IOrder } from "@/models/store-data";
import { currencySymbols } from "@/config/currency-config";
import {
	startOfDay,
	startOfWeek,
	endOfWeek,
	endOfMonth,
	format,
	subDays,
	isWithinInterval
} from "date-fns";
import { enGB } from 'date-fns/locale';
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { IOneTimeExpense } from "@/models/expenses";

const Chart = dynamic(() => import("./DashboardProfitsChart"), { ssr: false });


interface ChartData {
	categories: string[]; // Categories for x-axis
	series: { name: string; data: number[] }[]; // Data for y-axis
}

interface DashboardProfitsGraphProps {
	salesData: IOrder[];
    oneTimeExpensesData: IOneTimeExpense[];
	currency: string;
	selectedRange: number;
}

const DashboardProfitsGraph: React.FC<DashboardProfitsGraphProps> = ({
	salesData,
    oneTimeExpensesData,
	currency,
	selectedRange
}) => {
	const [chartData, setChartData] = useState<ChartData>({
		categories: [],
		series: [],
	});

	// Profits
	const [netProfit, setNetProfit] = useState(0);
	const [previousNetProfit, setPreviousNetProfit] = useState(0);


	// Calculate percentage change based on previous net profit
	const percentageChange =
		previousNetProfit !== 0
			? ((netProfit - previousNetProfit) / previousNetProfit) * 100
			: 0;


	useEffect(() => {
		const calculateRevenueProfitsAndCosts = () => {
			const today = startOfDay(new Date());

			let currentRangeStartDate: Date;
			let currentRangeEndDate: Date;
			let previousRangeStartDate: Date;
			let previousRangeEndDate: Date;

			// Adjust the logic for different ranges
			switch (selectedRange) {
				case 1: // Today
					currentRangeStartDate = today;
					currentRangeEndDate = today;
					previousRangeStartDate = subDays(today, 1);
					previousRangeEndDate = subDays(today, 1); // Previous day for comparison
					break;

				case 7: // Last Week (Monday to Sunday)
					currentRangeStartDate = startOfWeek(today, { weekStartsOn: 1 });
					currentRangeEndDate = endOfWeek(today, { weekStartsOn: 1 });
					previousRangeStartDate = subDays(currentRangeStartDate, 7); // Last week start
					previousRangeEndDate = subDays(currentRangeStartDate, 1); // Last week end
					break;

				case 30: // Last Month
					currentRangeStartDate = new Date(today.getFullYear(), today.getMonth(), 1); // Start of this month
					currentRangeEndDate = endOfMonth(currentRangeStartDate); // End of this month
					previousRangeStartDate = new Date(today.getFullYear(), today.getMonth() - 1, 1); // Start of last month
					previousRangeEndDate = endOfMonth(previousRangeStartDate); // End of last month
					break;

				case 90: // Last 3 Months
					currentRangeStartDate = new Date(today.getFullYear(), today.getMonth() - 2, 1); // Start of 3 months back
					currentRangeEndDate = endOfMonth(today); // Up to the end of the current month
					previousRangeStartDate = new Date(today.getFullYear(), today.getMonth() - 5, 1); // Start of the previous 3-month period
					previousRangeEndDate = new Date(today.getFullYear(), today.getMonth() - 3, 0); // End of the previous 3-month period
					break;

				case 180: // Last 6 Months
					currentRangeStartDate = new Date(today.getFullYear(), today.getMonth() - 5, 1); // Start of 6 months back
					currentRangeEndDate = endOfMonth(today); // Up to the end of the current month
					previousRangeStartDate = new Date(today.getFullYear(), today.getMonth() - 11, 1); // Start of the previous 6-month period
					previousRangeEndDate = new Date(today.getFullYear(), today.getMonth() - 6, 0); // End of the previous 6-month period
					break;

				case 365: // Year
					currentRangeStartDate = new Date(today.getFullYear(), 0, 1); // Start of last year
					currentRangeEndDate = endOfMonth(today); // Up to the end of the current month
					previousRangeStartDate = new Date(today.getFullYear() - 1, 0, 1); // Start of the previous year
					previousRangeEndDate = new Date(today.getFullYear(), 0, 0); // End of the previous year

					break;

				case 730: // All Time
					currentRangeStartDate = new Date(today.getFullYear() - 1, 0, 1); // Start of last year
					currentRangeEndDate = endOfMonth(today); // Up to the end of the current month
					previousRangeStartDate = new Date(today.getFullYear() - 3, 0, 1); // Start of the previous year
					previousRangeEndDate = new Date(today.getFullYear(), 0, 0); // End of the previous year

					break;

				default:
					currentRangeStartDate = new Date(0); // Start at epoch if not defined
					currentRangeEndDate = today; // Up to today
					previousRangeStartDate = new Date(0);
					previousRangeEndDate = new Date(0);
			}

			let currentRangeRevenue = 0;
			let previousRangeRevenue = 0;

			let currentRangeNetProfit = 0;
			let previousRangeNetProfit = 0;

			let currentRangeCosts = 0;
			let previousRangeCosts = 0;

			const revenueByDate = new Map<string, number>();
			const revenueByMonth = new Map<string, number>();

			const profitByDate = new Map<string, number>();
			const profitByMonth = new Map<string, number>();

			const costsByDate = new Map<string, number>();
			const costsByMonth = new Map<string, number>();

			// Iterate over sales data
			for (const order of salesData) {
                if (order.status !== "Completed" || !order.sale?.date || !order.purchase?.price) continue;

				// Parse the order date
				const saleDate = new Date(order.sale.date);

				// Ensure order has a purchase price and order price
				if (!order.purchase.price || !order.sale.price) continue;

				// Calculate revenue for the order
				const saleRevenue = order.sale.price;

				// Calculate costs for the order
				const saleCost = order.purchase.price + (order.shipping?.fees ?? 0) + (order.additionalFees ?? 0);

				// Calculate profit for the order
				const saleProfit = saleRevenue - saleCost;

				// Check if order falls within the current range
				if (isWithinInterval(saleDate, { start: currentRangeStartDate, end: currentRangeEndDate })) {
					currentRangeRevenue += saleRevenue;
					currentRangeCosts += saleCost;
					currentRangeNetProfit += saleProfit;

					if (selectedRange !== 365 && selectedRange !== 180 && selectedRange !== 730) {
						// Accumulate revenue and cost by date for daily and monthly range
						const saleDateKey = format(saleDate, 'dd MM yyyy', { locale: enGB });
						revenueByDate.set(saleDateKey, (revenueByDate.get(saleDateKey) || 0) + saleRevenue);
						costsByDate.set(saleDateKey, (costsByDate.get(saleDateKey) || 0) + saleCost);
						profitByDate.set(saleDateKey, (profitByDate.get(saleDateKey) || 0) + saleProfit);
					} else {
						const saleMonthKey = format(saleDate, 'MM yyyy', { locale: enGB });
						revenueByMonth.set(saleMonthKey, (revenueByMonth.get(saleMonthKey) || 0) + saleRevenue);
						costsByMonth.set(saleMonthKey, (costsByMonth.get(saleMonthKey) || 0) + saleCost);
						profitByMonth.set(saleMonthKey, (profitByMonth.get(saleMonthKey) || 0) + saleProfit);
					}
				} else if (isWithinInterval(saleDate, { start: previousRangeStartDate, end: previousRangeEndDate })) {
					previousRangeRevenue += saleRevenue;
					previousRangeCosts += saleCost;
					previousRangeNetProfit += saleProfit;
				}
			}

            for (const oneTimeExpense of oneTimeExpensesData) {
                if (!oneTimeExpense.date || !oneTimeExpense.amount) continue;

                const expenseDate = new Date(oneTimeExpense.date);

                if (isWithinInterval(expenseDate, { start: currentRangeStartDate, end: currentRangeEndDate })) {
                    currentRangeCosts += oneTimeExpense.amount;
                    currentRangeNetProfit -= oneTimeExpense.amount;

                    if (selectedRange !== 365 && selectedRange !== 180 && selectedRange !== 730) {
                        // Accumulate revenue and cost by date for daily and monthly range
                        const expenseDateKey = format(expenseDate, 'dd MM yyyy', { locale: enGB });
                        revenueByDate.set(expenseDateKey, (revenueByDate.get(expenseDateKey) || 0));
                        costsByDate.set(expenseDateKey, (costsByDate.get(expenseDateKey) || 0) + oneTimeExpense.amount);
                        profitByDate.set(expenseDateKey, (profitByDate.get(expenseDateKey) || 0) - oneTimeExpense.amount);
                    } else {
                        const expenseMonthKey = format(expenseDate, 'MM yyyy', { locale: enGB });
                        revenueByMonth.set(expenseMonthKey, (revenueByMonth.get(expenseMonthKey) || 0));
                        costsByMonth.set(expenseMonthKey, (costsByMonth.get(expenseMonthKey) || 0) + oneTimeExpense.amount);
                        profitByMonth.set(expenseMonthKey, (profitByMonth.get(expenseMonthKey) || 0) - oneTimeExpense.amount);
                    }
                } 
            }

			// Set the calculated values for Revenue, Costs, and Net Profit
			setNetProfit(currentRangeNetProfit);
			setPreviousNetProfit(previousRangeNetProfit);

			// Determine categories based on the populated map (daily or monthly)
			const categories =
				Array.from(revenueByDate.keys()).length === 0
					? Array.from(revenueByMonth.keys()).reverse()
					: Array.from(revenueByDate.keys()).reverse();

			// Set chart data
			setChartData({
				categories,
				series: [
					{
						name: "Revenue",
						data: Array.from(revenueByDate.values()).length === 0 ? Array.from(revenueByMonth.values()) : Array.from(revenueByDate.values()),
					},
					{
						name: "Costs",
						data: Array.from(costsByDate.values()).length === 0 ? Array.from(costsByMonth.values()) : Array.from(costsByDate.values()),
					},
					{
						name: "Profit",
						data: Array.from(profitByDate.values()).length === 0 ? Array.from(profitByMonth.values()) : Array.from(profitByDate.values()),
					},
				],
			});
		};

		calculateRevenueProfitsAndCosts();
    }, [salesData, selectedRange, oneTimeExpensesData]);


	return (
		<div className="w-full">
			<div className="flex justify-between">
				<div>
					<h5 className="leading-none text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
						{currencySymbols[currency]}
						{netProfit.toFixed(2)}
					</h5>
					<span className="inline-flex items-center text-md mt-2 font-normal text-gray-500 dark:text-gray-400">
						Net profit this period
					</span>
				</div>
			</div>

			{/* Chart component */}
			<Chart
				salesData={chartData}
				selectedRange={selectedRange}
				currencySymbol={currencySymbols[currency]}
			/>
		</div>
	);
};

export default DashboardProfitsGraph;
