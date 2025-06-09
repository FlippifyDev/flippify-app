"use server";

// Local Imports
import { IUser } from "@/models/user";
import { addToken } from "../oauth/add-token";
import { FieldValue } from "firebase-admin/firestore";
import { extractItemId } from "./extract";
import { firestoreAdmin } from "@/lib/firebase/config-admin";
import { formatDateToISO } from "@/utils/format-dates";
import { retrieveUIDAdmin } from "./admin-retrieve";
import { accountToRefreshFunc } from "../oauth/utils";
import { inventoryCol, usersCol } from "./constants";
import { incrementItemCountFields } from "./admin-increment";
import { IListing, IOrder, StoreType } from "@/models/store-data";
import { HardcodedStoreType, ItemType, RootColType } from "./models";


interface UpdateUserItemCountProps {
    idToken: string;
    item: ItemType;
    rootCol: RootColType;
    isNegated?: boolean;
    isNewItem?: boolean;
    amount?: number;
}
export async function updateItemCount({ idToken, item, rootCol, isNegated, isNewItem, amount }: UpdateUserItemCountProps) {
    try {
        // Step 1: Extract Item ID
        const id = extractItemId({ item });
        if (!id) throw Error(`Item does not contain an ID`);

        // Step 2: Retrieve UID
        const uid = await retrieveUIDAdmin({ idToken });
        if (!uid) return;

        // Step 3: Retrieve user document reference
        const userRef = firestoreAdmin.collection(usersCol).doc(uid);

        // Step 4: Get update fields
        const updateFields = await incrementItemCountFields({ item, rootCol, isNegated, isNewItem, amount });

        // Step 5: Update the counts
        await userRef.set({ store: updateFields }, { merge: true });
    } catch (error) {
        console.error(`Error in updateItemCount: ${error}`);
        return { error: `${error}` };
    }
}


interface IUpdateListingAdminProps {
    idToken: string;
    storeType: StoreType;
    item: IListing;
    amount: number;
}
export async function updateListing({ idToken, storeType, item, amount = 1 }: IUpdateListingAdminProps): Promise<{ success?: boolean; error?: any }> {
    try {
        // Step 1: Extract Item ID
        const id = item.itemId;
        if (!id) throw Error(`Item does not contain an ID`);

        // Step 2: Retrieve UID
        const uid = await retrieveUIDAdmin({ idToken });
        if (!uid) throw Error("User could not be found");

        // Step 3: Retrieve user document reference
        const docRef = firestoreAdmin.collection(inventoryCol).doc(uid).collection(storeType).doc(id);

        // Step 4: Check if listing exists
        const snapshot = await docRef.get();
        if (!snapshot.exists) return { error: "Listing not found." };

        // Step 5: Extract data from snapshot
        const data = snapshot.data() as IListing;

        // Step 6: Extract quantity from listing
        const quantity = data.quantity ?? 0

        // Step 7: If quantity minus the amount to change is zero then delete the listing
        if (quantity - amount <= 0) {
            // Step 8: Delete item
            await docRef.delete();

            // Step 9: Update the counts
            await updateItemCount({ idToken, item, rootCol: inventoryCol, isNegated: true })
        } else {
            // Step 10: Update the listing quantity
            await docRef.update({
                quantity: FieldValue.increment(-amount),
            });
        }

        return { success: true };
    } catch (error) {
        console.error("Error updateListing", error);
        return { error: `${error}` };
    }
}


export async function updateResetDates({ uid }: { uid: string }): Promise<{ success?: boolean; error?: any }> {
    try {
        // Step 1: Retrieve document reference
        const userRef = firestoreAdmin.collection(usersCol).doc(uid);
        const snap = await userRef.get();
        if (!snap.exists) {
            console.warn(`User ${uid} not found.`);
            return { success: false };
        }

        // Step 2: Extract data from reference
        const userData = snap.data() as IUser;

        const now = new Date();
        const updates: Record<string, any> = {};

        // Step 3: Reset any dates in the users shop
        async function updateResetDate(key: "numOrders" | "numExpenses", resetKeys: string[]) {
            const num = userData.store?.[key] ?? {};
            const resetDateStr = num.resetDate ?? new Date(now.getFullYear(), now.getMonth() - 1, 1);

            const resetDate = new Date(resetDateStr);
            if (resetDate < now) {
                const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

                updates[`store.${key}.resetDate`] = formatDateToISO(nextMonth);

                for (const resetKey of resetKeys) {
                    updates[`store.${key}.${resetKey}`] = 0;
                }
            }
        }

        await updateResetDate("numOrders", ["automatic", "manual"]);
        await updateResetDate("numExpenses", ["oneTime"]);

        if (updates.length > 0) {
            await userRef.update(updates);
        }

        return { success: true };
    } catch (error) {
        console.error('Error updating reset dates:', error);
        return { error: `${error}` };
    }
}

