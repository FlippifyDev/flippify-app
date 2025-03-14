"use client";

import React from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface PlansGetAccessButtonProps {
	redirect: string;
	specialPlan?: boolean;
}

const ServicesGetAccessButton = () => {
	const { data: session } = useSession();
	const router = useRouter();
	
	const handleRedirect = () => {
		if (session) {
			if (session.user?.username) {
				router.push(`/u/${session.user.username}/dashboard`);
			} else {
				router.push(`/u/loading`);
			}
		} else {
			signIn('discord'); 
		}
	};

	return (
		<div className="relative group w-full flex flex-col justify-end">
			<button
				className={'btn border-0 bg-houseBlue bg-opacity-10 text-houseBlue hover:bg-houseHoverBlue hover:text-white transition duration-300 text-opacity-100 w-2/3 mx-auto rounded-lg shadow-lg'}
				onClick={() => router.push('/l/coming-soon')}
			>
				Get Access Now
			</button>
		</div>
	);
};

export default ServicesGetAccessButton;
