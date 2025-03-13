// hooks/useSalesData.ts
import { useEffect, useState } from "react";

import { IOrder } from "@/models/firebase";
import { getCachedData, setCachedData } from "../utils/cache-helpers";
import { sendApiRequest } from "@/services/api/request";


export const useSalesData = (ebayAccessToken: string | null | undefined, customerId: string) => {
	const [salesData, setSalesData] = useState<IOrder[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const cacheKey = `salesData-${customerId}`; // Cache key based on customerId
	const cacheExpirationTime = 1000 * 60 * 10; // Cache expiration time (10 minutes)


	useEffect(() => {
		const fetchSalesData = async () => {
			setLoading(true);
			setError(null);

			// Check if cached data exists and is still valid
			const cachedData = getCachedData(cacheKey, cacheExpirationTime);
			if (cachedData && cachedData.length !== 0) {
				// If cached data is valid, use it
				setSalesData(cachedData);
				setLoading(false);
				return;
			}

			try {
				// Attempt initial request without refreshing tokens
				const response = await sendApiRequest("orders", ebayAccessToken, customerId);

				if (response.status === 401 || response.status === 400) { // If unauthorized, try refreshing tokens
					const refreshedResponse = await sendApiRequest("orders", ebayAccessToken, customerId, true);
					const data = await refreshedResponse.json();
					setSalesData(data.content);
					setCachedData(cacheKey, data.content);
				} else {
					const data = await response.json();
					setSalesData(data.content);
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

	return { salesData, loading, error };
};

