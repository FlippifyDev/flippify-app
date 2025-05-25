// Local Imports
import { IUser } from "@/models/user";
import { createUser } from "./create";
import { updateStoreInfo } from "../api/request";
import { firestore, auth } from "@/lib/firebase/config";
import { IListing, IOrder, StoreType } from "@/models/store-data";
import { filterInventoryByTime, filterOrdersByTime } from "@/utils/filters";
import { getCachedData, setCachedData, storeDataFetched } from "@/utils/cache-helpers";
import { inventoryCacheKey, oneTimeExpensesCacheKey, orderCacheKey, subscriptionsExpensesCacheKey } from "@/utils/constants";

// External Imports
import { collection, doc, DocumentData, DocumentReference, getDoc, getDocs, limit, orderBy, query, QueryConstraint, QueryDocumentSnapshot, startAfter, startAt, where } from 'firebase/firestore';
import { IOneTimeExpense, ISubscriptionExpense } from "@/models/expenses";


async function retrieveIdToken() {
    try {
        const user = auth.currentUser;
        if (!user) return;

        const idToken = await user?.getIdToken();
        if (!idToken) return;

        return idToken;
    } catch (error) {
        console.error(error)
    }
}


/**
 * Retrieves a user from Firestore using their UID. If the user does not exist, it creates a new user.
 * 
 * @param {string} uid - The unique identifier of the user.
 * @param {string | null} [email] - The email address of the user (required if creating a new user).
 * @returns {Promise<IUser | void>} - Returns the user data if found or created, otherwise void.
 * @throws {Error} - Throws an error if email is required but not provided.
 */
async function retrieveUserAndCreate(uid: string, email?: string | null): Promise<IUser | void> {
    try {
        // Retrieve the user document from Firestore using the UID
        const userRef = doc(firestore, 'users', uid);
        const userDoc = await getDoc(userRef);

        // Check if the user document exists
        if (userDoc.exists()) {
            // Return the user data as an IUser object
            const userData: IUser = userDoc.data() as IUser;
            return userData;
        } else {
            if (!email) {
                throw new Error('Email is required to create a new user');
            };
            return await createUser(uid, email)
        }
    } catch (error) {
        console.error('Error retrieving user from Firestore:', error);
    }
}


/**
 * Retrieves a user from Firestore based on a specified field and value.
 * 
 * @param {string} filter_key - The field to filter by (e.g., "email", "username").
 * @param {string} filter_value - The value to match for the specified field.
 * @returns {Promise<IUser | null>} - Returns the user data if found, otherwise null.
 * @throws {Error} - Logs and handles errors if Firestore retrieval fails.
 */
async function retrieveUser(filter_key: string, filter_value: string): Promise<IUser | null> {
    try {
        const userDoc = await retrieveUserSnapshot(filter_key, filter_value);
        if (userDoc) {
            return userDoc.data() as IUser;
        }
        return null;
    } catch (error) {
        console.error(`Error retrieving user with ${filter_key}=${filter_value}:`, error);
        return null;
    }
}


/**
 * Retrieves a Firestore user document based on a specified field and value.
 * 
 * @param {string} filter_key - The field to filter by (e.g., "email", "username").
 * @param {string} filter_value - The value to match for the specified field.
 * @returns {Promise<QueryDocumentSnapshot<DocumentData, DocumentData> | null>} - 
 *          Returns the first matching Firestore document snapshot if found, otherwise null.
 * @throws {Error} - Logs and handles errors if Firestore retrieval fails.
 */
async function retrieveUserSnapshot(filter_key: string, filter_value: string): Promise<QueryDocumentSnapshot<DocumentData, DocumentData> | null> {
    try {
        const usersCollection = collection(firestore, "users");
        const q = query(usersCollection, where(filter_key, "==", filter_value));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            return querySnapshot.docs[0];
        } else {
            console.log(`No user doc found with ${filter_key}: ${filter_value}`);
            return null;
        }
    } catch (error) {
        console.error(`Error retrieving user doc with ${filter_key}=${filter_value}:`, error);
        return null;
    }
}


/**
 * Retrieves a Firestore document reference for a user based on a specific field and value.
 * 
 * @param {string} filterKey - The field to filter by (e.g., "email", "username").
 * @param {string} filterValue - The value to match for the specified field.
 * @returns {Promise<DocumentReference | null>} - The Firestore document reference if found, otherwise null.
 */
async function retrieveUserRef(filterKey: string, filterValue: string): Promise<DocumentReference | null> {
    try {
        const usersCollection = collection(firestore, "users");
        const q = query(usersCollection, where(filterKey, "==", filterValue));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const userRef = doc(firestore, "users", querySnapshot.docs[0].id);
            return userRef;
        }
        console.log(`No user found with ${filterKey}: ${filterValue}`);
        return null;
    } catch (error) {
        console.error(`Error retrieving user reference with ${filterKey}=${filterValue}:`, error);
        return null;
    }
}


