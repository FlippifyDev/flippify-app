'use client';

// Local Imports
import { createBillingPortalUrl } from '@/services/stripe/create';

// External Imports
import React, { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';


interface Props {
	specialPlan?: boolean
}


const ButtonManageMembership: React.FC<Props> = ({ specialPlan }) => {
	const { data: session } = useSession();
	const [billingUrl, setBillingUrl] = useState<string | null>(null);
	const customerIdRef = useRef<string | null>(null);

	useEffect(() => {
		const fetchBillingUrl = async () => {
			if (session?.user) {
				const user = session.user;
				customerIdRef.current = user.stripeCustomerId || null;

				if (customerIdRef.current) {
					try {
						const url = await createBillingPortalUrl(user.username ?? "", customerIdRef.current);
						setBillingUrl(url);
					} catch (error) {
						console.error('Failed to create billing portal:', error);
						setBillingUrl('http://localhost:3000/u/failed-to-create-billing-portal');
					}
				}
			}
		};

		fetchBillingUrl();
	}, [session]);

	const handleBillingPortalButtonClick = () => {
		if (billingUrl) {
			window.open(billingUrl, '_blank', 'noopener,noreferrer');
		}
	};

	const btnClass = specialPlan !== true ? 'btn border-0 bg-white hover:bg-gray-300 shadow-md text-black w-2/3 mx-auto rounded-md' : 'btn border-0 bg-white hover:bg-gray-200 shadow-md text-black w-2/3 mx-auto rounded-sm'

	return (
		<div className="relative group w-full flex flex-col justify-end">
			<button
				className={btnClass}
				onClick={handleBillingPortalButtonClick}
				disabled={!billingUrl}
			>
				View Membership
			</button>
		</div>
	);
}

export default ButtonManageMembership;
