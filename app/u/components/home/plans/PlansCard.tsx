'use client';

import React, { useState, useEffect } from "react";
import LayoutSubscriptionWrapper from "../../layout/LayoutSubscriptionWrapper";
import PlansSubscribeNow from "./PlansSubscribeNow";
import ManageMembershipsButton from "./PlansManageMembershipButton";
import PlansGetAccessButton from "./PlansGetAccessButton";
import { useSession } from "next-auth/react";
import { database, ref, get } from "@/app/api/auth-firebase/firebaseConfig";

interface PlansCardProps {
  title: string;
  prices: number[];
  description: string;
  priceIds: { monthly: string; yearly: string };
  whatsIncludedComponent: any;
  specialPlan?: boolean;
  requiredSubscription: string;
  priceRange: number;
}

const currencyConversionRates: Record<'GBP' | 'USD' | 'EUR', number> = {
  GBP: 1,
  USD: 1.28,
  EUR: 1.16,
};

const currencySymbols: Record<'GBP' | 'USD' | 'EUR', string> = {
  GBP: '£',
  USD: '$',
  EUR: '€',
};

const PlansCard: React.FC<PlansCardProps> = ({
  title,
  prices,
  description,
  priceIds,
  whatsIncludedComponent,
  specialPlan,
  requiredSubscription,
  priceRange
}) => {
  const { data: session } = useSession();
  const [currency, setCurrency] = useState<'GBP' | 'USD' | 'EUR'>('GBP');
  const [currencySymbol, setCurrencySymbol] = useState('£');

  useEffect(() => {
    const loadUserCurrency = async () => {
      if (session && session.user) {
        const userRef = ref(database, `users/${session.user.customerId}`);
        try {
          const snapshot = await get(userRef);
          const userData = snapshot.val();
          const userCurrency = (userData?.currency || 'GBP') as keyof typeof currencySymbols;
          setCurrency(userCurrency);
          setCurrencySymbol(currencySymbols[userCurrency]);
        } catch (error) {
          console.error('Error loading user currency from Firebase:', error);
        }
      }
    };

    if (session && session.user && session.user.customerId) {
      loadUserCurrency();
    }
  }, [session]);

  const convertedPrices = prices.map(price =>
    Number((price * currencyConversionRates[currency]).toFixed(2))
  );

  const selectedPriceId = priceRange === 0 ? priceIds.monthly : priceIds.yearly;

  const cardBG = specialPlan === true ? 'linear-gradient(to top, #112ddb, #51b6f4)' : 'bg-white';
  const cardClass = specialPlan === true 
    ? 'card flex flex-col px-5 py-8 text-white rounded-xl shadow-lg overflow-hidden' 
    : 'card flex flex-col px-5 py-8 text-gray-700 rounded-xl shadow-lg overflow-hidden';

  return (
    <div className="col-span-1 row-span-1 flex justify-center hover:scale-101 transition duration-200">
      <div className="w-80 sm:w-88 min-h-[550px]">
        <div 
            className={cardClass}
            style={{ background: cardBG }}
        >
          {/* Name & Price Section */}
          <section className='flex flex-col gap-3'>
            <h2 className='font-bold text-start pl-2 text-[20px]'>{title}</h2>
            <h3 className='font-extrabold text-start pl-2 text-[30px]'>{`${currencySymbol}${convertedPrices[priceRange].toFixed(2)}`}</h3>
          </section>

          {/* Whats Included Section */}
          <section className="flex-grow mt-5">
            {whatsIncludedComponent}
          </section>

          {/* Button Section */}
          <section className="mt-auto">
            {prices.length > 0 && (
              <div className="flex">
                <LayoutSubscriptionWrapper requiredSubscriptions={["!accessGranted"]}>
                  <PlansGetAccessButton redirect="dashboard" specialPlan={specialPlan} unavailable={description}/>
                </LayoutSubscriptionWrapper>
                <LayoutSubscriptionWrapper requiredSubscriptions={["accessGranted", `!${requiredSubscription}`]}>
                  <PlansSubscribeNow priceId={selectedPriceId} specialPlan={specialPlan} unavailable={description} />
                </LayoutSubscriptionWrapper>
                <LayoutSubscriptionWrapper requiredSubscriptions={[requiredSubscription]}>
                  <ManageMembershipsButton specialPlan={specialPlan} />
                </LayoutSubscriptionWrapper>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default PlansCard;
