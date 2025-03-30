"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

const ServicesGetAccessButton = () => {
	const router = useRouter();

	return (
		<div className="relative group w-full flex flex-col justify-end">
			<button
				className={'btn border-0 bg-houseBlue bg-opacity-10 text-houseBlue hover:bg-houseHoverBlue hover:text-white transition duration-300 text-opacity-100 w-2/3 mx-auto rounded-lg shadow-lg'}
				onClick={() => router.push('/l/login')}
			>
				Get Access Now
			</button>
		</div>
	);
};

export default ServicesGetAccessButton;
