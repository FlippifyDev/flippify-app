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
}

const DisabledSideBarButton: React.FC<DisabledSideBarButtonProps> = ({ text, redirect, symbol, tooltip, showAlert }) => {
  const { data: session } = useSession();
  const pathname = usePathname();

  const basePath = `/u/${session?.user?.name}`;
  const isActive = pathname === `${basePath}/${redirect}`;

  const handleButtonClick = () => {
    if (showAlert !== undefined) {
      showAlert();
    }
  };

  return (
    <div className="relative group">
      <button
        className={`relative w-full bg-white text-gray-600 grid grid-cols-12 items-center gap-2 px-4 py-2 rounded-md cursor-pointer group transition duration-200
          ${isActive ? 'bg-houseBlue text-white' : 'hover:bg-gray-100 active:bg-gray-300'}
        `}
        onClick={handleButtonClick}
      >
        <span className={`col-span-2 text-lg ${isActive ? 'text-white' : ''}`}>{symbol}</span>
        <span className="col-span-10 text-base text-left">{text}</span>
      </button>
      
      {tooltip && (
        <div className="absolute bottom-full mb-2 right-0 p-2 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          {tooltip}
        </div>
      )}
    </div>
  );
};

export default DisabledSideBarButton;
