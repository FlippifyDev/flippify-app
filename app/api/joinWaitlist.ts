import { User, IUser } from './userModel';
import mongoose from 'mongoose';

export const joinWaitlist = async (userId: string, username: string, referralCode: string | null = null): Promise<void> => {
  try {
    const discordId = mongoose.Types.Long.fromString(userId);
    const existingUser = await User.findOne({ discord_id: discordId });

    // Generate a referral code for the new user
    const generatedReferralCode = Math.random().toString(36).substring(2, 15);

    if (existingUser) {
      // Update existing user if they are already in the database
      existingUser.referralCode = generatedReferralCode;
      existingUser.referredBy = referralCode;
      existingUser.position = existingUser.position || 1; // Retain existing position
      await existingUser.save();
    } else {
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

    // If a referral code was used, update the referring user's referral count and position
    if (referralCode) {
      const referringUser = await User.findOne({ referralCode });
      if (referringUser) {
        referringUser.referralCount += 1;
        referringUser.position = Math.max(1, referringUser.position - 1); // Move the referring user up the queue
        await referringUser.save();
      }
    }
  } catch (error) {
    console.error('Error in joinWaitlist:', error);
  }
};
