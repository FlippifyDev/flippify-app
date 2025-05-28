"use server";

// Local Imports
import { usersCol } from "./constants";
import { StoreType } from "@/models/store-data";
import { RootColType } from "./models";
import { firestoreAdmin } from "@/lib/firebase/config-admin";

// External Imports
import { getAuth } from "firebase-admin/auth";
import { IUser } from "@/models/user";


export async function retrieveUIDAdmin({ idToken }: { idToken: string }) {
    try {
        const decodedToken = await getAuth().verifyIdToken(idToken);
        return decodedToken.uid;
    } catch (error) {
        throw error;
    }
}


export async function retrieveUserAdmin({ uid }: { uid: string }): Promise<IUser | void> {
    try {
        // Step 1: Retrieve document reference & snapshot
        const docRef = firestoreAdmin.collection(usersCol).doc(uid)
        const snapshot = await docRef.get();

        // Step 2: If snapshot exists return snapshot data
        if (snapshot.exists) {
            return snapshot.data() as IUser;
        }
    } catch (error) {
        console.error(`Error in retrieveConnectedAccountAdmin: ${error}`);
    }
}

export async function retrieveUserRefAdmin({ uid }: { uid: string }): Promise<FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData, FirebaseFirestore.DocumentData> | void> {
    try {
        const userDocRef = firestoreAdmin.collection('users').doc(uid)

        if (userDocRef) {
            return userDocRef;
        } else {
            console.error('User document not found.');
        }
    } catch (error) {
        console.error(`Error in retrieveConnectedAccountAdmin: ${error}`);
    }
}



export async function retrieveUserStoreTypes({ idToken, rootCol }: { idToken: string, rootCol: RootColType }) {
    try {
        // Step 1: Retrieve the user id
        const uid = await retrieveUIDAdmin({ idToken });
        if (!uid) return;

        // Step 2: Get the document reference
        const docRef = firestoreAdmin.collection(rootCol).doc(uid);

        // Step 3: Get the collections within the document
        const subcollections = await docRef.listCollections();

        return subcollections.map(col => col.id);
    } catch (error) {
        console.error("Error retrieveUserStoreTypes:", error);
    }
}


export async function retrieveRefereeUserExists({ referralCode }: { referralCode: string }): Promise<boolean> {
    try {
        // Step 1: Retrieve the collection reference
        const colRef = firestoreAdmin.collection(usersCol);

        // Step 2: Build search query 
        const q = await colRef.where("referral.referralCode", "==", referralCode);

        // Step 3: Retrieve query snapshot
        const snapshot = await q.get();

        // Step 4: Check if document exists
        if (snapshot.empty) return false;

        return true;
    } catch (error) {
        console.error("Error retrieveUserStoreTypes:", error);
        return false;
    }
}


export async function retrieveRefereeUser({ referralCode }: { referralCode: string }): Promise<IUser | void> {
    try {
        // Step 1: Retrieve the collection reference
        const colRef = firestoreAdmin.collection(usersCol);

        // Step 2: Build search query 
        const q = await colRef.where("referral.referralCode", "==", referralCode);

        // Step 3: Retrieve query snapshot
        const snapshot = await q.get();

        // Step 4: Check if document exists
        if (snapshot.empty) return;

        // Step 5: Return the first matching user document as IUser
        const doc = snapshot.docs[0];
        return doc.data() as IUser;
    } catch (error) {
        console.error("Error retrieveRefereeUser:", error);
    }
}