"use server"

import { User, IUser } from './userModel';

const updateWaitlistPositions = async (referralCode: string): Promise<string | null> => {
  try {
    // This is the user who referred another user
    const referringUser = await User.findOne(
      { 'referral.referral_code': referralCode },
    ) as IUser;

    if (!referringUser) {
      return "Incorrect code";
    }

    const currentPosition = referringUser.waitlisted?.position;
    const currentReferralCount = referringUser.referral?.referral_count;

    if (currentReferralCount === undefined) {
      return `User not found for code: ${referralCode}`;
    }

    if (!currentPosition) {
      // The user has been whitelisted, only update the referral count
      await User.findOneAndUpdate(
        { 'referral.referral_code': referralCode },
        {
          $set: {
            'referral.referral_count': currentReferralCount + 1,
          },
        }
      );
      return null;
    }
    
    let newPosition = currentPosition
    if (currentPosition !== 1) {
      // Move the user currently in the position ahead of the referring user back a position
      newPosition -= 1
      await User.findOneAndUpdate(
        { 'waitlisted.position': newPosition },
        {
          $set: {
            'waitlisted.position': currentPosition,
          },
        }
      );
    }

    // Update the referring user's position and referral count
    await User.findOneAndUpdate(
      { 'referral.referral_code': referralCode },
      {
        $set: {
          'waitlisted.position': newPosition,
          'referral.referral_count': currentReferralCount + 1,
        },
      }
    );


    return null;
  } catch (error) {
    console.error('Error updating waitlist positions:', error);
    return 'Failed to update waitlist positions';
  }
};

export { updateWaitlistPositions };
