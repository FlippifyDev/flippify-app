"use server";

import { IUser } from "@/models/user";
import { firestoreAdmin } from "@/lib/firebase/config-admin";

async function retrieveUserAdmin(uid: string): Promise<IUser | void> {
  try {
    const userDocRef = firestoreAdmin.collection('users').doc(uid);
    const userDocSnapshot = await userDocRef.get();

    if (userDocSnapshot.exists) {
      return userDocSnapshot.data() as IUser;
    } else {
      console.error(`User document not found for UID: ${uid}`);
    }
  } catch (error) {
    console.error(`Error retrieving user ${uid} from Firestore:`, error);
    throw error; // Re-throw to allow the caller (e.g., session callback) to handle it
  }
}

async function retrieveUserRefAdmin(
  uid: string
): Promise<
  FirebaseFirestore.DocumentReference<
    FirebaseFirestore.DocumentData,
    FirebaseFirestore.DocumentData
  > | void
> {
  try {
    const userDocRef = firestoreAdmin.collection('users').doc(uid);
    return userDocRef; // No need to check existence here; just return the reference
  } catch (error) {
    console.error(`Error retrieving user reference for UID: ${uid}:`, error);
    throw error;
  }
}

export { retrieveUserAdmin, retrieveUserRefAdmin };