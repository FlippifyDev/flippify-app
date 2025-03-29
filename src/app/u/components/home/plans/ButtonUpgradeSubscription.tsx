"use client"

// Local Imports
import { subscriptionPlans } from "@/utils/constants";
import { updateStripeUserSubscription } from "@/services/stripe/update";

// External Imports
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";


export type CurrentSubscriptionName = "Free - member" | "Standard - member" | "Pro - member" | "Enterprise - member";

interface ButtonUpgradeSubscriptionProps {
    priceId: string;
    currentSubscriptionName?: string;
    planTitle?: string;
    specialPlan?: boolean;
    displayModal?: boolean;
    handleDisplayModal: (priceId: string, type: string) => void;
}


const ButtonUpgradeSubscription: React.FC<ButtonUpgradeSubscriptionProps> = ({ priceId, currentSubscriptionName, planTitle, specialPlan, displayModal, handleDisplayModal }) => {
    const { data: session } = useSession();
    const [confirmUpdate, setConfirmUpdate] = useState(false);
    const [confirmingUpdate, setConfirmingUpdate] = useState(false);
    const [confirmedUpdate, setConfirmedUpdate] = useState(false);

    // Apply the new button theming based on whether it's a special plan
    const btnClass = specialPlan
        ? 'btn border-0 bg-houseBlue hover:bg-houseHoverBlue text-white w-2/3 mx-auto rounded-lg shadow-lg' // Special plan button with houseBlue
        : 'btn border-0 bg-houseBlue bg-opacity-10 text-houseBlue hover:bg-houseHoverBlue hover:text-white transition duration-300 text-opacity-100 w-2/3 mx-auto rounded-lg shadow-lg'; // Default button styles for non-special plans

    const currentSubscriptionLevel = subscriptionPlans[currentSubscriptionName as CurrentSubscriptionName] || 0;
    const planSubscriptionLevel = subscriptionPlans[`${planTitle} - member` as CurrentSubscriptionName] || 0;

    const buttonText = currentSubscriptionLevel < planSubscriptionLevel ? "Upgrade Subscription" : "Downgrade Subscription";


    useEffect(() => {
        if (confirmUpdate) {
            setConfirmingUpdate(true);
            const updateSubscription = async () => {
                if (session?.user?.stripeCustomerId) {
                    try {
                        const { success, error } = await updateStripeUserSubscription(session.user.stripeCustomerId, priceId);
                        if (success) {
                            setConfirmedUpdate(true);
                            console.log("Subscription updated successfully!");
                        } else {
                            console.error("Error updating subscription:", error);
                        }
                    } catch (error) {
                        console.error("Error updating subscription:", error);
                    }
                }
                setConfirmUpdate(false); // Reset the confirmation state after the update
            };
            updateSubscription();
        }
    }, [confirmUpdate, session, priceId]);

    return (
        <div className="relative group w-full flex flex-col justify-end">
            {displayModal ? (
                <button
                    className={btnClass}
                    onClick={() => handleDisplayModal(priceId, "subscriptionChange")}
                >
                    {buttonText}
                </button >
            ) : (
                <button
                    className={btnClass}
                    onClick={() => {
                        if (!confirmedUpdate) {
                            setConfirmUpdate(true);
                        }
                    }}
                    disabled={confirmingUpdate || confirmedUpdate}
                >
                    {confirmedUpdate
                        ? "Confirmed" 
                        : confirmingUpdate
                            ? "Processing..."
                            : "Confirm"
                    }
                </button>
            )
            }
        </div>
    );
}

export default ButtonUpgradeSubscription
