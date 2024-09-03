"use client";

import React from 'react';

const ProfileEbayConnect = () => {
  const handleConnect = () => {
    // The eBay connection logic would go here, but the button is disabled for now.
  };

  return (
    <div className="card bg-white shadow-md rounded-lg p-6 mt-4 h-full flex flex-col justify-center items-center">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Connect your eBay Account</h2>
      <p className="text-sm text-gray-600 mb-6 text-center">
        Connect your eBay account to sync inventory, track sales, and automate your reselling business.
      </p>
      <div className="relative group w-1/4">
        <button 
          onClick={handleConnect}
          disabled={true} // Disables the button
          className="btn btn-disabled bg-white text-black border-black hover:bg-houseHoverBlue hover:border-black w-full h-full py-3 px-6 rounded-lg transition duration-300"
        >
          Connect with eBay
        </button>
        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 p-2 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
          Coming Soon
        </div>
      </div>
    </div>
  );
};

export default ProfileEbayConnect;
