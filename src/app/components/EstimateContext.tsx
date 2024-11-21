// context/EstimateContext.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface EstimateProviderProps {
	children: ReactNode;
}

export interface Estimate {
	purchasedQuantity: number;
	purchasePricePerUnit: number;
	websiteName?: string;
}

interface EstimateContextType {
	estimate: Estimate;
	setEstimate: (estimate: Estimate) => void;
}

const EstimateContext = createContext<EstimateContextType | undefined>(undefined);

export const EstimateProvider: React.FC<EstimateProviderProps> = ({ children }) => {
	const [estimate, setEstimate] = useState<Estimate>({
		purchasedQuantity: 1,
		purchasePricePerUnit: 0,
		websiteName: '',
	});

	return (
		<EstimateContext.Provider value={{ estimate, setEstimate }}>
			{children}
		</EstimateContext.Provider>
	);
};

export const useEstimate = () => {
	const context = useContext(EstimateContext);
	if (!context) {
		throw new Error('useEstimate must be used within an EstimateProvider');
	}
	return context;
};
