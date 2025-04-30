// Local Imports
import { CurrencyType } from '@/models/user';
import { retrieveUserRefById } from '@/services/firebase/retrieve';
import { updateUserPreferences } from '@/services/firebase/update';
import { updateReferredByAdmin } from '@/services/firebase/update-admin';
import { retrieveUserByKeyAndValueAdmin } from '@/services/firebase/retrieve-admin';

// External Imports
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { Lato } from 'next/font/google';
import { useRouter } from 'next/navigation';
import { deleteField, setDoc } from 'firebase/firestore';
import { validateAlphaNumericInput, validateEmailInput } from '@/utils/input-validation';

const lato = Lato({ weight: '900', style: 'italic', subsets: ['latin'] });

// Progress Bar Component
const OnboardingProgressBar: React.FC<{ currentStep: number }> = ({ currentStep }) => {
    const steps = ["Referral", "Details", "Plan"];

    return (
        <div className="flex items-center justify-center mb-8">
            {steps.map((label, index) => (
                <div key={index} className="flex items-center">
                    <div className="flex flex-col items-center">
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-white transition-colors duration-500 ease-in-out ${currentStep >= index + 1 ? 'bg-houseBlue' : 'bg-gray-300'
                                }`}
                        >
                            {index + 1}
                        </div>
                        <span className="text-sm mt-1 text-gray-600">{label}</span>
                    </div>
                    {index < steps.length - 1 && (
                        <div
                            className="h-1 w-16 mx-2"
                            style={{
                                background:
                                    currentStep > index + 1
                                        ? '#3b82f6'
                                        : currentStep === index + 1
                                            ? 'linear-gradient(to right, #3b82f6, #9ca3af)'
                                            : '#9ca3af',
                                transition: 'background 0.5s ease-in-out',
                            }}
                        />
                    )}
                </div>
            ))}
        </div>
    );
};

// Onboarding Flow Component
const OnboardingFlow: React.FC = () => {
    const { data: session, update: setSession, status } = useSession();
    const router = useRouter();

    const [step, setStep] = useState(1);
    const [referralCode, setReferralCode] = useState<string | null>("");
    const [email, setEmail] = useState<string>(session?.user.email ?? "");
    const [currency, setCurrency] = useState<CurrencyType>("USD");
    const [showReferralMessage, setShowReferralMessage] = useState<boolean>(false);
    const [referralError, setReferralError] = useState<string | null>(null);
    const [validReferralCode, setValidReferralCode] = useState<string | null>(null);
    const [validInputs, setValidInputs] = useState<boolean>(true);

    // Default username
    let username = "User";

    if (session?.user?.username) {
        username = session.user.username;
    }

    const handleNextStep = async () => {
        setReferralError(null);

        if (referralCode) {
            if (referralCode === session?.user.referral?.referralCode) {
                setReferralError('You cannot use your own referral code.');
                return;
            }
            const isValid = await retrieveUserByKeyAndValueAdmin("referral.referralCode", referralCode);
            if (!isValid) {
                setReferralError('Invalid referral code. Please try again.');
                return;
            } else {
                setValidReferralCode(referralCode); // Store the valid referral code
            }
        }

        if (!referralCode && !showReferralMessage) {
            setShowReferralMessage(true);
        } else {
            setStep(2);
        }
    };

    const handleStep2Next = async () => {
        if (session?.user) {
            await updateUserPreferences(session.user.id ?? "", currency);
            setStep(3);
            const userRef = await retrieveUserRefById(session?.user.id ?? "");
            if (!userRef) return;
            await setDoc(
                userRef,
                {
                    authentication: { onboarding: deleteField() }
                },
                { merge: true }
            );
            await updateReferredByAdmin(session.user.id ?? "", validReferralCode ?? "");
        }

        window.location.reload()
    };

    function handleInput(value: string, type: string) {
        if (type === "referral") {
            if (value.length > 7) return;
            validateAlphaNumericInput(value, setReferralCode);
        } else if (type === "email") {
            setEmail(value);
            const isValid = validateEmailInput(value);
            if (isValid) setValidInputs(true);
            else setValidInputs(false);
        }
    }

    return (
        <div className="flex items-center justify-center pt-40">
            <div className="bg-white py-8 px-6 rounded-3xl shadow-md border-2 max-w-lg w-full">
                <OnboardingProgressBar currentStep={step} />
                {step === 1 && (
                    <section className="text-center">
                        <h2 className={`${lato.className} pb-1 text-[40px] font-bold mb-4 text-gradient bg-gradient-to-r from-houseBlue to-textGradEnd bg-clip-text text-transparent`}>
                            flippify
                        </h2>
                        <h2 className="text-2xl font-semibold mb-2 animate-fadeInPrimary">Welcome, {username}</h2>
                        <p className="text-gray-600 mb-8 animate-fadeInSecondary">
                            Join now to take the first step to automating your store.
                        </p>
                        <div className="mb-6">
                            <input
                                type="text"
                                value={referralCode ?? ""}
                                onChange={(e) => handleInput(e.target.value, "referral")}
                                placeholder="Referral Code (optional)"
                                className="input input-bordered w-full"
                                aria-label="Referral Code"
                                aria-required="false"
                            />
                            {referralError && (
                                <p className="text-red-500 text-sm mt-2">{referralError}</p>
                            )}
                            {showReferralMessage && !referralError && (
                                <p className="text-houseBlue text-sm mt-2 animate-fadeInPrimary">
                                    Enter a referral code to get 10% off your first month.
                                </p>
                            )}
                        </div>
                        <button
                            className="btn border-0 bg-houseBlue bg-opacity-10 text-houseBlue hover:bg-houseHoverBlue hover:text-white transition duration-300 text-opacity-100 w-full mx-auto rounded-lg shadow-lg"
                            onClick={handleNextStep}
                        >
                            {showReferralMessage && !referralError ? "Click again to continue" : "Next"}
                        </button>
                    </section>
                )}
                {step === 2 && (
                    <section className="text-center">
                        <h2 className={`${lato.className} pb-1 text-[40px] font-bold mb-4 text-gradient bg-gradient-to-r from-houseBlue to-textGradEnd bg-clip-text text-transparent`}>
                            flippify
                        </h2>
                        <h2 className="text-2xl font-semibold mb-2">Welcome, {username}</h2>
                        <p className="text-gray-600 mb-8">
                            Join now to take the first step to automating your store.
                        </p>
                        <p className="text-md text-black mb-1 font-semibold text-left animate-fadeInPrimary">
                            Contact Email
                        </p>
                        <div className="mb-4">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => handleInput(e.target.value, "email")}
                                placeholder="Contact Email"
                                className="input input-bordered w-full animate-fadeInSecondary"
                                aria-label="Contact Email"
                                aria-required="true"
                            />
                        </div>
                        <p className="text-md text-black mb-1 font-semibold text-left animate-fadeInPrimary">
                            Currency
                        </p>
                        <div className="mb-6">
                            <select
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value as 'GBP' | 'USD' | 'EUR')}
                                className="input input-bordered w-full animate-fadeInSecondary"
                                aria-label="Preferred Currency"
                            >
                                <option value="GBP">GBP (£)</option>
                                <option value="USD">USD ($)</option>
                                <option value="EUR">EUR (€)</option>
                            </select>
                        </div>
                        <button
                            disabled={!validInputs}
                            className="btn border-0 disabled:cursor-not-allowed bg-houseBlue bg-opacity-10 text-houseBlue hover:bg-houseHoverBlue hover:text-white transition duration-300 text-opacity-100 w-full mx-auto rounded-lg shadow-lg"
                            onClick={handleStep2Next}
                        >
                            Next
                        </button>
                    </section>
                )}
                {step === 3 && (
                    <section className="text-center">
                        <h2 className={`${lato.className} pb-1 text-[40px] font-bold mb-4 text-gradient bg-gradient-to-r from-houseBlue to-textGradEnd bg-clip-text text-transparent`}>
                            flippify
                        </h2>
                        <h2 className="text-2xl font-semibold mb-4 animate-fadeInPrimary">Choose a Plan</h2>
                        <p className="text-gray-600 mb-8 animate-fadeInSecondary">
                            Select a plan to get started with Flippify.
                        </p>
                        <button
                            className="btn border-0 bg-houseBlue bg-opacity-10 text-houseBlue hover:bg-houseHoverBlue hover:text-white transition duration-300 text-opacity-100 w-full mx-auto rounded-lg shadow-lg"
                            onClick={() => router.push(`/u/${session?.user.username}/plans`)}
                        >
                            Go to Plans
                        </button>
                    </section>
                )}
            </div>
        </div>
    );
};

export default OnboardingFlow;