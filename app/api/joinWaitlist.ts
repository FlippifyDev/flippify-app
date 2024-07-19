"use server"

import { User } from './userModel';
import { updateWaitlistPositions } from './updateWaitlistPositions';
import { Types } from 'mongoose';

const Long = Types.Long;

const joinWaitlist = async (session: any, referralCode: string): Promise<string | null> => {
  try {
    if (typeof session.user.discordId !== 'string') {
      throw new Error('Invalid discordId: must be a string');
    }

    // Calculate the new waitlist position
    const newWaitlistPosition = await User.countDocuments({ 'waitlisted.position': { $ne: null } }) + 1;

    // Update the user's waitlist position and referral details
    const updatedUser = await User.findOneAndUpdate(
      { discord_id: Long.fromString(session.user.discordId) },
      {
        $set: {
          'referral.referred_by': referralCode || null,
          'waitlisted.position': newWaitlistPosition,
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return 'Failed to join the waitlist';
    }

    // Update the positions of users already on the waitlist if a referral code is provided
    if (referralCode !== '') {
      const updateResult = await updateWaitlistPositions(referralCode);
      if (updateResult !== null) {
        return updateResult;
      }
    }

    return null;
  } catch (error) {
    console.error('Error joining waitlist:', error);
    return 'Failed to join the waitlist';
  }
};

export { joinWaitlist };
