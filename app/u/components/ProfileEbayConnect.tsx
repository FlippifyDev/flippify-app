"use client";

import React from 'react';

const ProfileEbayConnect = () => {
  const handleConnect = () => {
    const CLIENT_ID = process.env.NEXT_PUBLIC_EBAY_CLIENT_ID;
    const REDIRECT_URI = process.env.NEXT_PUBLIC_EBAY_REDIRECT_URI;

    const SCOPES = [
      'https://api.sandbox.ebay.com/oauth/api_scope',
      'https://api.sandbox.ebay.com/oauth/api_scope/sell.inventory',
      // Add other scopes here as needed
    ];

    const scopeParam = SCOPES.join(' ');

    if (!CLIENT_ID || !REDIRECT_URI) {
      console.error('Missing environment variables:', {
        CLIENT_ID,
        REDIRECT_URI
      });
      return;
    }

    const ebayAuthUrl = `https://auth.sandbox.ebay.com/oauth2/authorize?client_id=${encodeURIComponent(CLIENT_ID)}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=${encodeURIComponent(scopeParam)}`;

    // Redirect to eBay for authentication
    window.location.href = ebayAuthUrl;
  };

  return (
    <div className="card bg-white shadow-md rounded-lg p-6 mt-4 h-full flex flex-col justify-center items-center">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Connect your eBay Account</h2>
      <p className="text-sm text-gray-600 mb-6 text-center">
        Connect your eBay account to sync inventory, track sales, and automate your reselling business.
      </p>
      <button 
        onClick={handleConnect}
        className="btn bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-houseHoverBlue transition w-1/4"
      >
        Connect with eBay
      </button>
    </div>
  );
};

export default ProfileEbayConnect;
