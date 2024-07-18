"use server"

import { User, IUser } from './userModel';
import mongoose, { Types } from 'mongoose';
import { exit } from 'process';
import mongooseLong from 'mongoose-long';

mongooseLong(mongoose);
const Long = Types.Long;

interface CustomUser {
  discordId: string;
  name: string;
  email: string;
  customerId?: string;
}

export const joinWaitlist = async (user: CustomUser, referralCode: string | null = null): Promise<string> => {
  try {
    const discordId = Long.fromString(user.discordId);
    const username = user.name
    const customerId = user.customerId
    const customerEmail = user.email

    // Stripe customer ID will always be generated on sign in. So existing user will always exist
    let existingUser = await User.findOne({ stripe_customer_id: customerId }) as IUser;

    // Generate a referral code for the new user
    const generatedReferralCode = Math.random().toString(36).substring(2, 15);
    
    if (existingUser) {
      // Generate a referral code for the new user
      const generatedReferralCode = Math.random().toString(36).substring(2, 15);

      if (existingUser.position) {
        return "not new user";
      }

      // Update existing user
      existingUser.referral_code = generatedReferralCode;
      existingUser.referred_by = referralCode;
      existingUser.position = await User.countDocuments({ position: { $exists: true } }).exec() + 1;
      existingUser.referral_count = 0;

      await existingUser.save();
    } else {
      // Calculate the new user's position in the queue
      const userCount = await User.countDocuments({ position: { $exists: true } });
      const position = userCount + 1;

      // Create a new user with the necessary details
      await User.create({
        stripe_customer_id: customerId,
        discord_id: discordId, // Provide proper discord_id or handle this field properly
        username: username, // Provide proper username or handle this field properly
        email: customerEmail, // Provide proper email or handle this field properly
        subscriptions: [],
        referral_code: generatedReferralCode,
        referred_by: referralCode,
        position,
        referral_count: 0,
      });
    }

    // If a referral code was used, update the referring user's referral count and position
    if (referralCode) {
      const referringUser = await User.findOne({ referralCode }).exec();

      if (referringUser) {
        referringUser.referral_count += 1;
        referringUser.position = Math.max(1, referringUser.position - 1); // Move the referring user up the queue
        await referringUser.save();
      }
    }
    return "new user"
  } catch (error) {
    console.error('Error in joinWaitlist:', error);
  }
  return "fail"
};


/*
 else {
      // Calculate the new user's position in the queue
      const userCount = await User.countDocuments({ position: { $exists: true } });
      const position = userCount + 1;

      // Create a new user with the necessary details
      await User.create({
        discord_id: discordId,
        username,
        email: '',
        stripe_customer_id: '',
        subscriptions: [],
        referralCode: generatedReferralCode,
        referredBy: referralCode,
        position,
        referralCount: 0,
      });
    }
*/
