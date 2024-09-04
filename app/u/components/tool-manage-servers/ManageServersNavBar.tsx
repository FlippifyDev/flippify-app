import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav className="w-full p-4 bg-white shadow">
      <div className="container mx-auto flex justify-between items-center">
        {/* Left Section: Logo or Brand Name (optional) */}
        
        {/* Right Section: Navbar Items */}
        <div className="flex space-x-4 justify-center flex-grow">
          <a href="#randomshit" className="text-black hover:text-gray-300">
            Bot Customizations
          </a>
          <a href="#numbershit" className="text-black hover:text-gray-300">
            Metrics
          </a>
          <a href="#nerdystuff" className="text-black hover:text-gray-300">
            Documentation
          </a>
          <a href="#ultra-nerdy-stuff" className="text-black hover:text-gray-300">
            API
          </a>
          <a href="#status-for-when-we-fuck-up" className="text-black hover:text-gray-300">
            Status
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
