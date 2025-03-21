// Local Imports
import { IUser } from "@/models/user";
import { firestore } from "@/lib/firebase/config";
import { createUser } from "./create";
import { updateStoreInfo } from "../api/request";
import { filterInventoryByTime, filterOrdersByTime } from "@/utils/filters";

// External Imports
import { collection, doc, DocumentData, DocumentReference, getDoc, getDocs, query, QueryDocumentSnapshot, where } from 'firebase/firestore';
import { IEbayInventoryItem, IEbayOrder } from "@/models/store-data";
import { getCachedData, setCachedData } from "@/utils/cache-helpers";


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
 *  * @param {string | null} timeFrom - The start date (in ISO format) to filter the orders by. If null, no filter is applied.
 * @returns {Promise<IEbayOrder[]>} - An array of user's orders, or an empty array if no orders are found.
 * @throws {Error} - Logs and handles errors if Firestore retrieval fails.
 */
async function retrieveUserOrdersFromDB(uid: string, timeFrom: string | null): Promise<IEbayOrder[]> {
    try {
        // Reference to the user's orders collection
        const ordersCollectionRef = collection(firestore, 'orders', uid, 'ebay');

        // Base query to get all orders for the user
        let q = query(ordersCollectionRef);

        // If timeFrom is provided, filter orders based on saleDate
        if (timeFrom) {
            const timeFromDate = new Date(timeFrom).toISOString();;
            if (timeFromDate.toString() === "Invalid Date") {
                throw new Error("Invalid timeFrom date format. Please provide a valid ISO date.");
            }
            q = query(ordersCollectionRef, where("sale.date", ">=", timeFromDate));
        }

        // Query to get orders based on the above filters
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            console.log(`No orders found for user with UID: ${uid}`);
            return []; // Return empty array if no orders found
        }

        // Map over the documents and extract order data to match the IEbayOrder interface
        const orders: IEbayOrder[] = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            return data as IEbayOrder;
        });

        return orders;
    } catch (error) {
        console.error(`Error retrieving orders for user with UID=${uid}:`, error);
        throw new Error('Failed to retrieve user orders');
    }
}


/**
 * Retrieves user orders from cache or Firestore, optionally updating the data if requested.
 *
 * @param {string} uid - The user ID to identify and fetch the relevant orders.
 * @param {string} timeFrom - The starting date (in ISO format) to filter orders from.
 * @param {string} ebayAccessToken - The eBay access token used for updating store info if necessary.
 * @param {boolean} [update=false] - If `true`, updates the orders by fetching the latest data.
 * 
 * @returns {Promise<IEbayOrder[]>} A promise that resolves to an array of orders filtered by the specified time.
 * 
 * @throws Will log an error and return an empty array if an error occurs while retrieving or fetching the data.
 */
async function retrieveUserOrders(uid: string, timeFrom: string, ebayAccessToken: string, update?: boolean): Promise<IEbayOrder[]> {
    const cacheKey = `salesData-${uid}`; // No need to include timeFrom in cache key since we are filtering later
    const cacheExpirationTime = 1000 * 60 * 5; // Cache expiration time (5 minutes)

    // Try to get the cached data first
    try {
        const cachedData = getCachedData(cacheKey, cacheExpirationTime);
        if (cachedData.length > 0 && !update) {
            return filterOrdersByTime(cachedData, timeFrom); // Return filtered cached data
        } else if (update || cachedData.length === 0) {
            // If update is requested, update store info before fetching
            await updateStoreInfo("update-orders", ebayAccessToken, uid);
        }
    } catch (error) {
        console.error(`Error retrieving cached orders for user with UID=${uid}:`, error);
    }

    // Fetch from Firestore if no cache or update is required
    try {
        const data = await retrieveUserOrdersFromDB(uid, timeFrom); // Fetch sales data from Firestore
        setCachedData(cacheKey, data, cacheExpirationTime); // Cache the fresh data
        return filterOrdersByTime(data, timeFrom); // Return filtered data
    } catch (error) {
        console.error(`Error fetching orders for user with UID=${uid}:`, error);
        return [];
    }
}


