'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { ref, get, set } from 'firebase/database';
import { updateUserPreferences } from '@/src/services/firebase/update-user-preferences';
import { database } from '@/src/lib/firebase/client';

type CurrencyType = 'GBP' | 'USD' | 'EUR';

const ProfileSettings = () => {
	const { data: session } = useSession();
	const [email, setEmail] = useState('');
	const [originalEmail, setOriginalEmail] = useState('');
	const [currency, setCurrency] = useState<CurrencyType>('GBP');
	const [originalCurrency, setOriginalCurrency] = useState<CurrencyType>('GBP');
	const [feedback, setFeedback] = useState('');
	const [isChanged, setIsChanged] = useState(false);
	const [notificationsEnabled, setNotificationsEnabled] = useState(true); // Notification setting state

	useEffect(() => {
		const loadUserData = async () => {
			if (session && session.user) {
				const customerId = session.user.customerId as string;
				const userRef = ref(database, `users/${customerId}`);

				try {
					const snapshot = await get(userRef);
					const userData = snapshot.val();

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
						setNotificationsEnabled(userData.notificationsEnabled); // Load saved preference
					} else {
						setNotificationsEnabled(true); // Default to true if not set
					}
				} catch (error) {
					console.error('Error loading user data from Firebase:', error);
					setEmail(session.user.email || '');
					setOriginalEmail(session.user.email || '');
					setCurrency(session.user.currency || 'GBP');
					setOriginalCurrency(session.user.currency || 'GBP');
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
		const newCurrency = e.target.value as CurrencyType;
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
			// Update preferred email, currency, and notification settings in Firebase
			await updateUserPreferences(customerId, email, currency, 'preferredEmail');
			await set(ref(database, `users/${customerId}/notificationsEnabled`), notificationsEnabled); // Save notification setting

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

	return (
		<div className="card bg-white shadow-md rounded-lg p-4 h-full flex flex-col">
			<h2 className="card-title text-black text-xl font-semibold mb-4">Profile Settings</h2>
			<p className="text-base font-normal text-gray-500 dark:text-gray-400 mb-4">
				Here you can update your profile settings.
			</p>
			<div className="mb-4">
				<label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2" htmlFor="email">
					Contact Email
				</label>
				<input
					type="email"
					id="email"
					value={email}
					onChange={handleEmailChange}
					className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
				/>
			</div>

			<div className="mb-4">
				<label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2" htmlFor="currency">
					Preferred Currency
				</label>
				<select
					id="currency"
					value={currency}
					onChange={handleCurrencyChange}
					className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
				>
					<option value="GBP">GBP (£)</option>
					<option value="USD">USD ($)</option>
					<option value="EUR">EUR (€)</option>
				</select>
			</div>

			{/* Notification Setting */}
			<div className="mb-4 flex items-center space-x-3">
				<label className="text-gray-700 dark:text-gray-300 font-semibold" htmlFor="notificationsEnabled">
					Enable Notifications
				</label>
				<input
					type="checkbox"
					id="notificationsEnabled"
					className="toggle"
					checked={notificationsEnabled}
					onChange={handleToggleNotifications}
					style={{ transform: 'scale(1.2)', backgroundColor: notificationsEnabled ? '#0070f3' : '#e5e7eb' }}
				/>
			</div>

			{feedback && (
				<p className="mb-4 text-center text-sm font-semibold text-gray-900 dark:text-white">
					{feedback}
				</p>
			)}
			<button
				type="button"
				onClick={handleSaveChanges}
				disabled={!isChanged}
				className={`mt-auto inline-block text-white py-2 px-4 rounded-md transition duration-200 ${isChanged ? 'bg-houseBlue hover:bg-houseHoverBlue' : 'bg-gray-300 cursor-not-allowed'
					}`}
			>
				Save Changes
			</button>
		</div>
	);
};

export default ProfileSettings;
