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
	localStorage.setItem(
		key,
		JSON.stringify({
			data: data,
			timestamp: Date.now(),
		})
	);
};