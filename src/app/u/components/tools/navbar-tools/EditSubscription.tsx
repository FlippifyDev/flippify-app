"use client"

// Local Imports
import Modal from '../../dom/ui/Modal'
import { BllingCycle, ISubscriptionExpense, Renewal } from '@/models/expenses';

// External Imports
import { useSession } from 'next-auth/react';
import Input from '../../dom/ui/Input';
import { FormEvent, useEffect, useState } from 'react';
import { validateAlphaNumericInput, validateIntegerInput, validateNumberInput, validatePriceInput } from '@/utils/input-validation';


interface EditSubscriptionProps {
    fillItem: ISubscriptionExpense;
    setDisplayModal: (value: boolean) => void;
}

const EditSubscription: React.FC<EditSubscriptionProps> = ({ fillItem, setDisplayModal }) => {
    const { data: session } = useSession();

    const [active, setActive] = useState<boolean>();
    const [name, setName] = useState<string>();
    const [amount, setAmount] = useState<string>();
    const [billingCycle, setBillingCycle] = useState<BllingCycle>();
    const [endDate, setEndDate] = useState<string>();
    const [provider, setProvider] = useState<string>();
    const [renewalDate, setRenewalDate] = useState<Renewal>();
    const [startDate, setStartDate] = useState<string>();

    // Messages
    const [errorMessage, setErrorMessage] = useState<string>("")
    const [successMessage, setSuccessMessage] = useState<string>("")

    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!fillItem) return;

        handleItemClick(fillItem);
    }, [fillItem])

    function handleItemClick(item: ISubscriptionExpense) {
        setActive(item.active ?? undefined);
        setName(item.name ?? undefined);
        setAmount(item.amount?.toFixed(2) ?? undefined);
        setBillingCycle(item.billingCycle ?? undefined);
        setEndDate(item.endDate ?? undefined);
        setProvider(item.provider ?? undefined);
        setRenewalDate(item.renewalDate ?? undefined);
        setStartDate(item.startDate ?? undefined);
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setErrorMessage("")
        setLoading(true);

        const item: ISubscriptionExpense = {
            active,
            amount: Number(amount),
            billingCycle,
            createdAt: fillItem.createdAt,
            currency: fillItem.currency,
            endDate,
            id: fillItem.id,
            name,
            provider,
            renewalDate,
            startDate,
            type: fillItem.type
        }

        try {
            // Handle Updates
            setSuccessMessage("Listing Edited!");
        } catch (error) {
            setErrorMessage("Error editing item")
        }

        setLoading(false);
    }

    function handleChange(value: string, type: string, setFunction: (value: any) => void) {
        switch (type) {
            case "name":
            case "provider":
                validateAlphaNumericInput(value, setFunction)
                break
            case "startDate":
            case "endDate":
                setStartDate(value);
                break
            case "amount": 
                validatePriceInput(value, setFunction);
                break
            case "status":
            case "billingCycle":
            case "renewalDate":
                break
        }
    }

  
    return (
        <Modal title="Edit Subscription" className="max-w-[21rem] sm:max-w-xl flex-grow" setDisplayModal={setDisplayModal}>
            <form className="w-full max-w-xl flex flex-col gap-4" onSubmit={handleSubmit}>
                <div className="flex flex-col sm:flex-row items-center w-full gap-4">
                    <Input type="text" placeholder="Enter name" title="Name" value={name ?? ""} onChange={(e) => handleChange(e.target.value, "name", setName)} />
                    <Input type="text" placeholder="Enter provider" title="Provider" value={provider ?? ""} onChange={(e) => handleChange(e.target.value, "provider", setProvider)} />
                </div>
                <div className="flex flex-col sm:flex-row items-center w-full gap-4">
                    <Input type="text" placeholder="Enter status" title="Status" value={active ? "Active": "InActive"} onChange={(e) => handleChange(e.target.value, "active", setActive)} />
                    <Input type="text" placeholder="Enter amount" title="Amount" value={amount ?? ""} onChange={(e) => handleChange(e.target.value, "amount", setAmount)} />
                </div>
                <div className="flex flex-col sm:flex-row items-center w-full gap-4">
                    <Input type="date" placeholder="Enter start date" title="Start Date" value={startDate ?? ""} onChange={(e) => handleChange(e.target.value, "startDate", setStartDate)} />
                    <Input type="date" placeholder="Enter end date" title="End Date" value={endDate ?? ""} onChange={(e) => handleChange(e.target.value, "endDate", setEndDate)} />
                </div>
                <div className="flex flex-col sm:flex-row items-center w-full gap-4">
                    <Input type="text" placeholder="Enter frequency" title="Frequency" value={billingCycle ?? "Monthly"} onChange={(e) => handleChange(e.target.value, "billingCycle", setBillingCycle)} />
                    <Input type="text" placeholder="Enter renewal date" title="Renewal Date" value={renewalDate ?? ""} onChange={(e) => handleChange(e.target.value, "renewalDate", setRenewalDate)} />
                </div>
                <hr />
                <div className="w-full flex flex-row gap-4 justify-between items-center">
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
