// pages/ManageServerPage.tsx
import React from 'react';
import UserLayout from '../../components/UserLayout';
import SalesTracker from '../../components/SalesTracker';
import { EstimateProvider } from '../../../components/EstimateContext';

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
