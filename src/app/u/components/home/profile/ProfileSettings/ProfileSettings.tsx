"use client";

import UnderlineInput from '@/app/components/UnderlineInput';
import UnderlineSelect from '@/app/components/UnderlineSelect';
import { updateUserPreferences } from '@/services/firebase/update';
import CurrencySelector from './ProfileCurrencySelector';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

// Update the currency type here to match your dropdown:
type Currency = "GBP" | "USD" | "EUR" | "AUD" | "CAD" | "JPY" | "NZD";

const ProfileSettings = () => {
  const { data: session, update: setSession } = useSession();
  const [email, setEmail] = useState('');
  const [originalEmail, setOriginalEmail] = useState('');
  // Cast the currency from the session to the new Currency union
  const [currency, setCurrency] = useState<Currency>(
    (session?.user.preferences.currency as Currency) ?? "USD"
  );
  const [originalCurrency, setOriginalCurrency] = useState<Currency>(
    (session?.user.preferences.currency as Currency) ?? "USD"
  );
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
          const userCurrency = (session.user.preferences.currency as Currency) || "USD";
          setCurrency(userCurrency);
          setOriginalCurrency(userCurrency);
        } catch (error) {
          console.error('Error loading user data:', error);
          setEmail(session.user.email || '');
          setOriginalEmail(session.user.email || '');
          setCurrency((session?.user.preferences.currency as Currency) || 'USD');
          setOriginalCurrency((session?.user.preferences.currency as Currency) || 'USD');
        }
      }
    };

    loadUserData();
  }, [session]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setIsChanged(e.target.value !== originalEmail || currency !== originalCurrency);
  };

  // Updated handler now accepts a value of type Currency
  const handleCurrencyChange = (newCurrency: Currency) => {
    setCurrency(newCurrency);
    setIsChanged(newCurrency !== originalCurrency || email !== originalEmail);
  };

  const handleSaveChanges = async () => {
    if (!session || !session.user) {
      setFeedback('You must be logged in to update your settings.');
      return;
    }

    try {
      // Update user preferences
      await updateUserPreferences(session.user.id, email, currency);

      setFeedback('Settings updated successfully.');
      setOriginalEmail(email);
      setOriginalCurrency(currency);
      setIsChanged(false);

      // Refresh the session
      setSession({
        ...session,
        user: {
          ...session.user,
          preferences: {
            ...session.user.preferences,
            preferredEmail: email,
            currency,
          },
        },
      });
    } catch (error) {
      console.error('Error updating settings:', error);
      setFeedback('Failed to update settings.');
    }
  };

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
          <CurrencySelector value={currency} onChange={handleCurrencyChange} />
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
        className={`m-6 mt-auto inline-block text-white py-2 px-4 rounded-md transition duration-200 ${
          isChanged ? 'bg-houseBlue hover:bg-houseHoverBlue' : 'bg-gray-300 cursor-not-allowed'
        }`}
      >
        Save Changes
      </button>
    </div>
  );
};

export default ProfileSettings;
