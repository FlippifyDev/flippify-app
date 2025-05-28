"use client"

// Local Imports
import Modal from '../../dom/ui/Modal'
import { BillingCycle, ISubscriptionExpense, Renewal } from '@/models/expenses';

// External Imports
import { useSession } from 'next-auth/react';
import Input from '../../dom/ui/Input';
import { FormEvent, useEffect, useState } from 'react';
import { validateAlphaNumericInput, validatePriceInput } from '@/utils/input-validation';
import Dropdown from '../../dom/ui/Dropdown';
import { billingCycleOptions, monthlyRenewalOptions, oneTimeExpensesCacheKey, subscriptionsExpensesCacheKey, weeklyRenewalOptions } from '@/utils/constants';
import { formatDateToISO } from '@/utils/format-dates';
import { updateItem } from '@/services/firebase/update';
import { expensesCol, oneTimeCol, subscriptionsExpenseCol } from '@/services/firebase/constants';


interface EditSubscriptionProps {
    fillItem: ISubscriptionExpense;
    setDisplayModal: (value: boolean) => void;
    setTriggerUpdate: (value: boolean) => void;
}



const EditSubscription: React.FC<EditSubscriptionProps> = ({ fillItem, setDisplayModal, setTriggerUpdate }) => {
    const { data: session } = useSession();
    const uid = session?.user.id as string;
    const cacheKey = `${subscriptionsExpensesCacheKey}-${session?.user.id}`;

    // Expense General
    const [name, setName] = useState("");
    const [amount, setAmount] = useState("");
    const [active, setActive] = useState<boolean>();
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


    const [renewalOptions, setRenewalOptions] = useState<any>(monthlyRenewalOptions);


    useEffect(() => {
        if (!fillItem) return;

        function handleItemClick(item: ISubscriptionExpense) {
            setActive(item.active ?? undefined);
            setName(item.name as string);
            setAmount(item.amount?.toFixed(2) as string);
            setBillingCycle(item.billingCycle as BillingCycle);
            setEndDate(item.endDate as string);
            setProvider(item.provider as string);
            setStartDate(item.startDate as string);

            setRenewalDate(item.renewalDate as Renewal)

            if (item.billingCycle === "daily") {
                setRenewalDate("daily");
            } else if (item.billingCycle === "weekly") {
                setRenewalOptions(weeklyRenewalOptions)
            } else if (item.billingCycle === "monthly") {
                setRenewalOptions(monthlyRenewalOptions)
            } else if (item.billingCycle === "yearly") {
                setRenewalOptions(null)
            }
        }

        handleItemClick(fillItem);
    }, [fillItem])


    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setErrorMessage("")
        setLoading(true);

        const finalEndDate = endDate ? formatDateToISO(new Date(endDate)) : "indefinite";

        const item: ISubscriptionExpense = {
            id: fillItem.id,
            name,
            active,
            amount: Number(amount),
            provider,
            currency: fillItem.currency,
            createdAt: fillItem.createdAt,
            type: fillItem.type,
            billingCycle,
            renewalDate,
            endDate: finalEndDate,
            startDate: formatDateToISO(new Date(startDate), true),
        }

        try {
            await updateItem({ uid, item, rootCol: expensesCol, subCol: subscriptionsExpenseCol, cacheKey: oneTimeExpensesCacheKey })
            setSuccessMessage("Item Edited!");
        } catch (error) {
            setErrorMessage("Error editing item")
        }

        setDisplayModal(false);
        setTriggerUpdate(true);
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
        <Modal title="Edit Subscription" className="max-w-[21rem] sm:max-w-xl flex-grow" setDisplayModal={setDisplayModal}>
            <form className="w-full max-w-xl flex flex-col gap-4" onSubmit={handleSubmit}>
                <div className="flex flex-col sm:flex-row items-center w-full gap-4">
                    <Input type="text" placeholder="Enter name" title="Name" value={name ?? ""} onChange={(e) => handleChange(e.target.value, "name", setName)} />
                    <Input type="text" placeholder="Enter provider" title="Provider" value={provider ?? ""} onChange={(e) => handleChange(e.target.value, "provider", setProvider)} />
                </div>
                <div className="flex flex-col sm:flex-row items-center w-full gap-4">
                    <Input type="text" placeholder="Enter status" title="Status" value={active ? "Active" : "InActive"} onChange={(e) => handleChange(e.target.value, "active", setActive)} />
                    <Input type="text" placeholder="Enter amount" title="Amount" value={amount ?? ""} onChange={(e) => handleChange(e.target.value, "amount", setAmount)} />
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
                    <Input type="date" placeholder="Enter start date" title="Start Date" value={new Date(startDate).toLocaleDateString("en-CA") ?? ""} onChange={(e) => handleChange(e.target.value, "startDate", setStartDate)} />
                    <Input type="date" placeholder="Enter end date" title="End Date" value={endDate === "indefinite" ? "" : new Date(endDate).toLocaleDateString("en-CA")} onChange={(e) => handleChange(e.target.value, "endDate", setEndDate)} />
                </div>
                <hr />
                <div className="w-full flex flex-row gap-4 justify-end items-center">
                    <div>
                        <button
                            type="submit"
                            disabled={loading || !name || !provider || !startDate || !amount || !billingCycle || !renewalDate}
                            className="disabled:bg-muted disabled:pointer-events-none bg-houseBlue text-white text-sm py-2 px-4 rounded-md hover:bg-houseHoverBlue transition duration-200"
                        >
                            {successMessage ? successMessage : loading ? "Updating..." : "Edit Subscription"}
                        </button>
                    </div>
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

export default EditSubscription
