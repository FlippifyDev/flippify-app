// Local Imports
import { usersCol } from "./constants";
import { firestore } from "@/lib/firebase/config";
import { updateStoreInfo } from "../api/request";
import { retrieveItemsFromDB, retrieveUserRef, retrieveUserRefById } from "./retrieve";
import { extractItemDateByFilter, extractItemId } from "./extract";
import { getCachedData, getLastVisibleCacheData, setCachedData, setLastVisibleCacheData, colDataFetched, updateCacheData } from "@/utils/cache-helpers";
import { DateFilterKeyType, ItemType, RootColType, SubColType } from "./models";

// External Imports
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { formatDateToISO } from "@/utils/format-dates";


export async function updateUser({ uid, data }: { uid: string, data: any }): Promise<boolean> {
    try {
        const userRef = await retrieveUserRefById({ uid });

        if (!userRef) {
            console.error(`No user found with uid: ${uid}`);
            return false;
        }

        await setDoc(userRef, data, { merge: true });

        console.log("User document updated successfully.");
        return true;
    } catch (error) {
        console.error("Error updating user in Firestore:", error);
        return false;
    }
}

export async function updateUserPreferences({ uid, currency }: { uid: string, currency: string }) {
    try {
        // Step 1: Retrieve document reference
        const docRef = doc(firestore, usersCol, uid);
        if (!docRef) return

        // Step 2: Update preferences
        await setDoc(
            docRef,
            {
                preferences: {
                    currency
                }
            },
            { merge: true }
        );

    } catch (error) {
        console.error("Error updating Firestore user:", error);
        throw error;
    }
}


export async function updateItem({ uid, item, rootCol, subCol, cacheKey }: { uid: string, item: ItemType, rootCol: RootColType, subCol: SubColType, cacheKey: string }) {
    try {
        // Step 1: Extract Item ID
        const id = extractItemId({ item });
        if (!id) throw Error(`Item does not contain an ID`);

        // Step 2: Retrieve document reference
        const docRef = doc(firestore, rootCol, uid, subCol, id);
        if (!docRef) throw Error(`No item found with ID: ${id}`)

        // Step 3: Update item
        await updateDoc(docRef, { ...item });

        // Step 4: Update item in cache
        updateCacheData(`${cacheKey}-${uid}`, item)
    } catch (error) {
        console.error("Error updateItem:", error);
        throw error;
    }
}


interface UpdateCachedItemsProps {
    uid: string;
    rootCol: RootColType;
    subCol: SubColType;
    cacheKey: string;
    filterKey: DateFilterKeyType;
    timeFrom: string;
    timeTo?: string;
    update?: boolean;
    pagenate?: boolean;
    nextPage?: boolean;
}
export async function updateCachedItems({ uid, rootCol, subCol, cacheKey, filterKey, timeFrom, timeTo, update, pagenate, nextPage }: UpdateCachedItemsProps): Promise<ItemType[]> {
    try {
        // Step 1: Retrieve cache
        const cacheData = getCachedData(cacheKey, true);
        const isColDataFetched = colDataFetched(cacheKey, subCol);

        // Step 2: Extract cache data
        const cache = cacheData?.data ? Object.values(cacheData.data) : [];
        const cacheTimeFrom = cacheData?.cacheTimeFrom ? new Date(cacheData.cacheTimeFrom) : undefined;
        const cacheTimeTo = cacheData?.cacheTimeTo ? new Date(cacheData.cacheTimeTo) : undefined;

        // Step 3: Create date objects with timeFrom and timeTo
        const timeFromDate = new Date(timeFrom);
        const timeToDate = timeTo ? new Date(timeTo) : new Date();

        let newTimeFrom = timeFrom;
        let newTimeTo = timeTo ? timeTo : formatDateToISO(new Date());

        // Step 4: If cache exists then only request new data if timeFrom & timeTo are out of range of the cache
        if (cache && cache.length > 0 && !update && !nextPage && isColDataFetched) {
            // Step 5: Extract cache items
            const firstItem = cache[0];
            const lastItem = cache[cache.length - 1];

            // Step 6: Determine the oldest & newest filter dates in the cache
            const oldestTime = cacheTimeFrom ?? new Date(extractItemDateByFilter({ item: lastItem, filterKey }));
            const newestTime = cacheTimeTo ?? new Date(extractItemDateByFilter({ item: firstItem, filterKey }));

            // Step 7: Check if requested times are within the cached data range
            if (timeFromDate >= oldestTime && timeToDate <= newestTime) return [];

            // Step 8: Check if timeFrom is older then the oldest cached data item
            if (timeFromDate < oldestTime && timeToDate <= newestTime) {
                newTimeFrom = timeFrom;
                newTimeTo = oldestTime.toISOString();
            }

            // Step 9: Check if timeTo is newer then the newest cached data item
            else if (timeFromDate >= oldestTime && timeToDate > newestTime) {
                newTimeFrom = newestTime.toISOString();
                newTimeTo = timeTo ? timeTo : formatDateToISO(new Date());
            }

            // Step 10: Check if timeFrom is older & timeTo is newer
            else if (timeFromDate < oldestTime && timeToDate > newestTime) {
                newTimeFrom = timeFrom;
                newTimeTo = timeTo ? timeTo : formatDateToISO(new Date());
            }

        }
        // Step 11: If the next page is requested
        else if (nextPage) {
            newTimeFrom = timeFrom;
            newTimeTo = timeTo ? timeTo : formatDateToISO(new Date());
        }
        // Step 12: If no cache exists or an update was requested
        else if (update || !cache || cache.length === 0) {
            // Step 13: Request API for new data
            await updateStoreInfo(rootCol, subCol, uid);

            // Step 14: Set the new times to the requested ones
            newTimeFrom = timeFrom;
            newTimeTo = timeTo ? timeTo : formatDateToISO(new Date());
        }

        // Step 15: Retrieve last visible document snapshot from cache
        let lastVisibleSnapshot;
        if (nextPage) {
            lastVisibleSnapshot = getLastVisibleCacheData(`snapshot-${subCol}-${cacheKey}`);
        }

        // Step 16: Retrieve the new items from the database using the new times
        const { items, lastVisible } = await retrieveItemsFromDB({ uid, rootCol, subCol, filterKey, timeFrom: newTimeFrom, timeTo: newTimeTo, pagenate, lastDoc: lastVisibleSnapshot });

        // Step 17: Update the last visible snapshot in cache
        if (lastVisible) {
            setLastVisibleCacheData(`snapshot-${subCol}-${cacheKey}`, lastVisible);
        }

        return Object.values(items);
    } catch (error) {
        console.error(`Error in retrieveItemsFromDB`, error);
        throw new Error(`${error}`);
    }
}