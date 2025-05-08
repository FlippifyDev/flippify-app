// Local Imports
import { firestore } from '@/lib/firebase/config';
import { formatDateToISO } from '@/utils/format-dates';
import { updateCacheData } from '@/utils/cache-helpers';
import { IListing, IOrder, StoreType } from '@/models/store-data';
import { validateAlphaNumericInput, validateIntegerInput, validatePriceInput } from '@/utils/input-validation';


// External Imports
import { deleteDoc, doc, DocumentReference, setDoc, updateDoc } from 'firebase/firestore';
import React, { useState } from 'react'
import { useSession } from 'next-auth/react';
import set from 'lodash/set';
import { updateMovedItemAdmin } from '@/services/firebase/create-admin';


type ExtraKey = "customTag" | "storeType"
type PurchaseKey = "purchase.platform" | "purchase.price" | "purchase.date" | "purchase.quantity"
type InventoryKey = "customTag"
type OrderKey = "sale.price" | "shipping.fees" | "sale.date" | "additionalFees" | "sale.quantity"


interface UpdateTableFieldProps {
    type?: "text" | "date";
    currentValue: string | undefined | null;
    docId?: string | null;
    docType: "inventory" | "orders";
    item: IOrder | IListing;
    keyType: InventoryKey | OrderKey | PurchaseKey | ExtraKey;
    cacheKey: string;
    tdClassName?: string;
    className?: string;
    storeType?: StoreType | null;
    triggerUpdate: () => void;
}

const UpdateTableField: React.FC<UpdateTableFieldProps> = ({ type, currentValue, docId, docType, item, keyType, cacheKey, tdClassName, className, storeType, triggerUpdate }) => {
    const { data: session } = useSession();

    const [value, setValue] = useState(currentValue);

    const handleNewStoreType = async (item: IOrder | IListing, value: string | null | undefined) => {
        const oldStoreType = item.storeType;
        
        // Step 1: Add the item to the storeType collection
        set(item, keyType, value);

        if (!session?.user.id || !item.storeType || !docId) {
            return;
        };

        await updateMovedItemAdmin(session.user.id, oldStoreType ?? "ebay", item);
        console.log(item)

        updateCacheData(cacheKey, item);
    }

    const saveChange = async () => {
        if (value === currentValue || !docId) return;

        try {
            const docRef = doc(firestore, docType, session?.user.id as string, storeType ?? "ebay", docId);

            switch (keyType) {
                case "purchase.platform":
                case "customTag":
                    set(item, keyType, value);
                    break;
                case "sale.quantity":
                    setValue(Number(value).toFixed(0))
                    set(item, keyType, Number(value));
                    break;
                case "additionalFees":
                case "purchase.price":
                case "shipping.fees":
                    setValue(Number(value).toFixed(2))
                    set(item, keyType, Number(value));
                    break;
                case "purchase.date":
                case "sale.date":
                    set(item, keyType, formatDateToISO(new Date(value ?? "")));
                    break;
                case "storeType":
                    await handleNewStoreType(item, value)
                    return;
            }

            // Update the database
            await updateDoc(docRef, item as { [x: string]: any; });

            // Update the users local cache
            updateCacheData(cacheKey, item);

            // Trigger an update
            triggerUpdate()
        } catch (error) {
            console.log(error)
        }
    };

    function handleChange(input: string) {
        switch (keyType) {
            case "purchase.platform":
            case "storeType":
            case "customTag":
                validateAlphaNumericInput(input, setValue);
                break;
            case "sale.quantity":
                validateIntegerInput(input, setValue)
                break;
            case "additionalFees":
            case "purchase.price":
            case "shipping.fees":
                validatePriceInput(input, setValue);
                break;
            case "purchase.date":
            case "sale.date":
                setValue(input);
                break;
        }
    }

    if (!docId) return null;

    return (
        <td
            className={`${tdClassName} cursor-pointer transition duration-200`}
        >
            <input
                type={type ? type : "text"}
                value={value ?? ""}
                placeholder={value === "" ? "N/A" : undefined}
                onChange={(e) => handleChange(e.target.value)}
                onBlur={() => saveChange()}
                className={`min-w-24 focus:border placeholder:font-semibold text-black hover:cursor-pointer hover:select-none w-full focus:outline-none focus:ring-2 focus:ring-gray-500 rounded border-none text-sm ${className}`}
            />
        </td>
    )
}

export default UpdateTableField