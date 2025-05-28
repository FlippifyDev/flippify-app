"use client"

// Local Imports
import Modal from '../../dom/ui/Modal';
import Input from '../../dom/ui/Input';
import { addCacheData } from '@/utils/cache-helpers';
import { formatDateToISO } from '@/utils/format-dates';
import { currencySymbols } from '@/config/currency-config';
import { IOneTimeExpense } from '@/models/expenses';
import { fetchUserExpensesCount } from '@/utils/extract-user-data';
import { generateRandomFlippifyOneTimeExpenseId } from '@/utils/generate-random';
import { oneTimeExpensesCacheKey, subscriptionLimits } from '@/utils/constants';
import { validateAlphaNumericInput, validatePriceInput } from '@/utils/input-validation';

// External Imports
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { createItem } from '@/services/firebase/admin-create';
import { expensesCol, oneTimeCol } from '@/services/firebase/constants';
import { retrieveIdToken } from '@/services/firebase/retrieve';

interface NewOneTimeExpenseProps {
    setDisplayModal: (value: boolean) => void;
}


const NewOneTimeExpense: React.FC<NewOneTimeExpenseProps> = ({ setDisplayModal }) => {
    const { data: session, update: updateSession } = useSession();
    const currency = session?.user.preferences?.currency ?? "USD";

    const [amount, setAmount] = useState("");
    const [name, setName] = useState("");
    const [provider, setProvider] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

    // Messages
    const [errorMessage, setErrorMessage] = useState<string>("")
    const [successMessage, setSuccessMessage] = useState<string>("")

    const [loading, setLoading] = useState<boolean>(false);
    const [aboveLimit, setAboveLimit] = useState<boolean>(false);


    useEffect(() => {
        const checkLimit = () => {
            const plan = session?.user.authentication?.subscribed;
            if (!plan) {
                setErrorMessage("Please subscribe to a plan to add a one time expense.");
                setAboveLimit(true);
                return;
            }
            const count = fetchUserExpensesCount(session.user);
            if (count.oneTime >= subscriptionLimits[plan].oneTimeExpenses) {
                setErrorMessage(`You have reached the maximum number of one time expenses for your plan. Please upgrade your plan to add more or wait till next month.`);
                setAboveLimit(true);
                return;
            }

            setAboveLimit(false);
        };

        if (session?.user) checkLimit();
    }, [session?.user]);


    async function handleCacheAndSessionUpdate(item: IOneTimeExpense) {
        const cacheKey = `${oneTimeExpensesCacheKey}-${session?.user.id}`;

        addCacheData(cacheKey, { [item.id as string]: item });

        const currentStore = session!.user.store || {};
        const currentNumOneTime = currentStore.numExpenses?.oneTime ?? 0;
        const currentNumTotalOneTime = currentStore.numExpenses?.totalOneTime ?? 0;

        await updateSession({
            ...session!,
            user: {
                ...session!.user,
                store: {
                    ...currentStore,
                    'numExpenses.oneTime': currentNumOneTime + 1,
                    'numExpenses.totalOneTime': currentNumTotalOneTime + 1
                },
            },
        });
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setErrorMessage("");
        setLoading(true);
        if (aboveLimit) return;

        const item: IOneTimeExpense = {
            amount: Number(amount),
            date: formatDateToISO(new Date(date), true),
            createdAt: formatDateToISO(new Date()),
            currency,
            id: generateRandomFlippifyOneTimeExpenseId(20),
            name,
            provider,
            type: "one-time"
        }

        const idToken = await retrieveIdToken();
        if (!idToken) return;

        const { success, error } = await createItem({ idToken, rootCol: expensesCol, subCol: oneTimeCol, item })
        if (!success) {
            console.error("Error creating new one time expense item", error)
            setErrorMessage(error);
        } else {
            await handleCacheAndSessionUpdate(item);
            setSuccessMessage("One time expense Added!")
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
                validateAlphaNumericInput(value, setFunction);
                break;
            case "date":
                setFunction(value);
                break;
            default:
                break;
        }
    }

    return (
        <Modal title="Add new one time expense" className="max-w-[21rem] sm:max-w-xl flex-grow" setDisplayModal={setDisplayModal}>
            {aboveLimit && (
                <div className="text-center">
                    <span>Sorry you&apos;ve reach your max one time expenses for this month.</span>
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
                        <Input type="date" placeholder="Enter date" title="Date" value={date} onChange={(e) => handleChange(e.target.value, "date", setDate)} />
                    </div>

                    <hr />
                    <div className="w-full flex flex-row gap-4 justify-end items-center">
                        <button
                            type="submit"
                            disabled={loading || !provider || !name || !amount || !date}
                            className="disabled:bg-muted disabled:pointer-events-none bg-houseBlue text-white text-sm py-2 px-4 rounded-md hover:bg-houseHoverBlue transition duration-200"
                        >
                            {successMessage ? successMessage : loading ? "Adding..." : "Add Expense"}
                        </button>
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

export default NewOneTimeExpense
