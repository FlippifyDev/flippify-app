"use client"

// Local Imports
import { handleConnectEbay, handleDisconnect } from "@/lib/ebay/ebay-connection";
import ConnectButton from "./ConnectButton";

// External Imports
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";



const EbayConnectButton = () => {
    const { data: session, status } = useSession();
    const [connected, setConnected] = useState(false);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        setLoading(status === "loading");
        setConnected(session?.user?.connectedAccounts?.ebay ? true : false);
    }, [status, session]);


    const disconnectEbay = () => {
        handleDisconnect(setConnected);
    };

    return (
        <ConnectButton connected={connected} loading={loading} handleConnect={handleConnectEbay} handleDisconnect={disconnectEbay} />
    )
}

export default EbayConnectButton
