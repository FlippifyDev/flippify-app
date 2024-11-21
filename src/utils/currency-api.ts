//import { database } from "@/src/lib/firebase/client";
//import { ref, get } from "firebase/database";

// Fetch conversion rates from Firebase
export const fetchConversionRatesFromFirebase = async (): Promise<Record<string, number>> => {
	return { GBP: 1, USD: 1.33, EUR: 1.19, AUD: 1.95, CAD: 1.8 };

	// Just ignoring this for now as conversion rates aren't updated in database
	/*
	try {
		// Assuming 'conversionRates' is the location in your Firebase database
		const ratesRef = ref(database, 'conversionRates');
		const snapshot = await get(ratesRef);

		if (snapshot.exists()) {
			return snapshot.val();
		} else {
			throw new Error("No conversion rates found");
		}
	} catch (error) {
		console.error("Error fetching conversion rates from Firebase:", error);

		// Fallback values if there is an error
		return { GBP: 1, USD: 1.33, EUR: 1.19, AUD: 1.95, CAD: 1.8 };
	}
		*/
};
