"use client"

// Local imports
import { IMonitorCard, ISortingDoc } from "@/src/models/mongodb/monitors/monitor-card";
import MonitorPage from "./MonitorContent";
import { formatTimeUntil } from "@/src/utils/format-dates";
import { countryToAbbreviation } from "@/src/utils/mapping-text";


const SneakerReleaseInfoPage = () => {
	// Transform ISneakerReleaseInfo to IMonitorCard
	const mapToIMonitorCard = (product: ISortingDoc): IMonitorCard => ({
		header: product.website,
		title: product.product_name,
		image: product.image,
		link: product.link,
		ebay_link: product.link, 
		timestamp: product.timestamp,
		release_date: product.release_date,
		cardHeight: "28rem",
		tableContents: {
			"Releases In": {
				value: formatTimeUntil(product.release_date),
				className: "flex justify-end"
			},
			"Releases Date": {
				value: new Date(product.release_date).toLocaleDateString(),
				className: "flex justify-end"
			},
			"Number of Raffles": {
				value: product.custom_fields["Number Of Raffles"] || "N/A",
				className: "flex justify-end"
			},
			"Regions": {
				value: product.custom_fields.Regions
					? product.custom_fields.Regions.map((region: string) => countryToAbbreviation[region] || region).join(", ")
					: "N/A",
				className: "flex justify-end"
			},
		},
	});

	return (
		<MonitorPage
			collection="SneakerReleaseInfo"
			fetchEbayData={true}
			mapToIMonitorCard={mapToIMonitorCard} 
			sortType="release-date"
		/>
	);
}

export default SneakerReleaseInfoPage;