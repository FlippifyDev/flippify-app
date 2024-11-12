import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { ref, get } from 'firebase/database';
import { updateUserPreferences } from '@/src/services/firebase/update-user-preferences';
import { database } from '@/src/lib/firebase/client';
import { completeOnboarding } from '@/src/services/mongodb/complete-on-boarding';
import { validateReferralCode } from '@/src/services/mongodb/validate-referral';
import { Lato } from 'next/font/google';

const lato = Lato({ weight: '900', style: 'italic', subsets: ['latin'] });

const OnboardingFlow: React.FC = () => {
	const [step, setStep] = useState(1);
	const [referralCode, setReferralCode] = useState<string>('');
	const [email, setEmail] = useState<string>('');
	const [currency, setCurrency] = useState<'GBP' | 'USD' | 'EUR'>('GBP');
	const [showReferralMessage, setShowReferralMessage] = useState<boolean>(false);
	const [referralError, setReferralError] = useState<string | null>(null);
	const [validReferralCode, setValidReferralCode] = useState<string | null>(null);
	const { data: session } = useSession();

	useEffect(() => {
		const loadUserData = async () => {
			if (session && session.user) {
				const customerId = session.user.customerId as string;
				const userRef = ref(database, `users/${customerId}`);

				try {
					const snapshot = await get(userRef);
					const userData = snapshot.val();

					setEmail(userData?.preferredEmail || session.user.email || '');
					setCurrency(userData?.currency || session.user.currency || 'GBP');
				} catch (error) {
					console.error('Error loading user data from Firebase:', error);
					setEmail(session.user.email || '');
					setCurrency(session.user.currency || 'GBP');
				}
			}
		};

		if (typeof window !== 'undefined') {
			loadUserData();
		}
	}, [session]);

	const handleNextStep = async () => {
		setReferralError(null);

		if (referralCode) {
			const isValid = await validateReferralCode(referralCode);
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
			const customerId = session.user.customerId as string;

			// Update the user in Firebase with preferred email and currency
			await updateUserPreferences(customerId, email, currency, 'preferredEmail');

			// Complete the onboarding with the referral code
			await completeOnboarding(session.user.discordId, validReferralCode);

			// Refresh the page to reflect any role updates
			if (typeof window !== 'undefined') {
				window.location.reload(); // Reloads the page to ensure roles are updated in the session
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
