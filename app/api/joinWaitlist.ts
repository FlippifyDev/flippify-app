"use server"

import { User, IWaitListed } from './userModel';

interface CustomUser {
  discordId: string;
  name: string;
  email: string;
  customerId?: string;
}

export const joinWaitlist = async (user: CustomUser, referralCode: string | null = null): Promise<string | null> => {
  try {
    const customerId = user.customerId;

    if (!customerId) {
      return "No customer ID provided.";
    }

    const generatedReferralCode = Math.random().toString(36).substring(2, 15);
    const position = await User.countDocuments({ 'waitlisted.position': { $exists: true } }) + 1;

    const waitlistedDict: IWaitListed = {
      referral_code: generatedReferralCode,
      referred_by: referralCode || null,
      position: position,
      referral_count: 0,
    };

    const updatedUser = await User.findOneAndUpdate(
      { stripe_customer_id: customerId },
      { $set: { waitlisted: waitlistedDict } },
      { new: true, upsert: false }
    );

    if (!updatedUser) {
      return "User not found or already waitlisted.";
    }

    if (referralCode) {
      const referringUser = await User.findOne({ 'waitlisted.referral_code': referralCode }).exec();
      if (referringUser && referringUser.waitlisted) {
        const waitlisted = referringUser.waitlisted;
        waitlisted.referral_count += 1;
        if (!waitlisted.position) {
          return "Referring user's waitlist position is not set.";
        }
        waitlisted.position = Math.max(1, waitlisted.position - 1);

        await referringUser.updateOne({
          $set: {
            'waitlisted.referral_count': waitlisted.referral_count,
            'waitlisted.position': waitlisted.position,
          }
        });
      } else {
        return "Invalid referral code.";
      }
    }

    return null; // Indicating success
  } catch (error) {
    return "An unexpected error occurred.";
  }
};