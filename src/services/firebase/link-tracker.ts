import { firestore } from '@/lib/firebase/config';
import { doc, getDoc, setDoc } from "firebase/firestore";


/**
 * Tracks and increments a count for a given path in Firestore.
 *
 * This function accesses a Firestore document at the path `/linkTracker/{path}/count` and increments its value.
 * If the document does not exist, it initializes the count to 0 before incrementing.
 *
 * @param {string} path - The path (or identifier) for the specific link tracker.
 * @returns {Promise<void>} A promise that resolves when the count has been updated in Firestore.
 */
export async function linkTracker(path: string) {
    try {
        // Reference to the specific document in Firestore
        const pathRef = doc(firestore, `linkTracker/${path}`);

        // Get the current document data
        const docSnapshot = await getDoc(pathRef);

        let count = 0;

        if (docSnapshot.exists()) {
            // If the document exists, retrieve the current count value
            count = docSnapshot.data()?.count || 0;
        }

        // Increment the count
        count += 1;

        // Update the count in the Firestore document
        await setDoc(pathRef, { count }, { merge: true });

    } catch (error) {
        console.error("Error updating count in Firestore:", error);
    }
}