'use client';

import React, { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import ProfileBillingPortalButton from "./ProfileBillingPortalButton";
import ProfileSupportButton from "./ProfileSupportButton";
import LayoutSubscriptionWrapper from "./LayoutSubscriptionWrapper";
import { database, ref, get } from "../../api/auth-firebase/firebaseConfig";
import { handleUser } from "../../api/auth-firebase/firebaseConfig";

const currencySymbols: Record<string, string> = {
  GBP: '£',
  USD: '$',
  EUR: '€',
};

const ProfileOverview = () => {
  const { data: session } = useSession();
  const [totalProfit, setTotalProfit] = useState(0);
  const [currencySymbol, setCurrencySymbol] = useState('£');

  const calculateTotalProfit = useCallback(async (customerId: string) => {
    if (!customerId) return;

    try {
      // Authenticate the user
      const { customerId: cleanedCustomerId } = await handleUser(customerId);

      const salesRef = ref(database, `sales/${cleanedCustomerId}`);
      const salesSnapshot = await get(salesRef);
      const salesData = salesSnapshot.val() || {};

      let totalProfit = 0;

      for (const saleKey in salesData) {
        const sale = salesData[saleKey];
        const purchasePricePerUnit = sale.purchasePricePerUnit || 0;
        const platformFees = sale.platformFees || 0;
        const shippingCost = sale.shippingCost || 0;
        const totalSaleRevenue = sale.quantitySold * sale.salePrice;
        const totalPurchaseCost = sale.quantitySold * purchasePricePerUnit;
        const estimatedProfit =
          totalSaleRevenue -
          totalPurchaseCost -
          totalSaleRevenue * (platformFees / 100) -
          shippingCost;

        totalProfit += estimatedProfit;
      }

      setTotalProfit(totalProfit);
    } catch (error) {
      console.error('Error calculating total profit:', error);
      setTotalProfit(0); // Ensure totalProfit is set to 0 in case of error
    }
  }, []);

  useEffect(() => {
    const loadUserCurrency = async () => {
      if (session && session.user) {
        const customerId = session.user.customerId as string;
        const userRef = ref(database, `users/${customerId}`);

        try {
          const snapshot = await get(userRef);
          const userData = snapshot.val();
          const userCurrency = userData?.currency || 'GBP';
          setCurrencySymbol(currencySymbols[userCurrency] || '£');
        } catch (error) {
          console.error('Error loading user currency from Firebase:', error);
        }
      }
    };

    if (session && session.user && session.user.customerId) {
      loadUserCurrency();
      calculateTotalProfit(session.user.customerId);
    }
  }, [session, calculateTotalProfit]);

  // Default avatar
  let avatar =
    "https://i.pinimg.com/originals/40/a4/59/40a4592d0e7f4dc067ec0cdc24e038b9.png";
  let username = "User";
  let email = "N/A";

  if (session) {
    if (session.user?.image) {
      avatar = session.user.image;
    }
    if (session.user?.name) {
      username = session.user.name;
    }
    if (session.user?.email) {
      email = session.user.email;
    }
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-md dark:bg-gray-800 p-4 md:p-6 flex flex-col md:flex-row justify-between items-center">
      <div className="flex items-center">
        <Image
          alt="Avatar"
          src={avatar}
          width={100}
          height={100}
          className="rounded-full"
        />
        <div className="ml-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {username}
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            {email}
          </p>
          <div>
            <ProfileBillingPortalButton />
            <ProfileSupportButton />
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-4 w-full font-semibold md:w-auto mt-4 md:mt-0 md:ml-auto">
        <LayoutSubscriptionWrapper anySubscriptions={['standard', 'server']}>
          <div className="stats shadow-md bg-white p-4 rounded-lg">
            <div className="stat">
              <div className="stat-title text-sm sm:text-base text-houseBlue">
                Subscription Status
              </div>
              <div className="stat-value font-bold text-xl sm:text-2xl text-black">
                Active
              </div>
            </div>
          </div>
        </LayoutSubscriptionWrapper>
        <LayoutSubscriptionWrapper requiredSubscriptions={['!standard', '!server']}>
          <div className="stats shadow-md bg-white p-4 rounded-lg">
            <div className="stat">
              <div className="stat-title text-sm sm:text-base text-houseBlue">
                Subscription Status
              </div>
              <div className="stat-value font-bold text-xl sm:text-2xl text-black">
                Not Active
              </div>
            </div>
          </div>
        </LayoutSubscriptionWrapper>
        <div className="stats shadow-md bg-white p-4 rounded-lg">
          <div className="stat">
            <div className="stat-title text-sm sm:text-base text-houseBlue">
              Total Profit Made
            </div>
            <div className="stat-value font-bold text-xl sm:text-2xl text-black">
              {currencySymbol}{totalProfit.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileOverview;
