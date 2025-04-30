import { IListing, IOrder } from "@/models/store-data";
import { cacheExpirationTime } from "./constants";

type CachedItem = IOrder | IListing;

// Function to check if cached data is still valid
export function getCachedData(key: string, returnCacheTimes?: boolean) {
    const cachedData = sessionStorage.getItem(key);
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
    sessionStorage.setItem(key, JSON.stringify(newCache));
}

export function getCachedTimes(key: string): { cacheTimeFrom?: Date, cacheTimeTo?: Date } | null {
    const cachedTimes = sessionStorage.getItem(key);
    if (cachedTimes) {
        const parsedData = JSON.parse(cachedTimes);
        if (!parsedData) {
            return null;
        }
        return parsedData;
    }
    return null;

}

// Function to store data in sessionStorage with a timestamp
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
    sessionStorage.setItem(key, JSON.stringify(newCache));
};


function isOrder(item: CachedItem): item is IOrder {
    return 'sale' in item && !!item.sale;
}

export function addCacheData(key: string, data: any) {
    const cachedData = getCachedData(key, true);

    // Determine key
    const dataKey = data.transactionId ?? data.itemId;

    if (cachedData) {
        cachedData.data[dataKey] = data;

        // Convert object to array for sorting
        const sortedArray = Object.values(cachedData.data as Record<string, CachedItem>)
            .sort((a, b) => {
                const dateA = isOrder(a) ? new Date(a.sale?.date ?? "").getTime() : new Date(a.dateListed ?? "").getTime();
                const dateB = isOrder(b) ? new Date(b.sale?.date ?? "").getTime() : new Date(b.dateListed ?? "").getTime();
                return dateB - dateA;
            });

        // Convert back to object using transactionId/itemId as key
        const sortedData: Record<string, CachedItem> = {};
        sortedArray.forEach(item => {
            const key = isOrder(item) ? item.transactionId : item.itemId;
            if (key) {
                sortedData[key] = item;
            }
        });

        const newCache = {
            data: sortedData,
            timestamp: cachedData.timestamp,
            cacheTimeFrom: cachedData.cacheTimeFrom,
            cacheTimeTo: cachedData.cacheTimeTo,
        };

        setCachedTimes(key, cachedData.cacheTimeFrom, cachedData.cacheTimeTo);
        sessionStorage.setItem(key, JSON.stringify(newCache));
    } else {
        // Initialize as a new object
        const dataKey = data.transactionId ?? data.itemId;
        const newData = { [dataKey]: data };
        setCachedData(key, newData);
    }
}


export function updateCacheData(key: string, data: any) {
    const cachedData = getCachedData(key, true);
    if (cachedData) {

        // Check if the incoming data is an order or a listing
        let dataKey;
        if (data.transactionId) {
            dataKey = data.transactionId;
        } else {
            dataKey = data.itemId
        }

        // Update the existing dictionary with the new data, keyed by data.id
        const updatedCacheData = {
            ...cachedData.data,
            [dataKey]: data,
        };

        const newCache = {
            data: updatedCacheData,
            timestamp: cachedData.timestamp,
            cacheTimeFrom: cachedData.cacheTimeFrom,
            cacheTimeTo: cachedData.cacheTimeTo,
        };

        sessionStorage.setItem(key, JSON.stringify(newCache));
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

        sessionStorage.setItem(key, JSON.stringify(newCache));
    }
}


export function getCachedItem(key: string, itemKey: string) {
    const cachedData = sessionStorage.getItem(key);
    if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        if (!parsedData) {
            return null;
        }

        return parsedData.data[itemKey]
    }
}