'use client';

import createCheckoutSession from '@/app/api/stripe-handlers/create-checkout-session';
import React, { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';

interface CustomUser {
  name: string;
  customerId?: string;
}

interface PlansSubscribeNowProps {
  priceId: string;
}

const PlansSubscribeNow: React.FC<PlansSubscribeNowProps> = ({ priceId }) => {
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
            setCheckoutUrl('http://flippify.co.uk/u/failed-to-create-checkout-session');
          }
        }
      }
    };

    fetchCheckoutUrl();
  }, [session, priceId]);

  const handleBuyButtonClick = () => {
    if (checkoutUrl) {
      window.open(checkoutUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <button 
      className="btn border-0 bg-houseBlue hover:bg-houseHoverBlue text-white w-2/3 mx-auto" 
      onClick={handleBuyButtonClick} 
      disabled={!checkoutUrl}
    >
      {checkoutUrl ? 'Subscribe Now' : 'Loading...'}
    </button>
  );
};

export default PlansSubscribeNow;
