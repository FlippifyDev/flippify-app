// hooks/useListedData.ts
import { useEffect, useState } from "react";

import { IListing } from "@/src/models/firebase";
import { getCachedData, setCachedData } from "../utils/cache-helpers";
import { sendApiRequest } from "@/src/services/api/request";


export const useListedData = (ebayAccessToken: string | null | undefined, customerId: string) => {
	const [listedData, setListedData] = useState<IListing[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const cacheKey = `listedData-${customerId}`; // Cache key based on customerId
	const cacheExpirationTime = 1000 * 60 * 10; // Cache expiration time (10 minutes)

	useEffect(() => {
		const fetchSalesData = async () => {
			setLoading(true);
			setError(null);

			// Check if cached data exists and is still valid
			const cachedData = getCachedData(cacheKey, cacheExpirationTime);
			if (cachedData && cachedData.length !== 0) {
				// If cached data is valid, use it
				setListedData(cachedData);
				setLoading(false);
				return;
			}

			try {
				// Attempt initial request without refreshing tokens
				const response = await sendApiRequest("active-listings", ebayAccessToken, customerId);

				if (response.status === 401 || response.status === 400) { // If unauthorized, try refreshing tokens
					const refreshedResponse = await sendApiRequest("active-listings", ebayAccessToken, customerId, true);
					const data = await refreshedResponse.json();
					setListedData(data.content);
					setCachedData(cacheKey, data.content);
				} else {
					const data = await response.json();
					setListedData(data.content);
					setCachedData(cacheKey, data.content);
				}
			} catch (error: any) {
				console.log(error)
				setError(error.message || "Failed to load sales data.");
			} finally {
				setLoading(false);
			}
		};

		fetchSalesData();
	}, [cacheKey, cacheExpirationTime, customerId, ebayAccessToken]);

	return { listedData, loading, error };
};
