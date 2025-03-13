'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';

interface DisabledSideBarButtonProps {
  text: string;
  redirect: string;
  symbol: React.ReactNode;
  tooltip?: string;
  showAlert?: () => void;
  isSidebarOpen: boolean;  // Control visibility of text on hover
}

const DisabledSideBarButton: React.FC<DisabledSideBarButtonProps> = ({
  text,
  redirect,
  symbol,
  tooltip,
  showAlert,
  isSidebarOpen,  // Get isSidebarOpen prop to control visibility
}) => {
  const { data: session } = useSession();
  const pathname = usePathname();

  const basePath = `/u/${session?.user?.username}`;
  const isActive = pathname === `${basePath}/${redirect}`;

  const handleButtonClick = () => {
    if (showAlert !== undefined) {
      showAlert();
    }
  };

  return (
    <div className="relative group">
		<button
			className={`w-full flex justify-start items-center gap-4 py-2 px-4 text-gray-600 rounded-md cursor-pointer transition duration-200 group 
    ${isActive ? 'text-white' : 'bg-darkBackground text-gray-400'}`}
			onClick={handleButtonClick}
		>
			{/* Icon always visible */}
			<span
				className={`w-8 h-8 flex justify-center items-center ${isActive ? 'text-houseBlue' : 'text-gray-600'}`}
			>
				{symbol}
			</span>

			{/* Text visibility controlled by isSidebarOpen */}
			<span
				className={`text-base text-left ${isActive ? 'font-semibold' : 'font-medium'} 
      ${isSidebarOpen ? 'opacity-100 max-w-full' : 'opacity-0 max-w-0'} 
      transition-all duration-300 ease-in-out 2xl:block overflow-hidden`}
				style={{
					whiteSpace: 'nowrap', // Ensure text doesn't wrap when expanding
				}}
			>
				{text}
			</span>
		</button>

      {/* Tooltip functionality */}
      {tooltip && (
        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 p-2 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          {tooltip}
        </div>
      )}
    </div>
  );
};

export default DisabledSideBarButton;
