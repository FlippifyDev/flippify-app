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

interface IWaitListed {
  position: number;
}

interface IReferral {
  referral_code: string;
  referred_by: string | null;
  referral_count: number;
  valid_referral_count: number;  // Added this property
  rewards_claimed: number;  // Added this property
}

interface IUser extends Document {
  discord_id: typeof Long;
  username: string;
  email: string;
  stripe_customer_id: string;
  subscriptions: ISubscription[];
  referral?: IReferral;
  waitlisted?: IWaitListed;
}

const waitListedSchema = new Schema<IWaitListed>({
  position: { type: Number, required: true, default: -1 },
});

const referralSchema = new Schema<IReferral>({
  referral_code: { type: String, default: null },
  referred_by: { type: String, default: null },
  referral_count: { type: Number, default: 0 },
  valid_referral_count: { type: Number, default: 0 },  // Added this line
  rewards_claimed: { type: Number, default: 0 },  // Added this line
});

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
  referral: { type: referralSchema },
  waitlisted: { type: waitListedSchema },
});

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export { User };
export type { IUser, IWaitListed, ISubscription, IReferral };
