import React from 'react';
import Layout from '../../components/layout/Layout';
import ServerPlansPageContent from '../../components/home/server-plans/ServerPlansPage';
import ThemeSetter from '@/src/app/components/ThemeSetter';

export const metadata = {
	title: 'Server Plans - Flippify',
	description: 'Explore our pricing plans and find the best deal to suit your needs. From monitoring soon-to-retire Lego sets to exclusive upcoming deals, discover how our affordable plans can help you maximize your flipping profits.',
};

export default function ServerPlans() {
	return (
		<>
			<ThemeSetter theme="light" />
			<Layout requiredSubscriptions={['']}>
				<ServerPlansPageContent />
			</Layout>
		</>
	);
}
