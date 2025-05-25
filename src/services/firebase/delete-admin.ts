"use server";

import { getAuth } from "firebase-admin/auth";
import { firestore } from "firebase-admin";
import { firestoreAdmin } from "@/lib/firebase/config-admin";
import { retrieveUserIdAdmin } from "./retrieve-admin";


async function deleteUserAdmin({ idToken }: { idToken: string }): Promise<{ success?: boolean; error?: string }> {
    try {
        const uid = await retrieveUserIdAdmin({ idToken });

        const { error: deleteDocError } = await deleteUserDocsAdmin({ uid });
        if (deleteDocError) throw deleteDocError;
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
        const userDocRef = firestoreAdmin.collection("users").doc(uid);
        const inventoryDocRef = firestoreAdmin.collection("inventory").doc(uid);
        const orderDocRef = firestoreAdmin.collection("orders").doc(uid);
        const expensesDocRef = firestoreAdmin.collection("expenses").doc(uid);
        
        await userDocRef.delete();
        await firestore().recursiveDelete(inventoryDocRef);
        await firestore().recursiveDelete(orderDocRef);
        await firestore().recursiveDelete(expensesDocRef);

        return { success: true };
    } catch (error) {
        console.error(`Failed to delete user ${uid} data`, error);
        return { error: `${error}` };
    }
}

export { deleteUserAdmin };