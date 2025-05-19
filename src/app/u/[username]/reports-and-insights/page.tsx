import React from 'react';
import Layout from '../../components/layout/Layout';
import ThemeSetter from '@/app/components/ThemeSetter';
import Page from '../../components/tools/reports-and-insights/Page';

export const metadata = {
    title: 'Reports & Insights - Flippify',
    description: '',
};

export default function ReportsAndInsights() {
    return (
        <>
            <ThemeSetter theme="light" />
            <Layout anySubscriptions={['standard', 'pro', 'admin']}>
                <Page />
            </Layout>
        </>
    );
}
