'use server';

import { User } from '@/src/models/mongodb/users';
import connectToMongoDB from '@/src/lib/mongo/client';


const completeOnboarding = async (userId: string, referralCode: string | null): Promise<void> => {
	try {
		// Ensure database connection
		await connectToMongoDB();
		const user = await User.findOne({ discord_id: userId });

		if (!user) {
			console.error('User not found.');
			return;
		}

		// Update the referred_by field with the referral code if it exists
		if (referralCode) {
			// Find the user who has this referral code and increment their referral count
			await User.findOneAndUpdate(
				{ 'referral.referral_code': referralCode }, // find the user with the referral code
				{ $inc: { 'referral.referral_count': 1 } }  // increment the referral count by 1
			);

			// Update the current user to store who referred them
			await User.findByIdAndUpdate(user._id, {
				$set: { 'referral.referred_by': referralCode }  // Store the actual referral code
			});
		}

		// Add the 'accessGranted' role if it doesn't exist
		await User.findByIdAndUpdate(user._id, {
			$addToSet: {
				subscriptions: {
					name: 'accessGranted',
					role_id: '0',
					override: true,
					server_subscription: false
				}
			}
		});

	} catch (error) {
		console.error('Error granting access:', error);
	}
};

export { completeOnboarding };
