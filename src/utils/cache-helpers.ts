// Function to check if cached data is still valid
export function getCachedData(key: string, expirationTime: number, returnCacheTimes?: boolean) {
    const cachedData = localStorage.getItem(key);
    if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        // Check if the cached data is still valid based on expiration time
        if (Date.now() - parsedData.timestamp >= expirationTime) {
            return null
        }

        if (returnCacheTimes) {
            return parsedData;
        } else {
            return parsedData.data;
        }
    }
    return null;
};

// Function to store data in localStorage with a timestamp
export function setCachedData(key: string, data: any, cacheTimeFrom?: Date, cacheTimeTo?: Date) {
    const newCache = {
        data, 
        timestamp: Date.now(), // Add a timestamp for expiration check
        cacheTimeFrom,
        cacheTimeTo
    };

    localStorage.setItem(key, JSON.stringify(newCache)); // Save the updated cache
};
