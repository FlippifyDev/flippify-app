import "@/styles/overview-cards.css"
import { IEbayOrder } from '@/models/store-data';

import React, { useEffect, useState } from 'react';

const currencySymbols: Record<string, string> = {
	GBP: '£',
	USD: '$',
	EUR: '€',
};

interface DashboardOverviewCardProps {
    salesData: IEbayOrder[];
	currency: string;
	selectedRange: number;
}

const DashboardOverviewCard: React.FC<DashboardOverviewCardProps> = ({ salesData, currency, selectedRange }) => {
	const [overviewData, setOverviewData] = useState({
		totalRevenue: 0,
		totalCosts: 0,
		totalSales: 0,
	});
	const [missingCosts, setMissingCosts] = useState(false);

	useEffect(() => {
		if (!salesData || salesData.length === 0) return;

		// Calculate range start date based on selectedRange
		const currentDate = new Date();
		let rangeStartDate = new Date();

		if (selectedRange === 1) {
			// Today: start from midnight today
			rangeStartDate.setHours(0, 0, 0, 0);
		} else if (selectedRange === 7) {
			// This Week: start from the most recent Monday
			const dayOfWeek = currentDate.getDay();
			rangeStartDate.setDate(currentDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)); // Adjust for Sunday (0)
			rangeStartDate.setHours(0, 0, 0, 0);
		} else if (selectedRange === 30) {
			// This Month: start from the first day of the current month
			rangeStartDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
		} else if (selectedRange === 365) {
			// This Year: start from January 1 of the current year
			rangeStartDate = new Date(currentDate.getFullYear(), 0, 1);
		} else {
			// Custom range: calculate by subtracting the number of days
			rangeStartDate.setDate(currentDate.getDate() - selectedRange);
		}

		let totalRevenue = 0;
		let totalCosts = 0;
		let totalSales = 0;
		let costsMissing = false;

        salesData.forEach((order: IEbayOrder) => {
            if (order.status !== 'Completed') return;
            const saleDate = new Date(order.sale.date);

			// Only include sales within the calculated range
			if (saleDate >= rangeStartDate && saleDate <= currentDate) {
                const salePrice = order.sale.price || 0;
				const purchasePrice = order.purchase.price || null;
                const shippingFees = order.shipping.fees || 0;
                const additionalFees = order.additionalFees || 0;

                if (purchasePrice) {
                    const totalPurchaseCost = purchasePrice;
                    totalRevenue += salePrice;
					totalCosts += totalPurchaseCost + shippingFees + additionalFees;
				} else {
					costsMissing = true;
				}

                totalSales += order.sale.quantity;
			}
		});

		setOverviewData({
			totalRevenue,
			totalCosts,
			totalSales,
		});
		setMissingCosts(costsMissing);

	}, [salesData, selectedRange]); // Re-run when salesData or selectedRange changes


	const roi = overviewData.totalCosts > 0
		? ((overviewData.totalRevenue - overviewData.totalCosts) / overviewData.totalCosts * 100).toFixed(2)
		: 'N/A';

	const currencySymbol = currencySymbols[currency] || '£';

	return (
		<div className="w-full flex flex-col items-center">
			<div className="grid grid-cols-2 lg:grid-cols-4 font-semibold justify-center gap-2 sm:gap-4 w-full">
				<div className="stats shadow-sm bg-white w-full flex-shrink-0 overflow-x-auto p-0 sm:p-2 rounded-lg">
					<div className="stat">
						<div className="stat-title text-sm sm:text-base text-houseBlue">Total Revenue</div>
						<div className="stat-value font-bold text-xl sm:text-2xl text-black">
							{currencySymbol}{overviewData.totalRevenue.toFixed(2)}
						</div>
					</div>
				</div>
                <div className="stats shadow-sm bg-white w-full flex-shrink-0 overflow-x-auto p-0 sm:p-2 rounded-lg">
					<div className="stat">
						<div className="stat-title text-sm sm:text-base text-houseBlue">Total Costs</div>
						<div className="stat-value font-bold text-xl sm:text-2xl text-black">
							{currencySymbol}{overviewData.totalCosts.toFixed(2)}
						</div>
					</div>
				</div>
                <div className="stats shadow-sm bg-white w-full flex-shrink-0 overflow-x-auto p-0 sm:p-2 rounded-lg">
					<div className="stat">
						<div className="stat-title text-sm sm:text-base text-houseBlue">No. Sales</div>
						<div className="stat-value font-bold text-xl sm:text-2xl text-black">
							{overviewData.totalSales}
						</div>
					</div>
				</div>
                <div className="stats shadow-sm bg-white w-full flex-shrink-0 overflow-x-auto p-0 sm:p-2 rounded-lg">
					<div className="stat">
						<div className="stat-title text-sm sm:text-base text-houseBlue">ROI</div>
						<div className="stat-value font-bold text-xl sm:text-2xl text-black">{roi}%</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DashboardOverviewCard;
