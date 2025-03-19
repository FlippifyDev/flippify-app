"use client";

// Local Imports
import CardListingsAmount from "./CardListingsAmount";
import CardPlatformPieChart from "./CardPlatformDonutChart";

// External Imports


const FinancialHubContent = () => {
    return (
        <div className="w-full mb-4 grid grid-cols-12 gap-4">
            <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                <CardListingsAmount />
            </div>
            <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                <CardPlatformPieChart />
            </div>
        </div>
    );
};

export default FinancialHubContent;
