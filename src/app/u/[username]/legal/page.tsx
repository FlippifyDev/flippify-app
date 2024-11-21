import React from 'react';
import LegalContent from '@/src/app/components/LegalContent';
import Layout from '../../components/layout/Layout';
import Loading from '@/src/app/components/Loading';
import { Suspense } from 'react';
import ThemeSetter from '@/src/app/components/ThemeSetter';

export const metadata = {
	title: 'Legal Info - Flippify',
	description: 'Access detailed legal information on Flippify, including our Privacy Policy and Terms and Conditions. Stay informed about our data practices, your rights, and our commitment to a fair trading platform.',
};

export default function Legal() {
	return (
		<>
			<ThemeSetter theme="light" />
			<Suspense fallback={<Loading />}>
				<Layout requiredSubscriptions={['']}>
					<LegalContent />
				</Layout>
			</Suspense>
		</>
	);
}
