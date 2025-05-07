"use server";

import { firestoreAdmin } from "@/lib/firebase/config-admin";
import { IListing, IOrder, ItemType, StoreType } from "@/models/store-data";
import { updateListingAdmin, updateUserItemCountAdmin, updateUserListingsCountAdmin, updateUserOrdersCountAdmin } from "./update-admin";


/**
 * Create a new listing in inventory/{uid}/{StoreType}/{itemId}
 * @param uid 
 * @param StoreType 
 * @param listing 
 */
async function createNewInventoryItemAdmin(uid: string, StoreType: StoreType | string, listing: IListing): Promise<{ success?: boolean, error?: any, listingExists?: boolean }> {
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


function isOrder(item: IOrder | IListing): item is IOrder {
    return (item as IOrder).transactionId !== undefined;
}


async function updateMovedItemAdmin(uid: string, storeType: StoreType, item: IOrder | IListing) {
    try {
        if (storeType === item.storeType) return;
        const isItemOrder = isOrder(item);

        const itemType = isItemOrder ? "orders" : "inventory";
        const isAuto = item.recordType === "automatic" ? true : false;
        const idKey = isItemOrder ? item.transactionId : item.itemId;

        if (!idKey || !item.storeType) {
            throw Error(`Item does not contain an ID or a storeType: ID: ${idKey} | StoreType: ${item.storeType}`)
        }

        const oldItemRef = firestoreAdmin.collection(itemType).doc(uid).collection(storeType).doc(idKey);
        const newItemRef = firestoreAdmin.collection(itemType).doc(uid).collection(item.storeType).doc(idKey);

        // Add the new item
        await newItemRef.set(item);

        // Increment the new store count
        await updateUserItemCountAdmin({ uid, itemType, storeType: item.storeType, amount: 1, isAuto })
        
        await oldItemRef.delete();

        // Decrement the old store count
        await updateUserItemCountAdmin({ uid, itemType, storeType: storeType, amount: -1, isAuto })
    } catch (error) {
        console.error("Error moving item between storeTypes:", error);
        throw error;
    }
}


export { createNewInventoryItemAdmin, createNewOrderItemAdmin, updateMovedItemAdmin };