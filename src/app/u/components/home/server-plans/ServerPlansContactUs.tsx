import React from "react";

interface ServerPlansContactUsProps {
	specialPlan?: boolean;
}

const ServerPlansContactUs: React.FC<ServerPlansContactUsProps> = ({ specialPlan }) => {
	const handleContactUsClick = () => {
		window.open("https://discord.com/channels/1236428617962229830/1236436288442466394", '_blank', 'noopener,noreferrer');
	};

	// Update button styles for the special plan
	const btnClassColours = specialPlan
		? 'btn border-0 bg-houseBlue hover:bg-houseHoverBlue text-white w-2/3 mx-auto rounded-lg shadow-lg' // Special plan button with houseBlue
		: 'btn border-0 bg-houseBlue bg-opacity-10 text-houseBlue hover:bg-houseHoverBlue hover:text-white transition duration-300 text-opacity-100 w-2/3 mx-auto rounded-lg shadow-lg'; // Default button styles for non-special plans

	return (
		<div className="relative group w-full flex flex-col justify-end">
			<button
				className={btnClassColours}
				onClick={handleContactUsClick}
			>
				Contact Us
			</button>
		</div>
	);
};

export default ServerPlansContactUs;
