// pages/ManageServerPage.tsx
import UserLayout from '../../components/Layout';
import SalesTrackerPage from '../../components/SalesTrackerPage';
import { EstimateProvider } from '../../../components/EstimateContext';
import "../../../../styles/sales-and-profits.css"

import React from 'react';

const SalesTracker = () => {
  return (
    <UserLayout>
      <EstimateProvider>
        <SalesTrackerPage />
      </EstimateProvider>
    </UserLayout>
  );
};

export default SalesTracker;
