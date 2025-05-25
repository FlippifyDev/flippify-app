"use client"

// Local Imports
import ConnectButton from "./ConnectButton";
import { handleConnectEbay, handleDisconnect } from "@/lib/ebay/ebay-connection";
import { retrieveConnectedAccount } from "@/services/firebase/retrieve-admin";

// External Imports
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { retrieveIdToken } from "@/services/firebase/retrieve";



const EbayConnectButton = () => {
    const { data: session, status } = useSession();
    const [connected, setConnected] = useState(false);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        // whenever session/status change, re-check
        const checkConnection = async () => {
            // if still loading NextAuth, bail out
            if (status === "loading") {
                setLoading(true);
                return;
            }

            const idToken = await retrieveIdToken()
            if (!idToken) return;

            // once authenticated, look up connectedAccounts.ebay
            if (status === "authenticated" && session?.user.id) {
                try {
                    const account = await retrieveConnectedAccount({
                        idToken,
                        storeType: "ebay"
                    });
                    setConnected(!!account);
                } catch (err) {
                    console.error("Error checking eBay connection:", err);
                    setConnected(false);
                }
            } else {
                setConnected(false);
            }

            setLoading(false);
        };

        checkConnection();
    }, [status, session]);


    const disconnectEbay = () => {
        handleDisconnect(setConnected);
    };

    return (
        <ConnectButton connected={connected} loading={loading} handleConnect={handleConnectEbay} handleDisconnect={disconnectEbay} />
    )
}

export default EbayConnectButton
