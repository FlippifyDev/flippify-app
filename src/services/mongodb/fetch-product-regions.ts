"use server";

import { Product } from '@/src/models/mongodb/products';
import connectToMongoDB from '@/src/lib/mongo/client';


const fetchProductRegions = async (subscriptionName: string): Promise<string[]> => {
	try {
		// Ensure database connection
		await connectToMongoDB();

		// Find the product with the specified subscription name
		const product = await Product.findOne({ "subscription-name-server": subscriptionName }).exec();

		// Check if product was found and has regions
		if (product && product.regions) {
			return product.regions;
		}

		// Return an empty array if no regions are found
		return [];
	} catch (error) {
		console.error('Error fetching product regions:', error);
		return [];
	}
};

export default fetchProductRegions;
