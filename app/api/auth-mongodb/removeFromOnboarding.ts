import { User } from './userModel';

const removeFromOnboarding = async (userId: string) => {
  try {
    const user = await User.findById(userId);
    if (!user || !user.onboarding) return;

    await User.findByIdAndUpdate(userId, { $unset: { onboarding: '' } });
  } catch (error) {
    console.error('Error removing from onboarding:', error);
  }
};

export { removeFromOnboarding };
