"use server";

import { User } from './userModel';
import { Types } from 'mongoose';

const Long = Types.Long;

const joinOnboarding = async (session: any, referralCode: string): Promise<string | null> => {
  try {
    if (typeof session.user.discordId !== 'string') {
      throw new Error('Invalid discordId: must be a string');
    }

    const updatedUser = await User.findOneAndUpdate(
      { discord_id: Long.fromString(session.user.discordId) },
      {
        $set: {
          'referral.referred_by': referralCode || null,
          'onboarding': true,
          'accessGranted': false, // Initially set to false
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return 'Failed to start onboarding';
    }

    return null;
  } catch (error) {
    console.error('Error joining onboarding:', error);
    return 'Failed to start onboarding';
  }
};

export { joinOnboarding };
