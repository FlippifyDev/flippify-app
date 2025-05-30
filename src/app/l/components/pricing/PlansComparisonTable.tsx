import React from 'react';
import { Inter } from 'next/font/google';
import { fetchConversionRates } from '@/utils/currency-api';

const inter = Inter({ subsets: ['latin'] });

interface PricingComparisonTableProps {
    selectedPlan: number;
    currency: string;
    conversionRates: Record<string, number>;
    currencySymbol: string;
}

const PricingComparisonTable: React.FC<PricingComparisonTableProps> = ({
    selectedPlan,
    currency,
    conversionRates,
    currencySymbol
}) => {
    const rate = conversionRates[currency] ?? 1;

    return (
        <div className="w-full max-w-8xl mx-auto px-6 sm:px-6 md:px-8 lg:px-10 xl:px-12 mt-16 animate-fadeInBounce">
            <h2 className={`${inter.className} text-3xl font-bold text-lightModeText mb-6`}>
                Feature Comparison
            </h2>
            <p className="text-lg text-lightModeText font-semibold mb-8">
                Compare our plans to find the perfect fit for your eBay business needs
            </p>

            <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100">
                <table className="w-full">
                    {/* Table Header */}
                    <thead>
                        <tr className="border-b">
                            <th className="w-1/5 py-5 px-6 text-left text-gray-800 bg-gray-200 font-bold">Features</th>
                            <th className="w-1/5 py-5 px-6 text-center text-gray-700 bg-gray-50">
                                <div className="text-xl font-bold">Free</div>
                                <div className="text-sm">For beginners</div>
                            </th>
                            <th className="w-1/5 py-5 px-6 text-center text-gray-700 bg-gray-50">
                                <div className="text-xl font-bold">Standard</div>
                                <div className="text-sm">For growing sellers</div>
                                <div className="text-lg font-bold mt-2">
                                    {currencySymbol}{selectedPlan === 0 ? (4.99 * rate).toFixed(2) : (49.90 * rate).toFixed(2)}<span className="text-sm font-medium">/{selectedPlan === 0 ? 'mo' : 'yr'}</span>
                                </div>
                                <div className="text-xs text-gray-500 line-through">
                                    {currencySymbol}{selectedPlan === 0 ? (9.99 * rate).toFixed(2) : (99.90 * rate).toFixed(2)}
                                </div>
                            </th>
                            <th className="w-1/5 py-5 px-6 text-center text-gray-700 bg-gray-50">
                                <div className="text-xl font-bold">Pro</div>
                                <div className="text-sm">For experts</div>
                                <div className="text-lg font-bold mt-2">
                                    {currencySymbol}{selectedPlan === 0 ? (9.99 * rate).toFixed(2) : (99.90 * rate).toFixed(2)}<span className="text-sm font-medium">/{selectedPlan === 0 ? 'mo' : 'yr'}</span>
                                </div>
                                <div className="text-xs text-gray-500 line-through">
                                    {currencySymbol}{selectedPlan === 0 ? (19.99 * rate).toFixed(2) : (199.90 * rate).toFixed(2)}
                                </div>
                            </th>
                            <th className="w-1/5 py-5 px-6 text-center text-gray-700 bg-gray-50">
                                <div className="text-xl font-bold">Enterprise</div>
                                <div className="text-sm">For businesses</div>
                                <div className="text-lg font-bold mt-2">
                                    {currencySymbol}{selectedPlan === 0 ? (19.99 * rate).toFixed(2) : (199.90 * rate).toFixed(2)}<span className="text-sm font-medium">/{selectedPlan === 0 ? 'mo' : 'yr'}</span>
                                </div>
                                <div className="text-xs text-gray-500 line-through">
                                    {currencySymbol}{selectedPlan === 0 ? (29.99 * rate).toFixed(2) : (299.90 * rate).toFixed(2)}
                                </div>
                            </th>
                        </tr>
                    </thead>

                    {/* Table Body */}
                    <tbody>
                        {/* Auto-Tracked Listings */}
                        <tr className="border-b">
                            <td className="py-4 px-6 font-medium text-gray-800 bg-gray-100">
                                Auto-Tracked Sales
                            </td>
                            <td className="py-4 px-6 text-center">
                                <span className="text-gray-600">12/month</span>
                            </td>
                            <td className="py-4 px-6 text-center">
                                <span className="text-gray-600">48/month</span>
                            </td>
                            <td className="py-4 px-6 text-center">
                                <span className="text-gray-600">96/month</span>
                            </td>
                            <td className="py-4 px-6 text-center">
                                <span className="text-gray-600">100+/month</span>
                            </td>
                        </tr>

                        {/* Manual Listing Entries */}
                        <tr className="border-b">
                            <td className="py-4 px-6 font-medium text-gray-800 bg-gray-100">
                                Auto-Tracked Listings
                            </td>
                            <td className="py-4 px-6 text-center bg-gray-50">
                                <span className="text-gray-600">12</span>
                            </td>
                            <td className="py-4 px-6 text-center bg-gray-50">
                                <span className="text-gray-600">48</span>
                            </td>
                            <td className="py-4 px-6 text-center bg-gray-50">
                                <span className="text-gray-600">96</span>
                            </td>
                            <td className="py-4 px-6 text-center bg-gray-50">
                                <span className="text-gray-600">100+</span>
                            </td>
                        </tr>

                        {/* Manual Sales Entries */}
                        <tr className="border-b">
                            <td className="py-4 px-6 font-medium text-gray-800 bg-gray-100">
                                Manual Sales Entries
                            </td>
                            <td className="py-4 px-6 text-center bg-gray-50">
                                <span className="text-gray-600">12/month</span>
                            </td>
                            <td className="py-4 px-6 text-center bg-gray-50">
                                <span className="text-gray-600">48/month</span>
                            </td>
                            <td className="py-4 px-6 text-center bg-gray-50">
                                <span className="text-gray-600">96/month</span>
                            </td>
                            <td className="py-4 px-6 text-center bg-gray-50">
                                <span className="text-gray-600">100+/month</span>
                            </td>
                        </tr>

                        {/* Manual Sales Entries */}
                        <tr className="border-b">
                            <td className="py-4 px-6 font-medium text-gray-800 bg-gray-100">
                                Manual Listing Entries
                            </td>
                            <td className="py-4 px-6 text-center bg-gray-50">
                                <span className="text-gray-600">12</span>
                            </td>
                            <td className="py-4 px-6 text-center bg-gray-50">
                                <span className="text-gray-600">48</span>
                            </td>
                            <td className="py-4 px-6 text-center bg-gray-50">
                                <span className="text-gray-600">96</span>
                            </td>
                            <td className="py-4 px-6 text-center bg-gray-50">
                                <span className="text-gray-600">100+</span>
                            </td>
                        </tr>


                        {/* One Time Expenses Entries */}
                        <tr className="border-b">
                            <td className="py-4 px-6 font-medium text-gray-800 bg-gray-100">
                                One Time Expenses
                            </td>
                            <td className="py-4 px-6 text-center bg-gray-50">
                                <span className="text-gray-600">12/month</span>
                            </td>
                            <td className="py-4 px-6 text-center bg-gray-50">
                                <span className="text-gray-600">100/month</span>
                            </td>
                            <td className="py-4 px-6 text-center bg-gray-50">
                                <span className="text-gray-600">200/month</span>
                            </td>
                            <td className="py-4 px-6 text-center bg-gray-50">
                                <span className="text-gray-600">400+/month</span>
                            </td>
                        </tr>

                        {/* Subscription Expenses Entries */}
                        <tr className="border-b">
                            <td className="py-4 px-6 font-medium text-gray-800 bg-gray-100">
                            Subscription Expenses
                            </td>
                            <td className="py-4 px-6 text-center bg-gray-50">
                                <span className="text-gray-600">3</span>
                            </td>
                            <td className="py-4 px-6 text-center bg-gray-50">
                                <span className="text-gray-600">6</span>
                            </td>
                            <td className="py-4 px-6 text-center bg-gray-50">
                                <span className="text-gray-600">9</span>
                            </td>
                            <td className="py-4 px-6 text-center bg-gray-50">
                                <span className="text-gray-600">12+</span>
                            </td>
                        </tr>

                        {/* Export to CSV */}
                        <tr className="border-b">
                            <td className="py-4 px-6 font-medium text-gray-800 bg-gray-100">
                                Export to CSV
                            </td>
                            <td className="py-4 px-6 text-center">
                                <span className="text-lightModeText">✗</span>
                            </td>
                            <td className="py-4 px-6 text-center">
                                <span className="text-houseBlue">✓</span>
                            </td>
                            <td className="py-4 px-6 text-center">
                                <span className="text-houseBlue">✓</span>
                            </td>
                            <td className="py-4 px-6 text-center">
                                <span className="text-houseBlue">✓</span>
                            </td>
                        </tr>


                        {/* Tax Report */}
                        <tr className="border-b">
                            <td className="py-4 px-6 font-medium text-gray-800 bg-gray-100">
                                Tax Report
                            </td>
                            <td className="py-4 px-6 text-center">
                                <span className="text-lightModeText">✗</span>
                            </td>
                            <td className="py-4 px-6 text-center">
                                <span className="text-houseBlue">✓</span>
                            </td>
                            <td className="py-4 px-6 text-center">
                                <span className="text-houseBlue">✓</span>
                            </td>
                            <td className="py-4 px-6 text-center">
                                <span className="text-houseBlue">✓</span>
                            </td>
                        </tr>



                        {/* AI Automated Listings */}
                        <tr className="border-b">
                            <td className="py-4 px-6 font-medium text-gray-800 bg-gray-100">
                                AI Automated Listings
                                <div className="text-xs text-gray-600 italic mt-1">Coming soon</div>
                            </td>
                            <td className="py-4 px-6 text-center">
                                <span className="text-gray-600">5</span>
                            </td>
                            <td className="py-4 px-6 text-center">
                                <span className="text-gray-600">20</span>
                            </td>
                            <td className="py-4 px-6 text-center">
                                <span className="text-gray-600">50</span>
                            </td>
                            <td className="py-4 px-6 text-center">
                                <span className="text-gray-600">50+</span>
                            </td>
                        </tr>

                        {/* Bulk Editing & Relisting */}
                        <tr className="border-b">
                            <td className="py-4 px-6 font-medium text-gray-800 bg-gray-100">
                                Bulk Editing & Relisting
                                <div className="text-xs text-gray-600 italic mt-1">Coming soon</div>
                            </td>
                            <td className="py-4 px-6 text-center">
                                <span className="text-lightModeText">✗</span>
                            </td>
                            <td className="py-4 px-6 text-center">
                                <span className="text-houseBlue">✓</span>
                            </td>
                            <td className="py-4 px-6 text-center">
                                <span className="text-houseBlue">✓</span>
                            </td>
                            <td className="py-4 px-6 text-center">
                                <span className="text-houseBlue">✓</span>
                            </td>
                        </tr>

                        {/* AI Competitor Analysis & Price Adjustments */}
                        <tr className="border-b">
                            <td className="py-4 px-6 font-medium text-gray-800 bg-gray-100">
                                AI Competitor Analysis & Price Adjustments
                                <div className="text-xs text-gray-600 italic mt-1">Coming soon</div>
                            </td>
                            <td className="py-4 px-6 text-center">
                                <span className="text-lightModeText">✗</span>
                            </td>
                            <td className="py-4 px-6 text-center">
                                <span className="text-lightModeText">✗</span>
                            </td>
                            <td className="py-4 px-6 text-center">
                                <span className="text-houseBlue">✓</span>
                            </td>
                            <td className="py-4 px-6 text-center">
                                <span className="text-houseBlue">✓</span>
                            </td>
                        </tr>

                        {/* Priority AI Processing */}
                        <tr className="border-b">
                            <td className="py-4 px-6 font-medium text-gray-800 bg-gray-100">
                                Priority AI Processing
                                <div className="text-xs text-gray-600 italic mt-1">Coming soon</div>
                            </td>
                            <td className="py-4 px-6 text-center bg-gray-50">
                                <span className="text-lightModeText">✗</span>
                            </td>
                            <td className="py-4 px-6 text-center bg-gray-50">
                                <span className="text-lightModeText">✗</span>
                            </td>
                            <td className="py-4 px-6 text-center bg-gray-50">
                                <span className="text-houseBlue">✓</span>
                            </td>
                            <td className="py-4 px-6 text-center bg-gray-50">
                                <span className="text-houseBlue">✓</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="text-sm text-center text-gray-500 mt-4">
                All plans include inventory & order management, financial tracking, and customer support.
            </div>
        </div>
    );
};

export default PricingComparisonTable;