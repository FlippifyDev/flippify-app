"use client"

import React, { useState, useEffect } from "react";

// eBay functions
import { handleConnectEbay, handleDisconnect, fetchEbayStatus } from "@/app/api/ebay/ebay-connection";


const EbayConnectButton = () => {
    const [connected, setConnected] = useState(false);
    const [loading, setLoading] = useState(true);
  
  
    useEffect(() => {
      fetchEbayStatus(setLoading, setConnected);
    }, []);
  
  
    const disconnectEbay = () => {
      handleDisconnect(setConnected);
    };

    return (
        <div className="relative group w-full">
            {loading ? (
                <button 
                disabled 
                className="btn bg-houseBlue text-white w-full h-full py-3 px-6 rounded-lg transition duration-200"
                >
                Loading eBay status...
                </button>
            ) : connected ? (
                <button 
                onClick={disconnectEbay} 
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
    )
}

export default EbayConnectButton
