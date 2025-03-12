"use client"

import React, { useState, useEffect } from "react";

// eBay functions
import { handleConnectEbay, handleDisconnect, fetchEbayStatus } from "@/src/lib/ebay/ebay-connection";
import ConnectButton from "./ConnectButton";

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
        <ConnectButton connected={connected} loading={loading} handleConnect={handleConnectEbay} handleDisconnect={disconnectEbay} />
    )
}

export default EbayConnectButton
