import React from 'react';
import Layout from '../../components/layout/Layout';
import ThemeSetter from '@/src/app/components/ThemeSetter';
import NotificationsContent from '../../components/home/notifications/NoitificationsContent';

export const metadata = {
	title: 'Notificatons - Flippify',
	description: 'Find the best notification on deals and all things resellings!',
};

export default function Legal() {
	return (
		<>
			<ThemeSetter theme="light" />
			<Layout requiredSubscriptions={['']}>
				<NotificationsContent />
			</Layout>
		</>
	);
}
