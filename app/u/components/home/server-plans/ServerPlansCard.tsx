import React from "react";
import LayoutSubscriptionWrapper from "../../layout/LayoutSubscriptionWrapper";
import PlansGetAccessButton from "../plans/PlansGetAccessButton";
import ManageMembershipsButton from "../plans/PlansManageMembershipButton";
import PlansContactUs from "./ServerPlansContactUs"; // Import the new Contact Us button
import { BackgroundGradient } from "@/components/ui/background-gradient";

interface ServerPlansCardProps {
  title: string;
  prices: number[];
  description: string;
  priceIds: { monthly: string; yearly: string };
  whatsIncludedComponent: any;
  specialPlan?: boolean;
  priceRange: number;
  planRole: string;
}

const currencyConversionRates: Record<"GBP" | "USD" | "EUR", number> = {
  GBP: 1,
  USD: 1.28,
  EUR: 1.16,
};

const currencySymbols: Record<"GBP" | "USD" | "EUR", string> = {
  GBP: "£",
  USD: "$",
  EUR: "€",
};

const ServerPlansCard: React.FC<ServerPlansCardProps> = ({
  title,
  prices,
  description,
  priceIds,
  whatsIncludedComponent,
  specialPlan,
  priceRange,
  planRole,
}) => {
  const convertedPrices = prices.map((price) =>
    Number((price * currencyConversionRates.GBP).toFixed(2))
  );

  const selectedPriceId = priceRange === 0 ? priceIds.monthly : priceIds.yearly;

  return (
    <div className="w-full flex justify-center transition duration-200 relative z-0"> {/* Set z-index to 0 */}
      <div className="w-full sm:w-full min-h-[700px] flex flex-col justify-between relative z-0">
        {specialPlan ? (
          <BackgroundGradient>
            <div className="bg-white rounded-2xl h-full p-6 flex flex-col justify-between min-h-[700px] relative z-0">
              <div className="absolute top-[-10px] left-6 z-10 bg-houseBlue text-white px-3 py-1 rounded-full text-xs">
                Most Popular
              </div>

              <div className="text-center">
                <h2 className="font-bold text-[24px]">{title}</h2>
                <p className="text-sm text-gray-600">{description}</p>
              </div>

              <div className="flex flex-row items-center mt-5 justify-center">
                <h3 className="font-extrabold text-[40px] text-gray-900">
                  {`${currencySymbols.GBP}${convertedPrices[priceRange].toFixed(2)}`}
                </h3>
                <span className="ml-1 mt-4 text-lg text-black font-semibold">
                  /{priceRange === 0 ? "mo" : "yr"}
                </span>
              </div>

              <section className="flex-grow mt-5">{whatsIncludedComponent}</section>

              <section className="mt-auto">
                {prices.length > 0 && (
                  <div className="flex flex-col gap-4">
                    {/* Get Access button if user doesn't have access */}
                    <LayoutSubscriptionWrapper requiredSubscriptions={["!accessGranted"]}>
                      <PlansGetAccessButton specialPlan={specialPlan} redirect="dashboard" unavailable={description} />
                    </LayoutSubscriptionWrapper>

                    {/* Show Manage Membership button if they have the role */}
                    <LayoutSubscriptionWrapper anySubscriptions={[planRole, "admin"]}>
                      <ManageMembershipsButton specialPlan={specialPlan} />
                    </LayoutSubscriptionWrapper>

                    {/* Show "Contact Us" instead of Subscribe Now */}
                    <LayoutSubscriptionWrapper requiredSubscriptions={[`!${planRole}`, "!admin"]}>
                      <PlansContactUs specialPlan={specialPlan} />
                    </LayoutSubscriptionWrapper>
                  </div>
                )}
              </section>
            </div>
          </BackgroundGradient>
        ) : (
          <div className="bg-white border rounded-2xl hover:shadow-md transition duration-200 h-full p-6 flex flex-col justify-between min-h-[700px] relative z-0">
            <div className="text-center">
              <h2 className="font-bold text-[24px]">{title}</h2>
              <p className="text-sm text-gray-600">{description}</p>
            </div>

            <div className="flex flex-row items-center mt-5 justify-center">
              <h3 className="font-extrabold text-[40px] text-gray-900">
                {`${currencySymbols.GBP}${convertedPrices[priceRange].toFixed(2)}`}
              </h3>
              <span className="ml-1 mt-4 text-lg text-black font-semibold">
                /{priceRange === 0 ? "mo" : "yr"}
              </span>
            </div>

            <section className="flex-grow mt-5">{whatsIncludedComponent}</section>

            <section className="mt-auto">
              {prices.length > 0 && (
                <div className="flex flex-col gap-4">
                  <LayoutSubscriptionWrapper requiredSubscriptions={["!accessGranted"]}>
                    <PlansGetAccessButton redirect="dashboard" unavailable={description} />
                  </LayoutSubscriptionWrapper>

                  <LayoutSubscriptionWrapper anySubscriptions={[planRole, "admin"]}>
                    <ManageMembershipsButton />
                  </LayoutSubscriptionWrapper>

                  {/* Replace Subscribe Now with Contact Us */}
                  <LayoutSubscriptionWrapper requiredSubscriptions={[`!${planRole}`, "!admin"]}>
                    <PlansContactUs specialPlan={specialPlan} />
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

export default ServerPlansCard;
