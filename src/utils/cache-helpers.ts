// Function to check if cached data is still valid
export function getCachedData(key: string, expirationTime: number) {
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
export function setCachedData(key: string, data: any) {
    const newCache = {
        data, // Store only the data (no need to preserve previous cache)
        timestamp: Date.now(), // Add a timestamp for expiration check
    };

    localStorage.setItem(key, JSON.stringify(newCache)); // Save the updated cache
};
