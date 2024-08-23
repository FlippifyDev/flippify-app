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

    console.log("OAuth2 Details:");
    console.log("CLIENT_ID:", CLIENT_ID);
    console.log("REDIRECT_URI:", REDIRECT_URI);
    console.log("SCOPES:", scopeParam);

    if (!CLIENT_ID || !REDIRECT_URI) {
      console.error('Missing environment variables:', {
        CLIENT_ID,
        REDIRECT_URI
      });
      return;
    }

    const ebayAuthUrl = `https://auth.sandbox.ebay.com/oauth2/authorize?client_id=${encodeURIComponent(CLIENT_ID)}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=${encodeURIComponent(scopeParam)}`;

    console.log("eBay OAuth URL:", ebayAuthUrl);

    // Redirect to eBay for authentication
    window.location.href = ebayAuthUrl;
  };

  return (
    <div>
      <h2>Connect your eBay Account</h2>
      <button onClick={handleConnect}>Connect with eBay</button>
    </div>
  );
};

export default ProfileEbayConnect;
