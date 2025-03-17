// Local Imports
import { IUser } from "@/models/user";
import { firestore } from "@/lib/firebase/config";
import { createUser } from "./create";

// External Imports
import { collection, doc, DocumentData, DocumentReference, getDoc, getDocs, query, QueryDocumentSnapshot, where } from 'firebase/firestore';


/**
 * Retrieves a user from Firestore using their UID. If the user does not exist, it creates a new user.
 * 
 * @param {string} uid - The unique identifier of the user.
 * @param {string | null} [email] - The email address of the user (required if creating a new user).
 * @returns {Promise<IUser | void>} - Returns the user data if found or created, otherwise void.
 * @throws {Error} - Throws an error if email is required but not provided.
 */
async function retrieveUserAndCreate(uid: string, email?: string | null): Promise<IUser | void> {
    try {
        // Retrieve the user document from Firestore using the UID
        const userRef = doc(firestore, 'users', uid);
        const userDoc = await getDoc(userRef);

        // Check if the user document exists
        if (userDoc.exists()) {
            // Return the user data as an IUser object
            const userData: IUser = userDoc.data() as IUser;
            return userData;
        } else {
            if (!email) {
                throw new Error('Email is required to create a new user');
            };
            return await createUser(uid, email)
        }
    } catch (error) {
        console.error('Error retrieving user from Firestore:', error);
    }
}


/**
 * Retrieves a user from Firestore based on a specified field and value.
 * 
 * @param {string} filter_key - The field to filter by (e.g., "email", "username").
 * @param {string} filter_value - The value to match for the specified field.
 * @returns {Promise<IUser | null>} - Returns the user data if found, otherwise null.
 * @throws {Error} - Logs and handles errors if Firestore retrieval fails.
 */
async function retrieveUser(filter_key: string, filter_value: string): Promise<IUser | null> {
    try {
        const userDoc = await retrieveUserSnapshot(filter_key, filter_value);
        console.log("retrieveUser", userDoc);
        if (userDoc) {
            return userDoc.data() as IUser;
        }
        return null;
    } catch (error) {
        console.error(`Error retrieving user with ${filter_key}=${filter_value}:`, error);
        return null;
    }
}


/**
 * Retrieves a Firestore user document based on a specified field and value.
 * 
 * @param {string} filter_key - The field to filter by (e.g., "email", "username").
 * @param {string} filter_value - The value to match for the specified field.
 * @returns {Promise<QueryDocumentSnapshot<DocumentData, DocumentData> | null>} - 
 *          Returns the first matching Firestore document snapshot if found, otherwise null.
 * @throws {Error} - Logs and handles errors if Firestore retrieval fails.
 */
async function retrieveUserSnapshot(filter_key: string, filter_value: string): Promise<QueryDocumentSnapshot<DocumentData, DocumentData> | null> {
    try {
        const usersCollection = collection(firestore, "users");
        const q = query(usersCollection, where(filter_key, "==", filter_value));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            console.log("retrieveUserSnapshot", querySnapshot.docs[0]);
            return querySnapshot.docs[0];
        } else {
            console.log(`No user doc found with ${filter_key}: ${filter_value}`);
            return null;
        }
    } catch (error) {
        console.error(`Error retrieving user doc with ${filter_key}=${filter_value}:`, error);
        return null;
    }
}


/**
 * Retrieves a Firestore document reference for a user based on a specific field and value.
 * 
 * @param {string} filterKey - The field to filter by (e.g., "email", "username").
 * @param {string} filterValue - The value to match for the specified field.
 * @returns {Promise<DocumentReference | null>} - The Firestore document reference if found, otherwise null.
 */
async function retrieveUserRef(filterKey: string, filterValue: string): Promise<DocumentReference | null> {
    try {
        const usersCollection = collection(firestore, "users");
        const q = query(usersCollection, where(filterKey, "==", filterValue));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const userRef = doc(firestore, "users", querySnapshot.docs[0].id);
            console.log("retrieveUserRef", userRef);
            return userRef;
        }
        console.log(`No user found with ${filterKey}: ${filterValue}`);
        return null;
    } catch (error) {
        console.error(`Error retrieving user reference with ${filterKey}=${filterValue}:`, error);
        return null;
    }
}


/**
 * Retrieves a reference to a user's document in Firestore using their unique ID (UID).
 *
 * This function constructs a reference to the Firestore document for a user in the 'users' collection
 * using the provided UID. It returns the reference to the document if successful, or null if an error occurs.
 *
 * @param {string} uid - The unique identifier of the user.
 * @returns {Promise<DocumentReference | null>} A promise that resolves to the user's document reference if found, or null if an error occurs.
 */
async function retrieveUserRefById(uid: string): Promise<DocumentReference | null> {
    try {
        const userRef = doc(firestore, 'users', uid);
        console.log("retrieveUserRefById", userRef);
        if (!userRef) {
            console.log(`No user found with id=${uid}`);
            return null;
        }
        return userRef;
    } catch (error) {
        console.error(`Error retrieving user reference with id=${uid}:`, error);   
        return null;
    }
}


async function retrieveProducts() {
    return [];
}


export { retrieveUserAndCreate, retrieveUser, retrieveUserSnapshot, retrieveUserRef, retrieveUserRefById, retrieveProducts };