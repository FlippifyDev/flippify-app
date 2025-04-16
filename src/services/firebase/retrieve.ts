// Local Imports
import { IUser } from "@/models/user";
import { firestore } from "@/lib/firebase/config";
import { createUser } from "./create";
import { updateStoreInfo } from "../api/request";
import { getCachedData, setCachedData } from "@/utils/cache-helpers";
import { IEbayInventoryItem, IEbayOrder } from "@/models/store-data";
import { ebayInventoryCacheKey, ebayOrderCacheKey } from "@/utils/constants";
import { filterInventoryByTime, filterOrdersByTime } from "@/utils/filters";

// External Imports
import { collection, doc, DocumentData, DocumentReference, getDoc, getDocs, limit, orderBy, query, QueryConstraint, QueryDocumentSnapshot, startAfter, startAt, where } from 'firebase/firestore';



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
 * @returns {Promise<Record<string, IEbayOrder>>} - A mapping of transactionId to its order data.
 * @throws {Error} - Logs and handles errors if Firestore retrieval fails.
 */
interface RetrieveUserOrdersFromDBProps {
    uid: string;
    timeFrom: string | null;
    timeTo?: string | null;
    filter?: { [key: string]: any };
}

async function retrieveUserOrdersFromDB({
    uid,
    timeFrom,
    timeTo,
    filter,
}: RetrieveUserOrdersFromDBProps): Promise<Record<string, IEbayOrder>> {
    try {
        // Reference to the user's orders collection
        const ordersCollectionRef = collection(firestore, "orders", uid, "ebay");

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
            console.log(`No orders found for user with UID: ${uid}`);
            return {}; // Return an empty dictionary if no orders found
        }

        // Map over the documents and extract order data,
        // using the transactionId as the key in the resulting dictionary.
        const orders: Record<string, IEbayOrder> = {};
        querySnapshot.forEach((doc) => {
            const order = doc.data() as IEbayOrder;
            orders[order.transactionId] = order;
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
    ebayAccessToken: string,
    timeTo?: string,
    update?: boolean,
    filter?: { [key: string]: any },
    itemsPerPage?: number,
    startAfterDate?: string,
}
async function retrieveUserOrders({
    uid,
    timeFrom,
    ebayAccessToken,
    timeTo,
    update = false,
    filter,
}: RetrieveUserOrdersProps): Promise<IEbayOrder[]> {
    // Cache key for orders
    const cacheKey = `${ebayOrderCacheKey}-${uid}`;

    let cachedData: Record<string, IEbayOrder> = {};
    let cacheTimeFrom: Date | undefined;
    let cacheTimeTo: Date | undefined;

    // Try to get the cached data first
    try {
        const cache = getCachedData(cacheKey, true);
        cachedData = cache.data as Record<string, IEbayOrder>;
        cacheTimeFrom = cache.cacheTimeFrom ? new Date(cache.cacheTimeFrom) : undefined;
        cacheTimeTo = cache.cacheTimeTo ? new Date(cache.cacheTimeTo) : undefined;
    } catch (error) {
        console.error(`Error retrieving cached orders for user with UID=${uid}:`, error);
    }

    const timeFromDate = new Date(timeFrom);
    const timeToDate = timeTo ? new Date(timeTo) : new Date();

    // If cache exists and update is not requested
    if (cachedData && Object.keys(cachedData).length > 0 && !update) {
        const cachedItems = Object.values(cachedData);
        // Determine cached boundaries from the stored cache or fallback to order dates
        const oldestTime = cacheTimeFrom ? cacheTimeFrom : new Date(cachedItems[cachedItems.length - 1].sale.date);
        const newestTime = cacheTimeTo ? cacheTimeTo : new Date(cachedItems[0].sale.date);

        // If the requested range is fully within the cached boundaries, return filtered cached data.
        if (timeFromDate >= oldestTime && timeToDate <= newestTime) {
            console.log("Requested date range is within cached orders range.");
            return filterOrdersByTime(Object.values(cachedData), timeFrom, timeTo);
        }

        // Start with the currently cached orders dictionary
        let ordersToReturn: Record<string, IEbayOrder> = { ...cachedData };

        // If requested timeFrom is earlier than the cached oldest order, fetch older orders.
        if (timeFromDate < oldestTime) {
            console.log("Fetching older orders from Firestore.");
            const olderData = await retrieveUserOrdersFromDB({ uid: uid, timeFrom: timeFromDate.toISOString(), timeTo: oldestTime.toISOString(), filter });
            // Merge older orders with the current cache (older orders override if keys conflict)
            ordersToReturn = { ...olderData, ...ordersToReturn };
        }

        // If requested timeTo is later than the cached newest order, fetch newer orders.
        if (timeToDate > newestTime) {
            console.log("Fetching newer orders from Firestore.");
            const newerData = await retrieveUserOrdersFromDB({ uid: uid, timeFrom: newestTime.toISOString(), timeTo: timeToDate.toISOString(), filter });
            // Merge newer orders with the current cache
            ordersToReturn = { ...ordersToReturn, ...newerData };
        }

        // Update the cache with the merged data and new boundaries
        setCachedData(cacheKey, ordersToReturn, timeFromDate, timeToDate);
        return filterOrdersByTime(Object.values(ordersToReturn), timeFrom, timeTo);
    }
    // If cache is empty or update is requested, update store info before fetching
    else if (update || !cachedData || Object.keys(cachedData).length === 0) {
        await updateStoreInfo("update-orders", ebayAccessToken, uid);
    }

    // If no valid cache exists or update is forced, fetch from Firestore
    try {
        const data = await retrieveUserOrdersFromDB({ uid: uid, timeFrom: timeFromDate.toISOString(), timeTo: timeToDate.toISOString(), filter });
        setCachedData(cacheKey, data, timeFromDate, timeToDate);
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
 * @returns {Promise<IEbayInventoryItem[]>} A promise that resolves to an array of filtered inventory items.
 */
async function retrieveUserInventoryFromDB(
    uid: string,
    timeFrom: string | null,
    timeTo?: string
): Promise<Record<string, IEbayInventoryItem>> {
    try {
        // Reference to the user's inventory collection
        const inventoryCollectionRef = collection(firestore, "inventory", uid, "ebay");

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
            console.log(`No inventory items found for user with UID: ${uid}`);
            return {}; // Return empty array if no inventory items found
        }

        // Map over the documents and extract inventory data matching IEbayInventoryItem interface
        const inventory: Record<string, IEbayInventoryItem> = {};
        querySnapshot.forEach((doc) => {
            const data = doc.data() as IEbayInventoryItem;
            inventory[data.itemId] = data as IEbayInventoryItem;
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
 * @returns {Promise<IEbayInventoryItem[]>} A promise that resolves to an array of inventory items filtered by the specified time.
 */
async function retrieveUserInventory(
    uid: string,
    timeFrom: string,
    ebayAccessToken: string,
    update: boolean = false,
    timeTo?: string
): Promise<IEbayInventoryItem[]> {
    const cacheKey = `${ebayInventoryCacheKey}-${uid}`;

    let cachedData: Record<string, IEbayInventoryItem> = {};
    let cacheTimeFrom: Date | undefined;
    let cacheTimeTo: Date | undefined;

    // Try to get the cached data first
    try {
        const cache = getCachedData(cacheKey, true);
        cachedData = cache.data as Record<string, IEbayInventoryItem>;
        cacheTimeFrom = cache.cacheTimeFrom ? new Date(cache.cacheTimeFrom) : undefined;
        cacheTimeTo = cache.cacheTimeTo ? new Date(cache.cacheTimeTo) : undefined;
    } catch (error) {
        console.error(`Error retrieving cached inventory for user with UID=${uid}:`, error);
    }

    const timeFromDate = new Date(timeFrom);
    const timeToDate = timeTo ? new Date(timeTo) : new Date();

    // If cache exists and update is not requested
    if (cachedData && Object.keys(cachedData).length > 0 && !update) {
        // Determine the cached range
        const cachedItems = Object.values(cachedData);
        const oldestTime = cacheTimeFrom ?? new Date(cachedItems[cachedItems.length - 1].dateListed);
        const newestTime = cacheTimeTo ?? new Date(cachedItems[0].dateListed);

        // If the requested range is fully within the cached range, return filtered cached data.
        if (timeFromDate >= oldestTime && timeToDate <= newestTime) {
            console.log("Requested date range is within cached inventory range.");
            return filterInventoryByTime(Object.values(cachedData), timeFrom, timeTo);
        }

        let inventoryToReturn: Record<string, IEbayInventoryItem> = { ...cachedData };

        // Case 1: Need older inventory (timeFrom is earlier than the oldest cached item)
        if (timeFromDate < oldestTime && timeToDate <= newestTime) {
            console.log("Fetching older inventory from Firestore.");
            const olderData = await retrieveUserInventoryFromDB(uid, timeFrom, oldestTime.toISOString());
            inventoryToReturn = { ...olderData, ...inventoryToReturn };
        }
        // Case 2: Need newer inventory (timeTo is later than the newest cached item)
        else if (timeFromDate >= oldestTime && timeToDate > newestTime) {
            console.log("Fetching newer inventory from Firestore.");
            const newerData = await retrieveUserInventoryFromDB(uid, newestTime.toISOString(), timeTo);
            inventoryToReturn = { ...inventoryToReturn, ...newerData };
        }
        // Case 3: Need both older and newer inventory
        else if (timeFromDate < oldestTime && timeToDate > newestTime) {
            console.log("Fetching both older and newer inventory from Firestore.");
            const olderData = await retrieveUserInventoryFromDB(uid, timeFrom, oldestTime.toISOString());
            const newerData = await retrieveUserInventoryFromDB(uid, newestTime.toISOString(), timeTo);
            inventoryToReturn = { ...olderData, ...inventoryToReturn, ...newerData };
        }

        if (Object.keys(inventoryToReturn).length > 0) {
            // Update the cache with the newly combined data and the new range
            setCachedData(cacheKey, inventoryToReturn, timeFromDate, timeToDate);
            return filterInventoryByTime(Object.values(inventoryToReturn), timeFrom, timeTo);
        }
        return [];
    }
    // If cache is empty or update is requested, update store info before fetching
    else if (update || !cachedData || Object.keys(cachedData).length === 0) {
        console.log("Request to check for new inventory");
        await updateStoreInfo("update-inventory", ebayAccessToken, uid);
    }

    // If no valid cache exists or update is forced, fetch from Firestore
    try {
        console.log("No cache exists", timeFromDate, timeToDate);
        const dataDict = await retrieveUserInventoryFromDB(uid, timeFrom, timeTo);

        setCachedData(cacheKey, dataDict, timeFromDate, timeTo ? new Date(timeTo) : new Date());
        return filterInventoryByTime(Object.values(dataDict), timeFrom, timeTo);
    } catch (error) {
        console.error(`Error fetching inventory for user with UID=${uid}:`, error);
        return [];
    }
}


async function retrieveUserOrderItemRef(uid: string, transactionId: string): Promise<DocumentReference | null> {
    try {
        const ordersCollectionRef = collection(firestore, "orders", uid, "ebay");
        return doc(ordersCollectionRef, transactionId);
    } catch (error) {
        console.error(`Error retrieving order with ID=${transactionId}:`, error);
        return null;
    }
}


async function retrieveProducts() {
    return [];
}


export { retrieveUserAndCreate, retrieveUser, retrieveUserSnapshot, retrieveUserRef, retrieveUserRefById, retrieveProducts, retrieveUserOrders, retrieveUserInventory, retrieveUserOrderItemRef };