/**
 * Retrieves a reference to a user's document in Firestore using their unique ID (UID).
 *
 * This function constructs a reference to the Firestore document for a user in the 'users' collection
 * using the provided UID. It returns the reference to the document if successful, or null if an error occurs.
 *
 * @param {string} uid - The unique identifier of the user.
 * @returns {Promise<DocumentReference | null>} A promise that resolves to the user's document reference if found, or null if an error occurs.
 */
async function retrieveUserRefById(uid: string): Promise<DocumentReference | null> {
    try {
        const userRef = doc(firestore, 'users', uid);
        if (!userRef) {
            console.log(`No user found with id=${uid}`);
            return null;
        }
        return userRef;
    } catch (error) {
        console.error(`Error retrieving user reference with id=${uid}:`, error);
        return null;
    }
}


/**
 * Retrieves a list of orders from Firestore for a specific user based on their UID.
 *
 * @param {string} uid - The unique identifier of the user.
 * @param {string | null} timeFrom - The start date (in ISO format) to filter the orders by. If null, no filter is applied.
 * @param {number} [itemsPerPage] - (Optional) Maximum number of orders to return (for pagination).
 * @param {string | null} timeTo - (Optional) The end date (in ISO format) to filter the orders by.
 * @param {{ [key: string]: any }} [filter] - (Optional) Additional filters.
 *
 * @returns {Promise<Record<string, IOrder>>} - A mapping of transactionId to its order data.
 * @throws {Error} - Logs and handles errors if Firestore retrieval fails.
 */
interface RetrieveUserOrdersFromDBProps {
    uid: string;
    timeFrom: string | null;
    timeTo?: string | null;
    filter?: { [key: string]: any };
    storeType: StoreType;
}

async function retrieveUserOrdersFromDB({
    uid,
    timeFrom,
    timeTo,
    filter,
    storeType,
}: RetrieveUserOrdersFromDBProps): Promise<Record<string, IOrder>> {
    try {
        // Reference to the user's orders collection
        const ordersCollectionRef = collection(firestore, "orders", uid, storeType);

        // Build an array of query constraints for clarity
        const constraints: QueryConstraint[] = [orderBy("sale.date", "desc")];

        // If timeFrom is provided, filter orders with sale.date >= timeFrom
        if (timeFrom) {
            constraints.push(where("sale.date", ">=", timeFrom));
        }

        // If timeTo is provided, filter orders with sale.date <= timeTo
        if (timeTo) {
            constraints.push(where("sale.date", "<=", timeTo));
        }

        // Apply any additional filters
        if (filter) {
            Object.entries(filter).forEach(([field, value]) => {
                constraints.push(where(field, "==", value));
            });
        }

        // Build the query with all constraints
        const q = query(ordersCollectionRef, ...constraints);
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            //console.log(`No orders found for user with UID: ${uid}`);
            return {}; // Return an empty dictionary if no orders found
        }

        // Map over the documents and extract order data,
        // using the transactionId as the key in the resulting dictionary.
        const orders: Record<string, IOrder> = {};
        querySnapshot.forEach((doc) => {
            const order = doc.data() as IOrder;

            if (order.transactionId) {
                orders[order.transactionId] = order;
            }
        });

        return orders;
    } catch (error) {
        console.error(`Error retrieving orders for user with UID=${uid}:`, error);
        throw new Error("Failed to retrieve user orders");
    }
}

/**
 * Retrieves user orders from cache or Firestore, optionally updating the data if requested.
 *
 * @param uid - The user ID to identify and fetch the relevant orders.
 * @param timeFrom - The starting date (in ISO format) to filter orders from.
 * @param ebayAccessToken - The eBay access token used for updating store info if necessary.
 * @param timeTo - (Optional) The end date (in ISO format) to filter orders.
 * @param update - (Optional) If true, forces updating the orders by fetching the latest data.
 * @param filter - (Optional) Additional filters applied to the query
 *
 * @returns A promise that resolves to an array of orders (filtered by time) derived from a dictionary.
 */
