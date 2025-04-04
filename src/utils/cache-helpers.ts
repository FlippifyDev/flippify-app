import { cacheExpirationTime } from "./constants";

// Function to check if cached data is still valid
export function getCachedData(key: string, returnCacheTimes?: boolean) {
    const cachedData = localStorage.getItem(key);
    if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        if (!parsedData) {
            return null;
        }

        // Check if the cached data is still valid based on expiration time
        if (Date.now() - parsedData.timestamp >= cacheExpirationTime) {
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


export function addCacheData(key: string, data: any) {
    const cachedData = getCachedData(key, true);
    if (cachedData) {
        const dataKey = data.itemId || data.orderId;
        cachedData.data[dataKey] = data;
        const newCacheData = {
            ...cachedData.data,
        };

        const newCache = {
            data: newCacheData,
            timestamp: cachedData.timestamp,
            cacheTimeFrom: cachedData.cacheTimeFrom,
            cacheTimeTo: cachedData.cacheTimeTo
        };
        setCachedTimes(key, cachedData.cacheTimeFrom, cachedData.cacheTimeTo);
        localStorage.setItem(key, JSON.stringify(newCache));
    } else {
        setCachedData(key, [data]);
    }
}


export function updateCacheData(key: string, data: any) {
    const cachedData = getCachedData(key, true);
    if (cachedData) {
        const dataKey = data.itemId || data.orderId;
        // Update the existing dictionary with the new data, keyed by data.id
        const updatedCacheData = {
            [dataKey]: data,
            ...cachedData.data,
        };

        const newCache = {
            data: updatedCacheData,
            timestamp: cachedData.timestamp,
            cacheTimeFrom: cachedData.cacheTimeFrom,
            cacheTimeTo: cachedData.cacheTimeTo,
        };

        localStorage.setItem(key, JSON.stringify(newCache));
    } else {
        // If there's no existing cache, create a new cache with this item.
        setCachedData(key, { [data.id]: data });
    }
}


export function removeCacheData(key: string, itemKey: string) {
    const cachedData = getCachedData(key, true);
    if (cachedData) {
        // Create a new cache without the removed item
        const updatedCacheData = { ...cachedData.data };
        delete updatedCacheData[itemKey];

        const newCache = {
            data: updatedCacheData,
            timestamp: cachedData.timestamp,
            cacheTimeFrom: cachedData.cacheTimeFrom,
            cacheTimeTo: cachedData.cacheTimeTo,
        };

        localStorage.setItem(key, JSON.stringify(newCache));
    }
}