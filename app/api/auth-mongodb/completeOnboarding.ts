"use server";

import { User } from './userModel';
import mongoose from 'mongoose';
import { Types } from 'mongoose';

// Ensure mongoose-long is initialized
require('mongoose-long')(mongoose);
const Long = Types.Long;

const completeOnboarding = async (userId: string): Promise<void> => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      console.error('User not found.');
      return;
    }

    // Add the 'accessGranted' role if it doesn't exist
    const roleExists = user.subscriptions.some(sub => sub.name === 'accessGranted');

    if (!roleExists) {
      user.subscriptions.push({
        name: 'accessGranted',
        role_id: new Long(0), // Create new Long instance directly
        override: true,
        server_subscription: false
      });

      await user.save();
    }

    console.log(`Successfully granted access for user ${userId}`);
  } catch (error) {
    console.error('Error granting access:', error);
  }
};

export { completeOnboarding };
