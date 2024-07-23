import React from 'react';
import UserLayout from '../../components/Layout';
import ManageServersPage from '../../components/ManageServersPage';


const ManageServers = () => {
  return (
    <UserLayout>
        <ManageServersPage />
    </UserLayout>
  );
};

export default ManageServers;