"use server"

import mongoose, { FilterQuery, UpdateQuery } from 'mongoose';

mongoose.connect(process.env.MONGO_URL as string)

// Define the schema interface
interface ISubscriptionServers {
    stripe_customer_id: string;
    subscription_name: string;
    webhooks: {
        [key: string]: string;
    };
}

const SubscriptionServersSchema = new mongoose.Schema<ISubscriptionServers>({
    stripe_customer_id: { type: String, required: true },
    subscription_name: { type: String, required: true },
    webhooks: { type: Map, of: String, required: true },
});

const SubscriptionServers: mongoose.Model<ISubscriptionServers> = mongoose.models['subscription.servers'] ||
    mongoose.model<ISubscriptionServers>('subscription.servers', SubscriptionServersSchema);

const addWebhook = async (stripe_customer_id: string, subscription_name: string, region: string, webhook: string) => {
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