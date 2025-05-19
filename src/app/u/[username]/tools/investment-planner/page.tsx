import React from 'react';
import Layout from '../../../components/layout/Layout';
import ThemeSetter from '@/app/components/ThemeSetter';
import Page from '@/app/u/components/tools/investment-planner/Page';

export const metadata = {
    title: 'Investment Planner - Flippify',
    description: '',
};

export default function InvenstmentPlanner() {
    return (
        <>
            <ThemeSetter theme="light" />
            <Layout anySubscriptions={['standard', 'pro', 'admin']} removePadding={true}>
                <Page />
            </Layout>
        </>
    );
}
