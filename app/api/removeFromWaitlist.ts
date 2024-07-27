import { User } from './userModel';

const removeFromWaitlist = async (userId: string) => {
  try {
    const user = await User.findById(userId);
    if (!user || !user.waitlisted) return;

    const position = user.waitlisted.position;
    await User.findByIdAndUpdate(userId, { $unset: { waitlisted: '' } });

    await User.updateMany(
      { 'waitlisted.position': { $gt: position } },
      { $inc: { 'waitlisted.position': -1 } }
    );
  } catch (error) {
    console.error('Error removing from waitlist:', error);
  }
};

export { removeFromWaitlist };
