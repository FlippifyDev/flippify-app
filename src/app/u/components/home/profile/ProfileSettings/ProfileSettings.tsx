"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { IUser } from "@/models/user";
import { auth, firestore } from "@/lib/firebase/config";
import {
    updatePassword,
    EmailAuthProvider,
    reauthenticateWithCredential,
    verifyBeforeUpdateEmail,
} from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { updateStripeCustomerEmail } from "@/services/stripe/update";
import { updateUserPreferences } from "@/services/firebase/update";
import { validateEmailInput } from "@/utils/input-validation";
import CurrencySelector from "./ProfileCurrencySelector";
import Modal from "../../../dom/ui/Modal";

type Currency = "GBP" | "USD" | "EUR" | "AUD" | "CAD" | "JPY" | "NZD";

// Helper Functions (unchanged)
async function updateUserEmail(
    newEmail: string,
    currentPassword: string,
    setNewEmailMessage: (value: string) => void,
    setEmailSuccessfullyUpdated: () => void
): Promise<{ success: boolean; error?: string }> {
    let success = false;
    let error = "";

    if (!auth.currentUser) {
        return { success, error: "No authenticated user found." };
    }

    try {
        const credential = EmailAuthProvider.credential(auth.currentUser.email!, currentPassword);
        await reauthenticateWithCredential(auth.currentUser, credential);
        setNewEmailMessage("Please verify your new email address.");
        await verifyBeforeUpdateEmail(auth.currentUser, newEmail);

        const interval = setInterval(async () => {
            await auth.currentUser?.reload();
            if (auth.currentUser?.emailVerified) {
                clearInterval(interval);
                const userRef = doc(firestore, "users", auth.currentUser.uid);
                const userDoc = await getDoc(userRef);
                const user = userDoc.data() as IUser;
                await updateStripeCustomerEmail(user.stripeCustomerId, newEmail);
                await updateDoc(userRef, {
                    email: newEmail,
                });
                setNewEmailMessage("");
                setEmailSuccessfullyUpdated();
                success = true;
            }
        }, 5000);
    } catch (err) {
        error = `Error updating email: ${err}`;
    }

    return { success, error };
}

async function updateUserPassword(
    newPassword: string,
    currentPassword: string,
    setNewPasswordMessage: (value: string) => void,
    setPasswordSuccessfullyUpdated: () => void
): Promise<{ success: boolean; error?: string }> {
    let success = false;
    let error = "";

    if (!auth.currentUser) {
        return { success, error: "No authenticated user found." };
    }

    try {
        const credential = EmailAuthProvider.credential(auth.currentUser.email!, currentPassword);
        await reauthenticateWithCredential(auth.currentUser, credential);
        await updatePassword(auth.currentUser, newPassword);
        setPasswordSuccessfullyUpdated();
        success = true;
    } catch (err) {
        error = `Error updating password: ${err}`;
    }

    return { success, error };
}

// UpdateEmail Component (unchanged)
const UpdateEmail = ({ onClose }: { onClose: () => void }) => {
    const [newEmail, setNewEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isValidEmail, setIsValidEmail] = useState(false);
    const [isValidPassword, setIsValidPassword] = useState(false);

    const handleUpdate = async () => {
        if (!newEmail || !password) {
            setErrorMessage("Please provide the new email and current password.");
            return;
        }
        const { success, error } = await updateUserEmail(newEmail, password, setMessage, () => {
            onClose();
            setMessage("Email Successfully Updated");
        });
        if (!success) {
            setErrorMessage(error ?? "An unknown error occurred while updating your email.");
        }
    };

    const handleInput = (value: string, type: string) => {
        if (type === "email") {
            setNewEmail(value);
            setIsValidEmail(validateEmailInput(value));
        } else if (type === "password") {
            setPassword(value);
            setIsValidPassword(true); // Assuming password is valid if not empty
        }
    };

    return (
        <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="password">
                Current Password
            </label>
            <input
                type="password"
                placeholder="Current Password"
                value={password}
                onChange={(e) => handleInput(e.target.value, "password")}
                className="w-full p-3 bg-gray-50 rounded-xl outline-none border border-gray-500 placeholder-gray-400 mb-4"
            />
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="email">
                New Email
            </label>
            <input
                type="email"
                placeholder="New Email Address"
                value={newEmail}
                onChange={(e) => handleInput(e.target.value, "email")}
                className="w-full p-3 bg-gray-50 rounded-xl outline-none border border-gray-500 placeholder-gray-400 mb-4"
            />
            <span className="text-sm text-gray-500">{message}</span>
            <span className="text-red-500 text-sm">{errorMessage}</span>
            <div className="flex justify-end gap-4 mt-6">
                <button
                    type="button"
                    onClick={handleUpdate}
                    disabled={!isValidEmail || !isValidPassword}
                    className={`px-4 py-2 text-white rounded-md transition ${isValidEmail && isValidPassword
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-gray-300 cursor-not-allowed"
                        }`}
                >
                    Update Email
                </button>
            </div>
        </div>
    );
};

