"use server";

// Local Imports
import { firestoreAdmin } from "@/lib/firebase/config-admin";
import { retrieveUIDAdmin } from "./admin-retrieve";

// External Imports
import { firestore } from "firebase-admin";
import { getAuth } from "firebase-admin/auth";
import { expensesCol, inventoryCol, ordersCol, usersCol } from "./constants";


async function deleteUserAdmin({ idToken }: { idToken: string }): Promise<{ success?: boolean; error?: string }> {
    try {
        // Step 1: Retrieve UID
        const uid = await retrieveUIDAdmin({ idToken });
        if (!uid) throw Error("User could not be found");
        
        // Step 2: Delete users documents
        const { error: deleteDocError } = await deleteUserDocsAdmin({ uid });
        if (deleteDocError) throw deleteDocError;
        
        // Step 3: Delete users authentication
        const { error: deleteAuthError } = await deleteAuthUserAdmin({ uid });
        if (deleteAuthError) throw deleteAuthError;

        return { success: true };
    } catch (error) {
        return { error: `${error}` };
    }
}

async function deleteAuthUserAdmin({ uid }: { uid: string }): Promise<{ success?: boolean; error?: string }> {
    try {
        await getAuth().deleteUser(uid);
        return { success: true };
    } catch (error) {
        console.error(`Failed to delete auth user: ${uid}`, error);
        return { error: (error as Error).message };
    }
}

async function deleteUserDocsAdmin({ uid }: { uid: string }): Promise<{ success?: boolean; error?: any }> {
    try {
        const userDocRef = firestoreAdmin.collection(usersCol).doc(uid);
        const orderDocRef = firestoreAdmin.collection(ordersCol).doc(uid);
        const expensesDocRef = firestoreAdmin.collection(expensesCol).doc(uid);
        const inventoryDocRef = firestoreAdmin.collection(inventoryCol).doc(uid);

        await userDocRef.delete();
        await firestore().recursiveDelete(orderDocRef);
        await firestore().recursiveDelete(expensesDocRef);
        await firestore().recursiveDelete(inventoryDocRef);

        return { success: true };
    } catch (error) {
        console.error(`Failed to delete user ${uid} data`, error);
        return { error: `${error}` };
    }
}

export { deleteUserAdmin };