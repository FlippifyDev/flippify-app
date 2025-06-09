"use server";

// Local Imports
import { IUser } from "@/models/user";
import { extractItemId } from "./extract";
import { firestoreAdmin } from "@/lib/firebase/config-admin";
import { updateItemCount } from "./admin-update";
import { formatDateToISO } from "@/utils/format-dates";
import { retrieveUIDAdmin } from "./admin-retrieve";
import { userProfileImages } from "@/utils/constants";
import { generateRandomChars } from "@/utils/generate-random";
import { retrieveStripeCustomer } from "../stripe/retrieve";
import { ItemType, RootColType, SubColType } from "./models";
import { usersCol } from "./constants";


interface CreateItemProps {
    idToken: string;
    rootCol: RootColType;
    subCol: SubColType;
    item: ItemType;
}
export async function createItem({ idToken, rootCol, subCol, item }: CreateItemProps): Promise<{ success?: boolean, error?: any }> {
    try {
        // Step 1: Extract Item ID
        const id = extractItemId({ item });
        if (!id) throw Error(`Item does not contain an ID`);

        // Step 2: Retrieve UID
        const uid = await retrieveUIDAdmin({ idToken });
        if (!uid) throw Error("User could not be found");

        // Step 3: Get the related document reference
        const docRef = firestoreAdmin.collection(rootCol).doc(uid).collection(subCol).doc(id);

        // Step 4: Check if the item already exists
        const docSnapshot = await docRef.get();
        if (docSnapshot.exists) throw Error(`Item ${id} already exists.`);

        // Step 5: Create the document
        await docRef.set(item, { merge: true });

        // Step 6: Update item count
        await updateItemCount({ idToken, item, rootCol, isNewItem: true })

        return { success: true };
    } catch (error) {
        console.error(`Error in createItem: ${error}`);
        return { error: `${error}` };
    }
}


export async function createItemsBatch({
    idToken,
    rootCol,
    subCol,
    items,
}: {
    idToken: string;
    rootCol: RootColType;
    subCol: SubColType;
    items: ItemType[];
}): Promise<{ successCount: number; errors: any[] }> {
    // Initialize admin SDK client (only works in Node/cloudfn)
    const uid = await retrieveUIDAdmin({ idToken });
    if (!uid) throw new Error("User could not be found");

    const batch = firestoreAdmin.batch();
    const errors: any[] = [];

    items.forEach(item => {
        try {
            const id = extractItemId({ item });
            if (!id) throw new Error("Missing ID");
            const docRef = firestoreAdmin
                .collection(rootCol)
                .doc(uid)
                .collection(subCol)
                .doc(id);
            // If you really need to check existence, you could do a get() first—
            // but that defeats the point of a batch. We'll just upsert:
            batch.set(docRef, item, { merge: true });
        } catch (e) {
            errors.push(e);
        }
    });

    // Fire the batch
    await batch.commit();
    return { successCount: items.length - errors.length, errors };
}
  


export async function createUser({ uid, email }: { uid: string, email: string }): Promise<IUser | void> {
    try {
        console.log("Creating new user", uid, email)
        const referralCode = generateRandomChars(7);
        const randomUsername = generateRandomChars(10);
        const customerId = await retrieveStripeCustomer(null, email, referralCode);

        // Get the user document reference
        const userRef = firestoreAdmin.collection(usersCol).doc(uid);

        const now = new Date();
        const resetDate = formatDateToISO(new Date(now.getFullYear(), now.getMonth() + 1, 1));


        // Create an empty user object with default values
        const emptyUser = {
            id: uid,
            username: randomUsername,
            email: email,
            stripeCustomerId: customerId,
            connectedAccounts: {
                discord: null,
                ebay: null,
            },
            subscriptions: null,
            referral: {
                referralCode: referralCode,
                referredBy: null,
                validReferrals: [],
                rewardsClaimed: 0,
            },
            store: {
                numExpenses: {
                    oneTime: 0,
                    totalOneTime: 0,
                    resetDate: resetDate,
                    subscriptions: 0,
                },
                numOrders: {
                    automatic: 0,
                    manual: 0,
                    resetDate: resetDate,
                    totalAutomatic: 0,
                    totalManual: 0
                },
                numListings: {
                    automatic: 0,
                    manual: 0
                }
            },
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

        const { connectedAccounts, ...safeUser } = emptyUser;
        return safeUser as IUser;
    } catch (error) {
        console.error('Error creating user in Firestore:', error);
    }
}