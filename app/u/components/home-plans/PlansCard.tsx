'use client';
import React, { useState, useEffect } from "react";
import LayoutSubscriptionWrapper from "../layout/LayoutSubscriptionWrapper";
import PlansSubscribeNow from "./PlansSubscribeNow";
import ManageMembershipsButton from "./PlansManageMembershipButton";
import PlansGetAccessButton from "./PlansGetAccessButton";
import OnboardingJoinButton from "../home-dashboard/OnboardingJoinButton";
import { useSession } from "next-auth/react";
import { database, ref, get } from "../../../api/auth-firebase/firebaseConfig";



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

  const cardBG = specialPlan === true ? 'linear-gradient(to top, #112ddb, #51b6f4)': 'bg-white'
  const cardClass = specialPlan === true ? 
  'card grid grid-rows-12 px-5 py-8 text-white rounded-xl h-full shadow-lg overflow-hidden': 
  'card grid grid-rows-12 px-5 py-8 text-gray-700 rounded-xl h-full shadow-lg overflow-hidden'

  return (
    <div className="col-span-1 row-span-1 flex justify-center">
      <div className="w-80 sm:w-88 h-[550px]">
        <div 
            className={cardClass}
            style={{ background: cardBG }}
          >
          {/* Name & Price Section */}
          <section className='row-span-2 flex flex-col gap-5'>
            <h2 className='font-semibold text-center text-[15px]'>{title}</h2>
            <h3 className='font-extrabold text-center text-[30px]'>{`${currencySymbol}${convertedPrices[priceRange].toFixed(2)}`}</h3>
          </section>

          {/* Whats Included Section */}
          <section className="row-span-8 mt-5">
            {whatsIncludedComponent}
          </section>

          {/* Button Section */}
          <section className="row-span-2 h-full w-full">
            {prices.length > 0 && (
              <div className="h-full w-full flex">
                <LayoutSubscriptionWrapper requiredSubscriptions={["!accessGranted"]}>
                  <PlansGetAccessButton redirect="dashboard" specialPlan={specialPlan}/>
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
  )
}

export default PlansCard



/** 
import React, { useState, useEffect } from "react";
import LayoutSubscriptionWrapper from "../layout/LayoutSubscriptionWrapper";
import PlansSubscribeNow from "./PlansSubscribeNow";
import PlansCardPriceStat from "./PlansCardPriceStat";
import ManageMembershipsButton from "./PlansManageMembershipButton";
import OnboardingJoinButton from "../home-dashboard/OnboardingJoinButton";
import { Lato } from "next/font/google";
import { useSession } from "next-auth/react";
import { database, ref, get } from "../../../api/auth-firebase/firebaseConfig";

const lato = Lato({ weight: "900", style: "italic", subsets: ["latin"] });

type BadgeColor = 'greenLabel' | 'blueLabel' | 'orangeLabel';

const badgeColorClasses: Record<BadgeColor, string> = {
  greenLabel: "bg-greenLabel",
  blueLabel: "bg-houseBlue",
  orangeLabel: "bg-orangeLabel",
};

interface PlansCardProps {
  title: string;
  prices: number[];
  description: string;
  priceIds: { monthly: string; yearly: string };
  whatsIncludedComponent: any;
  labelText: string;
  badgeColor: BadgeColor;
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
  labelText,
  badgeColor,
}) => {
  const { data: session } = useSession();
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
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

  const handlePlanSelect = (index: number) => {
    setSelectedPlan(index);
  };

  const convertedPrices = prices.map(price =>
    Number((price * currencyConversionRates[currency]).toFixed(2))
  );

  const selectedPriceId = selectedPlan === 0 ? priceIds.monthly : priceIds.yearly;

  const badgeClassName = `text-white ${badgeColorClasses[badgeColor]}`;

  return (
    <div className="w-88 sm:w-full sm:max-w-sm mx-2 sm:mx-12 mt-8">
      <div className="card bg-white border border-gray-300 rounded-lg h-full shadow-lg overflow-hidden hover:shadow-2xl transition duration-300">
        <div className="relative">
          <div className={`absolute top-1 left-1 ${badgeClassName} rounded-full px-4 py-1 text-xs font-semibold`}>
            {labelText}
          </div>
          <div className="p-6 text-center">
            <h2
              className={`${lato.className} text-3xl text-houseBlue font-bold mb-2 mt-4 sm:h-[3rem]`}
            >
              {title}
            </h2>
            <p className="text-lightModeText text-sm mb-8 sm:h-[5rem]">
              {description}
            </p>
            {prices.length > 0 && (
              <PlansCardPriceStat
                prices={convertedPrices}
                onPlanSelect={handlePlanSelect}
                selectedPlan={selectedPlan}
                currencySymbol={currencySymbol}
              />
            )}
            {whatsIncludedComponent}
          </div>
          <div className="border-t border-gray-200">
            <div className="flex justify-between p-4">
              {prices.length > 0 && selectedPlan !== null && (
                <div className="flex gap-2 w-full">
                  <LayoutSubscriptionWrapper requiredSubscriptions={["!accessGranted"]}>
                    <OnboardingJoinButton text="Get Access" redirect="dashboard"/>
                  </LayoutSubscriptionWrapper>
                  <LayoutSubscriptionWrapper requiredSubscriptions={["accessGranted", "!standard"]}>
                    <PlansSubscribeNow priceId={selectedPriceId} />
                  </LayoutSubscriptionWrapper>
                  <LayoutSubscriptionWrapper requiredSubscriptions={["standard"]}>
                    <ManageMembershipsButton />
                  </LayoutSubscriptionWrapper>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlansCard;
*/