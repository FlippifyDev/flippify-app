// Local Imports
import { firestore } from '@/lib/firebase/config';
import { formatDateToISO } from '@/utils/format-dates';
import { updateCacheData } from '@/utils/cache-helpers';
import { updateMovedItemAdmin } from '@/services/firebase/create-admin';
import { IListing, IOrder, StoreType } from '@/models/store-data';
import { validateAlphaNumericInput, validateIntegerInput, validatePriceInput } from '@/utils/input-validation';


// External Imports
import React, { useState } from 'react'
import { doc, updateDoc } from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import set from 'lodash/set';


type ExtraKey = "customTag" | "storeType" | "listingDate"
type PurchaseKey = "purchase.platform" | "purchase.price" | "purchase.date" | "purchase.quantity"
type InventoryKey = "customTag"
type OrderKey = "sale.price" | "shipping.fees" | "shipping.date" | "sale.date" | "additionalFees" | "sale.quantity" | "sale.buyerUsername"


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
    tooltip?: string;
    triggerUpdate: () => void;
}

const UpdateTableField: React.FC<UpdateTableFieldProps> = ({ type, currentValue, docId, docType, item, keyType, cacheKey, tdClassName, className, storeType, tooltip, triggerUpdate }) => {
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

        updateCacheData(cacheKey, item);
    }

    const saveChange = async () => {
        if (value === currentValue || !docId) return;

        try {
            const docRef = doc(firestore, docType, session?.user.id as string, storeType ?? "ebay", docId);

            switch (keyType) {
                case "purchase.platform":
                case "sale.buyerUsername":
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
                case "shipping.date":
                case "listingDate":
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
            case "sale.buyerUsername":
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
            case "shipping.date":
            case "listingDate":
                setValue(input);
                break;
        }
    }

    if (!docId) return null;

    return (
        <td
            className={`${tdClassName} cursor-pointer transition duration-200 relative group`}
        >
            <input
                type={type ? type : "text"}
                value={value ?? ""}
                placeholder={value === "" ? "N/A" : undefined}
                onChange={(e) => handleChange(e.target.value)}
                onBlur={() => saveChange()}
                className={`min-w-24 focus:border placeholder:font-semibold text-black hover:cursor-pointer hover:select-none w-full focus:outline-none focus:ring-2 focus:ring-gray-500 rounded border-none text-sm ${className}`}
            />
            {tooltip && (
                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-gray-800 text-white text-xs font-medium py-1 px-2 rounded shadow-lg whitespace-nowrap z-10">
                    {tooltip}
                </span>
            )}
        </td>
    )
}

export default UpdateTableField