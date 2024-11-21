import mongoose, { Schema } from 'mongoose';

// Define the schema interface
interface ISubscriptionServers extends Document {
	stripe_customer_id: string;
	subscription_name: string;
	webhooks: {
		[key: string]: string;
	};
}

const subscriptionServersSchema = new Schema<ISubscriptionServers>({
	stripe_customer_id: { type: String, required: true },
	subscription_name: { type: String, required: true },
	webhooks: { type: Map, of: String, required: true },
});


const SubscriptionServers: mongoose.Model<ISubscriptionServers> = mongoose.models['subscription.servers'] || mongoose.model<ISubscriptionServers>('subscription.servers', subscriptionServersSchema);


export { SubscriptionServers, subscriptionServersSchema };
export type { ISubscriptionServers };