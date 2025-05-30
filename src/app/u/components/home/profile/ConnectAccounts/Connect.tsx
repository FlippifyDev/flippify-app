"use client"

// Local Imports
import ConnectButton from "./ConnectButton";
import { handleDisconnect } from "@/lib/oauth/disconnect";
import { handleConnectEbay } from "@/lib/oauth/ebay/connect";
import { handleConnectStockX } from "@/lib/oauth/stockx/connect";
import { retrieveConnectedAccount } from "@/services/firebase/retrieve";

// External Imports
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { STORES } from "@/models/store-data";
import Modal from "../../../dom/ui/Modal";
import LoadingSpinner from "@/app/components/LoadingSpinner";

type StoreType = typeof STORES[number];
interface Props {
    store: StoreType;
}
const Connect: React.FC<Props> = ({ store }) => {
    const { data: session, status } = useSession();
    const [connected, setConnected] = useState(false);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(false);

    const connectHandlers: Record<StoreType, {
        connect: (setConnected: (val: boolean) => void) => void;
    }> = {
        ebay: {
            connect: handleConnectEbay,
        },
        stockx: {
            connect: handleConnectStockX,
        },
    };


    const { connect } = connectHandlers[store];


    useEffect(() => {
        // whenever session/status change, re-check
        const checkConnection = async () => {
            // if still loading NextAuth, bail out
            if (status === "loading") {
                setLoading(true);
                return;
            }

            // once authenticated, look up connectedAccounts.[store]
            if (status === "authenticated" && session?.user.id) {
                try {
                    const account = await retrieveConnectedAccount({
                        uid: session.user.id as string,
                        storeType: store
                    });
                    setConnected(!!account);
                } catch (err) {
                    console.error(`Error checking ${store} connection:`, err);
                    setConnected(false);
                }
            } else {
                setConnected(false);
            }

            setLoading(false);
        };

        checkConnection();
    }, [status, session, store]);

    function handleDisconnectClick() {
        setModal(true)
    }

    async function confirmDisconnect() {
        setLoading(true);
        await handleDisconnect(store, setConnected)
        setLoading(false);
        setModal(false);
    }

    return (
        <>
            <ConnectButton
                connected={connected}
                loading={loading && !modal}
                handleConnect={() => connect(setConnected)}
                handleDisconnect={() => handleDisconnectClick()}
            />
            {modal && (
                <Modal title="Disconnect Account" setDisplayModal={setModal}>
                    <div className="text-sm space-y-4 mb-4">
                        <p>Are you sure you wish to disconnect your account?</p>
                        <p>Your current items collected will not be deleted.</p>
                    </div>
                    <div className="flex justify-end text-sm">
                        <button type="button" onClick={() => confirmDisconnect()} className='w-36 flex justify-center items-center rounded-lg bg-red-600 hover:bg-red-500 py-2 px-3 text-white transition duration-100'>
                            {loading ? (
                                <LoadingSpinner />
                            ) : (
                                "Confirm"
                            )}
                        </button>
                    </div>

                </Modal>
            )}
        </>
    )
}

export default Connect
