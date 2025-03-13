'use client';

import createCheckoutSession from '@/services/stripe/create-checkout-session';
import React, { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';

interface PlansSubscribeNowProps {
	priceId: string;
	specialPlan?: boolean;
	unavailable?: string;
	serverPlan?: boolean;
}

const PlansSubscribeNow: React.FC<PlansSubscribeNowProps> = ({ priceId, specialPlan, unavailable, serverPlan }) => {
	const { data: session } = useSession();
	const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
	const customerIdRef = useRef<string | null>(null);
	const usernameRef = useRef<string | null>(null);
	const isAvailable = unavailable !== "unavailable";
	const root = process.env.ROOT as string;

	useEffect(() => {
		const fetchCheckoutUrl = async () => {
			if (session?.user) {
				const user = session.user;
				customerIdRef.current = user.stripeCustomerId || null;
				usernameRef.current = user.username;
				const referred_by = user.referral?.referredBy;

				if (customerIdRef.current && usernameRef.current) {
					try {
						const url = await createCheckoutSession(
							usernameRef.current,
							customerIdRef.current,
							priceId,
							referred_by
						);
						setCheckoutUrl(url);
					} catch (error) {
						setCheckoutUrl(root.concat('/u/failed-to-create-checkout-session'));
					}
				}
			}
		};

		fetchCheckoutUrl();
	}, [session, priceId, root]);

	const handleBuyButtonClick = () => {
		if (checkoutUrl && isAvailable) {
			window.open(checkoutUrl, '_blank', 'noopener,noreferrer');
		}
	};

	const handleContactUsClick = () => {
		window.open("https://discord.com/channels/1236428617962229830/1236436288442466394", '_blank', 'noopener,noreferrer');
	};

	// Update button styles for the special plan
	const btnClassColours = specialPlan
		? 'btn border-0 bg-houseBlue hover:bg-houseHoverBlue text-white w-2/3 mx-auto rounded-lg shadow-lg' // Special plan button with houseBlue
		: 'btn border-0 bg-houseBlue bg-opacity-10 text-houseBlue hover:bg-houseHoverBlue hover:text-white transition duration-300 text-opacity-100 w-2/3 mx-auto rounded-lg shadow-lg'; // Default button styles for non-special plans

	const btnClass = isAvailable ? btnClassColours : `${btnClassColours} cursor-not-allowed`;
	const btnFunction = serverPlan !== true ? handleBuyButtonClick : handleContactUsClick;
	const btnText = serverPlan !== true ? 'Get Started' : 'Contact Us';

	return (
		<div className="relative group w-full flex flex-col justify-end">
			<button
				className={btnClass}
				onClick={btnFunction}
				disabled={!checkoutUrl || !isAvailable}
			>
				{checkoutUrl && isAvailable ? btnText : 'Coming Soon'}
			</button>
			{!isAvailable && (
				<div className="absolute bottom-12 mb-2 left-1/2 transform -translate-x-1/2 p-2 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
					Coming Soon
				</div>
			)}
		</div>
	);
};

export default PlansSubscribeNow;