// UpdatePassword Component (unchanged)
const UpdatePassword = ({ onClose }: { onClose: () => void }) => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmedPassword, setConfirmedPassword] = useState("");
    const [message, setMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isChanged, setIsChanged] = useState(false);

    const handleUpdate = async () => {
        if (!newPassword || !currentPassword || newPassword !== confirmedPassword) {
            setErrorMessage("Please provide the new password and confirm it.");
            return;
        }
        const { success, error } = await updateUserPassword(newPassword, currentPassword, setMessage, () => {
            onClose();
            setMessage("Password Successfully Updated");
        });
        if (!success) {
            setErrorMessage(error ?? "An unknown error occurred while updating your password.");
        }
    };

    const handleInput = (value: string, type: string) => {
        if (type === "currentPassword") {
            setCurrentPassword(value);
        } else if (type === "newPassword") {
            setNewPassword(value);
        } else if (type === "confirmedPassword") {
            setConfirmedPassword(value);
        }
        setIsChanged(newPassword !== "" && confirmedPassword !== "" && newPassword === confirmedPassword);
    };

    return (
        <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="currentPassword">
                Current Password
            </label>
            <input
                type="password"
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => handleInput(e.target.value, "currentPassword")}
                className="w-full p-3 bg-gray-50 rounded-xl outline-none border border-gray-500 placeholder-gray-400 mb-4"
            />
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="newPassword">
                New Password
            </label>
            <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => handleInput(e.target.value, "newPassword")}
                className="w-full p-3 bg-gray-50 rounded-xl outline-none border border-gray-500 placeholder-gray-400 mb-4"
            />
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="confirmedPassword">
                Confirm New Password
            </label>
            <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmedPassword}
                onChange={(e) => handleInput(e.target.value, "confirmedPassword")}
                className="w-full p-3 bg-gray-50 rounded-xl outline-none border border-gray-500 placeholder-gray-400 mb-4"
            />
            <span className="text-sm text-gray-500">{message}</span>
            <span className="text-red-500 text-sm">{errorMessage}</span>
            <div className="flex justify-end gap-4 mt-6">
                <button
                    type="button"
                    onClick={handleUpdate}
                    disabled={!isChanged}
                    className={`px-4 py-2 text-white rounded-md transition ${isChanged ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300 cursor-not-allowed"
                        }`}
                >
                    Update Password
                </button>
            </div>
        </div>
    );
};

// ProfileSettings Component
const ProfileSettings = () => {
    const { data: session, update: setSession } = useSession();
    const [currency, setCurrency] = useState<Currency>((session?.user.preferences.currency as Currency) ?? "USD");
    const [originalCurrency, setOriginalCurrency] = useState<Currency>(
        (session?.user.preferences.currency as Currency) ?? "USD"
    );
    const [feedback, setFeedback] = useState("");
    const [isChanged, setIsChanged] = useState(false);
    const [modalType, setModalType] = useState<string | null>(null);

    const openModal = (type: string) => setModalType(type);
    const closeModal = () => setModalType(null);

    useEffect(() => {
        const loadUserData = async () => {
            if (session && session.user) {
                try {
                    const userCurrency = (session.user.preferences.currency as Currency) || "USD";
                    setCurrency(userCurrency);
                    setOriginalCurrency(userCurrency);
                } catch (error) {
                    console.error("Error loading user data:", error);
                    setCurrency((session?.user.preferences.currency as Currency) || "USD");
                    setOriginalCurrency((session?.user.preferences.currency as Currency) || "USD");
                }
            }
        };

        loadUserData();
    }, [session]);

    const handleCurrencyChange = (newCurrency: Currency) => {
        setCurrency(newCurrency);
        setIsChanged(newCurrency !== originalCurrency);
    };

    const handleSaveChanges = async () => {
        if (!session || !session.user) {
            setFeedback("You must be logged in to update your settings.");
            return;
        }

        try {
            await updateUserPreferences(session.user.id, currency);
            setFeedback("Settings updated successfully.");
            setOriginalCurrency(currency);
            setIsChanged(false);
            setSession({
                ...session,
                user: {
                    ...session.user,
                    preferences: {
                        ...session.user.preferences,
                        currency,
                    },
                },
            });
        } catch (error) {
            console.error("Error updating settings:", error);
            setFeedback("Failed to update settings.");
        }
    };

    return (
        <div className="card bg-white rounded-xl h-full flex flex-col">
            <h2 className="card-title text-black text-lg font-semibold border-b py-4 px-6">Profile Settings</h2>
            <div className="flex flex-col p-6 gap-4">
                <div>
                    <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2" htmlFor="currency">
                        Preferred Currency
                    </label>
                    <CurrencySelector value={currency} onChange={handleCurrencyChange} />
                    <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2 mt-4" htmlFor="currency">
                        Update Details
                    </label>
                    <div className="flex flex-col md:flex-row gap-2">
                        <button
                            onClick={() => openModal("email")}
                            className="flex-1 py-2 rounded-lg bg-gray-50 hover:bg-gray-200 border border-gray-500 text-sm transition duration-200 text-center"
                        >
                            Update Email
                        </button>
                        <button
                            onClick={() => openModal("password")}
                            className="flex-1 py-2 rounded-lg bg-gray-50 hover:bg-gray-200 border border-gray-500 text-sm transition duration-200 text-center"
                        >
                            Update Password
                        </button>
                    </div>
                </div>
            </div>

            {feedback && (
                <p className="text-center text-sm font-semibold text-gray-900 p-6">{feedback}</p>
            )}
            <button
                type="button"
                onClick={handleSaveChanges}
                disabled={!isChanged}
                className={`m-6 mt-auto inline-block text-white py-2 px-4 rounded-md transition duration-200 ${isChanged ? "bg-houseBlue hover:bg-houseHoverBlue" : "bg-gray-300 cursor-not-allowed"
                    }`}
            >
                Save Changes
            </button>

            {/* Updated Modals */}
            {modalType === "email" && (
                <Modal title="Update Email" setDisplayModal={() => setModalType(null)}>
                    <UpdateEmail onClose={() => setModalType(null)} />
                </Modal>
            )}
            {modalType === "password" && (
                <Modal title="Update Password" setDisplayModal={() => setModalType(null)}>
                    <UpdatePassword onClose={() => setModalType(null)} />
                </Modal>
            )}
        </div>
    );
};

export default ProfileSettings;