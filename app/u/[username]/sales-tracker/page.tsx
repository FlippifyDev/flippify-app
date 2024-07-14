import React from 'react';
import UserLayout from '../../components/UserLayout';
import SalesTracker from '../../components/SalesTracker';


const ManageServerPage = () => {
  return (
    <UserLayout>
        <SalesTracker />
    </UserLayout>
  );
};

export default ManageServerPage;