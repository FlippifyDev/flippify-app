"use client"

import { useSession } from "next-auth/react";

import { ISortingDoc, IMonitorCard } from "@/src/models/mongodb/monitors/monitor-card";
import { currencySymbols } from "@/src/config/currency-config";
import MonitorPage from "./MonitorContent";


const PageElectronics = () => {
	const { data: session } = useSession()
	const currency = session?.user.currency as string;
	const currencySymbol = currencySymbols[currency];
	const query = {
		"stock_available": true,
		"$expr": { "$lt": ["$price", "$rrp"] }
	}

	// Transform IElectronics to IMonitorCard
	const mapToIMonitorCard = (product: ISortingDoc): IMonitorCard => ({
		header: product.website,
		title: product.product_name,
		image: product.image,
		link: product.link,
		ebay_link: product.link,
		timestamp: product.timestamp,
		sections: [
			{
				label: "Price",
				value: `${currencySymbol}${product.price?.toFixed(2)}`
			},
			{
				label: "Profit",
				value: `${currencySymbol}${(product.estimatedProfit || 0).toFixed(2)}`,
				className: `${product.estimatedProfit || 0 > 0 ? 'text-houseBlue' : 'text-red-500'}`
			}
		],
		tableContents: {
			"RRP": {
				value: `${currencySymbol}${product.rrp?.toFixed(2) || "N/A"}`,
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
			"Stock": {
				value: product.stock_available ? "In Stock" : "Out of Stock",
				className: product.stock_available ? 'text-houseBlue font-semibold flex justify-end' : 'text-red-500 font-semibold flex justify-end'
			},
		},
	});

	return (
		<MonitorPage
			collection="Electronics"
			fetchEbayData={true}
			mapToIMonitorCard={mapToIMonitorCard}
			sortType="timestamp-roi-stock"
			query={query}
		/>
	)
}

export default PageElectronics
