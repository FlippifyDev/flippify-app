"use server";

// Local Imports
import { IUser } from '@/models/user';
import { firestoreAdmin } from '@/lib/firebase/config-admin';
import { userProfileImages } from '@/utils/constants';
import { retrieveStripeCustomer } from '@/services/stripe/retrieve';
import { generateRandomChars } from '@/utils/generate-random';


// This function will run when a new user signs up using Firebase Auth
export async function createUser(uid: string, email: string): Promise<IUser | void> {
    try {
        const referralCode = generateRandomChars(7);
        const randomUsername = generateRandomChars(10);
        const customerId = await retrieveStripeCustomer(null, email, referralCode);

        // Get the user document reference
        const userRef = firestoreAdmin.collection('users').doc(uid);

        // Create an empty user object with default values
        const emptyUser = {
            id: uid,
            connectedAccounts: {
                discord: null,
                ebay: null,
            },
            username: randomUsername,
            email: email,
            stripeCustomerId: customerId,
            subscriptions: null,
            referral: {
                referralCode: referralCode,
                referredBy: null,
                validReferrals: [],
                rewardsClaimed: 0,
            },
            store: null,
            preferences: {
                currency: 'USD',
            },
            authentication: {
                emailVerified: 'verified',
            },
            metaData: {
                createdAt: new Date().toISOString(), // Use ISO string for consistency
                image: userProfileImages[Math.floor(Math.random() * userProfileImages.length)],
            },
        };

        // Use Firestore Admin to write to Firestore (bypasses security rules)
        await userRef.set(emptyUser);

        console.log('User successfully created in Firestore!');

        const { connectedAccounts, ...safeUser } = emptyUser;
        return safeUser as IUser;
    } catch (error) {
        console.error('Error creating user in Firestore:', error);
    }
}
