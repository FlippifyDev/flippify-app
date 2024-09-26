'use client';

import addWebhook from '@/app/api/auth-mongodb/addWebhook';
import Alert from '@/app/components/Alert';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';
import Link from 'next/link';

interface Props {
  subscription_name: string;
  region: string;
}

const ManageServersSelectionWebhook = ({ subscription_name, region }: Props) => {
  const [webhookUrl, setWebhookUrl] = useState<string>(''); // State to track user's webhook URL input
  const { data: session } = useSession();
  
  const [alertVisible, setAlertVisible] = useState<boolean>(false); // State to control alert visibility
  const [alertMessage, setAlertMessage] = useState<string>(''); // State to set alert message

  const handleFormSubmit = async () => {
    if (!session || !session.user) {
      return; // Handle case where session or subscriptions are not available
    }
    const user = session.user;
    if (!user.customerId) {
      return;
    }

    const stripe_customer_id = user.customerId;
    const webhook = webhookUrl.trim();

    if (webhook) {
      const success = await addWebhook(stripe_customer_id, subscription_name, region, webhook);
      if (success) {
        setAlertMessage('Webhook added successfully!');
        setAlertVisible(true);
        setWebhookUrl(''); // Optionally clear input field or reset form state
      } else {
        setAlertMessage('Failed to add webhook. Please try again.');
        setAlertVisible(true);
      }
    } else {
      setAlertMessage('Please enter a webhook URL.');
      setAlertVisible(true);
    }
  };

  return (
    <div className="form-control w-full mt-2 text-lightModeText">
      {/* Alert Component */}
      <Alert 
        message={alertMessage} 
        visible={alertVisible} 
        onClose={() => setAlertVisible(false)} 
      />
      {/* Webhook URL Input */}
      <div className="label">
        <span className="label-text text-lightModeText">Webhook URL</span>
        <Link 
          href="https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks" 
          className="text-sm text-houseBlue hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Webhook?
        </Link>
      </div>
      <input
        type="text"
        placeholder="Enter webhook url"
        className="input input-bordered w-full bg-white"
        value={webhookUrl}
        onChange={(e) => setWebhookUrl(e.target.value)}
        style={{ fontSize: '14px' }}
      />
      <div className="label">
        <span className="label-text text-lightModeText">Note: Entering a webhook will replace the previous one.</span>
      </div>
      <button 
        className="btn mt-2 w-1/2 text-white bg-houseBlue hover:bg-houseHoverBlue" 
        onClick={handleFormSubmit}
      >
        Submit
      </button>
    </div>
  );
};

export default ManageServersSelectionWebhook;
