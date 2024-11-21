"use client"

import { useSession } from "next-auth/react";

import { ISortingDoc, IMonitorCard } from "@/src/models/mongodb/monitors/monitor-card";
import { currencySymbols } from "@/src/config/currency-config";
import MonitorPage from "./MonitorContent";


const DealWatchPage = () => {
	const { data: session } = useSession()
	const currency = session?.user.currency as string;
	const currencySymbol = currencySymbols[currency];

	// Transform IDealWatch to IMonitorCard
	const mapToIMonitorCard = (product: ISortingDoc): IMonitorCard => ({
		header: product.website,
		title: product.product_name,
		image: product.image,
		link: product.link,
		ebay_link: product.ebay_link,
		timestamp: product.timestamp,
		sections: [
			{
				label: "Price",
				value: `${currencySymbol}${product.price.toFixed(2)}`
			},
			{
				label: "Profit",
				value: `${currencySymbol}${(product.estimatedProfit || 0).toFixed(2)}`,
				className: `${product.estimatedProfit || 0 > 0 ? 'text-houseBlue' : 'text-red-500'}`
			},
		],
		tableContents: {
			"Sales This Week": {
				value: product.sold_last_7_days?.toString() || "N/A",
				className: "flex justify-end"
			},
			"Sales This Month": {
				value: product.sold_last_month?.toString() || "N/A",
				className: "flex justify-end"
			},
			"eBay Mean Price": {
				value: `${currencySymbol}${product.ebay_mean_price?.toFixed(2) || "N/A"}`,
				className: "flex justify-end"
			},
			"eBay Max Price": {
				value: `${currencySymbol}${product.ebay_max_price?.toFixed(2) || "N/A"}`,
				className: "flex justify-end"
			},
		},
	});

	return (
		<MonitorPage collection="DealWatch" mapToIMonitorCard={mapToIMonitorCard} sortType="timestamp-roi-stock" />
	)
}

export default DealWatchPage;
