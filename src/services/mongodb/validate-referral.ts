'use server';

import connectToMongoDB from '@/src/lib/mongo/client';
import { User } from '@/src/models/mongodb/users';

export const validateReferralCode = async (referralCode: string): Promise<string | undefined> => {
	// Ensure database connection
	await connectToMongoDB();

	const userWithReferral = await User.findOne({ 'referral.referral_code': referralCode });

	return userWithReferral?.stripe_customer_id;  // Return the stripe_customer_id or undefined
};
