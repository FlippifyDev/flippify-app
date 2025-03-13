import React from 'react';
import Layout from '../../components/layout/Layout';
import ThemeSetter from '@/app/components/ThemeSetter';
import TestingContent from '../../components/home/testing/TestingContent'

export const metadata = {
	title: 'Admin - Flippify',
	description: 'Admin page for managing users and subscriptions.',
};

export default function Admin() {
	return (
		<>
			<ThemeSetter theme="light" />
			<Layout requiredSubscriptions={['admin']}>
				<TestingContent />
			</Layout>
		</>
	);
}
