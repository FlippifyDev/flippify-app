"use server";

import { firestoreAdmin } from "@/lib/firebase/config-admin";
import { IEbayInventoryItem, StorePlatform } from "@/models/store-data";
import { incrementUserManualListingsAdmin } from "./update-admin";


/**
 * Create a new listing in inventory/{uid}/{storePlatform}/{itemId}
 * @param uid 
 * @param storePlatform 
 * @param listing 
 */
async function createNewInventoryItem(uid: string, storePlatform: StorePlatform, listing: IEbayInventoryItem): Promise<{ success?: boolean, error?: any }> {
    try {
        const inventoryRef = firestoreAdmin.collection("inventory").doc(uid).collection(storePlatform)

        // Use the listing's id as the document id in the store collection
        const itemDocRef = inventoryRef.doc(listing.itemId);

        // Create or update the listing document
        await itemDocRef.set(listing, { merge: true });

        const { success: incrementSuccess } = await incrementUserManualListingsAdmin(uid, storePlatform)
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



export { createNewInventoryItem };