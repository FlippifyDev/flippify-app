"use client";

import React, { useEffect, useState } from "react";

const FinancialHubContent = () => {
  const [financialData, setFinancialData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        const response = await fetch("/api/ebay/finances");
        if (!response.ok) {
          const errorData = await response.json();
          console.error("Failed to fetch financial data:", errorData);
          throw new Error(errorData.error || "Unknown error occurred while fetching financial data.");
        }
        const data = await response.json();
        setFinancialData(data.transactions || []);
      } catch (error: any) {
        setError(error.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchFinancialData();
  }, []);

  if (loading) {
    return <div>Loading financial data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="w-full mb-4">
      <h2 className="text-xl font-bold mb-4">Financial Hub</h2>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Date</th>
            <th className="py-2 px-4 border-b">Amount</th>
            <th className="py-2 px-4 border-b">Type</th>
            <th className="py-2 px-4 border-b">Status</th>
          </tr>
        </thead>
        <tbody>
          {financialData.length > 0 ? (
            financialData.map((transaction, index) => (
              <tr key={index}>
                <td className="py-2 px-4 border-b">{transaction.id}</td>
                <td className="py-2 px-4 border-b">
                  {new Date(transaction.date).toLocaleDateString()}
                </td>
                <td className="py-2 px-4 border-b">{transaction.amount}</td>
                <td className="py-2 px-4 border-b">{transaction.type}</td>
                <td className="py-2 px-4 border-b">{transaction.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="py-2 px-4 border-b text-center">
                No financial data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FinancialHubContent;
