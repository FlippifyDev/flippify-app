"use client";

// Local Imports
import Input from '../../dom/ui/Input';
import MarketItemSold from './MarketItemSold';
import NoResultsFound from '../../dom/ui/NoResultsFound';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import MarketItemListed from './MarketItemListed';
import { fetchFunctions } from '@/services/market-compare/utils';
import { validateSafeInput } from '@/utils/input-validation';
import { retrieveConnectedAccounts } from '@/services/firebase/retrieve';
import { IMarketListedItem, IMarketSoldItem } from '@/models/market-compare';

// External Imports
import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react';
import LayoutSubscriptionWrapper from '../../layout/LayoutSubscriptionWrapper';


const Page = () => {
    const { data: session } = useSession();
    const [connectedAccounts, setConnectedAccounts] = useState<string[]>();
    const [listedResults, setListedResults] = useState<Record<string, IMarketListedItem>>({});
    const [soldResults, setSoldResults] = useState<Record<string, IMarketSoldItem>>({});
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState("");

    useEffect(() => {
        async function retrieve() {
            const accounts = await retrieveConnectedAccounts({ uid: session?.user.id as string });
            if (accounts && typeof accounts === "object") {
                setConnectedAccounts(Object.keys(accounts))
            }
        }

        retrieve()
    }, [session?.user.id])

    async function handleCompareMarkets(type: "Listed" | "Sold") {
        if (!query) return;
        if (!connectedAccounts?.length) return;

        setLoading(true);

        const newResults: Record<string, any> = {};

        for (const account of connectedAccounts) {
            const fn = fetchFunctions[`${account}${type}`];
            if (!fn) continue;

            try {
                const result = await fn({ query });
                newResults[account] = result.item;
            } catch (err) {
                console.error(`Error running fetch function for ${account}:`, err);
                newResults[account] = { error: "Failed to fetch" };
            }
        }

        if (type === "Listed") {
            setListedResults(newResults)
        } else {
            setSoldResults(newResults);
        }
        setLoading(false);
    }

    function handleInput(value: string) {
        validateSafeInput(value, setQuery)
    }

    async function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter') {
            e.preventDefault();
            await handleRun()
        }
    }

    async function handleRun() {
        try {
            await handleCompareMarkets("Listed");
        } catch (error) {
            console.error(error)
        }
        try {
            await handleCompareMarkets("Sold");
        } catch (error) {
            console.error(error)
        }
    }
    const hasValidListedResults = Object.values(listedResults).some((v) => v !== undefined && v !== null);
    const hasValidSoldResults = Object.values(soldResults).some((v) => v !== undefined && v !== null);

    return (
        <LayoutSubscriptionWrapper anySubscriptions={["admin", "standard", "pro", "enterprise"]}>
            <div>
                <section className='relative flex justify-between'>
                    <div className="absolute -top-2 right-2 bg-houseBlue text-white text-xs font-semibold px-2 py-1 rounded-full shadow-sm z-10">
                        Beta
                    </div>
                    <div className="relative w-full max-w-md flex items-center bg-white rounded-t-lg px-4 pt-2 pb-4">
                        <Input
                            type="text"
                            placeholder="Enter keyword, sku, query"
                            value={query}
                            onChange={(e) => handleInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="w-full pr-24"
                        />
                        <button
                            type="button"
                            onClick={handleRun}
                            className="absolute right-5 top-5 text-sm w-20 bg-houseBlue hover:bg-houseHoverBlue transition duration-100 text-white px-3 rounded-lg h-10 flex items-center justify-center"
                        >
                            {loading ? <LoadingSpinner /> : "Submit"}
                        </button>
                    </div>
                    <div className='hidden lg:display lg:flex items-center'>
                        <p className='text-xs font-[550] text-gray-500'>Compare listed & sold items across connected marketplaces like eBay & StockX</p>
                    </div>
                </section>

                <section className="bg-white rounded-b-lg xs:rounded-tr-lg shadow-md">
                    {loading ? (
                        <div className='w-full py-6 flex justify-center items-center'>
                            <LoadingSpinner />
                        </div>
                    ) : (
                        <>
                            {(!hasValidListedResults && !hasValidSoldResults) ? (
                                <div className='w-full flex justify-center py-16'>
                                    <NoResultsFound />
                                </div>
                            ) : (
                                <>
                                    {hasValidListedResults &&
                                        (<div className='pt-4'>
                                            <h1 className='px-4 text-sm font-semibold text-gray-500'>Listed</h1>
                                            {Object.entries(listedResults).map(([platform, result]) => (
                                                <MarketItemListed key={platform} platform={platform} item={result} currency={session?.user.preferences?.currency ?? "USD"} />
                                            ))}
                                        </div>)
                                    }
                                    {hasValidSoldResults && (
                                        <div className='pt-4'>
                                            <h1 className='px-4 text-sm font-semibold text-gray-500'>Sold</h1>
                                            {Object.entries(soldResults).map(([platform, result]) => (
                                                <MarketItemSold key={platform} platform={platform} item={result} currency={session?.user.preferences?.currency ?? "USD"} />
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </>
                    )}
                </section>
            </div>
        </LayoutSubscriptionWrapper>
    )
}


export default Page
