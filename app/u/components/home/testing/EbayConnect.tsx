import React, { useState, useEffect } from 'react';

const EbayConnect = () => {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Fetch the user data from MongoDB to check if eBay is connected
    const checkConnectionStatus = async () => {
      const response = await fetch('/api/user');  // Make sure this API returns the user's eBay connection status
      const userData = await response.json();
      
      if (userData.ebayAccessToken) {
        setConnected(true);
      }
    };

    checkConnectionStatus();
  }, []);

  const handleConnect = () => {
    const CLIENT_ID = process.env.NEXT_PUBLIC_EBAY_CLIENT_ID;
    const REDIRECT_URI = process.env.NEXT_PUBLIC_EBAY_REDIRECT_URI;

    if (!CLIENT_ID || !REDIRECT_URI) {
      throw new Error('Missing eBay credentials');
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
      {connected ? (
        <button className="px-4 py-2 text-white bg-green-500 rounded-md">eBay Account Connected</button>
      ) : (
        <button className="px-4 py-2 text-white bg-blue-500 rounded-md" onClick={handleConnect}>
          Connect with eBay
        </button>
      )}
    </div>
  );
};

export default EbayConnect;
