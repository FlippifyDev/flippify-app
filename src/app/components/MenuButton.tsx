import React, { useState } from 'react';
import { Lato } from 'next/font/google';
import Link from 'next/link';

const lato = Lato({ weight: '900', style: 'italic', subsets: ['latin'] });


interface MenuButtonProps {
	onClick: () => void;
}

const MenuButton: React.FC<MenuButtonProps> = ({ onClick }) => {
	const [isActive, setIsActive] = useState(false);

	const handleClick = () => {
		setIsActive(!isActive);
		onClick();
	};

	return (
		<div className={`w-full h-full  ${isActive ? 'grid grid-cols-12 pr-4 pl-2' : 'flex justify-center'}`}>
			<Link
				href="/"
				className={`text-white text-3xl ${isActive ? 'col-span-11 block' : 'hidden'} ${lato.className}`}
			>
				flippify
			</Link>
			<button className={`relative group ${isActive ? 'col-span-1' : 'col-span-12'}`} onClick={handleClick}>
				<div className="relative flex overflow-hidden items-center justify-center rounded-full w-[40px] h-[40px] transform transition-all bg-slate-900 ring-0 ring-gray-600 hover:ring-4 ring-opacity-30 duration-200 shadow-md">
					<div
						className={`flex flex-col justify-between w-[15px] h-[15px] transform transition-all duration-500 origin-center overflow-hidden ${isActive ? '-rotate-180' : ''
							}`}
					>
						<div
							className={`bg-white h-[2px] w-5 transform transition-all duration-500 ${isActive ? 'rotate-45 -translate-x-[1.8px]' : ''
								}`}
						></div>
						<div
							className="bg-white h-[2px] w-5 rounded transform transition-all duration-500"
						></div>
						<div
							className={`bg-white h-[2px] w-5 transform transition-all duration-500 ${isActive ? '-rotate-45 -translate-x-[1.8px]' : ''
								}`}
						></div>
					</div>
				</div>
			</button>
		</div>
	);
};

export default MenuButton;
