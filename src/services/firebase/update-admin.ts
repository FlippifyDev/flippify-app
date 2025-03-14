"use server";

import { IUser } from "@/models/user";
import { firestoreAdmin } from "@/lib/firebase/config-admin";

export async function updateReferreeUser(referredUserId: string, referreeCode: string): Promise<{ success: boolean }> {
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
