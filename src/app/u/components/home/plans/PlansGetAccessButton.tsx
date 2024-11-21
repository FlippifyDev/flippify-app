'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface PlansGetAccessButtonProps {
	redirect: string;
	specialPlan?: boolean;
	unavailable?: string;
}

const PlansGetAccessButton: React.FC<PlansGetAccessButtonProps> = ({ redirect, specialPlan, unavailable }) => {
	const { data: session } = useSession();
	const router = useRouter();

	// Extract the base path without the username prefix
	const basePath = `/u/${session?.user?.name}`;

	const redirectUser = () => {
		if (session) {
			// Redirect to the username-specific URL or default redirect
			if (session.user?.name) {
				router.push(`${basePath}/${redirect}`);
			} else {
				router.push(`/u/loading`);
			}
		}
	};

	// Apply the new button theming based on whether it's a special plan
	const btnClass = specialPlan
		? 'btn border-0 bg-houseBlue hover:bg-houseHoverBlue text-white w-2/3 mx-auto rounded-lg shadow-lg' // Special plan button with houseBlue
		: 'btn border-0 bg-houseBlue bg-opacity-10 text-houseBlue hover:bg-houseHoverBlue hover:text-white transition duration-300 text-opacity-100 w-2/3 mx-auto rounded-lg shadow-lg'; // Default button styles for non-special plans

	const isAvailable = unavailable !== 'unavailable';

	return (
		<div className="relative group w-full flex flex-col justify-end">
			<button
				className={btnClass}
				onClick={redirectUser}
				disabled={!isAvailable}
			>
				{isAvailable ? 'Get Access' : 'Coming Soon'}
			</button>
			{!isAvailable && (
				<div className="absolute bottom-12 mb-2 left-1/2 transform -translate-x-1/2 p-2 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
					Coming Soon
				</div>
			)}
		</div>
	);
};

export default PlansGetAccessButton;
