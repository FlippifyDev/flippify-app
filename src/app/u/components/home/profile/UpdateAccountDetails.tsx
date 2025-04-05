"use client";

import { useState } from "react";
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
import { validateEmailInput, validatePasswordInput } from "@/utils/input-validation";

// Modal Component
const Modal = ({ isOpen, onClose, title, children }: {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <h2 className="text-2xl font-semibold mb-4">{title}</h2>
                {children}
                <div className="flex justify-end gap-4 mt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

// UpdateAccountDetails Component
const UpdateAccountDetails = () => {
    const [modalType, setModalType] = useState<string | null>(null);

    const openModal = (type: string) => setModalType(type);
    const closeModal = () => setModalType(null);

    return (
        <div className="w-full h-full card bg-white rounded-lg">
            <div className="w-full border-b py-4 px-6 text-lg font-semibold">
                Update Account Details
            </div>
            <div className="h-full flex flex-col md:flex-row gap-2 p-4">
                <button
                    onClick={() => openModal("email")}
                    className="py-3 px-6 rounded-lg bg-gray-50 hover:bg-gray-200 border border-gray-500 text-sm transition duration-200"
                >
                    Update Email
                </button>
                <button
                    onClick={() => openModal("password")}
                    className="py-3 px-6 rounded-lg bg-gray-50 hover:bg-gray-200 border border-gray-500 text-sm transition duration-200"
                >
                    Update Password
                </button>
            </div>

            {/* Modal for Update Email */}
            <Modal
                isOpen={modalType === "email"}
                onClose={closeModal}
                title="Update Email"
            >
                <UpdateEmail onClose={closeModal} />
            </Modal>

            {/* Modal for Update Password */}
            <Modal
                isOpen={modalType === "password"}
                onClose={closeModal}
                title="Update Password"
            >
                <UpdatePassword onClose={closeModal} />
            </Modal>
        </div>
    );
};

// UpdateEmail Component
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
        const { success, error } = await updateUserEmail(
            newEmail,
            password,
            setMessage,
            () => {
                onClose();
                setMessage("Email Successfully Updated");
            }
        );
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

// UpdatePassword Component
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
        const { success, error } = await updateUserPassword(
            newPassword,
            currentPassword,
            setMessage,
            () => {
                onClose();
                setMessage("Password Successfully Updated");
            }
        );
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

// Helper Functions with TypeScript Fix
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
                const userHasAPreferredEmail = user.preferences.preferredEmail !== user.email;
                await updateStripeCustomerEmail(user.stripeCustomerId, newEmail);
                await updateDoc(userRef, {
                    email: newEmail,
                    "preferences.preferredEmail": userHasAPreferredEmail ? user.preferences.preferredEmail : newEmail,
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

export default UpdateAccountDetails;