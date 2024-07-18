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
  referralCode: string;
  referredBy: string | null;
  position: number;
  referralCount: number;
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
  referralCode: String,
  referredBy: { type: String, default: null },
  position: Number,
  referralCount: { type: Number, default: 0 },
});

const User: Model<IUser> = mongoose.models.users || mongoose.model<IUser>('users', userSchema);

export { User };
export type { IUser, ISubscription };