interface RetrieveUserOrdersProps {
    uid: string,
    timeFrom: string,
    storeType: StoreType,
    timeTo?: string,
    update?: boolean,
    filter?: { [key: string]: any },
    itemsPerPage?: number,
    startAfterDate?: string,
}
async function retrieveUserOrders({
    uid,
    timeFrom,
    storeType,
    timeTo,
    update = false,
    filter,
}: RetrieveUserOrdersProps): Promise<IOrder[]> {
    // Cache key for orders
    const cacheKey = `${orderCacheKey}-${uid}`;
    const isStoreDataFetched = storeDataFetched(orderCacheKey, storeType)

    let cachedData: Record<string, IOrder> = {};
    let cacheTimeFrom: Date | undefined;
    let cacheTimeTo: Date | undefined;

    // Try to get the cached data first
    try {
        const cache = getCachedData(cacheKey, true);
        cachedData = cache.data as Record<string, IOrder>;
        cacheTimeFrom = cache.cacheTimeFrom ? new Date(cache.cacheTimeFrom) : undefined;
        cacheTimeTo = cache.cacheTimeTo ? new Date(cache.cacheTimeTo) : undefined;
    } catch (error) {
        console.error(`Error retrieving cached orders for user with UID=${uid}:`, error);
    }

    const timeFromDate = new Date(timeFrom);
    const timeToDate = timeTo ? new Date(timeTo) : new Date();

    // If cache exists and update is not requested
    if (cachedData && Object.keys(cachedData).length > 0 && !update && isStoreDataFetched) {
        const cachedItems = Object.values(cachedData);
        // Determine cached boundaries from the stored cache or fallback to order dates
        const oldestTime = cacheTimeFrom ? cacheTimeFrom : new Date(cachedItems[cachedItems.length - 1].sale?.date ?? "");
        const newestTime = cacheTimeTo ? cacheTimeTo : new Date(cachedItems[0].sale?.date ?? "");

        // If the requested range is fully within the cached boundaries, return filtered cached data.
        if (timeFromDate >= oldestTime && timeToDate <= newestTime) {
            //console.log("Requested date range is within cached orders range.");
            return filterOrdersByTime(Object.values(cachedData), timeFrom, timeTo);
        }

        // Start with the currently cached orders dictionary
        let ordersToReturn: Record<string, IOrder> = { ...cachedData };

        // If requested timeFrom is earlier than the cached oldest order, fetch older orders.
        if (timeFromDate < oldestTime) {
            //console.log("Fetching older orders from Firestore.");
            const olderData = await retrieveUserOrdersFromDB({ uid: uid, timeFrom: timeFromDate.toISOString(), timeTo: oldestTime.toISOString(), filter, storeType });
            // Merge older orders with the current cache (older orders override if keys conflict)
            ordersToReturn = { ...olderData, ...ordersToReturn };
        }

        // If requested timeTo is later than the cached newest order, fetch newer orders.
        if (timeToDate > newestTime) {
            //console.log("Fetching newer orders from Firestore.");
            const newerData = await retrieveUserOrdersFromDB({ uid: uid, timeFrom: newestTime.toISOString(), timeTo: timeToDate.toISOString(), filter, storeType });
            // Merge newer orders with the current cache
            ordersToReturn = { ...ordersToReturn, ...newerData };
        }

        const oldCache = getCachedData(cacheKey)
        const merged = {
            ...oldCache,
            ...ordersToReturn
        };
        // Update the cache with the merged data and new boundaries
        setCachedData(cacheKey, merged, timeFromDate, timeToDate);
        return filterOrdersByTime(Object.values(ordersToReturn), timeFrom, timeTo);
    }
    // If cache is empty or update is requested, update store info before fetching
    else if (update || !cachedData || Object.keys(cachedData).length === 0) {
        await updateStoreInfo("orders", storeType, uid);
    }

    // If no valid cache exists or update is forced, fetch from Firestore
    try {
        const data = await retrieveUserOrdersFromDB({ uid: uid, timeFrom: timeFromDate.toISOString(), timeTo: timeToDate.toISOString(), filter, storeType });
        const oldCache = getCachedData(cacheKey)
        const merged = {
            ...oldCache,
            ...data
        };
        setCachedData(cacheKey, merged, timeFromDate, timeToDate);
        return filterOrdersByTime(Object.values(data), timeFrom, timeTo);
    } catch (error) {
        console.error(`Error fetching orders for user with UID=${uid}:`, error);
        return [];
    }
}


/**
 * Retrieves user inventory from Firestore with optional time filtering.
 *
 * @param {string} uid - The user ID to identify and fetch relevant inventory.
 * @param {string | null} timeFrom - The starting date (in ISO format) to filter inventory items.
 * @param {string | null} [timeTo=null] - The end date (in ISO format) to filter inventory items.
 * 
 * @returns {Promise<IListing[]>} A promise that resolves to an array of filtered inventory items.
 */
