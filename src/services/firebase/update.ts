// Local Imports
import { IUser } from "@/models/user";
import { retrieveUserRef, retrieveUserRefById } from "./retrieve";

// External Imports
import { doc, getDoc, increment, setDoc } from "firebase/firestore";



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
async function updateUser(filter_key: string, filter_value: string, data: any) {
    try {
        const userRef = await retrieveUserRef(filter_key, filter_value);
        if (userRef) {
            await setDoc(userRef, data, { merge: true });
        } else {
            console.log(`No user found with ${filter_key}: ${filter_value}`);
        }
    } catch (error) {
        console.error("Error updating user in Firestore:", error);
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
 * @param {string} email - The email to set as the user's preferred email.
 * @param {string} currency - The currency to set for the user.
 * @returns {Promise<void>} A promise that resolves when the document update is complete.
 */
async function updateUserPreferences(customerId: string, email: string, currency: string) {
    try {
        const userRef = await retrieveUserRef("stripeCustomerId", customerId);
        if (userRef) {
            await setDoc(userRef, { ["preferredEmail"]: email, currency }, { merge: true });
        }
    } catch (error) {
        console.error("Error updating Firestore user:", error);
        throw error;
    }
};


/**
 * Completes the onboarding process for a user, optionally handling referrals.
 *
 * @param {string} uid - The user's unique ID.
 * @param {string | null} referralCode - The referral code used during signup, if any.
 * @returns {Promise<void>} Resolves when the onboarding is complete.
 */
async function completeOnboarding(uid: string, referralCode: string | null): Promise<void> {
    try {
        const userRef = await retrieveUserRefById(uid);
        if (!userRef) return;

        // Step 1: Handle referral if a referral code is provided
        if (referralCode) {
            const referralUserRef = await retrieveUserRef("referral.referralCode", referralCode);
            if (referralUserRef) {
                // Check if the user has already been referred by someone
                const referralSnap = await getDoc(referralUserRef);
                if (referralSnap.exists()) {
                    const referralData = referralSnap.data() as IUser;
                    if (!referralData.referral.validReferrals.includes(uid)) {
                        // Increment referral count only if the user has not been referred already
                        await setDoc(referralUserRef, { ["referral.referralCount"]: increment(1) }, { merge: true });
                        await setDoc(userRef, { ["referral.referredBy"]: referralCode }, { merge: true });

                        // Add the current user to the list of valid referrals for the referrer
                        const updatedReferrals = [...referralData.referral.validReferrals, uid];
                        await setDoc(referralUserRef, { ["referral.validReferrals"]: updatedReferrals }, { merge: true });
                    }
                }
            }
        }

        // Step 2: Handle subscriptions
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            const userData = userSnap.data() as IUser;

            // Ensure the subscription isn't duplicated
            const existingSubscriptions = userData.subscriptions || [];
            const subscriptionExists = existingSubscriptions.some(sub => sub.name === "accessGranted");
            if (!subscriptionExists) {
                existingSubscriptions.push({ name: "accessGranted", id: "0", override: true, createdAt: new Date().toString() });
                await setDoc(userRef, { subscriptions: existingSubscriptions }, { merge: true });
            }
        }
    } catch (error) {
        console.error("Error completing onboarding:", error);
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


export { updateUser, updateUserPreferences, completeOnboarding, incrementRewardsClaimed };