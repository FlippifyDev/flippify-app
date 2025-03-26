import React from 'react';
import Layout from '../../components/layout/Layout';
import ThemeSetter from '@/app/components/ThemeSetter';
import LoadingAnimation from '../../components/dom/ui/LoadingAnimation';

export const metadata = {
    title: 'Reports & Insights - Flippify',
    description: '',
};

export default function ReportsAndInsights() {
    return (
        <>
            <ThemeSetter theme="light" />
            <Layout requiredSubscriptions={['accessGranted']}>
                <LoadingAnimation text="This page is in development" type="typewriter" />
            </Layout>
        </>
    );
}
