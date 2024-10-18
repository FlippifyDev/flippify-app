"use client";

import React, { useState, useEffect } from 'react';

const EbayConnect = () => {
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the user data from MongoDB to check if eBay is connected
    const checkConnectionStatus = async () => {
      try {
        const response = await fetch('/api/user'); // Assuming this API returns the user's connection status
        const userData = await response.json();
        setLoading(false);

        if (userData.ebayAccessToken) {
          setConnected(true);
        }
      } catch (error) {
        setLoading(false);
        console.error("Error checking connection status:", error);
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

  const handleDisconnect = async () => {
    try {
      const response = await fetch('/api/ebay/disconnect', { method: 'POST' }); // Ensure your disconnect API works
      const data = await response.json();

      if (response.ok) {
        setConnected(false);
        alert('eBay account disconnected successfully.');
      } else {
        alert('Failed to disconnect eBay account.');
      }
    } catch (error) {
      console.error('Error disconnecting eBay account:', error);
      alert('Failed to disconnect eBay account.');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {connected ? (
        <div>
          <button className="px-4 py-2 text-white bg-green-500 rounded-md" onClick={handleDisconnect}>
            Disconnect eBay Account
          </button>
          <div className="mt-4">Status: eBay account is connected</div>
        </div>
      ) : (
        <button className="px-4 py-2 text-white bg-blue-500 rounded-md" onClick={handleConnect}>
          Connect with eBay
        </button>
      )}
    </div>
  );
};

export default EbayConnect;
