"use client";

import React from 'react';

const EbayConnect = () => {
  const handleConnect = () => {
    const CLIENT_ID = process.env.NEXT_PUBLIC_EBAY_CLIENT_ID;
    const REDIRECT_URI = process.env.NEXT_PUBLIC_EBAY_REDIRECT_URI;

    // Throw error if environment variables are missing
    if (!CLIENT_ID) {
      throw new Error('NEXT_PUBLIC_EBAY_CLIENT_ID is not set in the environment variables');
    }
    if (!REDIRECT_URI) {
      throw new Error('NEXT_PUBLIC_EBAY_REDIRECT_URI is not set in the environment variables');
    }

    const SCOPES = [
      'https://api.ebay.com/oauth/api_scope',
      'https://api.ebay.com/oauth/api_scope/sell.inventory'
    ].join(' ');

    const ebayAuthUrl = `https://auth.sandbox.ebay.com/oauth2/authorize?client_id=${encodeURIComponent(CLIENT_ID)}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=${encodeURIComponent(SCOPES)}`;

    window.location.href = ebayAuthUrl;
  };

  return (
    <div>
      <button className="px-4 py-2 text-white bg-blue-500 rounded-md" onClick={handleConnect}>Connect with eBay</button>
    </div>
  );
};

export default EbayConnect;