export async function checkAndRefreshTokens({ uid }: { uid: string }): Promise<{ success?: boolean; error?: any }> {
    try {
        // Step 1: Retrieve document reference
        const userRef = firestoreAdmin.collection(usersCol).doc(uid);
        const snap = await userRef.get();
        if (!snap.exists) {
            console.warn(`User ${uid} not found.`);
            return { success: false, error: `User ${uid} not found.` };
        }

        // Step 2: Extract data from reference
        const user = snap.data();
        if (!user) return { error: "User not found" };

        // Step 3: Extract connected accounts
        const accounts = user?.connectedAccounts as Record<string, unknown> | undefined;
        if (!accounts) return { success: true };

        // Step 5:
        for (const [store, data] of Object.entries(accounts)) {
            if (!data) continue;

            const expiresData = (data as { [key: string]: any })[`${store}TokenExpiry`];
            const refreshToken = (data as { [key: string]: any })[`${store}RefreshToken`];
            if (!refreshToken) continue;

            // Skip if token does not expire within the next 30 minutes
            const now = Date.now(); // in milliseconds
            const expiry = typeof expiresData === 'number' && expiresData < 1e12
                ? expiresData * 1000 // convert seconds to ms if necessary
                : expiresData;

            const THIRTY_MINUTES = 30 * 60 * 1000;
            if (expiry && expiry > now + THIRTY_MINUTES) {
                continue; // token still valid, no need to refresh
            }

            const typedPlatform = store as HardcodedStoreType;
            const refreshFn = accountToRefreshFunc[typedPlatform];
            if (!refreshFn) continue;

            try {
                const tokenData = await refreshFn({ refresh_token: refreshToken });
                if (tokenData) {
                    const { error: addTokenError } = await addToken({ uid: user.id as string, store, tokenData });
                    if (addTokenError) throw addTokenError;
                }
            } catch (error) {
                console.error('Error refreshing tokens:', error);
                continue
            }
        }

        return { success: true }
    } catch (error) {
        console.error('Error refreshing tokens:', error);
        return { error: `${error}` };
    }
}


export async function updateMovedItem({ idToken, rootCol, oldStoreType, item }: { idToken: string, rootCol: RootColType, oldStoreType: StoreType, item: IOrder | IListing }) {
    try {
        // Step 1: Extract Item ID
        const id = extractItemId({ item });
        if (!id) throw Error(`Item does not contain an ID`);

        // Step 2: Retrieve UID
        const uid = await retrieveUIDAdmin({ idToken });
        if (!uid) return;

        // Step 3: Check if the store type matches the item store type
        if (oldStoreType === item.storeType || !item.storeType) return;

        // Step 4: Retrieve document references
        const oldItemRef = firestoreAdmin.collection(rootCol).doc(uid).collection(oldStoreType).doc(id);
        const newItemRef = firestoreAdmin.collection(rootCol).doc(uid).collection(item.storeType).doc(id);

        // Step 5: Add the new item
        await newItemRef.set(item);

        // Step 6: Delete the old item
        await oldItemRef.delete();
    } catch (error) {
        console.error('Error updateMovedItem', error);
        return { error: `${error}` };
    }
}


export async function updateAccessGranted({ idToken }: { idToken: string }): Promise<void> {
    try {
        // Step 1: Retrieve UID
        const uid = await retrieveUIDAdmin({ idToken });
        if (!uid) return;

        // Step 2: Retrieve document reference
        const userRef = firestoreAdmin.collection(usersCol).doc(uid);

        // Step 2: Update document
        await userRef.set(
            {
                subscriptions: [{
                    name: "accessGranted",
                    id: "0",
                    override: true,
                    createdAt: formatDateToISO(new Date())
                }]
            },
            { merge: true }
        );

    } catch (error) {
        console.error("Error updating user subscription:", error);
    }
}


export async function updateReferredBy({ idToken, referredBy }: { idToken: string, referredBy: string }): Promise<void> {
    try {
        // Step 1: Retrieve UID
        const uid = await retrieveUIDAdmin({ idToken });
        if (!uid) return;

        // Step 2: Retrieve document reference
        const userRef = firestoreAdmin.collection(usersCol).doc(uid);

        // Step 3: Update the user's referral code
        await userRef.set(
            { referral: { referredBy } },
            { merge: true }
        );

    } catch (error) {
        console.error("Error updating referral code:", error);
    }
}


export async function updateReferreeUser({ referredUserId, referreeCode }: { referredUserId: string, referreeCode: string }): Promise<{ success: boolean }> {
    try {
        // Step 1: Create query
        const referreeUserQuery = firestoreAdmin.collection(usersCol).where('referral.referralCode', '==', referreeCode);
        if (!referreeUserQuery) return { success: false };

        // Step 2: Get query snapshot
        const querySnapshot = await referreeUserQuery.get();
        if (querySnapshot.empty) return { success: false };

        // Step 3: Extract referral user
        const referreeDoc = querySnapshot.docs[0];
        const referralData = referreeDoc.data() as IUser;

        // Step 4: Check if the referred user ID is already in the validReferrals array
        if (referralData.referral?.validReferrals?.includes(referredUserId)) {
            console.log("Referral already exists for this user.");
            return { success: false };
        }

        // Step 5: Add the referred user's ID to the validReferrals array
        const updatedReferrals = [...referralData.referral?.validReferrals ?? [], referredUserId];

        // Step 6: Update the document in Firestore
        await referreeDoc.ref.set(
            { referral: { validReferrals: updatedReferrals } },
            { merge: true }
        );

        return { success: true };
    } catch (error) {
        console.error("Error updating referree user:", error);
        return { success: false };
    }

}