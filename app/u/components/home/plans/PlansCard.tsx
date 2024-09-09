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
  description: string; // New quick description of who the plan is for
  prices: number[];
  priceIds: { monthly: string; yearly: string };
  whatsIncludedComponent: any;
  specialPlan?: boolean;
  priceRange: number;
  className?: string;  // Allow className to be passed
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
  description,
  prices,
  priceIds,
  whatsIncludedComponent,
  specialPlan,
  priceRange,
  className,  // Accept the className
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
    <div className={`w-full flex justify-center hover:scale-101 transition duration-200 ${className || ""}`}>
      <div className="w-full sm:w-full min-h-[700px] flex flex-col justify-between relative">
        {specialPlan ? (
          <BackgroundGradient>
            <div className="bg-white rounded-2xl h-full p-6 flex flex-col justify-between min-h-[700px]">
              {/* Badge for "Most Popular" */}
              <div className="absolute top-[-10px] left-6 z-20 bg-houseBlue text-white px-3 py-1 rounded-full text-xs">
                Most Popular
              </div>

              {/* Title and Description */}
              <div className="text-center">
                <h2 className="font-bold text-[24px]">{title}</h2>
                <p className="text-sm text-gray-600">{description}</p>
              </div>

              {/* Price Section */}
              <div className="flex flex-row items-center mt-5 justify-center">
                <h3 className="font-extrabold text-[40px] text-gray-900">
                  {`${currencySymbol}${convertedPrices[priceRange].toFixed(2)}`}
                </h3>
                <span className="ml-1 mt-4 text-lg text-black font-semibold">
                  /{priceRange === 0 ? 'mo' : 'yr'}
                </span>
              </div>

              {/* Features */}
              <section className="flex-grow mt-5">
                {whatsIncludedComponent}
              </section>

              {/* Button */}
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
                    <LayoutSubscriptionWrapper requiredSubscriptions={["accessGranted", "!member"]}>
                      <PlansSubscribeNow
                        priceId={selectedPriceId}
                        specialPlan={specialPlan}  
                        unavailable={description}
                      />
                    </LayoutSubscriptionWrapper>
                    <LayoutSubscriptionWrapper requiredSubscriptions={["member"]}>
                      <ManageMembershipsButton specialPlan={specialPlan} />
                    </LayoutSubscriptionWrapper>
                  </div>
                )}
              </section>
            </div>
          </BackgroundGradient>
        ) : (
          <div className="bg-white border rounded-2xl hover:shadow-md transition duration-200 h-full p-6 flex flex-col justify-between min-h-[700px]">
            {/* Title and Description */}
            <div className="text-center">
              <h2 className="font-bold text-[24px]">{title}</h2>
              <p className="text-sm text-gray-600">{description}</p>
            </div>

            {/* Price Section */}
            <div className="flex flex-row items-center mt-5 justify-center">
              <h3 className="font-extrabold text-[40px] text-gray-900">
                {`${currencySymbol}${convertedPrices[priceRange].toFixed(2)}`}
              </h3>
              <span className="ml-1 mt-4 text-lg text-black font-semibold">
                /{priceRange === 0 ? 'mo' : 'yr'}
              </span>
            </div>

            {/* Features */}
            <section className="flex-grow mt-5">
              {whatsIncludedComponent}
            </section>

            {/* Button */}
            <section className="mt-auto">
              {prices.length > 0 && (
                <div className="flex">
                  <LayoutSubscriptionWrapper requiredSubscriptions={["!accessGranted"]}>
                    <PlansGetAccessButton redirect="dashboard" unavailable={description} />
                  </LayoutSubscriptionWrapper>
                  <LayoutSubscriptionWrapper requiredSubscriptions={["accessGranted", "!member"]}>
                    <PlansSubscribeNow priceId={selectedPriceId} unavailable={description} />
                  </LayoutSubscriptionWrapper>
                  <LayoutSubscriptionWrapper requiredSubscriptions={["member"]}>
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
