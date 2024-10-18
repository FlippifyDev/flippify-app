import React, { useEffect, useState } from "react";

// Define types for Financial Transactions
interface FinancialTransaction {
  id: string;
  date: string;
  amount: number;
  type: string;
  status: string;
}

interface FinancialData {
  totalBalance: number;
  transactions: FinancialTransaction[];
}

const FinancialHubContent = () => {
  const [financialData, setFinancialData] = useState<FinancialTransaction[]>([]);
  const [totalBalance, setTotalBalance] = useState<number>(0);

  useEffect(() => {
    // Fetch financial data
    const fetchFinancialData = async () => {
      try {
        const response = await fetch("/api/ebay/finances");
        const data: FinancialData = await response.json();
        setFinancialData(data.transactions);
        setTotalBalance(data.totalBalance);
      } catch (error) {
        console.error("Error fetching financial data:", error);
      }
    };

    fetchFinancialData();
  }, []);

  return (
    <div className="w-full mb-4">
      <h2 className="text-xl font-bold mb-4">Financial Hub</h2>

      {/* Total Balance */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Total Balance</h3>
        <div className="text-2xl font-bold">
          ${totalBalance ? totalBalance.toFixed(2) : "0.00"}
        </div>
      </div>

      {/* Transaction History */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Transaction History</h3>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Transaction ID</th>
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
                <td className="py-2 px-4 border-b text-center" colSpan={5}>
                  No transactions available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FinancialHubContent;