/**
 * Retrieves a list of inventory items from Firestore for a specific user based on their UID.
 * Filters inventory based on a time range provided by the `timeFrom` parameter.
 * 
 * @param {string} uid - The unique identifier of the user.
 * @param {string | null} timeFrom - The start date (in ISO format) to filter the inventory by. If null, no filter is applied.
 * @returns {Promise<IEbayInventoryItem[]>} - An array of user's inventory items, or an empty array if no items are found.
 * @throws {Error} - Logs and handles errors if Firestore retrieval fails.
 */
async function retrieveUserInventoryFromDB(uid: string, timeFrom: string | null): Promise<IEbayInventoryItem[]> {
    try {
        // Reference to the user's inventory collection
        const inventoryCollectionRef = collection(firestore, 'inventory', uid, 'ebay');

        // Base query
        let q = query(inventoryCollectionRef);

        // If timeFrom is provided, filter by dateListed field
        if (timeFrom) {
            const timeFromDate = new Date(timeFrom).toISOString();;
            if (timeFromDate.toString() === "Invalid Date") {
                throw new Error("Invalid timeFrom date format. Please provide a valid ISO date.");
            }
            q = query(inventoryCollectionRef, where("dateListed", ">=", timeFromDate));
        }

        // Query to get all inventory items for the user, possibly filtered by time
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            console.log(`No inventory items found for user with UID: ${uid}`);
            return []; // Return empty array if no inventory items found
        }

        // Map over the documents and extract inventory data to match the IEbayInventoryItem interface
        const inventory: IEbayInventoryItem[] = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            return data as IEbayInventoryItem;
        });

        return inventory;
    } catch (error) {
        console.error(`Error retrieving inventory for user with UID=${uid}:`, error);
        throw new Error('Failed to retrieve user inventory');
    }
}


/**
 * Retrieves user inventory from cache or Firestore, optionally updating the data if requested.
 * It also filters the inventory based on the specified `timeFrom` parameter.
 *
 * @param {string} uid - The user ID to identify and fetch the relevant inventory.
 * @param {string} timeFrom - The starting date (in ISO format) to filter inventory items from.
 * @param {string} ebayAccessToken - The eBay access token used for updating store info if necessary.
 * @param {boolean} [update=false] - If `true`, updates the inventory by fetching the latest data.
 * 
 * @returns {Promise<IEbayInventoryItem[]>} A promise that resolves to an array of inventory items filtered by the specified time.
 * 
 * @throws Will log an error and return an empty array if an error occurs while retrieving or fetching the data.
 */
async function retrieveUserInventory(uid: string, timeFrom: string, ebayAccessToken: string, update?: boolean): Promise<IEbayInventoryItem[]> {
    const cacheKey = `inventoryData-${uid}`; // Cache key based on user ID and time filter
    const cacheExpirationTime = 1000 * 60 * 5; // Cache expiration time (10 minutes)

    // Try get the cached data first
    try {
        const cachedData = getCachedData(cacheKey, cacheExpirationTime);
        if (cachedData > 0 && !update) {
            // Filter cached inventory based on timeFrom before returning
            const filteredData = filterInventoryByTime(cachedData, timeFrom);
            return filteredData;
        } else if (update || cachedData.length === 0) {
            await updateStoreInfo("update-inventory", ebayAccessToken, uid);
        }
    } catch (error) {
        console.error(`Error retrieving cached inventory for user with UID=${uid}:`, error);
    }

    // If no cached data or update is required, fetch from Firestore
    try {
        // Fetch inventory data from Firestore with timeFrom applied
        const data = await retrieveUserInventoryFromDB(uid, timeFrom); // Fetch inventory data from Firestore
        setCachedData(cacheKey, data, cacheExpirationTime); // Cache the data
        return data;
    } catch (error) {
        console.error(`Error fetching inventory for user with UID=${uid}:`, error);
        return [];
    }
}


async function retrieveProducts() {
    return [];
}


export { retrieveUserAndCreate, retrieveUser, retrieveUserSnapshot, retrieveUserRef, retrieveUserRefById, retrieveProducts, retrieveUserOrders, retrieveUserInventory };