'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { database, ref, set } from '../../api/auth-firebase/firebaseConfig';

const ProfileSettings = () => {
  const { data: session } = useSession();
  const [email, setEmail] = useState(session?.user?.email || '');
  const [originalEmail, setOriginalEmail] = useState(session?.user?.email || '');
  const [feedback, setFeedback] = useState('');
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    if (session && session.user && session.user.email) {
      setEmail(session.user.email);
      setOriginalEmail(session.user.email);
    }
  }, [session]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setIsChanged(e.target.value !== originalEmail);
  };

  const handleSaveChanges = async () => {
    if (!session || !session.user || !session.user.customerId) {
      setFeedback('You must be logged in to update your settings.');
      return;
    }

    try {
      const userRef = ref(database, `users/${session.user.customerId}`);
      await set(userRef, { email });
      setFeedback('Email updated successfully.');
      setOriginalEmail(email);
      setIsChanged(false);
    } catch (error) {
      console.error('Error updating email:', error);
      setFeedback('Failed to update email.');
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
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={handleEmailChange}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
        />
      </div>
      {feedback && (
        <p className="mt-4 text-center text-sm font-semibold text-gray-900 dark:text-white">{feedback}</p>
      )}
      <button
        type="button"
        onClick={handleSaveChanges}
        disabled={!isChanged}
        className={`mt-auto inline-block text-white py-2 px-4 rounded-md transition duration-200 ${
          isChanged ? 'bg-blue-600 hover:bg-green-400' : 'bg-gray-300 cursor-not-allowed'
        }`}
      >
        Save Changes
      </button>
    </div>
  );
};

export default ProfileSettings;
