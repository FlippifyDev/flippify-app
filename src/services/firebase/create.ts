// Local Imports
import { IUser } from '@/models/user';
import { firestore } from '@/lib/firebase/config';
import retrieveStripeCustomer from '@/lib/stripe/retrieve';
import { generateReferralCode } from '@/utils/generate-referral-code';

// External Imports
import { doc, setDoc} from 'firebase/firestore';

// This function will run when a new user signs up using Firebase Auth
export async function createUser(uid: string, email: string): Promise<IUser | void> {
    try {
        const referralCode = generateReferralCode();
        const customer = await retrieveStripeCustomer(null, email, referralCode);
        // Add the user to Firestore `users` collection
        const userRef = doc(firestore, 'users', uid);
        const emptyUser: IUser = {
            id: uid,
            connectedAccounts: {
                discord: null,
                ebay: null,
            }, 
            username: null,
            email: email,
            stripeCustomerId: customer.id,  
            subscriptions: null,
            referral: {
                referralCode: referralCode,
                referredBy: null,
                validReferrals: [],
                rewardsClaimed: 0,
            },
            inventory: { ebay: null },
            orders: { ebay: null },
            numListings: {
                automatic: 0,
                manual: 0,
            },
            numOrders: {
                automatic: 0,
                manual: 0,
            },
            lastFetchedDate: null,  
            preferences: {
                notificationsEnabled: false,
                preferredEmail: email,
                locale: 'GB', 
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
