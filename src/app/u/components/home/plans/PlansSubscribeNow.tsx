'use client';

// Local Imports
import { createCheckoutSession } from '@/services/stripe/create';

// External Imports
import { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { set } from 'date-fns';

interface PlansSubscribeNowProps {
    priceId: string;
    specialPlan?: boolean;
    unavailable?: string;
    displayModal?: boolean;
    handleDisplayCouponModal: (priceId: string) => void;
    couponCode?: string;
    setCouponError?: (error: string) => void;
}

const PlansSubscribeNow: React.FC<PlansSubscribeNowProps> = ({ priceId, specialPlan, unavailable, displayModal, handleDisplayCouponModal, couponCode, setCouponError }) => {
    const { data: session } = useSession();
    const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
    const customerIdRef = useRef<string | null>(null);
    const usernameRef = useRef<string | null>(null);
    const isAvailable = unavailable !== "unavailable";
    const root = process.env.ROOT as string;
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        const fetchCheckoutUrl = async () => {
            if (session?.user && submitted) {
                const user = session.user;
                customerIdRef.current = user.stripeCustomerId || null;
                usernameRef.current = user.username;
                const referred_by = user.referral?.referredBy;

                if (customerIdRef.current && usernameRef.current) {
                    try {
                        const { url, error } = await createCheckoutSession(
                            usernameRef.current,
                            customerIdRef.current,
                            priceId,
                            referred_by,
                            couponCode
                        );
                        if (error && setCouponError) {
                            setCouponError(error);
                        }
                        if (url) {
                            setCheckoutUrl(url);
                        }
                    } catch (error) {
                        setCheckoutUrl(root.concat('/u/failed-to-create-checkout-session'));
                    }
                }
            }
        };

        fetchCheckoutUrl();
    }, [session, priceId, root, couponCode, setCouponError, submitted]);

    useEffect(() => {
        if (submitted && checkoutUrl !== null && checkoutUrl !== "") {
            setSubmitted(false);
            if (setCouponError) setCouponError("");
            window.open(checkoutUrl, '_blank', 'noopener,noreferrer');
        } else if (submitted) {
            setSubmitted(false);
        }
    }, [submitted, checkoutUrl, setCouponError]);

    const handleBuyButtonClick = () => {
        setSubmitted(true);
    };


    // Update button styles for the special plan
    const btnClassColours = specialPlan
        ? 'btn border-0 bg-houseBlue hover:bg-houseHoverBlue text-white w-2/3 mx-auto rounded-lg shadow-lg' // Special plan button with houseBlue
        : 'btn border-0 bg-houseBlue bg-opacity-10 text-houseBlue hover:bg-houseHoverBlue hover:text-white transition duration-300 text-opacity-100 w-2/3 mx-auto rounded-lg shadow-lg'; // Default button styles for non-special plans

    const btnClass = isAvailable ? btnClassColours : `${btnClassColours} cursor-not-allowed`;

    return (
        <div className="relative group w-full flex flex-col justify-end">
            {displayModal ? (
                <>
                    <button
                        className={btnClass}
                        onClick={() => handleDisplayCouponModal(priceId)}
                        disabled={!isAvailable}
                    >
                        Get Started
                    </button>
                </>
            ) : (
                <>
                    <button
                        className={btnClass}
                        onClick={handleBuyButtonClick}
                        disabled={!isAvailable}
                    >
                        {isAvailable ? 'Get Started' : 'Coming Soon'}
                    </button>
                    {!isAvailable && (
                        <div className="absolute bottom-12 mb-2 left-1/2 transform -translate-x-1/2 p-2 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                            Coming Soon
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default PlansSubscribeNow;
