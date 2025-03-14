// Local Imports
import { CurrencyType } from '@/models/user';
import { completeOnboarding } from '@/services/firebase/update';
import { updateUserPreferences } from '@/services/firebase/update';

// External Imports
import { retrieveUserRef } from '@/services/firebase/retrieve';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { Lato } from 'next/font/google';


const lato = Lato({ weight: '900', style: 'italic', subsets: ['latin'] });

const OnboardingFlow: React.FC = () => {
    const { data: session, update: setSession } = useSession();

    const [step, setStep] = useState(1);
    const [referralCode, setReferralCode] = useState<string>("");
    const [email, setEmail] = useState<string>(session?.user.preferences?.preferredEmail ?? "");
    const [currency, setCurrency] = useState<CurrencyType>("USD");
    const [showReferralMessage, setShowReferralMessage] = useState<boolean>(false);
    const [referralError, setReferralError] = useState<string | null>(null);
    const [validReferralCode, setValidReferralCode] = useState<string | null>(null);


    const handleNextStep = async () => {
        setReferralError(null);

        if (referralCode) {
            if (referralCode === session?.user.referral?.referralCode) {
                setReferralError('You cannot use your own referral code.');
                return;
            }
            const isValid = await retrieveUserRef("referral.referralCode", referralCode);
            if (!isValid) {
                setReferralError('Invalid referral code. Please try again.');
                return;
            } else {
                setValidReferralCode(referralCode);  // Store the valid referral code
            }
        }

        if (!referralCode && !showReferralMessage) {
            setShowReferralMessage(true);
        } else {
            setStep((prev) => prev + 1);
        }
    };

    const handleCompleteOnboarding = async () => {
        if (session?.user) {
            // Update the user in Firebase with preferred email and currency
            await updateUserPreferences(session.user.id, email, currency);

            // Complete the onboarding with the referral code
            const user = await completeOnboarding(session.user.id, validReferralCode);

            if (user) {
                setSession({ ...session, user: user });
            }
        }
    };


    return (
        <div className="flex items-center justify-center pt-40">
            <div className="bg-white py-8 px-6 rounded-3xl shadow-md border-2 max-w-lg w-full">
                {step === 1 && (
                    <section className="text-center">
                        <h2 className="text-5xl font-bold mb-2">Welcome to</h2>
                        <h2 className={`${lato.className} pb-1 text-5xl font-bold mb-4 text-gradient bg-gradient-to-r from-houseBlue to-textGradEnd bg-clip-text text-transparent`}>
                            flippify
                        </h2>
                        <p className="text-lg text-gray-700 mb-8">
                            Join now to take the first step to becoming a full-time reseller.
                        </p>
                        <div className="mb-6">
                            <input
                                type="text"
                                value={referralCode}
                                onChange={(e) => setReferralCode(e.target.value)}
                                placeholder="Referral Code (optional)"
                                className="input input-bordered w-full"
                                aria-label="Referral Code"
                                aria-required="false"
                            />
                            {referralError && (
                                <p className="text-red-500 text-sm mt-2">
                                    {referralError}
                                </p>
                            )}
                            {showReferralMessage && !referralError && (
                                <p className="text-red-500 text-sm mt-2">
                                    Enter a referral code to get 25% off your first month.
                                </p>
                            )}
                        </div>
                        <button
                            className="btn border-0 bg-houseBlue text-white hover:bg-blue-600 w-full"
                            onClick={handleNextStep}
                        >
                            {showReferralMessage && !referralError ? "Click again to continue" : "Next"}
                        </button>
                    </section>
                )}
                {step === 2 && (
                    <section className="text-center">
                        <h2 className="text-5xl font-bold mb-2">Welcome to</h2>
                        <h2 className={`${lato.className} pb-1 text-5xl font-bold mb-4 text-gradient bg-gradient-to-r from-houseBlue to-textGradEnd bg-clip-text text-transparent`}>
                            flippify
                        </h2>
                        <p className="text-lg text-gray-700 mb-8">
                            Join now to take the first step to becoming a full-time reseller.
                        </p>
                        <div className="mb-6">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Contact Email"
                                className="input input-bordered w-full"
                                aria-label="Contact Email"
                                aria-required="true"
                            />
                        </div>
                        <div className="mb-6">
                            <select
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value as 'GBP' | 'USD' | 'EUR')}
                                className="input input-bordered w-full"
                                aria-label="Preferred Currency"
                            >
                                <option value="GBP">GBP (£)</option>
                                <option value="USD">USD ($)</option>
                                <option value="EUR">EUR (€)</option>
                            </select>
                        </div>
                        <button
                            className="btn border-0 bg-houseBlue text-white hover:bg-blue-600 w-full"
                            onClick={handleCompleteOnboarding}
                        >
                            Get Access
                        </button>
                    </section>
                )}
            </div>
        </div>
    );
};

export default OnboardingFlow;