async function retrieveUserInventoryFromDB(
    uid: string,
    timeFrom: string | null,
    storeType: StoreType,
    timeTo?: string,
): Promise<Record<string, IListing>> {
    try {
        // Reference to the user's inventory collection
        const inventoryCollectionRef = collection(firestore, "inventory", uid, storeType);

        // Base query to get all inventory items for the user
        let q = query(inventoryCollectionRef, orderBy("dateListed", "desc"));

        // Apply timeFrom filter if provided
        if (timeFrom) {
            const timeFromDate = new Date(timeFrom).toISOString();
            if (timeFromDate.toString() === "Invalid Date") {
                throw new Error("Invalid timeFrom date format. Please provide a valid ISO date.");
            }
            q = query(q, where("dateListed", ">=", timeFromDate));
        }

        // Apply timeTo filter if provided
        if (timeTo) {
            const timeToDate = new Date(timeTo).toISOString();
            if (timeToDate.toString() === "Invalid Date") {
                throw new Error("Invalid timeTo date format. Please provide a valid ISO date.");
            }
            q = query(q, where("dateListed", "<=", timeToDate));
        }

        // Query Firestore with filters applied
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            //onsole.log(`No inventory items found for user with UID: ${uid}`);
            return {}; // Return empty array if no inventory items found
        }

        // Map over the documents and extract inventory data matching IListing interface
        const inventory: Record<string, IListing> = {};
        querySnapshot.forEach((doc) => {
            const data = doc.data() as IListing;

            if (data.itemId) {
                inventory[data.itemId] = data as IListing;
            }
        });

        return inventory;
    } catch (error) {
        console.error(`Error retrieving inventory for user with UID=${uid}:`, error);
        throw new Error("Failed to retrieve user inventory");
    }
}


/**
 * Retrieves user inventory from cache or Firestore, optionally updating the data if requested.
 *
 * @param {string} uid - The user ID to identify and fetch the relevant inventory.
 * @param {string} timeFrom - The starting date (in ISO format) to filter inventory items.
 * @param {string} ebayAccessToken - The eBay access token used for updating store info if necessary.
 * @param {boolean} [update=false] - If `true`, updates the inventory by fetching the latest data.
 * @param {string | null} [timeTo=null] - The end date (in ISO format) to filter inventory items.
 * 
 * @returns {Promise<IListing[]>} A promise that resolves to an array of inventory items filtered by the specified time.
 */

interface IRetrieveUserInventory {
    uid: string;
    timeFrom: string;
    update?: boolean;
    timeTo?: string;
    storeType: StoreType;
}
async function retrieveUserInventory({
    uid,
    timeFrom,
    update = false,
    timeTo,
    storeType
}: IRetrieveUserInventory): Promise<IListing[]> {
    const cacheKey = `${inventoryCacheKey}-${uid}`;
    const isStoreDataFetched = storeDataFetched(inventoryCacheKey, storeType)

    let cachedData: Record<string, IListing> = {};
    let cacheTimeFrom: Date | undefined;
    let cacheTimeTo: Date | undefined;

    // Try to get the cached data first
    try {
        const cache = getCachedData(cacheKey, true);
        cachedData = cache.data as Record<string, IListing>;
        cacheTimeFrom = cache.cacheTimeFrom ? new Date(cache.cacheTimeFrom) : undefined;
        cacheTimeTo = cache.cacheTimeTo ? new Date(cache.cacheTimeTo) : undefined;
    } catch (error) {
        console.error(`Error retrieving cached inventory for user with UID=${uid}:`, error);
    }

    const timeFromDate = new Date(timeFrom);
    const timeToDate = timeTo ? new Date(timeTo) : new Date();

    // If cache exists and update is not requested
    if (cachedData && Object.keys(cachedData).length > 0 && !update && isStoreDataFetched) {
        // Determine the cached range
        const cachedItems = Object.values(cachedData);
        const oldestTime = cacheTimeFrom ?? new Date(cachedItems[cachedItems.length - 1].dateListed ?? "");
        const newestTime = cacheTimeTo ?? new Date(cachedItems[0].dateListed ?? "");

        // If the requested range is fully within the cached range, return filtered cached data.
        if (timeFromDate >= oldestTime && timeToDate <= newestTime) {
            //console.log("Requested date range is within cached inventory range.");
            return filterInventoryByTime(Object.values(cachedData), timeFrom, timeTo);
        }

        let inventoryToReturn: Record<string, IListing> = { ...cachedData };

        // Case 1: Need older inventory (timeFrom is earlier than the oldest cached item)
        if (timeFromDate < oldestTime && timeToDate <= newestTime) {
            //console.log("Fetching older inventory from Firestore.");
            const olderData = await retrieveUserInventoryFromDB(uid, timeFrom, storeType, oldestTime.toISOString());
            inventoryToReturn = { ...olderData, ...inventoryToReturn };
        }
        // Case 2: Need newer inventory (timeTo is later than the newest cached item)
        else if (timeFromDate >= oldestTime && timeToDate > newestTime) {
            //console.log("Fetching newer inventory from Firestore.");
            const newerData = await retrieveUserInventoryFromDB(uid, newestTime.toISOString(), storeType, timeTo);
            inventoryToReturn = { ...inventoryToReturn, ...newerData };
        }
        // Case 3: Need both older and newer inventory
        else if (timeFromDate < oldestTime && timeToDate > newestTime) {
            //console.log("Fetching both older and newer inventory from Firestore.");
            const olderData = await retrieveUserInventoryFromDB(uid, timeFrom, storeType, oldestTime.toISOString());
            const newerData = await retrieveUserInventoryFromDB(uid, newestTime.toISOString(), storeType, timeTo);
            inventoryToReturn = { ...olderData, ...inventoryToReturn, ...newerData };
        }

        if (Object.keys(inventoryToReturn).length > 0) {
            const oldCache = getCachedData(cacheKey)
            const merged = {
                ...oldCache,
                ...inventoryToReturn
            };
            // Update the cache with the newly combined data and the new range
            setCachedData(cacheKey, merged, timeFromDate, timeToDate);
            return filterInventoryByTime(Object.values(inventoryToReturn), timeFrom, timeTo);
        }
        return [];
    }
    // If cache is empty or update is requested, update store info before fetching
    else if (update || !cachedData || Object.keys(cachedData).length === 0) {
        //console.log("Request to check for new inventory");
        await updateStoreInfo("inventory", storeType, uid);
    }

    // If no valid cache exists or update is forced, fetch from Firestore
    try {
        const dataDict = await retrieveUserInventoryFromDB(uid, timeFrom, storeType, timeTo);

        const oldCache = getCachedData(cacheKey)
        const merged = {
            ...oldCache,
            ...dataDict
        };
        setCachedData(cacheKey, merged, timeFromDate, timeTo ? new Date(timeTo) : new Date());
        return filterInventoryByTime(Object.values(dataDict), timeFrom, timeTo);
    } catch (error) {
        console.error(`Error fetching inventory for user with UID=${uid}:`, error);
        return [];
    }
}


