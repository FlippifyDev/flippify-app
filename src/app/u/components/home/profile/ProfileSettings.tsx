'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { updateUserPreferences, fetchUserData, updateNotificationPreference } from '@/src/services/firebase/users';
import Toggle from '@/src/app/components/Toggle';
import UnderlineInput from '@/src/app/components/UnderlineInput';
import UnderlineSelect from '@/src/app/components/UnderlineSelect';

const ProfileSettings = () => {
  const { data: session } = useSession();
  const [email, setEmail] = useState('');
  const [originalEmail, setOriginalEmail] = useState('');
  const [currency, setCurrency] = useState<string>('GBP');
  const [originalCurrency, setOriginalCurrency] = useState<string>('GBP');
  const [feedback, setFeedback] = useState('');
  const [isChanged, setIsChanged] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      if (session && session.user) {
        const customerId = session.user.customerId as string;

        try {
          const userData = await fetchUserData(customerId);

          if (userData?.preferredEmail) {
            setEmail(userData.preferredEmail);
            setOriginalEmail(userData.preferredEmail);
          } else {
            setEmail(session.user.email || '');
            setOriginalEmail(session.user.email || '');
          }

          const userCurrency = userData?.currency || session.user.currency || 'GBP';
          setCurrency(userCurrency);
          setOriginalCurrency(userCurrency);

          // Load notification preference
          if (typeof userData?.notificationsEnabled === 'boolean') {
            setNotificationsEnabled(userData.notificationsEnabled);
          } else {
            setNotificationsEnabled(true); // Default to true if not set
          }
        } catch (error) {
          console.error('Error loading user data:', error);
          setEmail(session.user.email || '');
          setOriginalEmail(session.user.email || '');
          setCurrency(session?.user.currency || 'GBP');
          setOriginalCurrency(session?.user.currency || 'GBP');
        }
      }
    };

    loadUserData();
  }, [session]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setIsChanged(e.target.value !== originalEmail || currency !== originalCurrency || notificationsEnabled !== true);
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCurrency = e.target.value as string;
    setCurrency(newCurrency);
    setIsChanged(newCurrency !== originalCurrency || email !== originalEmail || notificationsEnabled !== true);
  };

  const handleToggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
    setIsChanged(true); // Mark as changed when toggling notifications
  };

  const handleSaveChanges = async () => {
    if (!session || !session.user) {
      setFeedback('You must be logged in to update your settings.');
      return;
    }

    const customerId = session.user.customerId as string;

    if (!customerId) {
      throw new Error('Customer ID is missing');
    }

    try {
      // Update user preferences
      await updateUserPreferences(customerId, email, currency);
      await updateNotificationPreference(customerId, notificationsEnabled);

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
        <div className="mt-4">
          <Toggle text_left="Notifications" onChange={handleToggleNotifications} />
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
