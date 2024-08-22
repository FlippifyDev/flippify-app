"use server";

import { User } from './userModel';
import { Types } from 'mongoose';

const Long = Types.Long;

const completeOnboarding = async (userId: string): Promise<void> => {
  try {
    // Ensure the user exists
    const user = await User.findById(userId);

    if (!user) {
      console.error('User not found.');
      return;
    }

    // Add the 'accessGranted' role if it doesn't exist
    await User.findByIdAndUpdate(userId, {
      $addToSet: { subscriptions: { name: 'accessGranted', role_id: Long.fromString('0'), override: true, server_subscription: false } }
    });

    console.log(`Successfully granted access for user ${userId}`);
  } catch (error) {
    console.error('Error granting access:', error);
  }
};

export { completeOnboarding };
