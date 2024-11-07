import React from "react";

const AmazonConnectButton = () => {
  return (
    <div className="relative group w-full">
      <button
        disabled={true}
        className="btn btn-disabled bg-white text-black border-black hover:bg-houseHoverBlue hover:border-black w-full h-full py-3 px-6 rounded-lg transition duration-300"
      >
        Connect with Amazon
      </button>
      {/* Tooltip message (hover) */}
      <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 p-2 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
        Coming Soon
      </div>
    </div>
  );
};

export default AmazonConnectButton;
