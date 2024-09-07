import React, { useState, useEffect } from "react";
import LayoutSubscriptionWrapper from "../../layout/LayoutSubscriptionWrapper";
import PlansSubscribeNow from "./PlansSubscribeNow";
import ManageMembershipsButton from "./PlansManageMembershipButton";
import PlansGetAccessButton from "./PlansGetAccessButton";
import { useSession } from "next-auth/react";
import { database, ref, get } from "@/app/api/auth-firebase/firebaseConfig";
import { BackgroundGradient } from "@/components/ui/background-gradient";

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

  return (
    <div className="w-full flex justify-center hover:scale-101 transition duration-200">
      <div className="w-full sm:w-full min-h-[600px] relative">
        {specialPlan ? (
          <BackgroundGradient className="rounded-xl">
            <div className="bg-white rounded-xl h-full p-4">
              <section className="flex flex-col gap-3">
                <h2 className="font-bold text-start pl-2 text-[20px]">{title}</h2>
                <h3 className="font-extrabold text-start pl-2 text-[30px]">
                  {`${currencySymbol}${convertedPrices[priceRange].toFixed(2)}`}
                </h3>
              </section>

              <section className="flex-grow mt-5">
                {whatsIncludedComponent}
              </section>

              <section className="mt-auto">
                {prices.length > 0 && (
                  <div className="flex">
                    <LayoutSubscriptionWrapper requiredSubscriptions={["!accessGranted"]}>
                      <PlansGetAccessButton
                        redirect="dashboard"
                        specialPlan={specialPlan}
                        unavailable={description}
                      />
                    </LayoutSubscriptionWrapper>
                    <LayoutSubscriptionWrapper requiredSubscriptions={["accessGranted", `!${requiredSubscription}`]}>
                      <PlansSubscribeNow
                        priceId={selectedPriceId}
                        specialPlan={specialPlan}
                        unavailable={description}
                      />
                    </LayoutSubscriptionWrapper>
                    <LayoutSubscriptionWrapper requiredSubscriptions={[requiredSubscription]}>
                      <ManageMembershipsButton specialPlan={specialPlan} />
                    </LayoutSubscriptionWrapper>
                  </div>
                )}
              </section>
            </div>
          </BackgroundGradient>
        ) : (
          <div className="bg-white rounded-xl h-full p-4">
            <section className="flex flex-col gap-3">
              <h2 className="font-bold text-start pl-2 text-[20px]">{title}</h2>
              <h3 className="font-extrabold text-start pl-2 text-[30px]">
                {`${currencySymbol}${convertedPrices[priceRange].toFixed(2)}`}
              </h3>
            </section>

            <section className="flex-grow mt-5">
              {whatsIncludedComponent}
            </section>

            <section className="mt-auto">
              {prices.length > 0 && (
                <div className="flex">
                  <LayoutSubscriptionWrapper requiredSubscriptions={["!accessGranted"]}>
                    <PlansGetAccessButton redirect="dashboard" unavailable={description} />
                  </LayoutSubscriptionWrapper>
                  <LayoutSubscriptionWrapper requiredSubscriptions={["accessGranted", `!${requiredSubscription}`]}>
                    <PlansSubscribeNow priceId={selectedPriceId} unavailable={description} />
                  </LayoutSubscriptionWrapper>
                  <LayoutSubscriptionWrapper requiredSubscriptions={[requiredSubscription]}>
                    <ManageMembershipsButton />
                  </LayoutSubscriptionWrapper>
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlansCard;
