// File: /app/api/auth-mongodb/completeOnboarding.ts
'use server';

import { User } from './userModel';

const completeOnboarding = async (userId: string, referralCode: string | null): Promise<void> => {
  try {
    const user = await User.findOne({ discord_id: userId });

    if (!user) {
      console.error('User not found.');
      return;
    }

    // Update the referred_by field with the referral code if it exists
    if (referralCode) {
      await User.findByIdAndUpdate(user._id, {
        $set: { 'referral.referred_by': referralCode }  // Store the actual referral code
      });
    }

    // Add the 'accessGranted' role if it doesn't exist
    await User.findByIdAndUpdate(user._id, {
      $addToSet: { 
        subscriptions: { 
          name: 'accessGranted',
          override: true, 
          server_subscription: false 
        } 
      }
    });

    console.log(`Successfully granted access and updated referral for user ${userId}`);
  } catch (error) {
    console.error('Error granting access:', error);
  }
};

export { completeOnboarding };
