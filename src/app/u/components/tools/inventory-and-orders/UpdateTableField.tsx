// Local Imports
import { StoreType } from '@/models/user';
import { firestore } from '@/lib/firebase/config';
import { IEbayInventoryItem, IEbayOrder } from '@/models/store-data';
import { validateAlphaNumericInput, validatePriceInput, validateTextInput } from '@/utils/input-validation';


// External Imports
import React, { useState } from 'react'
import { useSession } from 'next-auth/react';
import { doc, updateDoc } from 'firebase/firestore';
import set from 'lodash/set';
import { updateCacheData } from '@/utils/cache-helpers';
import { formatDateToISO } from '@/utils/format-dates';

type ExtraKey = "customTag"
type PurchaseKey = "purchase.platform" | "purchase.price" | "purchase.date" | "purchase.quantity"
type InventoryKey = "customTag"
type OrderKey = "sale.price"

interface UpdateTableFieldProps {
    type?: "text" | "date";
    currentValue: string | undefined | null;
    docId: string;
    docType: "inventory" | "orders";
    item: IEbayOrder | IEbayInventoryItem;
    keyType: InventoryKey | OrderKey | PurchaseKey | ExtraKey;
    cacheKey: string;
    tdClassName?: string;
    className?: string;
    storeType: StoreType;
    triggerUpdate: () => void;
}

const UpdateTableField: React.FC<UpdateTableFieldProps> = ({ type, currentValue, docId, docType, item, keyType, cacheKey, tdClassName, className, storeType, triggerUpdate }) => {
    const { data: session } = useSession();

    const [value, setValue] = useState(currentValue);

    const saveChange = async () => {
        if (value === "" || value === currentValue) return;

        try {
            const docRef = doc(firestore, docType, session?.user.id as string, storeType, docId);

            switch (keyType) {
                case "purchase.platform":
                case "customTag":
                    set(item, keyType, value);
                    break;
                case "purchase.price":
                    setValue(Number(value).toFixed(2))
                    set(item, keyType, Number(value));
                    break;
                case "purchase.date":
                    set(item, keyType, formatDateToISO(new Date(value ?? "")));
                    break;
            }

            // Update the database
            await updateDoc(docRef, item as { [x: string]: any; });

            // Update the users local cache
            updateCacheData(cacheKey, item);

            // Trigger an update
            triggerUpdate()
        } catch (error) {

        }
    };

    function handleChange(input: string) {
        switch (keyType) {
            case "purchase.platform":
            case "customTag":
                validateAlphaNumericInput(input, setValue);
                break;
            case "purchase.price":
                validatePriceInput(input, setValue);
                break;
            case "purchase.date":
                setValue(input);
                break;
        }
    }

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