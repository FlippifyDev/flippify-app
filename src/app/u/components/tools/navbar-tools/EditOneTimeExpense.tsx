"use client"


import { IOneTimeExpense } from '@/models/expenses';
import { addCacheData, updateCacheData } from '@/utils/cache-helpers';
import { oneTimeExpensesCacheKey } from '@/utils/constants';
import { formatDateToISO } from '@/utils/format-dates';
import { validateAlphaNumericInput, validatePriceInput } from '@/utils/input-validation';
import { useSession } from 'next-auth/react';
import React, { FormEvent, useEffect, useState } from 'react'
import Modal from '../../dom/ui/Modal';
import Input from '../../dom/ui/Input';
import { updateItem } from '@/services/firebase/update';
import { expensesCol, oneTimeCol } from '@/services/firebase/constants';



interface EditOneTimeExpenseProps {
    fillItem: IOneTimeExpense;
    setDisplayModal: (value: boolean) => void;
    setTriggerUpdate: (value: boolean) => void;
}

const EditOneTimeExpense: React.FC<EditOneTimeExpenseProps> = ({ fillItem, setDisplayModal, setTriggerUpdate }) => {
    const { data: session } = useSession();
    const uid = session?.user.id as string;

    const [amount, setAmount] = useState("");
    const [name, setName] = useState("");
    const [provider, setProvider] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

    // Messages
    const [errorMessage, setErrorMessage] = useState<string>("")
    const [successMessage, setSuccessMessage] = useState<string>("")

    const [loading, setLoading] = useState<boolean>(false);
    useEffect(() => {
        if (!fillItem) return;

        handleItemClick(fillItem);
    }, [fillItem]);


    function handleItemClick(item: IOneTimeExpense) {
        setAmount(item.amount?.toFixed(2) ?? "");
        setName(item.name ?? "");
        setProvider(item.provider ?? "");
        setDate(new Date(item.date ?? new Date()).toISOString().split("T")[0] ?? "");
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

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setErrorMessage("")
        setLoading(true);

        const item: IOneTimeExpense = {
            amount: Number(amount),
            date: formatDateToISO(new Date(date), true),
            createdAt: formatDateToISO(new Date()),
            currency: fillItem.currency,
            id: fillItem.id,
            name,
            provider,
            type: "one-time"
        }

        try {
            await updateItem({ uid, item, rootCol: expensesCol, subCol: oneTimeCol, cacheKey: oneTimeExpensesCacheKey })
            setSuccessMessage("Item Edited!");
        } catch (error) {
            setErrorMessage("Error editing item")
        }

        setLoading(false);
        setTriggerUpdate(true);
        setDisplayModal(false);
    }

    return (
        <Modal title="Edit one time expense" className="max-w-[21rem] sm:max-w-xl flex-grow" setDisplayModal={setDisplayModal}>
            <form className="w-full max-w-xl flex flex-col gap-4" onSubmit={handleSubmit}>
                <div className='relative flex flex-col sm:flex-row items-center w-full gap-4'>
                    <Input type="text" placeholder='Enter provider' title="Provider" value={provider} onChange={(e) => handleChange(e.target.value, "provider", setProvider)} />
                    <Input type="text" placeholder="Enter name" title="Name" value={name} onChange={(e) => handleChange(e.target.value, "name", setName)} />
                </div>
                <div className="flex flex-col sm:flex-row items-center w-full gap-4">
                    <Input type="text" placeholder="Enter amount" title="Amount" value={amount} onChange={(e) => handleChange(e.target.value, "amount", setAmount)} />
                    <Input type="date" placeholder="Enter date" title="Date" value={date} onChange={(e) => handleChange(e.target.value, "date", setDate)} />
                </div>

                <hr />
                <div className="w-full flex flex-row gap-4 justify-end items-center">
                    <button
                        type="submit"
                        disabled={loading || !provider || !name || !amount || !date}
                        className="disabled:bg-muted disabled:pointer-events-none bg-houseBlue text-white text-sm py-2 px-4 rounded-md hover:bg-houseHoverBlue transition duration-200"
                    >
                        {successMessage ? successMessage : loading ? "Editing..." : "Edit Expense"}
                    </button>
                </div>
                <hr />
                {errorMessage && (
                    <div>
                        <p className="text-red-500 text-sm">{errorMessage}</p>
                    </div>
                )}
            </form>
        </Modal>
    )
}

export default EditOneTimeExpense
