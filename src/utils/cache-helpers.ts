// Function to check if cached data is still valid
export function getCachedData(key: string, expirationTime: number, returnCacheTimes?: boolean) {
    const cachedData = localStorage.getItem(key);
    if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        if (!parsedData) {
            return null;
        }

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


export function setCachedTimes(key: string, timeFrom?: Date, timeTo?: Date) {
    const newCache = {
        cacheTimeFrom: timeFrom,
        cacheTimeTo: timeTo
    };
    localStorage.setItem(key, JSON.stringify(newCache));
}

export function getCachedTimes(key: string): { cacheTimeFrom?: Date, cacheTimeTo?: Date } | null {
    const cachedTimes = localStorage.getItem(key);
    if (cachedTimes) {
        const parsedData = JSON.parse(cachedTimes);
        if (!parsedData) {
            return null;
        }
        return parsedData;
    }
    return null;

}

// Function to store data in localStorage with a timestamp
export function setCachedData(key: string, data: any, cacheTimeFrom?: Date, cacheTimeTo?: Date) {
    const cachedTimes = getCachedTimes(key); 
    const timeFrom = cacheTimeFrom ? cacheTimeFrom : cachedTimes?.cacheTimeFrom;
    const timeTo = cacheTimeTo ? cacheTimeTo : cachedTimes?.cacheTimeTo;

    const newCache = {
        data: data,
        timestamp: Date.now(),
        cacheTimeFrom: timeFrom,
        cacheTimeTo: timeTo
    };
    
    setCachedTimes(key, timeFrom, timeTo);
    localStorage.setItem(key, JSON.stringify(newCache));
};
