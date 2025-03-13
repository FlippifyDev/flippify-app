// Local Imports
import { firestore } from "@/lib/firebase/config";

// External Imports
import { doc, setDoc, updateDoc, getDoc } from "firebase/firestore";


// Function to update user preferences in Firestore
export const updateUserPreferences = async (
    customerId: string,
    email: string,
    currency: string,
    preferredEmailKey: string = "preferredEmail"
) => {
    try {
        const userRef = doc(firestore, `users/${customerId}`);
        await setDoc(userRef, { [preferredEmailKey]: email, currency }, { merge: true });
    } catch (error) {
        console.error("Error updating Firestore user:", error);
        throw error;
    }
};


// Update notification preference in Firestore
export const updateNotificationPreference = async (
    customerId: string,
    notificationsEnabled: boolean
) => {
    try {
        const userRef = doc(firestore, `users/${customerId}`);
        await updateDoc(userRef, { notificationsEnabled });
    } catch (error) {
        console.error("Error updating notification preference:", error);
        throw new Error("Failed to update notification preference");
    }
};