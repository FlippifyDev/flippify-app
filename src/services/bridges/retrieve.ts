"use client";

// Local Imports
import { IListing, IOrder } from "@/models/store-data";
import { filterItemsByDate } from "@/utils/filters";
import { updateCachedItems } from "../firebase/update";
import { retrieveUserStoreTypes } from "../firebase/admin-retrieve";
import { getCachedData, setCachedData } from "@/utils/cache-helpers";
import { IOneTimeExpense, ISubscriptionExpense } from "@/models/expenses";
import { extractItemDateByFilter, extractItemId } from "../firebase/extract";
import { retrieveConnectedAccounts, retrieveIdToken } from "../firebase/retrieve";
import { DateFilterKeyType, ItemType, RootColType, STORES, SubColFilter, SubColType } from "../firebase/models";
import { inventoryCacheKey, oneTimeExpensesCacheKey, orderCacheKey, subscriptionsExpensesCacheKey } from "@/utils/constants";
import { expensesCol, expensesFilterKey, inventoryCol, inventoryFilterKey, oneTimeCol, ordersCol, ordersFilterKey, subscriptionsExpenseCol } from "../firebase/constants";
import { formatDateToISO } from "@/utils/format-dates";


interface RetrieveProps {
    uid: string;
    timeFrom: string;
    timeTo?: string;
    subCol?: string;
    pagenate?: boolean;
    nextPage?: boolean;
}

export async function retrieveOrders({ uid, timeFrom, timeTo, subCol, pagenate, nextPage }: RetrieveProps): Promise<IOrder[] | void> {
    return await retrieveItems({
        uid,
        rootCol: ordersCol,
        cacheKey: `${orderCacheKey}-${uid}`,
        filterKey: ordersFilterKey,
        timeFrom,
        timeTo,
        subColFilter: ordersCol,
        subCol,
        pagenate,
        nextPage
    }) as IOrder[];
}

export async function retrieveInventory({ uid, timeFrom, timeTo, subCol, pagenate, nextPage }: RetrieveProps): Promise<IListing[] | void> {
    return await retrieveItems({
        uid,
        rootCol: inventoryCol,
        cacheKey: `${inventoryCacheKey}-${uid}`,
        filterKey: inventoryFilterKey,
        timeFrom,
        timeTo,
        subColFilter: inventoryCol,
        subCol,
        pagenate,
        nextPage
    });
}

export async function retrieveOneTimeExpenses({ uid, timeFrom, timeTo, subCol, pagenate, nextPage }: RetrieveProps): Promise<IOneTimeExpense[] | void> {
    return await retrieveItems({
        uid,
        rootCol: expensesCol,
        cacheKey: `${oneTimeExpensesCacheKey}-${uid}`,
        filterKey: expensesFilterKey,
        timeFrom,
        timeTo,
        subColFilter: oneTimeCol,
        subCol,
        pagenate,
        nextPage
    }) as IOneTimeExpense[];
}

export async function retrieveSubscriptionExpenses({ uid, timeFrom, timeTo, subCol, pagenate, nextPage }: RetrieveProps): Promise<ISubscriptionExpense[] | void> {
    return await retrieveItems(
        {
            uid,
            rootCol: expensesCol,
            cacheKey: `${subscriptionsExpensesCacheKey}-${uid}`,
            filterKey: expensesFilterKey,
            timeFrom,
            timeTo,
            subColFilter: subscriptionsExpenseCol,
            subCol,
            pagenate,
            nextPage
        }) as ISubscriptionExpense[];
}

