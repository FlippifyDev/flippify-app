"use client";

// Local Imports
import Card from '../../dom/ui/Card'
import Modal from '../../dom/ui/Modal';
import { auth } from "@/lib/firebase/config";
import LoadingSpinner from '@/app/components/LoadingSpinner';
import { createRefund } from '@/services/stripe/create'
import { cancelUserSubscription } from '@/services/stripe/cancel';

// External Imports
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation';
import { useState } from 'react'
import { handleSignOut } from '@/services/sign-out';
import { retrieveIdToken } from '@/services/firebase/retrieve';
import { deleteUserAdmin } from '@/services/firebase/admin-delete';

const DangerZone = () => {
    const { data: session } = useSession();
    const router = useRouter();

    // Modals
    const [displayRefundModal, setDisplayRefundModal] = useState(false);
    const [displayDeleteAccountModal, setDisplayDeleteAccountModal] = useState(false);

    const [message, setMessage] = useState("Refund granted.");
    const [success, setSuccess] = useState(false);

    const [loading, setLoading] = useState(false);

    async function handleCreateRefund() {
        setMessage("");
        if (!session?.user.stripeCustomerId) return;

        setLoading(true);

        const { success, error } = await createRefund(session.user.stripeCustomerId);
        if (success) {
            setSuccess(true);
            setMessage("Refund granted.")
        } else {
            setMessage(error);
            setSuccess(false);
        }
        setLoading(false);
    }

    async function handleDisplayModal(type: "refund" | "delete-account") {
        setMessage("");

        if (type === "refund") {
            setDisplayRefundModal(true);
        } else if (type === "delete-account") {
            setDisplayDeleteAccountModal(true);
        }
    }

    async function handleDeleteAccount() {
        if (!session?.user.stripeCustomerId) return;
        setLoading(true);

        const idToken = await retrieveIdToken();
        if (!idToken) return;

        // Step 1: Cancel any current subscriptions
        const { error: cancelError, isNoSubscriptionError } = await cancelUserSubscription(session?.user.stripeCustomerId);
        if (cancelError && !isNoSubscriptionError) {
            setSuccess(false);
            setMessage(cancelError);
            setLoading(false);
            return;
        }

        // Step 2: Delete user in database
        const { error: deleteError } = await deleteUserAdmin({ idToken: idToken });
        if (deleteError) {
            setSuccess(false);
            setMessage(deleteError);
            setLoading(false);
            return;
        }

        setSuccess(true);
        setMessage("Account deleted successfully");
        setLoading(false);

        // Step 3: Sign the user out
        await handleSignOut()
    }

    return (
        <Card title='Danger Zone'>
            <div className='flex flex-col gap-4 text-base'>
                <div className='flex flex-col gap-4'>
                    <span className='text-gray-600'>Refunds are only guaranteed if requested within 7 days of the original payment date. After this period, eligibility is subject to review.</span>
                    <button type="button" onClick={() => handleDisplayModal("refund")} className='text-sm w-36 flex justify-center items-center rounded-lg bg-red-600 hover:bg-red-500 py-2 px-3 text-white transition duration-100'>
                        Create Refund
                    </button>
                </div>
                <div className='flex flex-col gap-4'>
                    <span className='text-gray-600'>Deleting your account will permanently remove all personal data and purchase history stored in our system. This action cannot be undone.</span>
                    <button type="button" onClick={() => handleDisplayModal("delete-account")} className='text-sm w-36 flex justify-center items-center rounded-lg bg-red-600 hover:bg-red-500 py-2 px-3 text-white transition duration-100'>
                        Delete Account
                    </button>
                </div>
            </div>


            {displayRefundModal && (
                <Modal title="Issue Refund" setDisplayModal={setDisplayRefundModal}>
                    <div className='text-start text-sm'>
                        <p>Are you absolutely sure you want to issue a refund?</p>
                        <p className='my-2'>Funds typically appear in your account after 5-10 business days.</p>
                        <p className='font-bold mb-4'>This action cannot be undone</p>
                        <div className='w-full flex justify-end'>
                            <button type="button" onClick={() => handleCreateRefund()} className='w-36 flex justify-center items-center rounded-lg bg-red-600 hover:bg-red-500 py-2 px-3 text-white transition duration-100'>
                                {loading ? (
                                    <LoadingSpinner />
                                ) : (
                                    "Confirm"
                                )}
                            </button>
                        </div>
                        {message && (
                            <p className={`${success ? "text-green-500" : "text-red-500"} font-semibold text-sm mt-2`}>{message}</p>
                        )}
                    </div>
                </Modal>
            )}

            {displayDeleteAccountModal && (
                <Modal title="Delete Account" setDisplayModal={setDisplayDeleteAccountModal}>
                    <div className='text-start text-sm'>
                        <p>Are you absolutely sure you want to delete your account?</p>
                        <p className='my-2'>This will permanently remove your data from our system and cancel any active subscriptions.</p>
                        <p className='mb-2'>Payment records stored with Stripe will remain.</p>
                        <p className='font-bold mb-4'>This action cannot be undone.</p>
                        <div className='w-full flex justify-end'>
                            <button type="button" onClick={() => handleDeleteAccount()} className='w-36 flex justify-center items-center rounded-lg bg-red-600 hover:bg-red-500 py-2 px-3 text-white transition duration-100'>
                                {loading ? (
                                    <LoadingSpinner />
                                ) : (
                                    "Confirm"
                                )}
                            </button>
                        </div>
                        {message && (
                            <p className={`${success ? "text-green-500" : "text-red-500"} font-semibold text-sm mt-2`}>{message}</p>
                        )}
                    </div>
                </Modal>
            )}
        </Card>
    )
}

export default DangerZone