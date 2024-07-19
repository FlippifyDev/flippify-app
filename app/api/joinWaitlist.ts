"use server"

import { User } from './userModel';
import { Types } from 'mongoose';

interface CustomUser {
  discordId: string;
  name: string;
  email: string;
  customerId?: string;
}

const Long = Types.Long;

const joinWaitlist = async (user: any, referralCode: string) => {
  try {
    const waitlistPosition = await User.countDocuments({ 'waitlisted.position': { $ne: null } }) + 1;
    const referralCount = 0;

    const updatedUser = await User.findOneAndUpdate(
      { discord_id: Long.fromString(user.discordId) },
      {
        $set: {
          waitlisted: {
            referral_code: generateReferralCode(),
            referred_by: referralCode || null,
            position: waitlistPosition,
            referral_count: referralCount,
          },
        },
      },
      { new: true }
    );

    return updatedUser ? null : 'Failed to join the waitlist';
  } catch (error) {
    console.error('Error joining waitlist:', error);
    return 'Failed to join the waitlist';
  }
};

const generateReferralCode = () => {
  return Math.random().toString(36).substring(2, 10);
};

export { joinWaitlist };
