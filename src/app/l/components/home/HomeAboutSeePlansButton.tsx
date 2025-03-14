import React from 'react';
import { useRouter } from 'next/navigation';

const HomeAboutSeePlansButton = () => {
	const router = useRouter();

	const handleClick = () => {
		router.push('/l/pricing');
	};

	return (
		<button
			onClick={handleClick}
			className="btn bg-houseBlue hover:bg-houseHoverBlue text-white border-houseBlue hover:border-0 border-0 font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300"
		>
			See Plans and Start Earning
		</button>
	);
};

export default HomeAboutSeePlansButton;
