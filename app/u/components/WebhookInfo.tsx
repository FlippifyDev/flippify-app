"use client";

import addWebhook from '@/app/api/addWebhook';

import { useSession } from 'next-auth/react';
import React, { useState } from 'react';
import Link from 'next/link'



interface CustomUser {
    name: string;
    customerId?: string;
}


interface Props {
    subscription_name: string;
  }


  const WebhookInfo = ({ subscription_name }: Props) => {
    const [webhookUrl, setWebhookUrl] = useState<string>(''); // State to track user's name input
    const { data: session } = useSession();


    const handleFormSubmit = async () => {
        if (!session || !session.user) {
            return null; // Handle case where session or subscriptions are not available
        }
        const user = session.user as CustomUser;
        if (!user.customerId) {
            return null;
        }

        const stripe_customer_id = user.customerId;
        const webhook = webhookUrl.trim();
    
        if (webhook) {
          const success = await addWebhook(stripe_customer_id, subscription_name, webhook);
          if (success) {
            alert('Webhook added successfully!');
            // Optionally clear input field or reset form state
            setWebhookUrl('');
          } else {
            alert('Failed to add webhook. Please try again.');
          }
        } else {
          alert('Please enter a webhook URL.');
        }
      };

    return (
        <div className="form-control w-full max-w-xs mt-2">
            <div className="label">
                <span className="label-text">Webhook URL</span>
                <Link 
                    href="https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks" 
                    className="text-sm text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer" // Opens link in new tab
                    >
                    Webhook?
                </Link>
            </div> 
            <input
                type="text"
                placeholder="Enter webhook url"
                className="input input-bordered w-full max-w-xs"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                style={{ fontSize: '14px'}}
            />
            <div className="label">
                <span className="label-text">Note: Entering a webhook will replace the previous one.</span>
            </div>
            <button className="btn btn-active mt-2 w-1/2" onClick={handleFormSubmit}>Submit</button>
        </div>
    )
}

export default WebhookInfo
