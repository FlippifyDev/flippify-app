"use client"; // Ensures the component runs on the client side

import React, { useState, useEffect } from "react";

// Component to handle eBay and Amazon account connections
const ProfileMarketplaceConnect = () => {
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true); // To show loading state while fetching status

  const fetchEbayStatus = async () => {
    setLoading(true); // Start loading while fetching status
    try {
      const response = await fetch("/api/ebay/status");
      if (!response.ok) {
        throw new Error(`Failed to fetch eBay status: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();

      // Access the ebay object from the response
      const ebay = data.ebay || {};
      if (ebay.ebayAccessToken) {
        setConnected(true);
      } else {
        setConnected(false);
      }
    } catch (error) {
      console.error("Error fetching eBay status:", error);
      setConnected(false);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    fetchEbayStatus();
  }, []);

  const handleConnectEbay = () => {
    const CLIENT_ID = process.env.NEXT_PUBLIC_EBAY_CLIENT_ID;
    const REDIRECT_URI = process.env.NEXT_PUBLIC_EBAY_REDIRECT_URI;

    if (!CLIENT_ID || !REDIRECT_URI) {
      throw new Error("Missing eBay credentials");
    }

    const SCOPES = [
      "https://api.ebay.com/oauth/api_scope",
      "https://api.ebay.com/oauth/api_scope/sell.inventory",
    ].join(" ");

    const ebayAuthUrl = `https://auth.ebay.com/oauth2/authorize?client_id=${encodeURIComponent(
      CLIENT_ID
    )}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&response_type=code&scope=${encodeURIComponent(SCOPES)}`;

    window.location.href = ebayAuthUrl;
  };

  const handleDisconnect = async () => {
    try {
      const response = await fetch("/api/ebay/disconnect", { method: "POST" });
      if (response.ok) {
        setConnected(false);
      }
    } catch (error) {
      console.error("Error disconnecting eBay:", error);
    }
  };

  return (
    <div className="card bg-white shadow-md rounded-lg p-6 mt-4 h-full flex flex-col justify-center items-center">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Connect Your Accounts</h2>
      <p className="text-sm text-gray-600 mb-6 text-center">
        Connect your eBay and Amazon accounts to sync inventory, track sales, and automate your reselling business.
      </p>
      
      <div className="flex flex-col space-y-4 w-full items-center">
        {/* eBay Connect Button */}
        <div className="relative group w-full"> {/* Full width for all screen sizes */}
          {loading ? (
            <button 
              disabled 
              className="btn bg-houseBlue text-white w-full h-full py-3 px-6 rounded-lg transition duration-200"
            >
              Loading eBay status...
            </button>
          ) : connected ? (
            <button 
              onClick={handleDisconnect} 
              className="btn bg-white text-black hover:bg-red-600 hover:text-white w-full h-full py-3 px-6 rounded-lg transition duration-200"
            >
              Disconnect eBay Account
            </button>
          ) : (
            <button 
              onClick={handleConnectEbay} 
              className="btn bg-houseBlue text-white hover:bg-houseHoverBlue w-full h-full py-3 px-6 rounded-lg transition duration-200"
            >
              Connect with eBay
            </button>
          )}
        </div>

        {/* Amazon Connect Button */}
        <div className="relative group w-full"> {/* Full width for all screen sizes */}
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
      </div>
    </div>
  );
};

export default ProfileMarketplaceConnect;
