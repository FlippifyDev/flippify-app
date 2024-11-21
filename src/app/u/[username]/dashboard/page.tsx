import React from 'react';
import Layout from '../../components/layout/Layout';
import DashboardPage from '../../components/home/dashboard/DashboardPage';
import ThemeSetter from '@/src/app/components/ThemeSetter';

export const metadata = {
	title: 'Dashboard - Flippify',
	description: 'Experience the Flippify dashboard, designed for efficiency and effectiveness. Track your reselling activities, monitor deals, and maximize your profits with our user-friendly interface.',
};

export default function Dashboard() {
	return (
		<>
			<ThemeSetter theme="light" />
			<Layout requiredSubscriptions={['']}>
				<DashboardPage />
			</Layout>
		</>
	);
}
