'use client';

// Local Imports
import createBillingPortalUrl from '@/app/api/stripe-handlers/create-billing-portal';
import React, { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';

interface CustomUser {
  name: string;
  customerId?: string;
}

const ManageMembershipsButton = () => {
  const { data: session } = useSession();
  const [billingUrl, setBillingUrl] = useState<string | null>(null);
  const customerIdRef = useRef<string | null>(null);

  useEffect(() => {
    const fetchBillingUrl = async () => {
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

    fetchBillingUrl();
  }, [session]);

  const handleBillingPortalButtonClick = () => {
    if (billingUrl) {
      window.open(billingUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <button
      className="btn border-0 bg-houseBlue hover:bg-houseHoverBlue text-white w-2/3 mx-auto"
      onClick={handleBillingPortalButtonClick}
      disabled={!billingUrl}
    >
      Manage Memberships
    </button>
  );
}

export default ManageMembershipsButton;
