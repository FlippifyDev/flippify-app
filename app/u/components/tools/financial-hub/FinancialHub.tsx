"use client";

import React, { useState, useEffect } from "react";

const FinancialHub = () => {
  const [financialData, setFinancialData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchFinancialData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/ebay/finances");
      if (!response.ok) {
        throw new Error(`Error fetching financial data: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setFinancialData(data);
    } catch (error) {
      console.error("Error fetching financial data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinancialData();
  }, []);

  if (loading) {
    return <div>Loading Financial Data...</div>;
  }

  return (
    <div>
      <h2>Financial Hub</h2>
      {financialData && financialData.transactions.map((transaction: any) => (
        <div key={transaction.transactionId}>
          <p><strong>Transaction ID:</strong> {transaction.transactionId}</p>
          <p><strong>Amount:</strong> {transaction.amount.value} {transaction.amount.currency}</p>
          <p><strong>Type:</strong> {transaction.transactionType}</p>
          <p><strong>Status:</strong> {transaction.transactionStatus}</p>
        </div>
      ))}
    </div>
  );
};

export default FinancialHub;
