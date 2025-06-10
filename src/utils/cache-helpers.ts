import { StoreType } from "@/models/store-data";
import { cacheExpirationTime } from "./constants";
import { ItemType } from "@/services/firebase/models";
import { extractItemDate, extractItemId } from "@/services/firebase/extract";

type ItemCacheType = { data: Record<string, ItemType>, cacheTimeFrom?: Date, cacheTimeTo?: Date, timestamp?: Date }


// Function to check if cached data is still valid
export function getCachedData(key: string, returnCacheTimes?: boolean): ItemCacheType | void {
    const cachedData = sessionStorage.getItem(key);
    if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        if (!parsedData) {
            return;
        }

        // Check if the cached data is still valid based on expiration time
        if (Date.now() - parsedData.timestamp >= cacheExpirationTime) {
            return
        }

        if (returnCacheTimes) {
            return parsedData;
        } else {
            return { data: parsedData.data };
        }
    }
    return;
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
export function setCachedData(key: string, data: Record<string, ItemType>, cacheTimeFrom?: Date, cacheTimeTo?: Date) {
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


export function addCacheData(key: string, data: Record<string, ItemType>) {
    const cachedData = getCachedData(key, true);

    // Merge into existing cache
    const existingData: Record<string, ItemType> = cachedData?.data ?? {};

    // Add or update incoming items
    for (const itemId in data) {
        if (data.hasOwnProperty(itemId)) {
            existingData[itemId] = data[itemId];
        }
    }

    // Sort by date descending
    const sortedArray = Object.values(existingData).sort((a, b) => {
        const dateAStr = extractItemDate({ item: a });
        const dateBStr = extractItemDate({ item: b });

        // Handle missing dates safely
        if (!dateAStr && !dateBStr) return 0;
        if (!dateAStr) return 1;
        if (!dateBStr) return -1;

        const dateA = new Date(dateAStr);
        const dateB = new Date(dateBStr);
        return dateB.getTime() - dateA.getTime();
    });

    // Reconstruct dictionary after sorting
    const sortedData: Record<string, ItemType> = {};
    for (const item of sortedArray) {
        const itemId = extractItemId({ item });
        if (itemId) {
            sortedData[itemId] = item;
        }
    }

    // Create new cache object
    const newCache = {
        data: sortedData,
        timestamp: Date.now(),
        cacheTimeFrom: cachedData?.cacheTimeFrom,
        cacheTimeTo: cachedData?.cacheTimeTo
    };

    // Update cache
    setCachedTimes(key, newCache.cacheTimeFrom, newCache.cacheTimeTo);
    sessionStorage.setItem(key, JSON.stringify(newCache));
}


export function updateCacheData(key: string, data: ItemType) {
    // Check if the incoming data is an order or a listing
    const id = extractItemId({ item: data })
    if (!id) return;
    
    const cachedData = getCachedData(key, true);
    if (cachedData) {
        // Update the existing dictionary with the new data, keyed by data.id
        const updatedCacheData = {
            ...cachedData.data,
            [id]: data,
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
        setCachedData(key, { [id]: data });
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


export function colDataFetched(cacheKey: string, storeType: StoreType): boolean {
    const raw = sessionStorage.getItem(`${cacheKey}-store`);
    let cache: StoreType[];

    // 1. Parse existing cache (or start empty)
    try {
        cache = raw ? JSON.parse(raw) : [];
        if (!Array.isArray(cache)) {
            // malformed but parseable JSON—reset
            cache = [];
        }
    } catch {
        // invalid JSON—reset
        cache = [];
    }

    // 2. If it's already in the list, return true
    if (cache.includes(storeType)) {
        return true;
    }

    // 3. Otherwise, add it and persist
    cache.push(storeType);
    sessionStorage.setItem(`${cacheKey}-store`, JSON.stringify(cache));

    // Indicate we added it
    return false;
}


export function setLastVisibleCacheData(cacheKey: string, data: any) {
    const raw = sessionStorage.getItem(cacheKey);

    let parsed: Record<string, any> = {};

    if (raw) {
        try {
            parsed = JSON.parse(raw);
        } catch (error) {
            console.error(`Failed to parse sessionStorage data for ${cacheKey}:`, error);
        }
    }

    parsed.lastVisible = data;

    try {
        sessionStorage.setItem(cacheKey, JSON.stringify(parsed));
    } catch (error) {
        console.error(`Failed to save lastVisible to sessionStorage for ${cacheKey}:`, error);
    }
}


export function getLastVisibleCacheData(cacheKey: string): any | null {
    const raw = sessionStorage.getItem(cacheKey);

    if (!raw) return null;

    try {
        const parsed = JSON.parse(raw);
        return parsed.lastVisible ?? null;
    } catch (error) {
        console.error(`Failed to parse sessionStorage data for ${cacheKey}:`, error);
        return null;
    }
}