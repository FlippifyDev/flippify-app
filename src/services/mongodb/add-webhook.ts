"use server"

import { FilterQuery, UpdateQuery } from 'mongoose';

import { SubscriptionServers, ISubscriptionServers } from '@/src/models/mongodb/subscription-servers';
import connectToMongoDB from '@/src/lib/mongo/client';

const addWebhook = async (stripe_customer_id: string, subscription_name: string, region: string, webhook: string) => {
	// Ensure database connection
	await connectToMongoDB();

	const filter: FilterQuery<ISubscriptionServers> = { subscription_name, stripe_customer_id };
	const update: UpdateQuery<ISubscriptionServers> = { [`webhooks.${region}`]: webhook };

	try {
		// Use findOneAndUpdate with explicit types
		await SubscriptionServers.findOneAndUpdate(filter, update, { new: true, upsert: true });

		return true;
	} catch (error) {
		console.error('Error updating webhook:', error);
		return false;
	}
};

export default addWebhook;