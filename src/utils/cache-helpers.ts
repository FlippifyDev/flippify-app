// Function to check if cached data is still valid
export const getCachedData = (key: string, expirationTime: number) => {
	const cachedData = localStorage.getItem(key);
	if (cachedData) {
		const parsedData = JSON.parse(cachedData);
		// Check if the cached data is still valid based on expiration time
		if (Date.now() - parsedData.timestamp < expirationTime) {
			return parsedData.data;
		}
	}
	return null;
};

// Function to store data in localStorage with a timestamp
export const setCachedData = (key: string, data: any) => {
	const currentCache = getCachedData(key, 0); // Get current cache, but don't check expiration
	const newCache = {
		...currentCache, // Preserve other data
		...data, // Update with new data (e.g., updated salesData)
		timestamp: Date.now(),
	};

	localStorage.setItem(key, JSON.stringify(newCache)); // Save the updated cache
};