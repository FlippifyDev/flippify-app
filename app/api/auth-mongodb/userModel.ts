import mongoose, { Document, Model, Schema, Types } from 'mongoose';
import mongooseLong from 'mongoose-long';

mongooseLong(mongoose);
const Long = Types.Long;

interface ISubscription {
  name: string;
  role_id: InstanceType<typeof Long>; // Use InstanceType to avoid the TypeScript error
  override: boolean;
  server_subscription: boolean;
}

interface IReferral {
  referral_code: string;
  referred_by: string | null;
  referral_count: number;
  valid_referrals: string[];
  valid_referral_count: number;
  rewards_claimed: number;
}

interface IUser extends Document {
  discord_id: InstanceType<typeof Long>; // Adjust discord_id similarly
  username: string;
  email: string;
  stripe_customer_id: string;
  subscriptions: ISubscription[];
  referral?: IReferral;
}

const subscriptionSchema = new Schema<ISubscription>({
  name: { type: String, required: true },
  role_id: { type: Long, required: true },
  override: { type: Boolean, default: false },
  server_subscription: { type: Boolean, default: false },
});

const UserSchema = new Schema<IUser>({
  discord_id: { type: Long, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  stripe_customer_id: { type: String, required: true },
  subscriptions: [subscriptionSchema],
  referral: {
    type: new Schema<IReferral>({
      referral_code: { type: String, default: null },
      referred_by: { type: String, default: null },
      referral_count: { type: Number, default: 0 },
      valid_referrals: { type: [String], default: [] },
      valid_referral_count: { type: Number, default: 0 },
      rewards_claimed: { type: Number, default: 0 },
    }),
  },
});

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export { User };
export type { IUser, ISubscription, IReferral };
