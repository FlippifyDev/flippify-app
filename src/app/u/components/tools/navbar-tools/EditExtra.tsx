"use client"


// Local Imports
import Modal from "../../dom/ui/Modal"
import Input from "../../dom/ui/Input"
import { updateItem } from "@/services/firebase/update"
import { updateCacheData } from "@/utils/cache-helpers"
import { IListing, IOrder } from "@/models/store-data"
import { inventoryCol, ordersCol } from "@/services/firebase/constants"
import { inventoryCacheKey, orderCacheKey } from "@/utils/constants"

// External Imports
import { FormEvent, useEffect, useState } from "react"
import { useSession } from "next-auth/react"

type IItem = IListing | IOrder;

interface EditExtraProps {
    fillItem: IItem;
    setDisplayModal: (value: boolean) => void;
    setTriggerUpdate: (value: boolean) => void;
}


const EditExtra: React.FC<EditExtraProps> = ({ fillItem, setDisplayModal, setTriggerUpdate }) => {
    const { data: session } = useSession();
    const uid = session?.user.id as string;

    const collection = "transactionId" in fillItem ? ordersCol : inventoryCol;
    const cache = "transactionId" in fillItem ? orderCacheKey : inventoryCacheKey;
    const cacheKey = `${cache}-${session?.user.id}`;


    // General Info
    const [extra, setExtra] = useState<Record<string, string>>({});

    // Messages
    const [errorMessage, setErrorMessage] = useState<string>("")
    const [successMessage, setSuccessMessage] = useState<string>("")

    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!fillItem) return;

        handleItemClick(fillItem);
    }, [fillItem])

    function handleCacheUpdate(item: IItem) {
        updateCacheData(cacheKey, item);
    }

    function handleItemClick(item: IItem) {
        if (item.extra) {
            setExtra(item.extra);
        }
    }

    const handleExtraChange = (index: number, field: 'key' | 'value', newValue: string) => {
        setExtra((prev) => {
            const newExtra = { ...prev };
            const currentKeys = Object.keys(newExtra);
            const currentKey = currentKeys[index] || `extra${index + 1}`; // Default key if not set

            if (field === 'key') {
                // If key changes, move the value to the new key
                if (currentKeys[index] && newValue && newValue !== currentKey) {
                    const value = newExtra[currentKey];
                    delete newExtra[currentKey];
                    newExtra[newValue] = value || '';
                } else if (newValue) {
                    newExtra[newValue] = newExtra[currentKey] || '';
                } else {
                    delete newExtra[currentKey]; // Remove if key is cleared
                }
            } else {
                // Update value for the current key
                newExtra[currentKey] = newValue;
            }

            return newExtra;
        });
    };

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setErrorMessage("");
        setLoading(true);

        const item: IItem = {
            ...fillItem,
            extra: Object.keys(extra).length > 0 ? extra : undefined,
        };

        try {
            await updateItem({ uid, item: item, rootCol: collection, subCol: item.storeType as string, cacheKey });
            setSuccessMessage("Item Edited!");
            handleCacheUpdate(item);
        } catch (error) {
            setErrorMessage("Error editing item");
        }

        setTriggerUpdate(true);
        setLoading(false);
        setDisplayModal(false);
    }


    const extraInputs = Array.from({ length: 5 }, (_, index) => {
        const currentKeys = Object.keys(extra);
        const key = currentKeys[index] || '';
        const value = extra[key] || '';

        return (
            <div key={index} className="flex gap-2">
                <Input
                    type="text"
                    placeholder={`Enter key`}
                    value={key}
                    onChange={(e) => handleExtraChange(index, 'key', e.target.value)}
                    className="w-1/2"
                />
                <Input
                    type="text"
                    placeholder={`Enter value`}
                    value={value}
                    onChange={(e) => handleExtraChange(index, 'value', e.target.value)}
                    className="w-1/2"
                />
            </div>
        );
    });

    return (
        <Modal title="Extra Info" className="max-w-[21rem] sm:max-w-xl flex-grow" setDisplayModal={setDisplayModal}>
            <form onSubmit={handleSubmit} className="w-full max-w-xl flex flex-col gap-4">
                {errorMessage && (
                    <div>
                        <p className="text-red-500 text-sm">{errorMessage}</p>
                    </div>
                )}
                {successMessage && (
                    <div>
                        <p className="text-green-500 text-sm">{successMessage}</p>
                    </div>
                )}
                {extraInputs}
                <button
                    type="submit"
                    disabled={loading}
                    className={`btn border-0 bg-houseBlue bg-opacity-10 text-houseBlue hover:bg-houseHoverBlue hover:text-white transition duration-300 text-opacity-100 w-2/3 mx-auto rounded-lg shadow-lg ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {loading ? 'Saving...' : 'Save Changes'}
                </button>
            </form>
        </Modal>
    )
}

export default EditExtra;
