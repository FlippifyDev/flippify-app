import React from 'react';
import UserLayout from '../../components/UserLayout';
import SalesTracker from '../../components/SalesTracker';
import { EstimateProvider } from '@/app/components/EstimateContext';


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