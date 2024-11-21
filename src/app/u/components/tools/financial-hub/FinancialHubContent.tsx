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
					throw new Error("Failed to fetch financial data.");
				}
				const data = await response.json();
				setFinancialData(data.transactions || []);  // Ensure it's always an array
			} catch (error: any) {
				setError(error.message);
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
		return (
			<div>
				<p>Error: {error}</p>
				<p>Unable to retrieve your financial data at this time.</p>
			</div>
		);
	}

	return (
		<div className="w-full mb-4">
			<h2 className="text-xl font-bold mb-4">Financial Hub</h2>
			{financialData.length > 0 ? (
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
						{financialData.map((transaction, index) => (
							<tr key={index}>
								<td className="py-2 px-4 border-b">{transaction.id}</td>
								<td className="py-2 px-4 border-b">
									{new Date(transaction.date).toLocaleDateString()}
								</td>
								<td className="py-2 px-4 border-b">{transaction.amount}</td>
								<td className="py-2 px-4 border-b">{transaction.type}</td>
								<td className="py-2 px-4 border-b">{transaction.status}</td>
							</tr>
						))}
					</tbody>
				</table>
			) : (
				<div>No financial data available at the moment.</div>
			)}
		</div>
	);
};

export default FinancialHubContent;
