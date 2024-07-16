// context/EstimateContext.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface EstimateProviderProps {
  children: ReactNode;
}

interface Estimate {
  quantity: number;
  purchasePrice: number;
  websiteName?: string;
}

interface EstimateContextType {
  estimate: Estimate;
  setEstimate: (estimate: Estimate) => void;
}

const EstimateContext = createContext<EstimateContextType | undefined>(undefined);

export const EstimateProvider: React.FC<EstimateProviderProps> = ({ children }) => {
  const [estimate, setEstimate] = useState<Estimate>({
    quantity: 0,
    purchasePrice: 0,
    websiteName: ''
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
