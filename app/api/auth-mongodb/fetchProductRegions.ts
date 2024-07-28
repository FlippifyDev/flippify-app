"use server";

import mongoose from 'mongoose';

mongoose.connect(process.env.MONGO_URL as string);

// Define the schema interface
interface IProductsConfig {
    "subscription-name-server": string;
    regions: string[] | null;
}

const ProductsConfigSchema = new mongoose.Schema<IProductsConfig>({
    "subscription-name-server": { type: String, required: true },
    regions: { type: [String], default: null } // 'regions' can be null or an array of strings
});

const ProductsConfig = mongoose.models['config.products'] || mongoose.model<IProductsConfig>('config.products', ProductsConfigSchema);

const fetchProductRegions = async (subscriptionName: string): Promise<string[]> => {
    try {
        // Find the product with the specified subscription name
        const product = await ProductsConfig.findOne({ "subscription-name-server": subscriptionName }).exec();

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
