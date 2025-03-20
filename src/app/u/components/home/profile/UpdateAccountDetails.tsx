"use client";

import { IUser } from "@/models/user";
import { auth, firestore } from "@/lib/firebase/config";

import { updatePassword, EmailAuthProvider, reauthenticateWithCredential, verifyBeforeUpdateEmail } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Lock, Mail } from "lucide-react";
import { useState } from "react";
import { updateStripeCustomerEmail } from "@/services/stripe/update";


async function updateUserEmail(newEmail: string, currentPassword: string, setNewEmailMessage: (value: string) => void, setEmailSuccessfullyUpdated: (value: boolean) => void): Promise<{ success: boolean, error?: string }> {
    let success = false;
    let error = "";

    if (!auth.currentUser) {
        return { success, error: "No authenticated user found." };
    }

    try {
        // Reauthenticate user before updating email
        const credential = EmailAuthProvider.credential(auth.currentUser.email!, currentPassword);
        await reauthenticateWithCredential(auth.currentUser, credential);

        setNewEmailMessage("Please verify your new email address.");
        // Send verification email before updating
        await verifyBeforeUpdateEmail(auth.currentUser, newEmail);

        // Polling: Wait for email verification
        const interval = setInterval(async () => {
            await auth.currentUser?.reload(); // Refresh the user
            if (auth.currentUser?.emailVerified) {
                clearInterval(interval); // Stop checking

                // Update Firestore document
                const userRef = doc(firestore, "users", auth.currentUser.uid);
                const userDoc = await getDoc(userRef);
                const user = userDoc.data() as IUser;
                const userHasAPreferredEmail = user.preferences.preferredEmail !== user.email;

                await updateStripeCustomerEmail(user.stripeCustomerId, newEmail);
                await updateDoc(userRef, {
                    email: newEmail,
                    "preferences.preferredEmail": userHasAPreferredEmail ? user.preferences.preferredEmail : newEmail
                });
                setNewEmailMessage("");
                setEmailSuccessfullyUpdated(true);
                success = true;
            }
        }, 5000); // Check every 5 seconds
    } catch (err) {
        error = `Error updating email: ${err}`;
    }

    return { success: success, error: error };
};

async function updateUserPassword(newPassword: string, currentPassword: string, setNewPasswordMessage: (value: string) => void, setPasswordSuccessfullyUpdated: (value: boolean) => void): Promise<{ success: boolean, error?: string }> {
    let success = false;
    let error = "";

    if (!auth.currentUser) {
        return { success, error: "No authenticated user found." }
    }

    try {
        // Reauthenticate user before updating password
        const credential = EmailAuthProvider.credential(auth.currentUser.email!, currentPassword);
        await reauthenticateWithCredential(auth.currentUser, credential);

        await updatePassword(auth.currentUser, newPassword);
        setPasswordSuccessfullyUpdated(true);
        success = true;
    } catch (err) {
        error = `Error updating password: ${err}`;
    }

    return { success: success, error: error };
};

const UpdateAccountDetails = () => {
    return (
        <div className="w-full h-full card bg-white rounded-lg">
            <div className='w-full border-b py-4 px-6 text-lg font-semibold'>
                Update Account Details
            </div>
            <div className="h-full flex flex-row gap-2 p-4">
                <div>
                    <UpdateEmail />
                </div>
                <div>
                    <UpdatePassword />
                </div>
            </div>
        </div>
    )
}


const UpdateEmail = () => {
    const [newEmail, setNewEmail] = useState("");
    const [updated, setUpdated] = useState(false);

    const [message, setMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [password, setPassword] = useState("")
    const [isChanged, setIsChanged] = useState(false);

    const handleUpdate = async () => {
        if (!newEmail || !password) {
            setErrorMessage("Please provide the new email and current password.");
            return;
        }
        const { success, error } = await updateUserEmail(newEmail, password, setMessage, setUpdated);
        if (!success) {
            setErrorMessage(error ?? "An unknown error occurred while updating your email.");
        } else {
            setUpdated(true);
        }
    };

    return (
        <div className="h-full">
            <div className="w-full">
                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2" htmlFor="email">
                    Current Password
                </label>
                <input
                    type="password"
                    placeholder="Current Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 bg-gray-50 rounded-xl outline-none border  border-gray-500 placeholder-gray-400"
                />
                
                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2 mt-2" htmlFor="email">
                    New Email
                </label>
                <input
                    type="email"
                    placeholder="Email Address"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full p-3 bg-gray-50 rounded-xl outline-none border border-gray-500 placeholder-gray-400"
                />

                <span className="text-sm">{message}</span>
                <span className="text-green-500 text-sm">{updated ? "Email Successfully Updated" : ""}</span>
                <span className="text-red-500 text-sm">{errorMessage}</span>
            </div>
            <button
                type="button"
                onClick={handleUpdate}
                disabled={!isChanged}
                className={`mt-4 w-full inline-block text-white py-2 rounded-md transition duration-200 ${
                    isChanged ? 'bg-houseBlue hover:bg-houseHoverBlue' : 'bg-gray-300 cursor-not-allowed'
                }`}
            >
                Update Email
            </button>
        </div>
    )
}


const UpdatePassword = () => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmedPassword, setConfirmedPassword] = useState("");
    const [updated, setUpdated] = useState(false);

    const [message, setMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isChanged, setIsChanged] = useState(false);

    const handleUpdate = async () => {
        if (!newPassword || !currentPassword || (newPassword !== confirmedPassword)) {
            setErrorMessage("Please provide the new password and current password.");
            return;
        }
        const { success, error } = await updateUserPassword(newPassword, currentPassword, setMessage, setUpdated);
        if (!success) {
            setErrorMessage(error ?? "An unknown error occurred while updating your password.");
        } else {
            setUpdated(true);
        }
    };

    return (
        <div className="h-full">
            <div className="w-full">
                {/* Update Password */}
                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2" htmlFor="email">
                    Current Password
                </label>
                <input
                    type="password"
                    placeholder="Current Password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full p-3 bg-gray-50 rounded-xl outline-none border border-gray-500 placeholder-gray-400"
                />

                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2" htmlFor="email">
                    New Password
                </label>
                <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full p-3 bg-gray-50 rounded-xl outline-none border border-gray-500 placeholder-gray-400"
                />

                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2" htmlFor="email">
                    Confirm Password
                </label>
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmedPassword}
                    onChange={(e) => setConfirmedPassword(e.target.value)}
                    className="w-full p-3 bg-gray-50 rounded-xl outline-none border border-gray-500 placeholder-gray-400"
                />

                <span className="text-sm">{message}</span>
                <span className="text-green-500 text-sm">{updated ? "Password Successfully Updated" : ""}</span>
                <span className="text-red-500 text-sm">{errorMessage}</span>
            </div>
            <button
                type="button"
                onClick={handleUpdate}
                disabled={!isChanged}
                className={`mt-4 w-full inline-block text-white py-2 rounded-md transition duration-200 ${
                    isChanged ? 'bg-houseBlue hover:bg-houseHoverBlue' : 'bg-gray-300 cursor-not-allowed'
                }`}
            >
                Update Password
            </button>
        </div>
    )
}


export default UpdateAccountDetails;