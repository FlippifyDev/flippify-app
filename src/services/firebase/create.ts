// Local Imports
import { IUser } from '@/models/user';
import { firestore } from '@/lib/firebase/config';
import { retrieveStripeCustomer } from '@/services/stripe/retrieve';
import { generateRandomChars } from '@/utils/generate-random';

// External Imports
import { doc, setDoc } from 'firebase/firestore';

// This function will run when a new user signs up using Firebase Auth
export async function createUser(uid: string, email: string): Promise<IUser | void> {
    try {
        const referralCode = generateRandomChars(7);
        const randomUsername = generateRandomChars(10);
        const customerId = await retrieveStripeCustomer(null, email, referralCode);
        // Add the user to Firestore `users` collection
        const userRef = doc(firestore, 'users', uid);
        const emptyUser: IUser = {
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
                preferredEmail: email,
                locale: 'GB',
                currency: 'USD',
            },
            authentication: {
                emailVerified: 'verified'
            },
            metaData: {
                createdAt: new Date().toString()
            }
        };

        await setDoc(userRef, emptyUser);
        return emptyUser;
    } catch (error) {
        console.error('Error creating user in Firestore:', error);
    }
};
