"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import createCheckoutSession from '@/app/api/stripe-handlers/create-checkout-session';

interface CustomUser {
  name: string;
  customerId?: string;
}

interface SubscribeNowProps {
  priceId: string;
}

const SubscribeNow: React.FC<SubscribeNowProps> = ({ priceId }) => {
  const { data: session } = useSession();
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const customerIdRef = useRef<string | null>(null);
  const usernameRef = useRef<string | null>(null);

  useEffect(() => {
    const fetchCheckoutUrl = async () => {
      if (session?.user) {
        const user = session.user as CustomUser;
        customerIdRef.current = user.customerId || null;
        usernameRef.current = user.name;

        if (customerIdRef.current && usernameRef.current) {
          try {
            const url = await createCheckoutSession(
              usernameRef.current,
              customerIdRef.current,
              priceId
            );
            setCheckoutUrl(url);
          } catch (error) {
            console.error('Failed to create checkout session:', error);
            setCheckoutUrl('http://localhost:3000/u/failed-to-create-checkout-session');
          }
        }
      }
    };

    fetchCheckoutUrl();
  }, [session, priceId]);

  const handleBuyButtonClick = () => {
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
    }
  };

  return (
    <button className="btn btn-primary bg-discordBlue border-white text-white border-1" onClick={handleBuyButtonClick} disabled={!checkoutUrl}>
      {checkoutUrl ? 'Subscribe Now' : 'Loading...'}
    </button>
  );
};

export default SubscribeNow;