async function retrieveUserSubscriptionExpensesFromDB(
    uid: string,
    timeFrom: string | null,
    timeTo?: string,
): Promise<Record<string, ISubscriptionExpense>> {
    try {
        // Reference to the user's collection
        const collectionRef = collection(firestore, "expenses", uid, "subscriptions");

        // Base query to get all items for the user
        let q = query(collectionRef, orderBy("createdAt", "desc"));

        // Apply timeFrom filter if provided
        if (timeFrom) {
            const timeFromDate = new Date(timeFrom).toISOString();
            if (timeFromDate.toString() === "Invalid Date") {
                throw new Error("Invalid timeFrom date format. Please provide a valid ISO date.");
            }
            q = query(q, where("createdAt", ">=", timeFromDate));
        }

        // Apply timeTo filter if provided
        if (timeTo) {
            const timeToDate = new Date(timeTo).toISOString();
            if (timeToDate.toString() === "Invalid Date") {
                throw new Error("Invalid timeTo date format. Please provide a valid ISO date.");
            }
            q = query(q, where("createdAt", "<=", timeToDate));
        }

        // Query Firestore with filters applied
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            //console.log(`No subscription expenses items found for user with UID: ${uid}`);
            return {}; // Return empty array if no subscription expenses items found
        }

        // Map over the documents and extract subscription expenses data matching ISubscriptionExpense interface
        const subscriptionExpenses: Record<string, ISubscriptionExpense> = {};
        querySnapshot.forEach((doc) => {
            const data = doc.data() as ISubscriptionExpense;

            if (data.id) {
                subscriptionExpenses[data.id] = data as ISubscriptionExpense;
            }
        });

        return subscriptionExpenses;
    } catch (error) {
        console.error(`Error retrieving subscription expenses for user with UID=${uid}:`, error);
        throw new Error("Failed to retrieve user subscription expenses");
    }
}


