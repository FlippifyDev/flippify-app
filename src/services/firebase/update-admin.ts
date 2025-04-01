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


export async function incrementUserManualListingsAdmin(uid: string, storePlatform: StorePlatform): Promise<{ success?: boolean, error?: any }> {
    try {
        const userRef = firestoreAdmin.collection('users').doc(uid);
        // Update the user's manual listings count
        await userRef.set(
            {
                store: {
                    [storePlatform]: {
                        numListings: {
                            manual: FieldValue.increment(1)
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