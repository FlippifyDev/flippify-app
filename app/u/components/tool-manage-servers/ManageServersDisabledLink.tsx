import Link from 'next/link';
import React from 'react';

interface DisabledLinkProps {
  href: string;
  text: string;
  isDisabled: boolean;
  tooltip: string;
  activeComponent: string;
  setActiveComponent: (component: string) => void;
}

const DisabledLink: React.FC<DisabledLinkProps> = ({ href, text, isDisabled, tooltip, activeComponent, setActiveComponent }) => {
  return (
    <div className="row-span-1 md:col-span-2 relative flex justify-center">
      {isDisabled ? (
        <div className="relative">
          {/* Text with Tooltip */}
          <span className="inline-block text-gray-600 rounded-md bg-white opacity-50 cursor-not-allowed relative group">
            {text}

            {/* Tooltip for disabled link */}
            {tooltip && (
              <div className="absolute left-1/2 w-[120px] top-full mb-2 transform -translate-x-1/2 p-2 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {tooltip}
              </div>
            )}
          </span>
        </div>
      ) : (
        <Link
          href={href}
          className={`inline-block text-gray-600 rounded-md bg-white hover:bg-gray-100 active:bg-gray-300 ${activeComponent === text ? 'font-bold' : ''}`}
          onClick={() => setActiveComponent(text)}
        >
          {text}
        </Link>
      )}
    </div>
  );
};

export default DisabledLink;