interface IRetrieveUserSubscriptionExpenses {
    uid: string;
    timeFrom: string;
    update?: boolean;
    timeTo?: string;
}
async function retrieveUserSubscriptionExpenses({
    uid,
    timeFrom,
    update = false,
    timeTo,
}: IRetrieveUserSubscriptionExpenses): Promise<ISubscriptionExpense[]> {
    const cacheKey = `${subscriptionsExpensesCacheKey}-${uid}`;

    let cachedData: Record<string, ISubscriptionExpense> = {};
    let cacheTimeFrom: Date | undefined;
    let cacheTimeTo: Date | undefined;

    // Try to get the cached data first
    try {
        const cache = getCachedData(cacheKey, true);
        cachedData = cache.data as Record<string, ISubscriptionExpense>;
        cacheTimeFrom = cache.cacheTimeFrom ? new Date(cache.cacheTimeFrom) : undefined;
        cacheTimeTo = cache.cacheTimeTo ? new Date(cache.cacheTimeTo) : undefined;
    } catch (error) {
        console.error(`Error retrieving cached subscription expenses for user with UID=${uid}:`, error);
    }

    const timeFromDate = new Date(timeFrom);
    const timeToDate = timeTo ? new Date(timeTo) : new Date();

    // If cache exists and update is not requested
    if (cachedData && Object.keys(cachedData).length > 0 && !update) {
        // Determine the cached range
        const cachedItems = Object.values(cachedData);
        const oldestTime = cacheTimeFrom ?? new Date(cachedItems[cachedItems.length - 1].createdAt ?? "");
        const newestTime = cacheTimeTo ?? new Date(cachedItems[0].createdAt ?? "");

        // If the requested range is fully within the cached range, return filtered cached data.
        if (timeFromDate >= oldestTime && timeToDate <= newestTime) {
            //console.log("Requested date range is within cached subscription expenses range.");
            return Object.values(cachedData);
        }

        let itemsToReturn: Record<string, ISubscriptionExpense> = { ...cachedData };

        // Case 1: Need older subscription expenses (timeFrom is earlier than the oldest cached item)
        if (timeFromDate < oldestTime && timeToDate <= newestTime) {
            //console.log("Fetching older subscription expenses from Firestore.");
            const olderData = await retrieveUserSubscriptionExpensesFromDB(uid, timeFrom, oldestTime.toISOString());
            itemsToReturn = { ...olderData, ...itemsToReturn };
        }
        // Case 2: Need newer subscription expenses (timeTo is later than the newest cached item)
        else if (timeFromDate >= oldestTime && timeToDate > newestTime) {
            //console.log("Fetching newer subscription expenses from Firestore.");
            const newerData = await retrieveUserSubscriptionExpensesFromDB(uid, newestTime.toISOString(), timeTo);
            itemsToReturn = { ...itemsToReturn, ...newerData };
        }
        // Case 3: Need both older and newer subscription expenses
        else if (timeFromDate < oldestTime && timeToDate > newestTime) {
            //console.log("Fetching both older and newer subscription expenses from Firestore.");
            const olderData = await retrieveUserSubscriptionExpensesFromDB(uid, timeFrom, oldestTime.toISOString());
            const newerData = await retrieveUserSubscriptionExpensesFromDB(uid, newestTime.toISOString(), timeTo);
            itemsToReturn = { ...olderData, ...itemsToReturn, ...newerData };
        }

        if (Object.keys(itemsToReturn).length > 0) {
            const oldCache = getCachedData(cacheKey)
            const merged = {
                ...oldCache,
                ...itemsToReturn
            };
            // Update the cache with the newly combined data and the new range
            setCachedData(cacheKey, merged, timeFromDate, timeToDate);
            return Object.values(itemsToReturn);
        }
        return [];
    }
    else if (!cachedData || Object.keys(cachedData).length === 0) {
        // Add users Flippify Subscription
    }

    // If no valid cache exists or update is forced, fetch from Firestore
    try {
        const dataDict = await retrieveUserSubscriptionExpensesFromDB(uid, timeFrom, timeTo);

        const oldCache = getCachedData(cacheKey)
        const merged = {
            ...oldCache,
            ...dataDict
        };
        setCachedData(cacheKey, merged, timeFromDate, timeTo ? new Date(timeTo) : new Date());
        return Object.values(dataDict);
    } catch (error) {
        console.error(`Error fetching subscription expenses for user with UID=${uid}:`, error);
        return [];
    }
}


