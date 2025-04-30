// Local Imports
import { IUser } from "@/models/user";
import { orderCacheKey } from "@/utils/constants";
import { formatDateToISO } from "@/utils/format-dates";
import { updateCacheData } from "@/utils/cache-helpers";
import { createHistoryItems } from "./helpers";
import { updateReferreeUserAdmin } from "./update-admin";
import { IListing, IOrder, OrderStatus, StoreType } from "@/models/store-data";
import { retrieveUserOrderItemRef, retrieveUserRefById } from "./retrieve";

// External Imports
import { collection, deleteField, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { firestore } from "@/lib/firebase/config";



/**
 * Updates a user's document in Firestore based on a filter key and value.
 *
 * This function searches for a user document in Firestore based on the specified `filter_key` and `filter_value`.
 * If a user document is found, it merges the provided `data` into the document. If no matching user is found,
 * an error message is logged.
 *
 * @param {string} filter_key - The field to filter the user by (e.g., 'uid', 'email', etc.).
 * @param {string} filter_value - The value of the field to match (e.g., the actual uid or email).
 * @param {any} data - The data to update in the user's document.
 * @returns {Promise<void>} A promise that resolves when the document update is complete.
 */
async function updateUser(uid: string, data: any): Promise<boolean> {
    try {
        const userRef = await retrieveUserRefById(uid);

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

/**
 * Updates a user's preferences in Firestore based on their Stripe customer ID.
 *
 * This function updates the user's preferences (email and currency) in Firestore by matching the provided
 * `customerId` with the user's `stripeCustomerId` in the Firestore document. If a matching user is found,
 * their preferences are updated with the provided values.
 *
 * @param {string} customerId - The Stripe customer ID of the user to update.
 * @param {string} currency - The currency to set for the user.
 * @returns {Promise<void>} A promise that resolves when the document update is complete.
 */
async function updateUserPreferences(uid: string, currency: string) {
    try {
        const userRef = await retrieveUserRefById(uid);
        if (userRef) {
            await setDoc(
                userRef,
                {
                    preferences: {
                        currency
                    }
                },
                { merge: true }
            );
        }
    } catch (error) {
        console.error("Error updating Firestore user:", error);
        throw error;
    }
}

/**
 * Completes the onboarding process for a user, optionally handling referrals.
 *
 * @param {string} uid - The user's unique ID.
 * @param {string | null} referralCode - The referral code used during signup, if any.
 * @returns {Promise<void>} Resolves when the onboarding is complete.
 */
async function completeOnboarding(uid: string, referralCode: string | null): Promise<IUser | null> {
    try {
        const userRef = await retrieveUserRefById(uid);
        if (!userRef) return null;

        // Step 1: Handle referral if a referral code is provided
        if (referralCode) {
            const { success } = await updateReferreeUserAdmin(uid, referralCode);
            if (success) {
                await setDoc(userRef, { referral: { referredBy: referralCode } }, { merge: true });
            }
        }

        // Step 2: Handle subscriptions
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            const userData = userSnap.data() as IUser;
            const existingSubscriptions = userData.subscriptions || [];
            const subscriptionExists = existingSubscriptions.some(sub => sub.name === "accessGranted");

            if (!subscriptionExists) {
                existingSubscriptions.push({ name: "accessGranted", id: "0", override: true, createdAt: formatDateToISO(new Date()) });
                await setDoc(userRef, { subscriptions: existingSubscriptions }, { merge: true });
            }

            await setDoc(
                userRef,
                {
                    authentication: {
                        onboarding: deleteField()
                    }
                },
                { merge: true }
            );
        }

        // 🔄 Fetch and return the updated user document
        const updatedUserSnap = await getDoc(userRef);
        if (updatedUserSnap.exists()) {
            return updatedUserSnap.data() as IUser;
        } else {
            console.error("User document not found after updating.");
            return null;
        }

    } catch (error) {
        console.error("Error completing onboarding:", error);
        return null;
    }
}

/**
 * Increments the "rewardsClaimed" field for a user in Firestore by 1.
 * If the user does not have a rewardsClaimed field, it initializes it to 0 and then increments.
 *
 * @param {string} uid - The UID of the user whose rewardsClaimed count will be incremented.
 * @returns {Promise<void>} A promise that resolves when the user's rewardsClaimed field is updated.
 */
async function incrementRewardsClaimed(uid: string): Promise<void> {
    try {
        // Reference to the user's document in Firestore
        const userRef = await retrieveUserRefById(uid);
        if (!userRef) return;

        // Get the current user document
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            // Get the current rewardsClaimed value (defaults to 0 if it doesn't exist)
            const currentRewardsClaimed = userDoc.data()?.rewardsClaimed || 0;

            // Increment the rewardsClaimed by 1
            const newRewardsClaimed = currentRewardsClaimed + 1;

            // Update the rewardsClaimed field in Firestore
            await setDoc(userRef, { rewardsClaimed: newRewardsClaimed }, { merge: true });

            console.log(`Successfully incremented rewardsClaimed for user ${uid}. New value: ${newRewardsClaimed}`);
        } else {
            console.log(`No user found with uid: ${uid}`);
        }
    } catch (error) {
        console.error("Error incrementing rewards claimed:", error);
    }
}


async function updateOrderStatus(uid: string, order: IOrder, status: OrderStatus): Promise<void> {
    try {
        if (!order.transactionId || !order.sale?.price || !order.sale.date) {
            throw Error("error")
        }

        const orderRef = await retrieveUserOrderItemRef(uid, order.transactionId);

        if (!orderRef) {
            console.error(`No order found with ID: ${order.transactionId}`);
            return;
        }

        const historyItems = createHistoryItems(
            {
                status,
                salePrice: order.sale.price,
                dbHistory: order.history,
                saleDate: order.sale.date
            }
        );

        await updateDoc(orderRef, {
            status: status,
            history: historyItems
        });

        order.status = status;
        if (historyItems) {
            order.history = historyItems
        }
        updateCacheData(`${orderCacheKey}-${uid}`, order)

        console.log(`Order ${order.transactionId} status updated to ${status}`);
    } catch (error) {
        console.error("Error updating Firestore order status:", error);
        throw error;
    }
}


/**
 * Updates (or creates) an eBay inventory item in Firestore.
 * @param uid       – the user’s UID
 * @param listing   – the full listing payload to write
 * @param storeType – which sub‐collection under "inventory"/uid to use
 * @returns         – the saved listing, or null on error
 */
async function updateListing(
    uid: string,
    listing: IListing,
    storeType: StoreType
): Promise<{ success?: boolean, error?: any }> {
    try {
        if (!listing.itemId) {
            throw Error("Listing did not contain an ID")
        }

        // Reference to /inventory/{uid}/{storeType}/{itemId}
        const colRef = collection(firestore, "inventory", uid, storeType);
        const itemDoc = doc(colRef, listing.itemId);

        // Write the listing object to Firestore, merging with any existing data
        await setDoc(itemDoc, listing, { merge: true });

        // Return the payload back to the caller for further use
        return { success: true };
    } catch (error) {
        console.error(`Error updating item with ID=${listing.itemId}:`, error);
        return { error: `Error updating item with ID=${listing.itemId}: ${error}`};
    }
}


export { updateUser, updateUserPreferences, completeOnboarding, incrementRewardsClaimed, updateOrderStatus, updateListing };