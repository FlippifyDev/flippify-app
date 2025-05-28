import { updateResetDates } from "./firebase/admin-update";

export async function handleLogin(uid: string): Promise<{ success?: boolean, error?: any }> {
    try {
        const { error: resetDateError } = await updateResetDates({ uid });
        if (resetDateError) throw resetDateError;

        return { success: true }
    } catch (error) {
        console.error("An error occured whilst processing login");
        return { error };
    }
}