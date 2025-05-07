'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';

interface SidebarButtonProps {
	text: string;
	redirect?: string;
	symbol: React.ReactNode;
	isSidebarOpen: boolean;
	onClick?: () => void;
}

const SidebarButton: React.FC<SidebarButtonProps> = ({
	text,
	redirect,
	symbol,
	isSidebarOpen,
	onClick,
}) => {
	const { data: session } = useSession();
	const router = useRouter();
	const pathname = usePathname();

	// Extract the base path without the username prefix
	const basePath = `/u/${session?.user?.username}`;

	// Determine if the button should be active
	const isActive = pathname === `${basePath}/${redirect}`;

	const handleClick = () => {
		if (!onClick) {
			if (session) {
				if (session.user?.username) {
					router.push(`${basePath}/${redirect}`);
				} else {
					router.push(`/u/loading`);
				}
			}
		} else {
			onClick();
		}
	};

	return (
		<div className="relative group">
			{/* Button */}
			<button
                className={`relative z-50 w-full flex justify-start items-center gap-4 py-2 ${isSidebarOpen ? 'px-2' : 'pl-2'} active:bg-gray-700 hover:bg-gray-800 rounded-md transition duration-200 ${isActive ? 'text-white' : 'bg-deepBlue text-gray-400'}`}
				onClick={handleClick}
			>
				{/* Icon */}
				<span
					className={`w-8 h-8 flex justify-center items-center ${isActive ? 'text-houseBlue' : 'text-gray-400'}`}
				>
					{symbol}
				</span>

				{/* Text */}
				<span
                    className={`absolute left-14 text-base text-left ${isActive ? 'font-semibold' : 'font-medium'} ${isSidebarOpen ? 'opacity-100 max-w-full delay-100' : 'opacity-0 max-w-0'} transition-all duration-150 ease-in-out overflow-hidden`}
					style={{
						whiteSpace: 'nowrap',
					}}
				>
					{text}
				</span>
			</button>
		</div>
	);
};

export default SidebarButton;
