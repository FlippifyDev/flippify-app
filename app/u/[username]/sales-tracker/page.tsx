// pages/ManageServerPage.tsx
import React from 'react';
import UserLayout from '../../components/UserLayout';
import SalesTracker from '../../components/SalesTracker';
import { EstimateProvider } from '../../../components/EstimateContext';
import "../../../../styles/sales-and-profits.css"

const ManageServerPage = () => {
  return (
    <UserLayout>
      <EstimateProvider>
        <SalesTracker />
      </EstimateProvider>
    </UserLayout>
  );
};

export default ManageServerPage;
