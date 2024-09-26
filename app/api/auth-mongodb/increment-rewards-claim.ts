"use server"

import mongoose from 'mongoose';

import { User } from './userModel';

mongoose.connect(process.env.MONGO_URL as string)

const incrementRewardsClaimed = async (customerId: string) => {
    try {
      // Update the user's rewards claimed
      await User.findOneAndUpdate(
        { stripe_customer_id: customerId }, // Filter query to find user by customerId
        { $inc: { 'referral.rewards_claimed': 1 } }, // Increment rewards_claimed by 1
      );

      return true; // Return the updated user document
    } catch (error) {
      console.error('Error incrementing rewards claimed:', error);
      throw error; // Rethrow the error to handle it later
    }
  };

export default incrementRewardsClaimed