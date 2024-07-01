"use client"

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Session } from 'next-auth';

import createCheckoutSession from '@/app/api/stripe-handlers/create-checkout-session';


interface CustomUser extends Session {
  name: string;
  customerId?: string;
}

interface SubscripeNowButtonProps {
  productId: string
}

const SubscripeNowButton: React.FC<SubscripeNowButtonProps> = ({ productId }) => {
  const { data: session } = useSession();
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  let customerId = null;
  let username = null;

  useEffect(() => {
    const fetchCheckoutUrl = async () => {
      if (session?.user) {
        const user = session.user as CustomUser;
        customerId = user.customerId;
        username = user.name;
        if (customerId) {
          try {
            const url = await createCheckoutSession(username, customerId, productId);
            setCheckoutUrl(url);
          } catch (error) {
            console.error('Failed to create checkout session:', error);
            setCheckoutUrl('http://localhost:3000/u/failed-to-create-checkout-session'); // Default URL on failure
          }
        }
      }
    };

    fetchCheckoutUrl();
  }, [session, productId]);

  const handleBuyButtonClick = () => {
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
    }
  };

  return (
    <button className="btn btn-primary" onClick={handleBuyButtonClick} disabled={!checkoutUrl}>
      {checkoutUrl ? 'Subscribe Now' : 'Loading...'}
    </button>
  );
};

export default SubscripeNowButton
