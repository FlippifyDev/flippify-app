'use server';

import dbConnect from './mongodb';
import { User } from '@/app/api/auth-mongodb/userModel'; // Adjust the path as needed

export const validateReferralCode = async (referralCode: string): Promise<string | undefined> => {
  await dbConnect();

  const userWithReferral = await User.findOne({ 'referral.referral_code': referralCode });

  return userWithReferral?.stripe_customer_id;  // Return the stripe_customer_id or undefined
};
