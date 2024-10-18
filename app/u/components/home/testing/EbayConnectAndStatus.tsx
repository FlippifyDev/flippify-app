"use client";

import React, { useState, useEffect } from "react";

const EbayConnectAndStatus = () => {
  const [connected, setConnected] = useState(false);
  const [ebayData, setEbayData] = useState<any>(null);
  const [loading, setLoading] = useState(true); // Added to show loading state

  const fetchEbayStatus = async () => {
    setLoading(true); // Start loading while fetching status
    try {
      const response = await fetch("/api/ebay/status");
      if (!response.ok) {
        throw new Error(`Failed to fetch eBay status: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      
      // Accessing the ebay object from the response
      const ebay = data.ebay || {};
      if (ebay.ebayAccessToken) {
        console.log("eBay connected, data:", data);
        setConnected(true);
        setEbayData(ebay);  // Set the ebay object to state
      } else {
        console.log("eBay not connected");
        setConnected(false);
      }
    } catch (error) {
      console.error("Error fetching eBay status:", error);
      setConnected(false);
    } finally {
      setLoading(false); // Done loading
    }
  };

  useEffect(() => {
    fetchEbayStatus();
  }, []);

  const handleConnect = () => {
    const CLIENT_ID = process.env.NEXT_PUBLIC_EBAY_CLIENT_ID;
    const REDIRECT_URI = process.env.NEXT_PUBLIC_EBAY_REDIRECT_URI;

    if (!CLIENT_ID || !REDIRECT_URI) {
      throw new Error("Missing eBay credentials");
    }

    const SCOPES = [
      "https://api.ebay.com/oauth/api_scope",
      "https://api.ebay.com/oauth/api_scope/sell.inventory",
    ].join(" ");

    const ebayAuthUrl = `https://auth.sandbox.ebay.com/oauth2/authorize?client_id=${encodeURIComponent(
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
        setEbayData(null);
      }
    } catch (error) {
      console.error("Error disconnecting eBay:", error);
    }
  };

  if (loading) {
    return <div>Loading eBay status...</div>;
  }

  return (
    <div>
      {connected ? (
        <div>
          <button onClick={handleDisconnect}>Disconnect eBay Account</button>
          <div>
            <p>
              <strong>Discord ID:</strong> {ebayData?.discordId}
            </p>
            <p>
              <strong>Access Token:</strong> {ebayData?.ebayAccessToken}
            </p>
            <p>
              <strong>Refresh Token:</strong> {ebayData?.ebayRefreshToken}
            </p>
            <p>
              <strong>Token Expiry:</strong>{" "}
              {new Date(ebayData?.ebayTokenExpiry).toLocaleString()}
            </p>
          </div>
        </div>
      ) : (
        <button onClick={handleConnect}>Connect with eBay</button>
      )}
    </div>
  );
};

export default EbayConnectAndStatus;
