"use server";

import { User, IUser } from '@/src/models/mongodb/users';
import connectToMongoDB from '@/src/lib/mongo/client';

// Helper function to serialize MongoDB documents
const serializeUser = (user: any): IUser => {
	// Function to recursively convert ObjectId or nested _id values to strings
	const convertToPlain = (obj: unknown): unknown => {
		if (Array.isArray(obj)) {
			return obj.map(item => convertToPlain(item)); // Handle arrays
		} else if (typeof obj === 'object' && obj !== null) {
			const plainObj: Record<string, unknown> = {}; // Use Record to safely handle unknown types

			// Iterate over all object properties
			for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
				// Convert _id or other MongoDB ObjectId fields to string
				if (key === '_id' || key.endsWith('Id')) {
					plainObj[key] = value?.toString ? value.toString() : value;
				} else if (value instanceof Date) {
					plainObj[key] = value.toISOString(); // Convert Date to ISO string
				} else {
					plainObj[key] = convertToPlain(value); // Recursively handle nested objects
				}
			}

			return plainObj;
		}

		return obj; // Return the primitive value as is
	};

	return convertToPlain(user) as IUser; // Serialize the whole user object and cast to IUser
};


const fetchUser = async (filter_key: string, filter_value: string): Promise<IUser | null> => {
	try {
		// Ensure database connection
		await connectToMongoDB();

		// Use .lean() to get a plain object from MongoDB
		const user = await User.findOne({ [filter_key]: filter_value }).lean().exec();

		// If no user found, return null
		if (!user) {
			return null;
		}

		// Serialize the user object to make it safe for passing to client components
		return serializeUser(user);
	} catch (error) {
		console.error('Error fetching user:', error);
		return null;
	}
};

export default fetchUser;


