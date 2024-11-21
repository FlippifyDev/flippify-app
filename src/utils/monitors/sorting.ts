import { ISortingDoc } from "@/src/models/mongodb/monitors/monitor-card";


export const sortByRoiStockAndTimestamp = (products: ISortingDoc[]) => {
	return products.sort((a, b) => {
		// Handle missing data by checking if price, ebay_mean_price, and ebay_max_price exist
		const missingDataA = !a.price || a.ebay_mean_price === undefined || a.ebay_max_price === undefined;
		const missingDataB = !b.price || b.ebay_mean_price === undefined || b.ebay_max_price === undefined;

		// If product A is missing data and B isn't, A should come later in the list
		if (missingDataA && !missingDataB) return 1;
		if (!missingDataA && missingDataB) return -1;

		// Calculate ROI (return on investment) for each product, defaulting to 0 if data is missing
		const roiA = a.estimatedProfit && a.price ? a.estimatedProfit / a.price : 0;
		const roiB = b.estimatedProfit && b.price ? b.estimatedProfit / b.price : 0;

		// First, compare by ROI (descending order)
		if (roiA !== roiB) {
			return roiB - roiA; // Sort by ROI (highest first)
		}

		// Second, if ROI is the same, compare by stock availability (descending order)
		const stockA = a.sold_last_7_days || a.sold_last_month || 0;
		const stockB = b.sold_last_7_days || b.sold_last_month || 0;

		if (stockA !== stockB) {
			return stockB - stockA; // Sort by stock availability (highest first)
		}

		// Lastly, if both ROI and stock are the same, compare by timestamp (most recent first)
		const timestampA = new Date(a.timestamp).getTime();
		const timestampB = new Date(b.timestamp).getTime();

		return timestampB - timestampA; // Sort by timestamp (newest first)
	});
};


// Function to sort products by release date, placing past releases at the end
export const sortByReleaseDate = (products: ISortingDoc[]) => {
	const now = new Date().getTime(); // Get current time

	return products.sort((a, b) => {
		const releaseA = new Date(a.release_date).getTime();
		const releaseB = new Date(b.release_date).getTime();

		const isPastA = releaseA < now; // Check if A's release date is in the past
		const isPastB = releaseB < now; // Check if B's release date is in the past

		// If both are in the past or both are in the future, sort by date
		if (isPastA === isPastB) {
			return releaseA - releaseB;
		}

		// If A is in the past but B is in the future, place A after B
		return isPastA ? 1 : -1;
	});
};