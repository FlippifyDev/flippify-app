import React from 'react';
import { SiTicktick } from "react-icons/si";

interface ClickableBulletPointProps {
  text: string;
  tooltip: string;
  comingSoon?: boolean;  // Optional prop to handle "coming soon" state
}

const ClickableBulletPoint: React.FC<ClickableBulletPointProps> = ({ text, tooltip, comingSoon }) => {
  // Text color remains the same, but the icon color changes based on comingSoon
  const textColor = 'text-gray-500'; // Keep text color for both
  const hoverColor = 'group-hover:text-houseBlue';  // Still apply hover color
  const iconColor = comingSoon ? 'text-gray-400' : 'text-houseBlue'; // Gray for "coming soon"

  return (
    <div className="relative group cursor-pointer"> {/* Apply the group class here to isolate hover */}
      <div className="grid grid-cols-12 px-2">
        <span className='2xl:col-span-1 col-span-2 flex justify-end mr-3 items-center'>
          <SiTicktick className={`inline-block ${iconColor} text-sm 2xl:text-base`} />
        </span>
        <span className={`2xl:col-span-11 col-span-10 flex items-center ${textColor} ${hoverColor} transition-colors duration-200 select-none text-md 2xl:text-base`}>
          {text}
        </span>
      </div>
      {/* Show tooltip for both available and coming soon items */}
      <div 
        className="absolute top-full left-0 mt-2 p-2 bg-gray-800 text-white text-sm rounded-md z-10 shadow-lg transition-opacity duration-300 max-w-xs opacity-0 group-hover:opacity-100 pointer-events-none"
      >
        {tooltip}
      </div>
    </div>
  );
};

export default ClickableBulletPoint;
