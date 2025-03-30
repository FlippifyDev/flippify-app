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
            className="btn bg-houseBlue rounded-lg mr-1 text-white hover:bg-houseHoverBlue hover:shadow-lg hover:pb-[2px] border-none transform-duration-400 transition-duration-400"
		>
			See Plans and Start Earning
		</button>
	);
};

export default HomeAboutSeePlansButton;
