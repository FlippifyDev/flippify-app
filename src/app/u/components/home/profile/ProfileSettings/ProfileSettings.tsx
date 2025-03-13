'use client';

// Local Imports
import UnderlineInput from '@/app/components/UnderlineInput';
import UnderlineSelect from '@/app/components/UnderlineSelect';
import { CurrencyType } from '@/models/user';
import { updateUserPreferences } from '@/services/firebase/update';

// External Imports
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

const ProfileSettings = () => {
    const { data: session } = useSession();
    const [email, setEmail] = useState('');
    const [originalEmail, setOriginalEmail] = useState('');
    const [currency, setCurrency] = useState<CurrencyType>(session?.user.preferences.currency ?? "USD");
    const [originalCurrency, setOriginalCurrency] = useState<CurrencyType>('GBP');
    const [feedback, setFeedback] = useState('');
    const [isChanged, setIsChanged] = useState(false);

    useEffect(() => {
        const loadUserData = async () => {
            if (session && session.user) {
                try {
                    if (session.user.preferences.preferredEmail) {
                        setEmail(session.user.preferences.preferredEmail);
                        setOriginalEmail(session.user.preferences.preferredEmail);
                    } else {
                        setEmail(session.user.email || '');
                        setOriginalEmail(session.user.email || '');
                    }

                    const userCurrency = session.user?.preferences.currency || "USD";
                    setCurrency(userCurrency);
                    setOriginalCurrency(userCurrency);

                } catch (error) {
                    console.error('Error loading user data:', error);
                    setEmail(session.user.email || '');
                    setOriginalEmail(session.user.email || '');
                    setCurrency(session?.user.preferences.currency || 'USD');
                    setOriginalCurrency(session?.user.preferences.currency || 'USD');
                }
            }
        };

        loadUserData();
    }, [session]);

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        setIsChanged(e.target.value !== originalEmail || currency !== originalCurrency);
    };

    const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newCurrency = e.target.value as CurrencyType;
        setCurrency(newCurrency);
        setIsChanged(newCurrency !== originalCurrency || email !== originalEmail);
    };

    const handleSaveChanges = async () => {
        if (!session || !session.user) {
            setFeedback('You must be logged in to update your settings.');
            return;
        }

        const customerId = session.user.stripeCustomerId as string;

        if (!customerId) {
            throw new Error('Customer ID is missing');
        }

        try {
            // Update user preferences
            await updateUserPreferences(customerId, email, currency);

            setFeedback('Settings updated successfully.');
            setOriginalEmail(email);
            setOriginalCurrency(currency);
            setIsChanged(false);

            // Refresh the page after successful save
            window.location.reload();
        } catch (error) {
            console.error('Error updating settings:', error);
            setFeedback('Failed to update settings.');
        }
    };

    const currencyOptions = [
        { value: 'GBP', label: 'GBP (£)' },
        { value: 'USD', label: 'USD ($)' },
        { value: 'EUR', label: 'EUR (€)' },
    ];

    return (
        <div className="card bg-white rounded-xl h-full flex flex-col">
            <h2 className="card-title text-black text-lg font-semibold border-b py-4 px-6">Profile Settings</h2>
            <div className="flex flex-col p-6 gap-4">
                <div>
                    <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2" htmlFor="email">
                        Contact Email
                    </label>
                    <UnderlineInput type="email" id="email" value={email} onChange={handleEmailChange} />
                </div>
                <div>
                    <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2" htmlFor="currency">
                        Preferred Currency
                    </label>
                    <UnderlineSelect id="currency" value={currency} options={currencyOptions} onChange={handleCurrencyChange} />
                </div>
            </div>

            {feedback && (
                <p className="text-center text-sm font-semibold text-gray-900 p-6">
                    {feedback}
                </p>
            )}
            <button
                type="button"
                onClick={handleSaveChanges}
                disabled={!isChanged}
                className={`m-6 mt-auto inline-block text-white py-2 px-4 rounded-md transition duration-200 ${isChanged ? 'bg-houseBlue hover:bg-houseHoverBlue' : 'bg-gray-300 cursor-not-allowed'}`}
            >
                Save Changes
            </button>
        </div>
    );
};

export default ProfileSettings;
