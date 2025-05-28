// Local Imports
import { IUser } from "@/models/user";
import { ordersCol, usersCol } from "./constants";
import { createUser } from "./admin-create";
import { extractItemDateByFilter, extractItemId } from "./extract";
import { firestore, auth } from "@/lib/firebase/config";
import { DateFilterKeyType, ItemType, RootColType, SubColType } from "./models";

// External Imports
import { collection, doc, documentId, DocumentReference, getDoc, getDocs, limit, orderBy, query, QueryDocumentSnapshot, startAfter, where } from "firebase/firestore";
import { IOrder, StoreType } from "@/models/store-data";


export async function retrieveUserRef({ filterKey, filterValue }: { filterKey: string, filterValue: string }): Promise<DocumentReference | void> {
    try {
        const colRef = collection(firestore, usersCol);
        const q = query(colRef, where(filterKey, "==", filterValue));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const userRef = doc(firestore, usersCol, querySnapshot.docs[0].id);
            return userRef;
        }
        console.log(`No user found with ${filterKey}: ${filterValue}`);
    } catch (error) {
        console.error(`Error retrieving user reference with ${filterKey}=${filterValue}:`, error);
    }
}

export async function retrieveUserRefById({ uid }: { uid: string }): Promise<DocumentReference | void> {
    try {
        const userRef = doc(firestore, usersCol, uid);
        if (!userRef) {
            console.log(`No user found with id=${uid}`);
            return;
        }
        return userRef;
    } catch (error) {
        console.error(`Error retrieving user reference with id=${uid}:`, error);
        return;
    }
}


export async function retrieveIdToken() {
    try {
        const user = auth.currentUser;
        if (!user) return;

        const idToken = await user?.getIdToken();
        if (!idToken) return;

        return idToken;
    } catch (error) {
        console.error(error)
    }
}


export async function retrieveUserAndCreate({ uid, email }: { uid: string, email?: string | null }): Promise<IUser | void> {
    try {
        // Step 1: Retrieve document reference
        const docRef = doc(firestore, usersCol, uid);
        const userDoc = await getDoc(docRef);

        // Step 2: Check if the user document exists
        if (userDoc.exists()) {
            // Step 3: Extract & return the user data as an IUser object
            return userDoc.data() as IUser;
        } else {
            if (!email) throw new Error('Email is required to create a new user');

            // Step 4: Create a new user
            return await createUser({ uid, email })
        }
    } catch (error) {
        console.error('Error retrieving user from Firestore:', error);
    }
}


interface RetrieveItemsFromDBProps {
    uid: string;
    rootCol: RootColType;
    subCol: SubColType;
    filterKey: DateFilterKeyType;
    timeFrom: string;
    timeTo?: string;
    pagenate?: boolean;
    pageLimit?: number;
    lastDoc?: { id: string, date: string } | null;
}
export async function retrieveItemsFromDB({ uid, rootCol, subCol, filterKey, timeFrom, timeTo, pagenate, pageLimit = 48, lastDoc = null }: RetrieveItemsFromDBProps): Promise<{
    items: Record<string, ItemType>;
    lastVisible: { id: string, date: string } | null;
}> {
    const items: Record<string, ItemType> = {};

    try {
        // Step 1: Retrieve collection reference
        const colRef = collection(firestore, rootCol, uid, subCol);

        // Step 2: Build Query
        let q = query(colRef, orderBy(filterKey, "desc"), orderBy(documentId(), "desc"));

        // Step 3: Apply timeFrom filter if provided
        if (timeFrom) {
            q = query(q, where(filterKey, ">=", timeFrom));
        }

        // Step 4: Apply timeTo filter if provided
        if (timeTo) {
            q = query(q, where(filterKey, "<=", timeTo));
        }

        if (pagenate) {
            // Step 5: If a last doc is passed in then apply this to the query
            if (lastDoc) {
                q = query(q, startAfter(lastDoc.date, lastDoc.id));
            }

            // Step 6: Apply query page limit
            q = query(q, limit(pageLimit));
        }

        // Step 7: Query firestore with filters applied
        const snapshot = await getDocs(q);
        if (snapshot.empty) return { items: {}, lastVisible: null };

        // Step 8: Map over documents and extract each item
        snapshot.forEach((doc) => {
            const item = doc.data() as ItemType;
            const id = extractItemId({ item });

            if (id) {
                items[id] = item as ItemType
            };
        });

        // Step 9: Retrieve the last visiable document snapshot
        const itemKeys = Object.keys(items);
        const lastKey = itemKeys[itemKeys.length - 1];
        const lastVisibleItem = items[lastKey] ?? {};
        const lastVisibleId = extractItemId({ item: lastVisibleItem }) as string
        const lastVisibleDate = extractItemDateByFilter({ item: lastVisibleItem, filterKey }) as string;

        return { items, lastVisible: { id: lastVisibleId, date: lastVisibleDate } };
    } catch (error) {
        console.error(`Error in retrieveItemsFromDB`, error);
        throw new Error(`${error}`);
    }
}


export async function retrieveConnectedAccount({ uid, storeType }: { uid: string, storeType: StoreType }) {
    try {
        // Step 1: Retrieve users connected accounts
        const accounts = await retrieveConnectedAccounts({ uid });
        if (!accounts) return;

        return (accounts as Record<string, any>)[storeType];
    } catch (error) {
        console.error(`Error in retrieveConnectedAccount: ${error}`);
        return { error: `${error}` };
    }
}

export async function retrieveConnectedAccounts({ uid }: { uid: string }): Promise<any> {
    try {
        // Step 1: Retrieve document reference
        const docRef = doc(firestore, usersCol, uid);

        // Step 2: Grab the user document
        const snapshot = await getDoc(docRef);
        if (!snapshot.exists()) throw new Error(`User with UID "${uid}" not found.`);

        // Step 3: Pull out the connectedAccounts object
        const data = snapshot.data();

        return data?.connectedAccounts;
    } catch (error) {
        console.error(`Error in retrieveConnectedAccounts: ${error}`);
        return { error: `${error}` };
    }
}

export async function retrieveOldestOrder({
    uid,
    storeTypes,
}: { uid: string, storeTypes: StoreType[] }): Promise<IOrder | null> {
    let absoluteOldest: IOrder | null = null;

    try {
        for (const storeType of storeTypes) {

            // Reference the sub‐collection for this storeType
            const ordersRef = collection(firestore, ordersCol, uid, storeType);

            // Build a query: order by sale.date ascending, take only the first doc
            const oldestQuery = query(
                ordersRef,
                orderBy("sale.date", "asc"),
                limit(1)
            );

            // Execute
            const snapshot = await getDocs(oldestQuery);
            if (snapshot.empty) {
                continue;
            }

            const docSnap = snapshot.docs[0];
            const candidate = {
                ...(docSnap.data() as Omit<IOrder, "transactionId">),
                transactionId: docSnap.id,
            } as IOrder;

            // Compare to our running “absoluteOldest”
            const candidateDate = new Date(candidate.sale?.date ?? "");
            if (
                !absoluteOldest ||
                candidateDate < new Date(absoluteOldest.sale?.date ?? "")
            ) {
                absoluteOldest = candidate;
            }
        }

        return absoluteOldest;
    } catch (error) {
        console.error("Error retrieving oldest order:", error);
        return null;
    }
}