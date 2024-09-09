import React from 'react';
import { SiTicktick } from "react-icons/si";

interface ClickableBulletPointProps {
  text: string;
  tooltip: string;
  comingSoon?: boolean;
}

const PlansClickableBulletPoint: React.FC<ClickableBulletPointProps> = ({ text, tooltip, comingSoon }) => {
  const textColor = 'text-gray-500'; 
  const hoverColor = 'hover:text-houseBlue';  // Use regular hover for color change
  const iconColor = comingSoon ? 'text-gray-500' : 'text-houseBlue';

  return (
    <div className="relative flex items-start cursor-pointer"> 
      {/* Icon */}
      <span className="flex justify-center items-center mt-1 mr-3">
        <SiTicktick className={`inline-block ${iconColor} text-sm`} />
      </span>

      {/* Text */}
      <span className={`flex items-center ${textColor} ${hoverColor} transition-colors duration-200 text-left text-md`}>
        {text}
      </span>

      {/* Tooltip */}
      <div className="absolute top-full left-0 mt-2 p-2 bg-gray-800 text-white text-sm rounded-md z-10 shadow-lg transition-opacity duration-300 max-w-xs opacity-0 hover:opacity-100 pointer-events-none">
        {tooltip}
      </div>
    </div>
  );
};

export default PlansClickableBulletPoint;