async function retrieveUserOneTimeExpensesFromDB(
    uid: string,
    timeFrom: string | null,
    timeTo?: string,
): Promise<Record<string, IOneTimeExpense>> {
    try {
        // Reference to the user's collection
        const collectionRef = collection(firestore, "expenses", uid, "oneTime");

        // Base query to get all items for the user
        let q = query(collectionRef, orderBy("createdAt", "desc"));

        // Apply timeFrom filter if provided
        if (timeFrom) {
            const timeFromDate = new Date(timeFrom).toISOString();
            if (timeFromDate.toString() === "Invalid Date") {
                throw new Error("Invalid timeFrom date format. Please provide a valid ISO date.");
            }
            q = query(q, where("createdAt", ">=", timeFromDate));
        }

        // Apply timeTo filter if provided
        if (timeTo) {
            const timeToDate = new Date(timeTo).toISOString();
            if (timeToDate.toString() === "Invalid Date") {
                throw new Error("Invalid timeTo date format. Please provide a valid ISO date.");
            }
            q = query(q, where("createdAt", "<=", timeToDate));
        }

        // Query Firestore with filters applied
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            //console.log(`No oneTime expenses items found for user with UID: ${uid}`);
            return {}; // Return empty array if no oneTime expenses items found
        }

        // Map over the documents and extract oneTime expenses data matching IOneTimeExpense interface
        const expenses: Record<string, IOneTimeExpense> = {};
        querySnapshot.forEach((doc) => {
            const data = doc.data() as IOneTimeExpense;

            if (data.id) {
                expenses[data.id] = data as IOneTimeExpense;
            }
        });

        return expenses;
    } catch (error) {
        console.error(`Error retrieving oneTime expenses for user with UID=${uid}:`, error);
        throw new Error("Failed to retrieve user oneTime expenses");
    }
}


interface IRetrieveUserOneTimeExpenses {
    uid: string;
    timeFrom: string;
    update?: boolean;
    timeTo?: string;
}
async function retrieveUserOneTimeExpenses({
    uid,
    timeFrom,
    update = false,
    timeTo,
}: IRetrieveUserOneTimeExpenses): Promise<IOneTimeExpense[]> {
    const cacheKey = `${oneTimeExpensesCacheKey}-${uid}`;

    let cachedData: Record<string, IOneTimeExpense> = {};
    let cacheTimeFrom: Date | undefined;
    let cacheTimeTo: Date | undefined;

    // Try to get the cached data first
    try {
        const cache = getCachedData(cacheKey, true);
        cachedData = cache.data as Record<string, IOneTimeExpense>;
        cacheTimeFrom = cache.cacheTimeFrom ? new Date(cache.cacheTimeFrom) : undefined;
        cacheTimeTo = cache.cacheTimeTo ? new Date(cache.cacheTimeTo) : undefined;
    } catch (error) {
        console.error(`Error retrieving cached subscription expenses for user with UID=${uid}:`, error);
    }

    const timeFromDate = new Date(timeFrom);
    const timeToDate = timeTo ? new Date(timeTo) : new Date();

    // If cache exists and update is not requested
    if (cachedData && Object.keys(cachedData).length > 0 && !update) {
        // Determine the cached range
        const cachedItems = Object.values(cachedData);
        const oldestTime = cacheTimeFrom ?? new Date(cachedItems[cachedItems.length - 1].createdAt ?? "");
        const newestTime = cacheTimeTo ?? new Date(cachedItems[0].createdAt ?? "");

        // If the requested range is fully within the cached range, return filtered cached data.
        if (timeFromDate >= oldestTime && timeToDate <= newestTime) {
            //console.log("Requested date range is within cached subscription expenses range.");
            return Object.values(cachedData);
        }

        let itemsToReturn: Record<string, IOneTimeExpense> = { ...cachedData };

        // Case 1: Need older subscription expenses (timeFrom is earlier than the oldest cached item)
        if (timeFromDate < oldestTime && timeToDate <= newestTime) {
            //console.log("Fetching older subscription expenses from Firestore.");
            const olderData = await retrieveUserOneTimeExpensesFromDB(uid, timeFrom, oldestTime.toISOString());
            itemsToReturn = { ...olderData, ...itemsToReturn };
        }
        // Case 2: Need newer subscription expenses (timeTo is later than the newest cached item)
        else if (timeFromDate >= oldestTime && timeToDate > newestTime) {
            //console.log("Fetching newer subscription expenses from Firestore.");
            const newerData = await retrieveUserOneTimeExpensesFromDB(uid, newestTime.toISOString(), timeTo);
            itemsToReturn = { ...itemsToReturn, ...newerData };
        }
        // Case 3: Need both older and newer subscription expenses
        else if (timeFromDate < oldestTime && timeToDate > newestTime) {
            //console.log("Fetching both older and newer subscription expenses from Firestore.");
            const olderData = await retrieveUserOneTimeExpensesFromDB(uid, timeFrom, oldestTime.toISOString());
            const newerData = await retrieveUserOneTimeExpensesFromDB(uid, newestTime.toISOString(), timeTo);
            itemsToReturn = { ...olderData, ...itemsToReturn, ...newerData };
        }

        if (Object.keys(itemsToReturn).length > 0) {
            const oldCache = getCachedData(cacheKey)
            const merged = {
                ...oldCache,
                ...itemsToReturn
            };
            // Update the cache with the newly combined data and the new range
            setCachedData(cacheKey, merged, timeFromDate, timeToDate);
            return Object.values(itemsToReturn);
        }
        return [];
    }
    else if (!cachedData || Object.keys(cachedData).length === 0) {
        // Add users Flippify Subscription
    }

    // If no valid cache exists or update is forced, fetch from Firestore
    try {
        const dataDict = await retrieveUserOneTimeExpensesFromDB(uid, timeFrom, timeTo);

        const oldCache = getCachedData(cacheKey)
        const merged = {
            ...oldCache,
            ...dataDict
        };
        setCachedData(cacheKey, merged, timeFromDate, timeTo ? new Date(timeTo) : new Date());
        return Object.values(dataDict);
    } catch (error) {
        console.error(`Error fetching subscription expenses for user with UID=${uid}:`, error);
        return [];
    }
}


