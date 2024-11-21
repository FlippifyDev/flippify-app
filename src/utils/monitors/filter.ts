import { IDoc, ISortingDoc } from "@/src/models/mongodb/monitors/monitor-card";
import { sortByRoiStockAndTimestamp, sortByReleaseDate } from "./sorting";

export const filterBySearch = (
	searchQueryToSubmit: string,
	products: IDoc[],
	sortType: string
) => {
	let filtered = products;

	// Check if search query is not empty
	if (searchQueryToSubmit.trim() !== "") {
		const lowercasedQuery = searchQueryToSubmit.toLowerCase();

		filtered = products.filter((product) => {
			// Loop through all keys in the product object
			return Object.keys(product).some((key) => {
				const value = product[key];
				if (value && typeof value === "string") {
					return value.toLowerCase().includes(lowercasedQuery);
				}
				return false;
			});
		});
	}

	// Apply sorting based on sortType
	if (sortType === "timestamp-roi-stock") {
		filtered = sortByRoiStockAndTimestamp(filtered as ISortingDoc[]);
	} else if (sortType === "release-date") {
		filtered = sortByReleaseDate(filtered as ISortingDoc[]);
	}
	return filtered;
};