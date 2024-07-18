"use server"

import mongoose, { Document, Model, Schema, Types } from 'mongoose';
import mongooseLong from 'mongoose-long';

mongooseLong(mongoose);
const Long = Types.Long;

interface ISubscription {
  name: string;
  role_id: typeof Long;
  override: boolean;
  server_subscription: boolean;
}

interface IUser extends Document {
  discord_id: typeof Long;
  username: string;
  email: string;
  stripe_customer_id: string;
  subscriptions: ISubscription[];
  referral_code: string;
  referred_by: string | null;
  position: number;
  referral_count: number;
}

const subscriptionSchema = new Schema<ISubscription>({
  name: { type: String, required: true },
  role_id: { type: Long, required: true },
  override: { type: Boolean, default: false },
  server_subscription: { type: Boolean, default: false },
});

const userSchema = new Schema<IUser>({
  discord_id: { type: Long, required: true },
  username: String,
  email: String,
  stripe_customer_id: String,
  subscriptions: [subscriptionSchema],
  referral_code: { type: String, default: null },
  referred_by: { type: String, default: null },
  position: { type: Number, default: null },
  referral_count: { type: Number, default: 0 },
});

const User: Model<IUser> = mongoose.models.users || mongoose.model<IUser>('users', userSchema);

export { User };
export type { IUser, ISubscription };
