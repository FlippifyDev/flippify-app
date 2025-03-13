import React from 'react';
import Layout from '../../components/layout/Layout';
import CoursesPageContent from '../../components/home/courses/CoursesPage';
import ThemeSetter from '@/app/components/ThemeSetter';

export const metadata = {
	title: 'Courses - Flippify',
	description: 'Master the art of reselling with Flippify&apos;s expert-led courses. Learn everything from in-store arbitrage to advanced online reselling strategies with our step-by-step guides. Whether you&apos;re a beginner or a seasoned reseller, our courses provide the tools and knowledge you need to grow and scale your reselling business.',
};

export default function Plans() {
	return (
		<>
			<ThemeSetter theme="light" />
			<Layout requiredSubscriptions={['']}>
				<CoursesPageContent />
			</Layout>
		</>
	);
}
