import { database } from "@/src/lib/firebase/client";
import { ref, set, get } from "firebase/database"



// Fetch user data from Firebase
export const fetchUserData = async (customerId: string) => {
	const userRef = ref(database, `users/${customerId}`);
	try {
		const snapshot = await get(userRef);
		const userData = snapshot.val();
		return userData;
	} catch (error) {
		console.error("Error loading user data from Firebase:", error);
		throw new Error("Failed to load user data");
	}
};


// Function to update user data in Firebase
export const updateUserPreferences = async (
	customerId: string,
	email: string,
	currency: string,
	preferredEmailKey: string = 'preferredEmail'
) => {
	try {
		const userRef = ref(database, `users/${customerId}`);
		await set(userRef, { [preferredEmailKey]: email, currency });
	} catch (error) {
		console.error('Error updating Firebase user:', error);
		throw error;
	}
};


// Update notification preference
export const updateNotificationPreference = async (
	customerId: string,
	notificationsEnabled: boolean
) => {
	try {
		await set(ref(database, `users/${customerId}/notificationsEnabled`), notificationsEnabled);
	} catch (error) {
		console.error("Error updating notification preference:", error);
		throw new Error("Failed to update notification preference");
	}
};


// Function to update user data in Firebase
export const fetchPreferredCurrency = async (
	customerId: string
) => {
	try {
		const currencyRef = ref(database, `users/${customerId}/currency`);
		const currency = await get(currencyRef)
		return currency.val()
	} catch (error) {
		console.error('Error updating Firebase user:', error);
		throw error;
	}
};