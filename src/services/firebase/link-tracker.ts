"use server"

import { firestoreAdmin } from '@/lib/firebase/config-admin';


export async function linkTracker(path: string) {
    try {
        if (!path) {
            throw new Error("Path is required");
        }

        const linkRef = firestoreAdmin.collection('link-tracker').doc(path);

        // Use Firestore transaction to ensure atomicity
        await firestoreAdmin.runTransaction(async (transaction) => {
            const linkDoc = await transaction.get(linkRef);

            if (linkDoc.exists) {
                const linkData = linkDoc.data();
                if(!linkData) {
                    throw new Error("Link data is missing");
                }
                // If document exists, increment the count
                transaction.update(linkRef, {
                    count: linkData.count + 1,
                });
            } else {
                // If document does not exist, create it with count 1
                transaction.set(linkRef, {
                    count: 1,
                });
            }
        });

        console.log(`Path "${path}" tracked successfully.`);
    } catch (error) {
        console.error("Error updating count in Firestore:", error);
    }
}