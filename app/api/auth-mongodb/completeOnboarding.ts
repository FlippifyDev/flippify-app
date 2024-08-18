"use server";

import { User } from './userModel';

const completeOnboarding = async (userId: string): Promise<void> => {
  try {
    // Find the user by ID
    const user = await User.findById(userId);

    // Ensure the user exists and has the onboarding role
    if (!user || !user.subscriptions.some(sub => sub.name === 'onboarding')) {
      console.error('User not found or not onboarding.');
      return;
    }

    // Remove the onboarding role and add the accessGranted role
    await User.findByIdAndUpdate(userId, {
      $pull: { subscriptions: { name: 'onboarding' } },
      $push: { subscriptions: { name: 'accessGranted', override: true } }
    });

    console.log(`Successfully completed onboarding for user ${userId}`);
  } catch (error) {
    console.error('Error completing onboarding:', error);
  }
};

export { completeOnboarding };
