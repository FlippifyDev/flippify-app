'use client';

// Local Imports
import createBillingPortalUrl from '@/app/api/stripe-handlers/create-billing-portal';
import { TbReportMoney } from "react-icons/tb";

// External Imports
import React, { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';

interface CustomUser {
  name: string;
  customerId?: string;
}

const BillingPortalButton = () => {
  const { data: session } = useSession();
  const [billingUrl, setBillingUrl] = useState<string | null>(null);
  const customerIdRef = useRef<string | null>(null);

  useEffect(() => {
    const fetchCheckoutUrl = async () => {
      if (session?.user) {
        const user = session.user as CustomUser;
        customerIdRef.current = user.customerId || null;

        if (customerIdRef.current) {
          try {
            const url = await createBillingPortalUrl(user.name, customerIdRef.current);
            setBillingUrl(url);
          } catch (error) {
            console.error('Failed to create billing portal:', error);
            setBillingUrl('http://localhost:3000/u/failed-to-create-billing-portal');
          }
        }
      }
    };

    fetchCheckoutUrl();
  }, [session]);

  const handleBillingPortalButtonClick = () => {
    if (billingUrl) {
      window.location.href = billingUrl;
    }
  };

  return (
    <button
      className="hover:bg-gray-100 active:bg-gray-300 w-full text-lightModeText grid grid-cols-12 items-center gap-2 px-4 py-2 rounded-md transition duration-200"
      onClick={handleBillingPortalButtonClick}
    >
      <span className="col-span-2 text-lg"><TbReportMoney /></span>
      <span className="col-span-10 text-base text-left">Billing Portal</span>
    </button>
  );
}

export default BillingPortalButton;
