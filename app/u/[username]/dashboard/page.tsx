import React from "react";
import UserLayout from "../../components/UserLayout";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Manage Your Reselling Efficiently - Flippify Dashboard',
  description: "Experience the Flippify dashboard, designed for efficiency and effectiveness. Track your reselling activities, monitor deals, and maximize your profits with our user-friendly interface."
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
