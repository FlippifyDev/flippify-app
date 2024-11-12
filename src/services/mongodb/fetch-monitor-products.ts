"use server";

import { modelRegistry, ModelRegistry } from '@/src/models/mongodb/monitors/model-registry';
import connectToMongoDB from '@/src/lib/mongo/client';

// Dynamic model fetching and fetching products
export async function fetchProducts<T>(modelName: keyof ModelRegistry, query?: object): Promise<T[]> {
	try {
		// Ensure database connection
		await connectToMongoDB();

		// Retrieve the model from the registry
		const model = modelRegistry[modelName];

		if (!model) {
			throw new Error(`Model ${modelName} is not registered. Make sure to register the schema before fetching.`);
		}

		// Fetch products using the dynamically fetched model
		if (query === undefined) {
			query = {};
		};
		const products = await model.find(query).exec();

		// Convert the products to plain JavaScript objects
		return products.map(product => {
			const productObject = product.toObject();
			productObject._id = productObject._id.toString();
			return productObject as T;
		});

	} catch (error) {
		console.error("Error fetching products:", error);
		return [];
	}
};

export default fetchProducts;