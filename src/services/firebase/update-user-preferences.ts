import { database, ref, set } from "@/src/lib/firebase/client";

// Function to update user data in Firebase
export const updateUserPreferences = async (
	customerId: string,
	email: string,
	currency: string,
	emailKey: string = 'preferredEmail'
) => {
	try {
		const userRef = ref(database, `users/${customerId}`);
		await set(userRef, { [emailKey]: email, currency });
	} catch (error) {
		console.error('Error updating Firebase user:', error);
		throw error;
	}
};