async function retrieveUserOrderItemRef(uid: string, storeType: StoreType, transactionId: string): Promise<DocumentReference | null> {
    try {
        const ordersCollectionRef = collection(firestore, "orders", uid, storeType);
        return doc(ordersCollectionRef, transactionId);
    } catch (error) {
        console.error(`Error retrieving order with ID=${transactionId}:`, error);
        return null;
    }
}

/**
 * Retrieve all eBay orders for a user where purchase.date ∈ [timeFrom, timeTo].
 *
 * @param uid      - Firebase user ID
 * @param timeFrom - ISO string start of period, e.g. "2024-01-01T00:00:00.000Z"
 * @param timeTo   - ISO string end of period,   e.g. "2024-12-31T23:59:59.999Z"
 * @returns        - Array of IOrder objects
 */

interface IRetrieveUserOrdersInPeriod {
    uid: string;
    timeFrom: string;
    timeTo: string;
    storeType: StoreType
}
async function retrieveUserOrdersInPeriod({ uid, timeFrom, timeTo, storeType }: IRetrieveUserOrdersInPeriod): Promise<IOrder[]> {
    try {
        // Reference the user's eBay orders sub-collection
        const ordersRef = collection(firestore, "orders", uid, "ebay");

        // Build a Firestore query on purchase.date
        const ordersQuery = query(
            ordersRef,
            where("purchase.date", ">=", timeFrom),
            where("purchase.date", "<=", timeTo)
        );

        // Execute the query
        const snapshot = await getDocs(ordersQuery);

        // Map documents → IOrder (including the doc ID as orderId/transactionId)
        const orders: IOrder[] = snapshot.docs.map((docSnap) => {
            const data = docSnap.data() as DocumentData;
            return {
                ...data,
                transactionId: docSnap.id,
            } as IOrder;
        });

        return orders;
    } catch (error) {
        console.error(
            `Error retrieving orders for UID=${uid} between ${timeFrom} and ${timeTo}:`,
            error
        );
        return [];
    }
}


/**
 * Fetch the single oldest eBay order (by sale.date) for a given user + store.
 * @param uid        – the user’s UID
 * @param storeTypes  – which sub-collection under "orders"/uid to use
 * @returns          – the oldest order, or null if none/ex on error
 */

interface RetrieveOldestParams {
    uid: string;
    storeTypes: StoreType[];
}

async function retrieveOldestOrder({
    uid,
    storeTypes,
}: RetrieveOldestParams): Promise<IOrder | null> {
    let absoluteOldest: IOrder | null = null;

    try {
        for (const storeType of storeTypes) {
            // Reference the sub‐collection for this storeType
            const ordersRef = collection(
                firestore,
                "orders",
                uid,
                storeType
            );

            // Build a query: order by sale.date ascending, take only the first doc
            const oldestQuery = query(
                ordersRef,
                orderBy("sale.date", "asc"),
                limit(1)
            );

            // Execute
            const snapshot = await getDocs(oldestQuery);
            if (snapshot.empty) {
                continue;
            }

            const docSnap = snapshot.docs[0];
            const candidate = {
                ...(docSnap.data() as Omit<IOrder, "orderId">),
                orderId: docSnap.id,
            } as IOrder;

            // Compare to our running “absoluteOldest”
            const candidateDate = new Date(candidate.sale?.date ?? "");
            if (
                !absoluteOldest ||
                candidateDate < new Date(absoluteOldest.sale?.date ?? "")
            ) {
                absoluteOldest = candidate;
            }
        }

        return absoluteOldest;
    } catch (error) {
        console.error("Error retrieving oldest order:", error);
        return null;
    }
}


export { retrieveIdToken, retrieveUserAndCreate, retrieveUser, retrieveUserSnapshot, retrieveUserRef, retrieveUserRefById, retrieveUserOrders, retrieveUserInventory, retrieveUserOrderItemRef, retrieveUserOrdersInPeriod, retrieveOldestOrder, retrieveUserSubscriptionExpenses, retrieveUserOneTimeExpenses };