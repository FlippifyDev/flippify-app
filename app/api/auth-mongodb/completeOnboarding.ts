'use server';

import { User } from './userModel';
import { Types } from 'mongoose';

const Long = Types.Long;

const completeOnboarding = async (userId: string): Promise<void> => {
  try {
    const user = await User.findOne({ discord_id: Long.fromString(userId) });

    if (!user) {
      console.error('User not found.');
      return;
    }

    // Add the 'accessGranted' role if it doesn't exist
    await User.findByIdAndUpdate(user._id, {
      $addToSet: 
      { 
        subscriptions: { 
          name: 'accessGranted',
          override: true, 
          server_subscription: false 
        } 
      }
    }
  );

    console.log(`Successfully granted access for user ${userId}`);
  } catch (error) {
    console.error('Error granting access:', error);
  }
};

export { completeOnboarding };
