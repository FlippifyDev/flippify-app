import React from 'react';
import { SiTicktick } from "react-icons/si";

interface ClickableBulletPointProps {
	text: string;
	tooltip: string;
}

const ClickableBulletPoint: React.FC<ClickableBulletPointProps> = ({ text, tooltip }) => {
	return (
		<div className="relative group cursor-pointer">
			<div className="grid grid-cols-12 px-2">
				<span className='2xl:col-span-1 col-span-2 flex justify-end mr-3 items-center'><SiTicktick className="inline-block text-houseBlue transition-transform duration-200 text-sm 2xl:text-base" /></span>
				<span className="2xl:col-span-11 col-span-10 flex items-center font-semibold text-gray-400 group-hover:text-houseBlue transition-colors duration-200 select-none text-sm 2xl:text-base">{text}</span>
			</div>
			<div
				className="absolute top-full left-0 mt-2 p-2 bg-gray-800 text-white text-sm rounded-md z-10 shadow-lg transition-opacity duration-300 max-w-xs opacity-0 group-hover:opacity-100 pointer-events-none"
			>
				{tooltip}
			</div>
		</div>
	);
};

export default ClickableBulletPoint;
