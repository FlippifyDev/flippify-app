import { database } from '@/lib/firebase/config';
import { ref, get, set } from "firebase/database"

export async function linkTracker(path: string) {
	try {
		// Reference to the specific path in the database
		const pathRef = ref(database, `/linkTracker/${path}/count`);

		// Get current count
		const snapshot = await get(pathRef);
		let count = snapshot.exists() ? snapshot.val() : 0;

		// Increment count
		count += 1;

		// Update the count in the database
		await set(pathRef, count);

	} catch (error) {
		console.error("Error updating count:", error);
	}
}
