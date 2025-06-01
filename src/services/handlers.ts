import { checkAndRefreshTokens, updateResetDates } from "./firebase/admin-update";

export async function handleLogin(uid: string): Promise<{ success?: boolean, error?: any }> {
    try {
        // Step 1: Check and update the users reset dates
        const { error: resetDateError } = await updateResetDates({ uid });
        if (resetDateError) throw resetDateError;

        // Step 2: Check and refresh the users tokens
        const { error: refreshTokensError } = await checkAndRefreshTokens({ uid });
        if (refreshTokensError) throw refreshTokensError;

        return { success: true }
    } catch (error) {
        console.error("An error occured whilst processing login");
        return { error };
    }
}