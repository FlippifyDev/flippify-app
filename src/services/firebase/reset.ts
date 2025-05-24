"use server";

// Local Imports
import { auth } from '@/lib/firebase/config';

// External Imports
import { sendPasswordResetEmail } from 'firebase/auth';

export async function resetPassword(email: string): Promise<{ success: boolean, message: string }> {
    try {
        await sendPasswordResetEmail(auth, email);
        return { success: true, message: 'Password reset email sent!' }

    } catch (err: any) {
        return { success: false, message: err.message }
    }
}