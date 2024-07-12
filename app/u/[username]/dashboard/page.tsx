import React from "react";
import UserLayout from "../../components/UserLayout";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'User - Dashboard',
  description: "Flippify's dashboard, designed to be slick and effective"
};

const DashboardPage = () => {
  return (
    <UserLayout>
      <div>
      <div className="text-2xl text-white font-bold flex justify-center">Dashboard</div>
      <div className="text-greyText flex justify-center">Coming Soon...</div>
      </div>
    </UserLayout>
  );
};

export default DashboardPage;
