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

const ProfileBillingPortalButton = () => {
  const { data: session } = useSession();
  const [billingUrl, setBillingUrl] = useState<string | null>(null);
  const customerIdRef = useRef<string | null>(null);
  const root = process.env.ROOT as string;

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
            setBillingUrl(root.concat('/u/failed-to-create-billing-portal'));
          }
        }
      }
    };

    fetchCheckoutUrl();
  }, [session]);

  const handleBillingPortalButtonClick = () => {
    if (billingUrl) {
      window.open(billingUrl, '_blank');
    }
  };

  return (
    <button
      className="w-auto text-lightModeText flex items-center gap-2 pt-1 rounded-md transition duration-200 focus:outline-none hover:text-gray-500"
      onClick={handleBillingPortalButtonClick}
    >
      <span className="flex items-center gap-2">
        <TbReportMoney className="text-lg" />
        <span className="text-base text-left">Billing Portal</span>
      </span>
    </button>
  );
}

export default ProfileBillingPortalButton;
