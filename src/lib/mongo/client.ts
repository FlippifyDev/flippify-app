import mongoose, { ConnectOptions } from "mongoose";

// MongoDB connection URL from environment variable
const mongoUrl = process.env.MONGO_URL as string;

// Throw an error if the MONGO_URL environment variable is not defined
if (!mongoUrl) {
	throw new Error(
		"Please define the MONGO_URL environment variable inside .env.local"
	);
}

// Extend the global object to include mongoose connection and promise
declare global {
	var mongoose: {
		connection: mongoose.Connection | null;
		connectionPromise: Promise<mongoose.Connection> | null;
	};
}

// Initialize the global mongoose cache if it doesn't exist
let mongooseCache = global.mongoose;

if (!mongooseCache) {
	mongooseCache = global.mongoose = {
		connection: null,
		connectionPromise: null,
	};
}

// Function to establish a MongoDB connection
const connectToMongoDB = async () => {
	// If a connection already exists in the cache, return it
	if (mongooseCache.connection) {
		return mongooseCache.connection;
	}

	// If no connection is cached, but a connection promise exists, wait for it to resolve
	if (!mongooseCache.connectionPromise) {
		// Create a new connection promise and store it in the cache
		mongooseCache.connectionPromise = mongoose
			.connect(mongoUrl, {
				bufferCommands: false, // Disable command buffering in Mongoose
			} as ConnectOptions)
			.then((mongooseInstance) => mongooseInstance.connection);
	}

	// Wait for the connection promise to resolve and store the connection in the cache
	mongooseCache.connection = await mongooseCache.connectionPromise;

	// Return the established connection
	return mongooseCache.connection;
};

// Export the connection function for use in other parts of the application
export default connectToMongoDB;
