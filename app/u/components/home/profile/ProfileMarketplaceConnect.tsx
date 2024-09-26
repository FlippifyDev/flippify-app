"use client"; // This ensures the component runs on the client side

import React from 'react';

const ProfileMarketplaceConnect = () => {
  const handleConnectEbay = () => {
    // eBay connection logic placeholder
  };

  const handleConnectAmazon = () => {
    // Amazon connection logic placeholder
  };

  return (
    <div className="card bg-white shadow-md rounded-lg p-6 mt-4 h-full flex flex-col justify-center items-center">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Connect Your Accounts</h2>
      <p className="text-sm text-gray-600 mb-6 text-center">
        Connect your eBay and Amazon accounts to sync inventory, track sales, and automate your reselling business.
      </p>
      
      <div className="flex flex-col space-y-4 w-full items-center">
        {/* eBay Connect Button */}
        <div className="relative group w-1/2">
          <button 
            onClick={handleConnectEbay} 
            disabled={true} // Disable button for now
            className="btn btn-disabled bg-white text-black border-black hover:bg-houseHoverBlue hover:border-black w-full h-full py-3 px-6 rounded-lg transition duration-300"
          >
            Connect with eBay
          </button>
          <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 p-2 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
            Coming Soon
          </div>
        </div>

        {/* Amazon Connect Button */}
        <div className="relative group w-1/2">
          <button 
            onClick={handleConnectAmazon} 
            disabled={true} // Disable button for now
            className="btn btn-disabled bg-white text-black border-black hover:bg-houseHoverBlue hover:border-black w-full h-full py-3 px-6 rounded-lg transition duration-300"
          >
            Connect with Amazon
          </button>
          <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 p-2 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
            Coming Soon
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileMarketplaceConnect;
