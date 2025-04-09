import { SiTicktick } from "react-icons/si";

interface ClickableBulletPointProps {
	text: string;
	tooltip: string;
	comingSoon?: boolean;
}

const PlansClickableBulletPoint: React.FC<ClickableBulletPointProps> = ({ text, tooltip, comingSoon }) => {
	const textColor = 'text-gray-500';
	const hoverColor = 'hover:text-houseBlue';  // Color change on hover
	const iconColor = comingSoon ? 'text-gray-500' : 'text-houseBlue';

	return (
		<div className="relative group/tooltip cursor-pointer">
			<div className='grid grid-cols-12 px-2'>
				<span className="2xl:col-span-1 col-span-2 flex justify-end mr-3 items-center"><SiTicktick className={`2xl:col-span-11 col-span-10 flex items-center font-semibold ${iconColor} transition-colors duration-200 select-none text-sm 2xl:text-base`} /></span>
				<span className={`2xl:col-span-11 col-span-10 flex items-center ${textColor} ${hoverColor} transition-colors duration-200 text-left text-md`}>{text}</span>
			</div>
			<div
				className="absolute top-full left-0 mt-1 p-2 bg-gray-800 text-white text-sm rounded-md z-10 shadow-lg transition-opacity duration-300 max-w-xs opacity-0 group-hover/tooltip:opacity-100 pointer-events-none"
			>
				{tooltip}
			</div>
		</div>
	);
};

export default PlansClickableBulletPoint;
