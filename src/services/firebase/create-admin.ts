"use server";

import { firestoreAdmin } from "@/lib/firebase/config-admin";
import { IListing, IOrder, StoreType } from "@/models/store-data";
import { updateListingAdmin, updateUserListingsCountAdmin, updateUserOrdersCountAdmin } from "./update-admin";


/**
 * Create a new listing in inventory/{uid}/{StoreType}/{itemId}
 * @param uid 
 * @param StoreType 
 * @param listing 
 */
async function createNewInventoryItemAdmin(uid: string, StoreType: StoreType, listing: IListing): Promise<{ success?: boolean, error?: any, listingExists?: boolean }> {

    try {
        if (!listing.itemId) {
            throw Error("Item does not contain an ID")
        }

        const inventoryRef = firestoreAdmin.collection("inventory").doc(uid).collection(StoreType)

        // Use the listing's id as the document id in the store collection
        const itemDocRef = inventoryRef.doc(listing.itemId);

        // Check if the listing already exists
        const docSnapshot = await itemDocRef.get();
        if (docSnapshot.exists) {
            console.warn(`Listing ${listing.itemId} already exists.`);
            return { error: `Listing ${listing.itemId} already exists.`, listingExists: true };
        }

        // Create or update the listing document
        await itemDocRef.set(listing, { merge: true });

        const { success: incrementSuccess } = await updateUserListingsCountAdmin(uid, StoreType)
        if (!incrementSuccess) {
            console.error("Error incrementing user manual listings count.");
            return { error: "Error incrementing user manual listings count." };
        }

        console.log(`Inventory item ${listing.itemId} created/updated successfully.`);
        return { success: true };
    } catch (error) {
        console.error("Error creating/updating inventory item:", error);
        return { error: error };
    }
}


/**
 * Creates or updates an order listing in Firestore under `orders/{uid}/{StoreType}/{transactionId}`.
 * 
 * This function stores the order details in Firestore, increments the user's manual order count, 
 * and decreases the user's manual listing count if the order is associated with an existing listing.
 * It will also delete the listing if the quantity is 0.
 * 
 * @param {string} uid - The unique user ID for whom the order is being created.
 * @param {StoreType} StoreType - The e-commerce platform (e.g., eBay, Amazon) where the order was placed.
 * @param {IOrder} order - The order details to be stored in Firestore.
 * 
 * @returns {Promise<{ success?: boolean; error?: any }>} 
 * - Returns `{ success: true }` if the operation is successful.
 * - Returns `{ error: any }` if an error occurs during the process.
 * 
 * @throws Will catch and return errors encountered during Firestore operations.
 * 
 * @remarks
 * - If the order already exists, it will be merged with existing data.
 * - If the order has a `itemId`, the function will decrease the manual listing count accordingly.
 */
async function createNewOrderItemAdmin(uid: string, StoreType: StoreType, order: IOrder): Promise<{ success?: boolean, error?: any, orderExists?: boolean }> {
    try {
        if (!order.transactionId) {
            throw Error("Item does not contain an ID")
        }

        const orderRef = firestoreAdmin.collection("orders").doc(uid).collection(StoreType)
        
        // Use the order's transaction id as the document id in the store collection
        const itemDocRef = orderRef.doc(order.transactionId);
    
        // Check if the listing already exists
        const docSnapshot = await itemDocRef.get();
        if (docSnapshot.exists) {
            console.warn(`Order ${order.transactionId} already exists.`);
            return { error: `Order ${order.transactionId} already exists.`, orderExists: true };
        }

        // Create or update the listing document
        await itemDocRef.set(order, { merge: true });

        // Increment the user's manual orders count by 1
        const { success: incrementSuccess } = await updateUserOrdersCountAdmin(uid, StoreType)
        if (!incrementSuccess) {
            console.error("Error incrementing user manual orders count.");
            return { error: "Error incrementing user manual orders count." };
        }

        // Update the user's manual orders count
        // In the case where there is no item id, then there is no listings that matches the order
        // so the order is likely custom
        if (order.itemId && order.sale?.quantity) {
            await updateListingAdmin(uid, StoreType, order.itemId, order.sale.quantity);
        }

        console.log(`Order item ${order.transactionId} created/updated successfully.`);
        return { success: true };
    } catch (error) {
        console.error("Error creating/updating order item:", error);
        return { error: error };
    }
}


export { createNewInventoryItemAdmin, createNewOrderItemAdmin };