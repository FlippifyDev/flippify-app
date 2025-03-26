import React from 'react';
import Layout from '@/app/u/components/layout/Layout';
import FinancialHubContent from '@/app/u/components/tools/financial-hub/FinancialHubContent';
import ThemeSetter from '@/app/components/ThemeSetter';

export const metadata = {
	title: 'Financial Hub - Flippify',
	description: 'Keep track of your sales and profits with Flippify’s comprehensive Financial Hub. Monitor your performance and maximize your reselling success.',
};

export default function Dashboard() {
	return (
		<>
			<ThemeSetter theme="light" />
			<Layout anySubscriptions={['admin', 'member']} removePadding={true}>
				<FinancialHubContent />
			</Layout>
		</>
	);
}
