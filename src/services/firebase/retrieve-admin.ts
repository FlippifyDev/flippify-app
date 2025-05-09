"use server"

import { auth } from "firebase-admin";
import { IUser } from "@/models/user";
import { firestoreAdmin } from "@/lib/firebase/config-admin";

async function retrieveUserAdmin(uid: string): Promise<IUser | void> {
    const userDocRef = firestoreAdmin.collection('users').doc(uid)
    const userDocSnapshot = await userDocRef.get();

    if (userDocSnapshot.exists) {
        return userDocSnapshot.data() as IUser;
    } else {
        console.error('User document not found.');
    }
}


async function retrieveUserRefAdmin(uid: string): Promise<FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData, FirebaseFirestore.DocumentData> | void> {
    const userDocRef = firestoreAdmin.collection('users').doc(uid)

    if (userDocRef) {
        return userDocRef;
    } else {
        console.error('User document not found.');
    }
}


// Function to retrieve the number of authenticated users
async function retrieveAuthenticatedUserCount(): Promise<number> {
    try {
        // List all users in Firebase Authentication
        const listUsersResult = await auth().listUsers();

        // Count the number of authenticated users
        const userCount = listUsersResult.users.length;

        return userCount;
    } catch (error) {
        console.error("Error retrieving authenticated user count:", error);
        throw new Error("Failed to retrieve authenticated user count.");
    }
}


/**
 * Function to retrieve the number of users with subscriptions which include the word member in them
 * @returns {Promise<number>} - The number of users with subscriptions
 */
async function retrieveUserSubscriptionCount(): Promise<number> {
    try {
        const collectionRef = firestoreAdmin.collection("users");

        // Query users where authentication.subscribed exists (i.e., they have a subscription level)
        const querySnapshot = await collectionRef
            .where("authentication.subscribed", "!=", null) // Ensure they have a subscription status
            .get();

        return querySnapshot.size; // Return count directly from Firestore
    } catch (error) {
        console.error("Error retrieving user subscription count:", error);
        throw new Error("Failed to retrieve user subscription count.");
    }
}


async function retrieveUserByKeyAndValueAdmin(key: string, value: string): Promise<IUser | void> {
    try {
        const collectionRef = firestoreAdmin.collection("users");
        const querySnapshot = await collectionRef.where(key, "==", value).get();

        if (querySnapshot.empty) {
            console.error(`No document found where ${key} == ${value}`);
            return;
        }

        // Assuming only one document is returned, otherwise you can handle multiple results
        return querySnapshot.docs[0].data() as IUser; // Or you can modify this to return all matching docs
    } catch (error) {
        console.error("Error retrieving document by key-value:", error);
        throw new Error("Failed to retrieve document.");
    }
}

export { retrieveUserAdmin, retrieveUserRefAdmin, retrieveAuthenticatedUserCount, retrieveUserByKeyAndValueAdmin, retrieveUserSubscriptionCount };