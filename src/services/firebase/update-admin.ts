"use server";

import { ISubscription, IUser } from "@/models/user";
import { firestoreAdmin } from "@/lib/firebase/config-admin";
import { StorePlatform } from "@/models/store-data";
import { FieldValue } from "firebase-admin/firestore";


export async function updateReferreeUserAdmin(referredUserId: string, referreeCode: string): Promise<{ success: boolean }> {
    try {
        const referreeUserQuery = firestoreAdmin.collection('users').where('referral.referralCode', '==', referreeCode);
        if (!referreeUserQuery) return { success: false };
        const querySnapshot = await referreeUserQuery.get();
        if (querySnapshot.empty) return { success: false };

        const referreeDoc = querySnapshot.docs[0];
        const referralData = referreeDoc.data() as IUser;

        // Check if the referred user ID is already in the validReferrals array
        if (!referralData.referral.validReferrals.includes(referredUserId)) {
            // Add the referred user's ID to the validReferrals array
            const updatedReferrals = [...referralData.referral.validReferrals, referredUserId];

            // Update the document in Firestore
            await referreeDoc.ref.set(
                { referral: { validReferrals: updatedReferrals } },
                { merge: true }
            );
            return { success: true };
        } else {
            console.log("Referral already exists for this user.");
            return { success: false };
        }
    } catch (error) {
        console.error("Error updating referree user:", error);
        return { success: false };
    }

}


export async function updateUserSubscriptionAdmin(uid: string, subscription: ISubscription): Promise<void> {
    try {
        const userRef = firestoreAdmin.collection('users').doc(uid);
        // Update the user's subscriptions array
        await userRef.set(
            { subscriptions: [subscription] },
            { merge: true }
        );

    } catch (error) {
        console.error("Error updating user subscription:", error);
    }
}


export async function updateReferredByAdmin(uid: string, referredBy: string): Promise<void> {
    try {
        const userRef = firestoreAdmin.collection('users').doc(uid);
        // Update the user's referral code
        await userRef.set(
            { referral: { referredBy } },
            { merge: true }
        );

    } catch (error) {
        console.error("Error updating referral code:", error);
    }
}


export async function updateUserManualListingsCountAdmin(uid: string, storePlatform: StorePlatform, amount: number = 1): Promise<{ success?: boolean, error?: any }> {
    try {
        const userRef = firestoreAdmin.collection('users').doc(uid);
        // Update the user's manual listings count
        await userRef.set(
            {
                store: {
                    [storePlatform]: {
                        numListings: {
                            manual: FieldValue.increment(amount)
                        }
                    }
                }
            }, { merge: true }
        );

        return { success: true };

    } catch (error) {
        console.error("Error updating manual listings:", error);
        return { error: error };
    }
}


export async function updateUserManualOrdersCountAdmin(uid: string, storePlatform: StorePlatform, amount: number = 1): Promise<{ success?: boolean, error?: any }> {
    try {
        const userRef = firestoreAdmin.collection('users').doc(uid);
        // Update the user's manual orders count
        await userRef.set(
            {
                store: {
                    [storePlatform]: {
                        numOrders: {
                            manual: FieldValue.increment(amount),
                            totalManual: FieldValue.increment(amount)
                        }
                    }
                }
            }, { merge: true }
        );

        return { success: true };

    } catch (error) {
        console.error("Error updating manual orders:", error);
        return { error: error };
    }
}


/**
 * Updates or deletes a listing in Firestore under `inventory/{uid}/{storePlatform}/{listingId}`.
 * 
 * This function decreases the quantity of an existing listing by a specified amount. 
 * If the quantity reaches zero or below, the listing is removed from Firestore.
 * Additionally, it updates the user's manual listings count accordingly.
 * 
 * @param {string} uid - The unique user ID to whom the listing belongs.
 * @param {StorePlatform} storePlatform - The e-commerce platform (e.g., eBay, Amazon) associated with the listing.
 * @param {string} listingId - The unique identifier of the listing to be updated.
 * @param {number} [amount=1] - The amount by which the listing's quantity should be reduced (default is 1).
 * 
 * @returns {Promise<{ success?: boolean; error?: any }>} 
 * - Returns `{ success: true }` if the update is successful.
 * - Returns `{ error: any }` if an error occurs during the process.
 * 
 * @throws Will catch and return errors encountered during Firestore operations.
 * 
 * @remarks
 * - If the listing does not exist, the function returns an error.
 * - If the new quantity is zero or negative, the listing is deleted instead of updated.
 * - The user's manual listings count is decremented accordingly.
 */
export async function updateListingAdmin(uid: string, storePlatform: StorePlatform, listingId: string, amount: number = 1): Promise<{ success?: boolean; error?: any }> {
    try {
        const listingRef = firestoreAdmin.collection('inventory').doc(uid).collection(storePlatform).doc(listingId);

        // Fetch the current listing data
        const listingSnap = await listingRef.get();
        if (!listingSnap.exists) {
            return { error: "Listing not found." };
        }

        const currentQuantity = listingSnap.data()?.quantity || 0;
        const newQuantity = currentQuantity - amount;

        if (newQuantity <= 0) {
            // Delete the listing if the new quantity is 0 or less
            await listingRef.delete();

            // Decrement the user's manual listings count when quantity is 0 or less
            const { success, error } = await updateUserManualListingsCountAdmin(uid, storePlatform, -1);
            if (!success) {
                console.error(`Error decrementing user manual listings count. ${error}`);
                return { error: `Error decrementing user manual listings count. ${error}` };
            }
        } else {
            // Otherwise, update the quantity
            await listingRef.update({
                quantity: FieldValue.increment(-amount),
            });
        }

        return { success: true };
    } catch (error) {
        console.error("Error updating manual listings:", error);
        return { error };
    }
}