// Local Imports
import { firestore } from '@/lib/firebase/config';
import { StoreType } from '@/models/store-data';
import { validateNumberInput } from '@/utils/input-validation';


// External Imports
import { doc, updateDoc } from 'firebase/firestore';
import React, { useState } from 'react'
import { useSession } from 'next-auth/react';
import set from 'lodash/set';
import { IUser } from '@/models/user';
import Input from '../../dom/ui/Input';


type Investment = "profitPercentTakeHome" | "profitAmountTakeHome";


interface UpdatePreferencesFieldProps {
    type?: "text";
    currentValue: string | undefined | null;
    title?: string;
    placeholder?: string;
    item: IUser;
    keyType: Investment;
    containerClassName?: string;
    className?: string;
    tooltip?: string;
}

const UpdatePreferencesField: React.FC<UpdatePreferencesFieldProps> = ({ type, currentValue, title, placeholder, item, keyType, containerClassName, className, tooltip }) => {
    const { data: session } = useSession();

    const [value, setValue] = useState(currentValue);


    const saveChange = async () => {
        if (value === currentValue) return;

        try {
            const docRef = doc(firestore, "users", session?.user.id as string);

            switch (keyType) {
                case "profitAmountTakeHome":
                case "profitPercentTakeHome":
                    set(item, `preferences.investment.${keyType}`, Number(value));
                    break;
            }

            // Update the database
            await updateDoc(docRef, item as { [x: string]: any; });
        } catch (error) {
            console.log(error)
        }
    };

    function handleChange(input: string) {
        switch (keyType) {
            case "profitAmountTakeHome":
            case "profitPercentTakeHome":
                validateNumberInput(input, setValue)
                break
        }
    }


    return (
        <div
            className={`${containerClassName} col-span-1 cursor-pointer transition duration-200 relative group`}
        >
            <Input
                type={type ? type : "text"}
                value={value ?? ""}
                title={title}
                placeholder={placeholder}
                onChange={(e) => handleChange(e.target.value)}
                onBlur={() => saveChange()}
                className={`${className}`}
            />
            {tooltip && (
                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-gray-800 text-white text-xs font-medium py-1 px-2 rounded shadow-lg whitespace-nowrap z-10">
                    {tooltip}
                </span>
            )}
        </div>
    )
}

export default UpdatePreferencesField;