interface RetrieveItemsProps {
    uid: string;
    rootCol: RootColType;
    cacheKey: string;
    filterKey: DateFilterKeyType;
    subColFilter: SubColFilter;
    timeFrom: string;
    timeTo?: string;
    subCol?: string;
    pagenate?: boolean;
    nextPage?: boolean;
}
export async function retrieveItems({ uid, rootCol, cacheKey, filterKey, timeFrom, timeTo, subColFilter, subCol, pagenate, nextPage }: RetrieveItemsProps): Promise<ItemType[] | void> {
    try {
        // Step 1: Retrieve sub collections
        const { cols: subCols, error } = await retrieveSubCols({ uid, subColFilter, subCol });
        if (error) throw error;

        // Step 2: Retrieve all items within the time ranges
        const subColResults = await Promise.all(
            subCols.map((col) =>
                updateCachedItems({
                    uid,
                    rootCol,
                    subCol: col,
                    cacheKey,
                    filterKey,
                    timeFrom,
                    timeTo,
                    pagenate,
                    nextPage,
                })
            )
        );

        // Step 3: Combine results into a dictionary
        const mergedData: Record<string, ItemType> = {};

        // Step 4: Merge existing cached data
        const cache = getCachedData(cacheKey) as { data: Record<string, ItemType> } | undefined;
        if (cache?.data) {
            Object.assign(mergedData, cache.data);
        }

        // Step 5: Merge new results
        subColResults.forEach((result) => {
            if (result) {
                result.forEach((item) => {
                    const id = extractItemId({ item });
                    if (id) mergedData[id] = item;
                });
            }
        });

        // Step 6: Convert to array and sort
        const mergedArray = Object.values(mergedData).sort((a, b) => {
            const dateA = extractItemDateByFilter({ item: a, filterKey });
            const dateB = extractItemDateByFilter({ item: b, filterKey });

            if (!dateA && !dateB) return 0;
            if (!dateA) return 1;
            if (!dateB) return -1;

            return new Date(dateB).getTime() - new Date(dateA).getTime();
        });

        // Step 7: Write the full merged cache back once
        setCachedData(cacheKey, mergedData, new Date(timeFrom), timeTo ? new Date(timeTo) : new Date());

        // Step 8: Filter cache by date
        return filterItemsByDate({ items: mergedArray, filterKey, timeFrom, timeTo });
    } catch (error) {
        console.log(`Error in retrieveItems: ${error}`);
    }
}

export async function retrieveSubCols({ uid, subColFilter, subCol }: { uid: string, subColFilter: SubColFilter, subCol?: string }): Promise<{ cols: SubColType[], error?: string }> {
    const subCols: SubColType[] = [];

    if (subCol) {
        return { cols: [subCol] }
    }

    try {
        if (subColFilter === "oneTime") {
            subCols.push(oneTimeCol);

        } else if (subColFilter === "subscriptions") {
            subCols.push(subscriptionsExpenseCol);

        } else if (subColFilter === inventoryCol || subColFilter === ordersCol) {
            // Step 1: Retrieve id token
            const idToken = await retrieveIdToken();
            if (!idToken) throw Error("Could not find token id");

            // Step 2: Retrieve all store types
            const storeTypes = await retrieveUserStoreTypes({ idToken, rootCol: subColFilter });
            if (storeTypes === undefined) throw Error("Error fetching store types");

            // Step 3: Retrieve connected accounts
            const connectedAccounts = await retrieveConnectedAccounts({ uid });

            // Step 4: Loop through each connected account entry
            for (const [name, value] of Object.entries(connectedAccounts ?? {})) {
                if (STORES.includes(name) && value) {
                    subCols.push(name);
                }
            }

            // Step 5: Loop through each store type
            for (const name of storeTypes) {
                if (!subCols.includes(name)) {
                    subCols.push(name);
                }
            }
        }

        return { cols: subCols };
    } catch (error) {
        console.log(`Error in retrieveSubCols: ${error}`);
        return { cols: subCols, error: `${error}` };
    }
}

export async function retrieveOrderStoreTypes(): Promise<string[] | void> {
    try {
        // Step 1: Retrieve Id token
        const idToken = await retrieveIdToken();
        if (!idToken) return;

        // Step 2: Retrieve Store types
        return await retrieveUserStoreTypes({ idToken, rootCol: ordersCol });
    } catch (error) {
        console.log(`Error in retrieveOrderStoreTypes: ${error}`);
    }
}

