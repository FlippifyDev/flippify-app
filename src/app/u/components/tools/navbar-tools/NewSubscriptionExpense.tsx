"use client";

// Local Imports
import Input from '../../dom/ui/Input';
import Modal from '../../dom/ui/Modal';
import Dropdown from '../../dom/ui/Dropdown';
import { createItem } from '@/services/firebase/admin-create';
import { addCacheData } from '@/utils/cache-helpers';
import { formatDateToISO } from '@/utils/format-dates';
import { currencySymbols } from '@/config/currency-config';
import { retrieveIdToken } from '@/services/firebase/retrieve';
import { fetchUserExpensesCount } from '@/utils/extract-user-data';
import { expensesCol, subscriptionsExpenseCol } from '@/services/firebase/constants';
import { BillingCycle, ISubscriptionExpense, Renewal } from '@/models/expenses';
import { generateRandomFlippifySubscriptionExpenseId } from '@/utils/generate-random';
import { validatePriceInput, validateSafeInput } from '@/utils/input-validation';
import { billingCycleOptions, monthlyRenewalOptions, subscriptionLimits, subscriptionsExpensesCacheKey, weeklyRenewalOptions } from '@/utils/constants';

// External Imports
import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react';
import Button from '../../dom/ui/Button';


interface NewSubscriptionExpenseProps {
    setDisplayModal: (value: boolean) => void;
}


