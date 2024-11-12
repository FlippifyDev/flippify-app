import mongoose, { Document, Model, Schema, Types } from 'mongoose';

interface ISubscription {
	name: string;
	role_id: string;
	override: boolean;
	server_subscription: boolean;
}

interface IReferral {
	referral_code: string;
	referred_by: string | null;
	referral_count: number;
	valid_referrals: string[];
	rewards_claimed: number;
}

interface IEbay {
	ebayAccessToken?: string | null;
	ebayRefreshToken?: string | null;
	ebayTokenExpiry?: number | null;
}

interface IUser extends Document {
	_id: Types.ObjectId;
	discord_id: string;
	username: string;
	email: string;
	stripe_customer_id: string;
	subscriptions: ISubscription[];
	referral?: IReferral;
	ebay?: IEbay;
}

const subscriptionSchema = new Schema<ISubscription>({
	name: { type: String, required: true },
	role_id: { type: String, required: true },
	override: { type: Boolean, default: false },
	server_subscription: { type: Boolean, default: false },
});

const referralSchema = new Schema<IReferral>({
	referral_code: { type: String, required: true },
	referred_by: { type: String, default: null },
	referral_count: { type: Number, default: 0 },
	valid_referrals: { type: [String], default: [] },
	rewards_claimed: { type: Number, default: 0 },
});

const ebaySchema = new Schema<IEbay>({
	ebayAccessToken: { type: String, default: null },
	ebayRefreshToken: { type: String, default: null },
	ebayTokenExpiry: { type: Number, default: null },
})

const userSchema = new Schema<IUser>({
	stripe_customer_id: { type: String, required: true },
	discord_id: { type: String, required: true },
	username: { type: String, required: true },
	email: { type: String, required: true },
	subscriptions: [subscriptionSchema],
	referral: referralSchema,
	ebay: ebaySchema,
});



const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export { User };
export type { IUser, ISubscription, IReferral };