const NewSubscriptionExpense: React.FC<NewSubscriptionExpenseProps> = ({ setDisplayModal }) => {
    const { data: session, update: updateSession } = useSession();
    const currency = session?.user.preferences?.currency ?? "USD";

    // Expense General
    const [name, setName] = useState("");
    const [amount, setAmount] = useState("");
    const [provider, setProvider] = useState("");

    // Subscription Specific
    const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
    const [renewalDate, setRenewalDate] = useState<Renewal>(new Date().getDate().toString());
    const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
    const [endDate, setEndDate] = useState("");

    // Messages
    const [errorMessage, setErrorMessage] = useState<string>("")
    const [successMessage, setSuccessMessage] = useState<string>("")

    const [loading, setLoading] = useState<boolean>(false);
    const [aboveLimit, setAboveLimit] = useState<boolean>(false);

    const [renewalOptions, setRenewalOptions] = useState<any>(monthlyRenewalOptions);

    useEffect(() => {
        const checkLimit = () => {
            const plan = session?.user.authentication?.subscribed;
            if (!plan) {
                setErrorMessage("Please subscribe to a plan to add a one time expense.");
                setAboveLimit(true);
                return;
            }
            const count = fetchUserExpensesCount(session.user);
            if ((plan === "free" || plan === "standard") && count.subscriptions >= subscriptionLimits[plan].subscriptionExpenses) {
                setErrorMessage(`You have reached the maximum number of subscriptions for your plan. Please upgrade your plan to add more.`);
                setAboveLimit(true);
                return;
            }

            setAboveLimit(false);
        };

        if (session?.user) checkLimit();
    }, [session?.user]);


    async function handleCacheAndSessionUpdate(item: ISubscriptionExpense) {
        const cacheKey = `${subscriptionsExpensesCacheKey}-${session?.user.id}`;

        addCacheData(cacheKey, { [item.id as string]: item });

        const currentStore = session!.user.store || {};
        const currentNumSubscriptions = currentStore.numExpenses?.subscriptions ?? 0;

        await updateSession({
            ...session!,
            user: {
                ...session!.user,
                store: {
                    ...currentStore,
                    'numExpenses.subscriptions': currentNumSubscriptions + 1,
                },
            },
        });
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setErrorMessage("");
        setLoading(true);
        if (aboveLimit) return;

        const finalEndDate = endDate ? formatDateToISO(new Date(endDate)) : "indefinite";

        const item: ISubscriptionExpense = {
            id: generateRandomFlippifySubscriptionExpenseId(20),
            name,
            active: true,
            amount: Number(amount),
            provider,
            currency,
            createdAt: formatDateToISO(new Date()),
            type: "subscription",
            billingCycle,
            renewalDate,
            startDate: formatDateToISO(new Date(startDate), true),
            endDate: finalEndDate
        }

        const idToken = await retrieveIdToken();
        if (!idToken) return;

        const { success, error } = await createItem({ idToken, item, rootCol: expensesCol, subCol: subscriptionsExpenseCol })
        if (!success) {
            console.error("Error creating new subscription expense item", error)
            setErrorMessage(error);
        } else {
            await handleCacheAndSessionUpdate(item);
            setSuccessMessage("Subscription Added!")
        }

        setLoading(false);
    }

    function handleChange(value: string, type: string, setFunction: (value: any) => void) {
        switch (type) {
            case "amount":
                validatePriceInput(value, setFunction);
                break;
            case "name":
            case "provider":
                validateSafeInput(value, setFunction);
                break;
            case "startDate":
            case "endDate":
            case "renewalDate":
            case "billingCycle":
                setFunction(value);
                break;
            default:
                break;
        }
    }

    function handleBillingChange(value: string) {
        handleChange(value, "billingCycle", setBillingCycle);
        if (value === "daily") {
            setRenewalDate("daily");
            setRenewalOptions(undefined)
        } else if (value === "weekly") {
            setRenewalDate(weeklyRenewalOptions[new Date().getDay() - 1].value)
            setRenewalOptions(weeklyRenewalOptions)
        } else if (value === "monthly") {
            setRenewalDate(new Date().getDate().toString())
            setRenewalOptions(monthlyRenewalOptions)
        } else if (value === "yearly") {
            setRenewalDate(new Date().toISOString().split("T")[0])
            setRenewalOptions(null)
        }
    }

    function handleRenewalChange(value: string) {
        handleChange(value, "renewalDate", setRenewalDate);
    }

    return (
        <Modal title="Add new subscription expense" className="max-w-[21rem] sm:max-w-xl flex-grow" setDisplayModal={setDisplayModal}>
            {aboveLimit && (
                <div className="text-center">
                    <span>Sorry you&apos;ve reach your max subscription expenses.</span>
                </div>
            )}
            {!aboveLimit && (
                <form className="w-full max-w-xl flex flex-col gap-4" onSubmit={handleSubmit}>
                    <div className='relative flex flex-col sm:flex-row items-center w-full gap-4'>
                        <Input type="text" placeholder='Enter provider' title="Provider" value={provider} onChange={(e) => handleChange(e.target.value, "provider", setProvider)} />
                        <Input type="text" placeholder="Enter name" title="Name" value={name} onChange={(e) => handleChange(e.target.value, "name", setName)} />
                    </div>
                    <div className="flex flex-col sm:flex-row items-center w-full gap-4">
                        <Input type="text" placeholder="Enter amount" title={`Amount (${currencySymbols[currency]})`} value={amount} onChange={(e) => handleChange(e.target.value, "amount", setAmount)} />
                    </div>
                    <div className="flex flex-col sm:flex-row items-center w-full gap-4">
                        <div className='flex flex-col gap-2 w-full'>
                            <span className='text-gray-700'>Frequency</span>
                            <Dropdown value={billingCycle} options={billingCycleOptions} onChange={handleBillingChange} buttonClassName="w-full" />
                        </div>
                        {renewalOptions && (
                            <div className='flex flex-col gap-2 w-full'>
                                <span className='text-gray-700'>Renews</span>
                                <Dropdown value={renewalDate} options={renewalOptions} onChange={handleRenewalChange} buttonClassName="w-full" />
                            </div>
                        )}
                        {renewalOptions === null && (
                            <Input type="date" placeholder="Enter renewal date" title="Renewal Date" value={renewalDate} onChange={(e) => handleChange(e.target.value, "renewalDate", setRenewalDate)} />
                        )}
                    </div>
                    <div className="flex flex-col sm:flex-row items-center w-full gap-4">
                        <Input type="date" placeholder="Enter start date" title="Start date" value={startDate} onChange={(e) => handleChange(e.target.value, "startDate", setStartDate)} />
                        <Input type="date" placeholder="Enter end date" title="End date" value={endDate} onChange={(e) => handleChange(e.target.value, "endDate", setEndDate)} />
                    </div>

                    <hr />
                    <div className="w-full flex flex-row gap-4 justify-end items-center">
                        <Button
                            type="submit"
                            text={successMessage ? successMessage : loading ? "Adding..." : "Add Expense"}
                            disabled={loading || !provider || !name || !amount}
                        />
                    </div>
                    <hr />
                    {errorMessage && (
                        <div>
                            <p className="text-red-500 text-sm">{errorMessage}</p>
                        </div>
                    )}
                </form>
            )}
        </Modal>
    )
}

export default NewSubscriptionExpense
